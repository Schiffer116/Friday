use crate::{
    internal_error,
    AppState,
};

use axum::{
    http::StatusCode,
    extract::{State, Extension},
    response::IntoResponse,
    Json
};
use chrono::{naive::serde::ts_microseconds, NaiveDateTime};
use serde::Serialize;

use std::sync::Arc;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct TicketInfo {
    id: i32,
    flight_id: i32,
    passenger_name: String,
    passenger_id: String,
    phone_number: String,
    class: String,
    passenger_type: String,
    #[serde(with = "ts_microseconds")]
    book_time: NaiveDateTime,
    status: String,
    note: Option<String>,
}

pub async fn user_history(
    Extension(email): Extension<String>,
    State(state): State<Arc<AppState>>
) -> Result<impl IntoResponse, (StatusCode, String)> {

    let tickets = sqlx::query_as!(
        TicketInfo,
        r#"
           SELECT
                id,
                flight_id,
                passenger_name,
                passenger_id,
                phone_number,
                class,
                passenger_type,
                book_time,
                status::VARCHAR(10) as "status!",
                note
           FROM ticket
           WHERE book_email = $1
        "#,
        email
    )
    .fetch_all(&state.db)
    .await
    .map_err(internal_error)?;

    Ok(Json(tickets))
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct FullTicketInfo {
    id: i32,
    book_email: String,
    flight_id: i32,
    passenger_name: String,
    passenger_id: String,
    phone_number: String,
    class: String,
    passenger_type: String,
    #[serde(with = "ts_microseconds")]
    book_time: NaiveDateTime,
    status: String,
    note: Option<String>,
}

pub async fn full_history(
    State(state): State<Arc<AppState>>
) -> Result<impl IntoResponse, (StatusCode, String)> {
    let tickets = sqlx::query_as!(
        FullTicketInfo,
        r#"
           SELECT
                id,
                book_email,
                flight_id,
                passenger_name,
                passenger_id,
                phone_number,
                class,
                passenger_type,
                book_time,
                status::VARCHAR(10) as "status!",
                note
           FROM ticket
        "#,
    )
    .fetch_all(&state.db)
    .await
    .map_err(internal_error)?;

    Ok(Json(tickets))
}
