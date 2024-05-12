use sqlx::postgres::PgPool;
use axum::http::StatusCode;

use crate::internal_error;

pub async fn ticket_price(
    pool: &PgPool,
    flight_designator: String,
    ticket_class: String,
    passenger_type: String,
) -> Result<i32, (StatusCode, String)> {
    let mut ticket_price: i32 = sqlx::query_scalar(r#"
        SELECT ticket_price
        FROM flight
        WHERE designator = $1
    "#,)
    .bind(&flight_designator)
    .fetch_one(pool)
    .await
    .map_err(|err| {
        return match err {
            sqlx::Error::RowNotFound => (StatusCode::NOT_FOUND, "Flight doesn't exist".to_string()),
            _ => (StatusCode::INTERNAL_SERVER_ERROR, err.to_string()),
        }
    })?;

    let class_multiplier: i32 = sqlx::query_scalar(r#"
        SELECT multiplier
        FROM ticket_class
        WHERE class = $1
    "#,)
    .bind(&ticket_class)
    .fetch_one(pool)
    .await
    .map_err(|err| {
        return match err {
            sqlx::Error::RowNotFound => (StatusCode::NOT_FOUND, "Ticket class doesn't exist".to_string()),
            _ => internal_error(err),
        }
    })?;

    let passenger_multiplier: i32 = sqlx::query_scalar(r#"
        SELECT multiplier
        FROM passenger_type
        WHERE type = $1
    "#,)
    .bind(passenger_type)
    .fetch_one(pool)
    .await
    .map_err(|err| {
        match err {
            sqlx::Error::RowNotFound => (StatusCode::NOT_FOUND, "Passenger type doesn't exist".to_string()),
            _ => (StatusCode::INTERNAL_SERVER_ERROR, err.to_string()),
        }
    })?;

    ticket_price *= class_multiplier / 100;
    ticket_price *= passenger_multiplier / 100;

    Ok(ticket_price)
}


pub async fn available_tickets(
    pool: &PgPool,
    flight_designator: String,
    ticket_class: String,
) -> i32 {

    let passenger_multiplier: i32 = sqlx::query_scalar(r#"
        SELECT multiplier
        FROM passenger_type
        WHERE type = $1
    "#,)
    .await
    .map_err(|err| {
        match err {
            sqlx::Error::RowNotFound => (StatusCode::NOT_FOUND, "Passenger type doesn't exist".to_string()),
            _ => (StatusCode::INTERNAL_SERVER_ERROR, err.to_string()),
        }
    })?;

    12
}
