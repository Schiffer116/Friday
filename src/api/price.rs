use axum::{
    extract::{Query, State},
    http::StatusCode,
};
use sqlx::postgres::PgPool;
use serde::Deserialize;

use crate::utils::ticket;

#[derive(Deserialize)]
#[serde(rename_all = "kebab-case")]
pub struct Ticket {
    flight_id: i32,
    ticket_class: String,
    passenger_type: String,
}

pub async fn ticket_price(
    State(pool): State<PgPool>,
    Query(Ticket { flight_id, ticket_class, passenger_type }): Query<Ticket>,
) -> Result<String, (StatusCode, String)> {
    ticket::ticket_price(pool, flight_id, &ticket_class, &passenger_type)
        .await
        .map(|price| price.to_string())
}
