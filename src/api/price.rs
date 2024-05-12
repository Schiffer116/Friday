use axum::{
    extract::{Path, State},
    http::StatusCode,
};
use sqlx::postgres::PgPool;

use crate::utils::ticket;

pub async fn ticket_price(
    State(pool): State<PgPool>,
    Path((flight_designator, ticket_class, passenger_type)): Path<(String, String, String)>,
) -> Result<String, (StatusCode, String)> {
    ticket::ticket_price(&pool, flight_designator, ticket_class, passenger_type)
        .await
        .map(|price| price.to_string())
}
