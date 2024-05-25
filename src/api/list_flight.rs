use crate::{
    internal_error,
    AppState
};

use axum::{
    extract::{Json, State},
    http::StatusCode,
};
use sqlx::postgres::types::PgInterval;
use chrono::{naive::serde::ts_microseconds, NaiveDateTime};
use serde::Serialize;

use std::sync::Arc;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct FlightInfo {
    id: i32,
    src_airport: String,
    dst_airport: String,
    #[serde(with = "ts_microseconds")]
    date_time: NaiveDateTime,
    duration: i64,
    booked_seat: i32,
    empty_seat: i32,
}

pub struct FlightQueryTarget {
    id: i32,
    src_airport: String,
    dst_airport: String,
    date_time: NaiveDateTime,
    duration: PgInterval,
    booked_seat: i32,
    empty_seat: i32,
}

pub async fn list_flight(
    State(state): State<Arc<AppState>>
) -> Result<Json<Vec<FlightInfo>>, (StatusCode, String)> {

    let flights = sqlx::query_as!(
        FlightQueryTarget,
        r#"
        SELECT
            id,
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

    let flights = flights.into_iter().map(|flight| FlightInfo {
        id: flight.id,
        src_airport: flight.src_airport,
        dst_airport: flight.dst_airport,
        date_time: flight.date_time,
        duration: flight.duration.microseconds,
        booked_seat: flight.booked_seat,
        empty_seat: flight.empty_seat,
    })
    .collect();
    Ok(Json(flights))
}
