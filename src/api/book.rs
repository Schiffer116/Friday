use crate::internal_error;
use axum::{
    extract::{Json, State},
    http::StatusCode,
};

use serde::Deserialize;
use sqlx::postgres::PgPool;

#[derive(Debug, Deserialize, sqlx::Type)]
#[sqlx(type_name = "passenger_type", rename_all = "lowercase")]
enum PassengerType {
    Adult,
    Chlid,
    Infant,
}

#[derive(Debug, Deserialize)]
pub struct BookingInfo {
    flight_designator: String,
    ticket_class: i8,
    passenger_type: PassengerType,
}

pub async fn book_flight() {

}

#[allow(unused)]
#[cfg(test)]
mod tests {}
