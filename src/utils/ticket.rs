use sqlx::{
    Error,
    postgres::{
        PgPool,
        types::PgMoney,
    }
};
use axum::http::StatusCode;
use tracing::instrument;

use crate::internal_error;

#[instrument(skip_all, fields(f_id = flight_id, t_class = ticket_class, p_type = passenger_type))]
pub async fn ticket_price(
    connection: PgPool,
    flight_id: i32,
    ticket_class: &String,
    passenger_type: &String,
) -> Result<i64, (StatusCode, String)> {

    let PgMoney(mut ticket_price) = sqlx::query_scalar!(r#"
            SELECT ticket_price
            FROM flight
            WHERE id = $1
        "#,
        flight_id
    )
    .fetch_one(&connection)
    .await
    .map_err(|err| match err {
        Error::RowNotFound => (
            StatusCode::NOT_FOUND,
            format!("Flight {flight_id} doesn't exist"),
        ),
        _ => internal_error(err),
    })?;

    tracing::debug!(price = %ticket_price);

    let class_multiplier = sqlx::query_scalar!(r#"
            SELECT multiplier
            FROM ticket_class
            WHERE class = $1
        "#,
        ticket_class
    )
    .fetch_one(&connection)
    .await
    .map_err(|err| match err {
        Error::RowNotFound => (
            StatusCode::NOT_FOUND,
            format!("Ticket class {ticket_class} doesn't exist")
        ),
        _ => internal_error(err),
    })?;

    tracing::debug!(c_mult = %class_multiplier);

    let type_multiplier = sqlx::query_scalar!(r#"
            SELECT multiplier
            FROM passenger_type
            WHERE type = $1
        "#,
        passenger_type
    )
    .fetch_one(&connection)
    .await
    .map_err(|err| match err {
        Error::RowNotFound => (StatusCode::NOT_FOUND, "Passenger type doesn't exist".to_string()),
        _ => internal_error(err),
    })?;

    tracing::debug!(t_mult = %type_multiplier);

    ticket_price = (ticket_price as f64 * (class_multiplier as f64 / 100_f64) * (type_multiplier as f64 / 100_f64)) as i64;

    Ok(ticket_price)
}

pub async fn available_tickets(
    pool: PgPool,
    flight_id: i32,
    class: String,
) -> Result<i32, (StatusCode, String)> {

    let ticket_count = sqlx::query_scalar!(r#"
            SELECT ticket_count
            FROM flight_ticket_count
            WHERE flight_id = $1 AND ticket_class = $2
        "#,
        flight_id,
        class,
    )
    .fetch_one(&pool)
    .await
    .map_err(|err| match err {
        Error::RowNotFound => (
            StatusCode::NOT_FOUND,
            format!(
                "Either flight {} doesn't exist or it doens't have class {} ticket",
                flight_id,
                class
            )
        ),
        _ => internal_error(err),
    })?;

    let confirmed_count = sqlx::query_scalar!(r#"
            SELECT COUNT(id) as "id!"
            FROM ticket
            WHERE flight_id = $1 AND class = $2
        "#,
        flight_id,
        class,
    )
    .fetch_one(&pool)
    .await
    .map_err(internal_error)?;

    Ok(ticket_count - confirmed_count as i32)
}
