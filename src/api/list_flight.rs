use axum::{
    extract::{Json, State},
    http::StatusCode,
};

use chrono::{naive::serde::ts_microseconds, NaiveDateTime};
use serde::Serialize;
use sqlx::postgres::PgPool;

use crate::internal_error;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct FlightInfo {
    src_airport: String,
    dst_airport: String,
    #[serde(with = "ts_microseconds")]
    date_time: NaiveDateTime,
    booked_seat: i32,
    empty_seat: i32,
}

pub async fn list_flight(
    State(pool): State<PgPool>
) -> Result<Json<Vec<FlightInfo>>, (StatusCode, String)> {

    let flights = sqlx::query_as!(
        FlightInfo,
        r#"
        SELECT
            source_airport_id as "src_airport",
            destination_airport_id as "dst_airport",
            date_time,
            COALESCE(booked_count, 0) as "booked_seat!",
            (c.sum - COALESCE(booked_count, 0))::INT as "empty_seat!"
        FROM flight f
        LEFT JOIN (
            SELECT flight_id, SUM(ticket_count)
            FROM flight_ticket_count
            GROUP BY flight_id
        ) c
        ON f.id = c.flight_id
        LEFT JOIN (
            SELECT flight_id, COUNT(flight_id)::INT AS "booked_count"
            FROM ticket
            WHERE status = 'booked'
            GROUP BY flight_id
        ) t
        ON f.id = t.flight_id
        GROUP BY f.id, t.booked_count, c.sum
    "#)
    .fetch_all(&pool)
    .await
    .map_err(internal_error)?;

    Ok(Json(flights))
}
