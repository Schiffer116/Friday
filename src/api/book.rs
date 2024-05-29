use crate::{
    utils::ticket::available_tickets,
    internal_error,
    AppState,
};

use axum::{
    extract::{Json, State, Extension},
    http::StatusCode,
};
use serde::Deserialize;
use chrono::Utc;

use std::sync::Arc;

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BookingInfo {
    flight_id: i32,
    name: String,
    passenger_id: String,
    phone: String,
    class: String,
    passenger_type: String,
    note: String,
}

pub async fn book_flight(
    Extension(email): Extension<String>,
    State(state): State<Arc<AppState>>,
    Json(booking_info): Json<BookingInfo>,
) -> Result<(), (StatusCode, String)> {

    let BookingInfo {
        flight_id,
        name,
        passenger_id,
        phone,
        class,
        passenger_type,
        note,
    } = booking_info;

    if available_tickets(state.db.clone(), flight_id, class.clone()).await? == 0 {
        return Err((
            StatusCode::CONFLICT,
            format!("no class {class} ticket left for flight {flight_id}")
        ));
    }

    sqlx::query!(r#"
             INSERT INTO ticket (
                 flight_id,
                 book_email,
                 passenger_name,
                 passenger_id,
                 phone_number,
                 class,
                 passenger_type,
                 book_time,
                 note
             )
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        "#,
        flight_id,
        email,
        name,
        passenger_id,
        phone,
        class,
        passenger_type,
        Utc::now().naive_utc(),
        note,
    )
    .execute(&state.db)
    .await
    .map_err(internal_error)?;

    Ok(())
}
