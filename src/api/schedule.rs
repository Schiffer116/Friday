use crate::internal_error;
use axum::{
    extract::{Json, State},
    http::StatusCode,
};
use chrono::{naive::serde::ts_microseconds, NaiveDateTime};
use serde::Deserialize;
use sqlx::postgres::{
    PgPool,
    types::{
        PgMoney,
        PgInterval,
    }
};

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FlightSchedule {
    price: i64,
    src: String,
    dst: String,
    #[serde(with = "ts_microseconds")]
    date_time: NaiveDateTime,
    duration: i64,
    layovers: Vec<Layover>,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct Layover {
    airport_id: String,
    ord: i16,
    duration: i64,
    note: String,
}

pub async fn schedule_flight(
    State(pool): State<PgPool>,
    Json(schedule): Json<FlightSchedule>,
) -> Result<(), (StatusCode, String)> {

    let FlightSchedule {
        price,
        src,
        dst,
        date_time,
        duration,
        layovers,
    } = schedule;

    let mut transaction = pool.begin().await.map_err(internal_error)?;

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
    .map_err(internal_error)?;

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
        .map_err(internal_error);
    }

    transaction.commit().await.map_err(internal_error)?;

    Ok(())
}
