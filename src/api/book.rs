use axum::{
    extract::{Json, State},
    http::StatusCode,
};
use serde::Deserialize;
use sqlx::postgres::PgPool;
use chrono::Utc;

use crate::{
    utils::ticket,
    internal_error,
};

#[derive(Deserialize)]
pub struct BookingInfo {
    flight_id: i32,
    name: String,
    id: String,
    phone_number: String,
    class: String,
    passenger_type: String,
    note: String,
}

pub async fn book_flight(
    State(pool): State<PgPool>,
    Json(booking_info): Json<BookingInfo>,
) -> Result<(), (StatusCode, String)> {

    let BookingInfo {
        flight_id,
        name,
        id,
        phone_number,
        class,
        passenger_type,
        note,
    } = booking_info;

    if ticket::available_tickets(pool.clone(), flight_id, class.clone()).await? == 0 {
        return Err((StatusCode::CONFLICT, format!("class {class} ticket for flight {flight_id}")));
    }

    sqlx::query!(r#"
             INSERT INTO ticket
                 (flight_id, passenger_name, passenger_id, phone_number, class, passenger_type, book_time, status, note)
             VALUES ($1, $2, $3, $4, $5, $6, $7, 'booked', $8)
        "#,
        flight_id,
        name,
        id,
        phone_number,
        class,
        passenger_type,
        Utc::now().naive_utc(),
        note,
    )
    .execute(&pool)
    .await
    .map_err(internal_error)?;

    Ok(())
}
