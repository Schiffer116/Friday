use crate::{
    internal_error,
    request_error,
    query_error,
    AppState
};

use axum::{
    extract::{Json, State},
    http::StatusCode,
};
use chrono::{naive::serde::ts_microseconds, NaiveDateTime};
use serde::{Serialize, Deserialize};
use sqlx::postgres::types::{
    PgMoney,
    PgInterval,
};
use futures::future;

use std::sync::Arc;
use std::iter::zip;

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Flight {
    id: Option<i32>,
    price: i64,
    src: String,
    dst: String,
    #[serde(with = "ts_microseconds")]
    date_time: NaiveDateTime,
    duration: i64,
    seat_count: Vec<TicketCount>,
    layovers: Vec<Layover>,
    #[serde(skip_deserializing)]
    booked_seat: i32,
    #[serde(skip_deserializing)]
    empty_seat: i32,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct TicketCount {
    class: String,
    count: i32,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct Layover {
    airport_id: String,
    ord: i16,
    duration: i64,
    note: String,
}

struct FlightQueryTarget {
    id: i32,
    price: PgMoney,
    src_airport: String,
    dst_airport: String,
    date_time: NaiveDateTime,
    duration: PgInterval,
    booked_seat: i32,
    empty_seat: i32,
}

struct LayoverQueryTarget {
    airport_id: String,
    ord: i16,
    duration: PgInterval,
    note: String,
}

pub async fn list_schedule(
    State(state): State<Arc<AppState>>
) -> Result<Json<Vec<Flight>>, (StatusCode, String)> {

    let flights = sqlx::query_as!(
        FlightQueryTarget,
        r#"
        SELECT
            id,
            ticket_price AS "price",
            source_airport_id as "src_airport",
            destination_airport_id as "dst_airport",
            duration,
            date_time,
            COALESCE(booked_count, 0) as "booked_seat!",
            (c.sum - COALESCE(booked_count, 0))::INT as "empty_seat!"
        FROM flight f
        LEFT JOIN (
            SELECT
                flight_id,
                SUM(ticket_count)
            FROM flight_ticket_count
            GROUP BY flight_id
        ) c
        ON f.id = c.flight_id
        LEFT JOIN (
            SELECT
                flight_id,
                COUNT(flight_id)::INT AS "booked_count"
            FROM ticket
            WHERE status = 'booked'
            GROUP BY flight_id
        ) t
        ON f.id = t.flight_id
        GROUP BY f.id, t.booked_count, c.sum
    "#)
    .fetch_all(&state.db)
    .await
    .map_err(internal_error)?;

    let layovers = future::join_all(
        flights.iter().map(|flight| {
            sqlx::query_as!(
                LayoverQueryTarget,
                r#"
                    SELECT
                        airport_id,
                        ordinal as "ord",
                        duration,
                        note
                    FROM layover
                    WHERE flight_id = $1
                "#,
                flight.id
            )
            .fetch_all(&state.db)
        }
    ))
    .await
    .into_iter()
    .filter_map(|query_target| match query_target {
        Err(_) => None,
        Ok(lays) => Some(lays
            .iter()
            .map(|query_target| Layover::from(query_target))
            .collect()
        ),
    });

    let ticket_counts = future::join_all(
        flights.iter().map(|flight| {
            sqlx::query_as!(
                TicketCount,
                r#"
                    SELECT
                        ticket_class as class,
                        SUM(ticket_count)::INT as "count!"
                    FROM flight_ticket_count
                    WHERE flight_id = $1
                    GROUP BY ticket_class
                "#,
                flight.id
            )
            .fetch_all(&state.db)
        }
    ))
    .await
    .into_iter()
    .filter_map(|query_target| query_target.ok());

    let flights = zip(flights, zip(layovers, ticket_counts)).into_iter().map(
        |(flight, (layover, counts))| {
            let mut flight: Flight = flight.into();
            flight.layovers = layover;
            flight.seat_count = counts;
            flight
        }
    )
    .collect();
    Ok(Json(flights))
}


pub async fn add_schedule(
    State(state): State<Arc<AppState>>,
    Json(schedule): Json<Flight>,
) -> Result<(), (StatusCode, String)> {

    let Flight {
        price,
        src,
        dst,
        date_time,
        duration,
        seat_count,
        layovers,
        ..
    } = schedule;

    let mut transaction = state.db.begin().await.map_err(internal_error)?;

    let flight_id = sqlx::query_scalar!(
        r#"
            INSERT INTO flight
                (ticket_price, source_airport_id, destination_airport_id, date_time, duration)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id
        "#,
        PgMoney(price),
        src,
        dst,
        date_time,
        PgInterval { months: 0, days: 0, microseconds: duration },
    )
    .fetch_one(&mut *transaction)
    .await
    .map_err(query_error)?;

    for TicketCount { class, count } in seat_count {
        let _ = sqlx::query!(r#"
                INSERT INTO flight_ticket_count
                    (flight_id, ticket_class, ticket_count)
                VALUES ($1, $2, $3)
            "#,
            flight_id,
            class,
            count,
        )
        .execute(&mut *transaction)
        .await
        .map_err(query_error)?;
    }

    for layover in layovers {
        let _ = sqlx::query!(r#"
                INSERT INTO layover
                    (flight_id, ordinal, airport_id, duration, note)
                VALUES ($1, $2, $3, $4, $5)
            "#,
            flight_id,
            layover.ord,
            layover.airport_id,
            PgInterval { months: 0, days: 0, microseconds: layover.duration },
            layover.note,
        )
        .execute(&mut *transaction)
        .await
        .map_err(internal_error)?;
    }

    transaction.commit().await.map_err(internal_error)?;
    Ok(())
}


pub async fn remove_schedule(
    State(state): State<Arc<AppState>>,
    id: String,
) -> Result<(), (StatusCode, String)> {

    let id: i32 = id.parse().map_err(request_error)?;

    sqlx::query!(r"
            DELETE FROM flight
            WHERE id = $1
        ",
        id
    )
    .execute(&state.db)
    .await
    .map_err(query_error)?;

    Ok(())
}


pub async fn update_schedule(
    State(state): State<Arc<AppState>>,
    Json(schedule): Json<Flight>,
) -> Result<(), (StatusCode, String)> {

    let Flight {
        price,
        src,
        dst,
        date_time,
        duration,
        seat_count,
        layovers,
        ..
    } = schedule;

    let mut transaction = state.db.begin().await.map_err(internal_error)?;

    let flight_id = sqlx::query_scalar!(
        r#"
            INSERT INTO flight
                (ticket_price, source_airport_id, destination_airport_id, date_time, duration)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id
        "#,
        PgMoney(price),
        src,
        dst,
        date_time,
        PgInterval { months: 0, days: 0, microseconds: duration },
    )
    .fetch_one(&mut *transaction)
    .await
    .map_err(query_error)?;

    for TicketCount { class, count } in seat_count {
        let _ = sqlx::query!(r#"
                INSERT INTO flight_ticket_count
                    (flight_id, ticket_class, ticket_count)
                VALUES ($1, $2, $3)
            "#,
            flight_id,
            class,
            count,
        )
        .execute(&mut *transaction)
        .await
        .map_err(query_error)?;
    }

    for layover in layovers {
        let _ = sqlx::query!(r#"
                INSERT INTO layover
                    (flight_id, ordinal, airport_id, duration, note)
                VALUES ($1, $2, $3, $4, $5)
            "#,
            flight_id,
            layover.ord,
            layover.airport_id,
            PgInterval { months: 0, days: 0, microseconds: layover.duration },
            layover.note,
        )
        .execute(&mut *transaction)
        .await
        .map_err(internal_error)?;
    }

    transaction.commit().await.map_err(internal_error)?;
    Ok(())
}


impl From<&LayoverQueryTarget> for Layover {
    fn from(value: &LayoverQueryTarget) -> Self {
        Layover {
            airport_id: value.airport_id.clone(),
            ord: value.ord,
            duration: value.duration.microseconds,
            note: value.note.clone(),
        }
    }
}


impl From<FlightQueryTarget> for Flight {
    fn from(value: FlightQueryTarget) -> Self {
        Flight {
            id: Some(value.id),
            price: value.price.0,
            src: value.src_airport,
            dst: value.dst_airport,
            date_time: value.date_time,
            duration: value.duration.microseconds,
            booked_seat: value.booked_seat,
            empty_seat: value.empty_seat,
            layovers: Vec::new(),
            seat_count: Vec::new(),
        }
    }
}


