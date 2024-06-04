use crate::{
    internal_error,
    utils::ticket::ticket_price,
    AppState,
};

use axum::{
    extract::{Json, State, Path},
    http::StatusCode,
};
use serde::Serialize;
use sqlx::postgres::PgPool;
use futures::future;

use std::{
    iter::zip,
    sync::Arc,
    collections::HashMap,
};

#[derive(Debug)]
struct Ticket {
    count: i64,
    flight_id: i32,
    class: String,
    passenger_type: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct FlightInfo {
    id: i32,
    ticket_count: i64,
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
    State(state): State<Arc<AppState>>,
    Path((year, month)): Path<(i16, i16)>
) -> Result<Json<MonthInfo>, (StatusCode, String)> {

    Ok(Json(month_info(state.db.clone(), year, month).await?))
}

pub async fn year_report(
    State(state): State<Arc<AppState>>,
    Path(year): Path<i16>
) -> Result<Json<YearInfo>, (StatusCode, String)> {

    let months_info: Vec<MonthInfo> = future::join_all(
        (1..=12).map(|month| month_info(state.db.clone(), year, month))
    )
    .await
    .into_iter()
    .filter_map(|month| month.map_or(None, |m| Some(m)))
    .collect();

    let revenue: i64 = months_info.iter().map(|month| month.revenue).sum();

    let months = months_info.iter().enumerate().map(|(month, info)| MonthRevenue {
        month: month as i32 + 1,
        flight: info.flights.len() as u32,
        revenue: info.revenue,
        percent: (((info.revenue * 100) as f64) / (revenue as f64)).round() as u8,
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

    let tickets: Vec<Ticket> = sqlx::query_as!(
        Ticket,
        r#"
            SELECT COUNT(t.id) as "count!", t.flight_id, t.class, t.passenger_type
            FROM flight f
            JOIN ticket t
            ON t.flight_id = f.id
            WHERE date_part('year', f.date_time)::SMALLINT = $1
            AND date_part('month', f.date_time)::SMALLINT = $2
            AND (t.status = 'expired' OR t.status = 'confirmed')
            GROUP BY (t.flight_id, t.class, t.passenger_type)
        "#,
        year,
        month,
    )
    .fetch_all(&connection)
    .await
    .map_err(internal_error)?;

    let cost_per_ticket: Vec<i64> = future::join_all(
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

    let ticket_revenue = zip(tickets, cost_per_ticket).fold(
        HashMap::new(),
        |mut map, (ticket, cost)| {
            let flight_id = ticket.flight_id;
            let revenue = map.entry(flight_id).or_insert((ticket.count, 0));
            (*revenue).1 += cost;
            map
        }
    );

    let total_revenue: i64 = ticket_revenue.values().fold(0, |acc, (_, revenue)| acc + revenue);
    let flights = ticket_revenue.into_iter().map(|(flight_id, (ticket_count, revenue))|
        FlightInfo {
            id: flight_id,
            ticket_count,
            revenue,
            percent: ((100 * revenue) as f64 / total_revenue as f64) as i32,
        }
    )
    .collect();

    Ok(MonthInfo { revenue: total_revenue, flights })
}
