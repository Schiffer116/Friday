use axum::{
    extract::{Json, State, Path},
    http::StatusCode,
};
use serde::Serialize;
use sqlx::postgres::PgPool;

use futures::future;

use crate::{
    internal_error,
    utils::ticket::ticket_price,
};

use std::iter::zip;

#[derive(Debug)]
struct Ticket {
    count: i64,
    flight_id: i32,
    class: String,
    passenger_type: String,
}

#[derive(Debug, Serialize)]
struct FlightInfo {
    id: i32,
    ticket_counts: i64,
    revenue: i64,
    percent: i32,
}

#[derive(Debug, Serialize)]
pub struct MonthInfo {
    revenue: i64,
    flights: Vec<FlightInfo>,
}

#[derive(Serialize)]
pub struct MonthRevenue {
    month: i32,
    flight: u32,
    revenue: i64,
    percent: u8,
}

#[derive(Serialize)]
pub struct YearInfo {
    revenue: i64,
    months: Vec<MonthRevenue>,
}

pub async fn month_report(
    State(pool): State<PgPool>,
    Path((year, month)): Path<(i16, i16)>
) -> Result<Json<MonthInfo>, (StatusCode, String)> {
    Ok(Json(month_info(pool, year, month).await?))
}

pub async fn year_report(
    State(pool): State<PgPool>,
    Path(year): Path<i16>
) -> Result<Json<YearInfo>, (StatusCode, String)> {

    let months_info: Vec<MonthInfo> = future::join_all(
        (1..=13).map(|month| month_info(pool.clone(), year, month))
    )
    .await
    .into_iter()
    .filter_map(|month| month.map_or(None, |m| Some(m)))
    .collect();

    let revenue: i64 = months_info.iter().map(|month| month.revenue).sum();

    if revenue == 0 {
        return Ok(Json(YearInfo { revenue: 0, months: Vec::new() }));
    }

    let months = months_info.iter().enumerate().map(|(month, info)| MonthRevenue {
        month: month as i32,
        flight: info.flights.len() as u32,
        revenue: info.revenue,
        percent: (info.revenue * 100 / revenue) as u8,
    })
    .collect();

    Ok(Json(YearInfo { revenue, months }))
}

#[tracing::instrument(skip(connection))]
async fn month_info(
    connection: PgPool,
    year: i16,
    month: i16,
) -> Result<MonthInfo, (StatusCode, String)> {

    let tickets = sqlx::query_as!(
        Ticket,
        r#"
            SELECT COUNT(t.id) as "count!", t.flight_id, t.class, t.passenger_type
            FROM flight f
            JOIN ticket t
            ON t.flight_id = f.id
            WHERE date_part('year', f.date_time)::SMALLINT = $1
            AND date_part('month', f.date_time)::SMALLINT = $2
            AND (t.status = 'flown' OR t.status = 'confirmed')
            GROUP BY t.id
        "#,
        year,
        month,
    )
    .fetch_all(&connection)
    .await
    .map_err(internal_error)?;

    let ticket_prices: Vec<i64> = future::join_all(
        tickets.iter().map(|ticket| {
            ticket_price(
                connection.clone(),
                ticket.flight_id,
                &ticket.class,
                &ticket.passenger_type
            )
        })
    )
    .await
    .into_iter()
    .map(|price| price.expect("Unexpected error"))
    .collect();

    let revenue: i64 = ticket_prices.iter().sum();
    let flights = zip(tickets, ticket_prices).map(|(ticket, price)|
        FlightInfo {
            id: ticket.flight_id,
            ticket_counts: ticket.count,
            revenue: price,
            percent: (100 * price / revenue) as i32,
        }
    )
    .collect();
    Ok(MonthInfo { revenue, flights })
}
