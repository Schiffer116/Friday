#![allow(unused)]
use crate::internal_error;
use axum::{
    extract::{Json, State},
    http::StatusCode,
    response::IntoResponse,
};

use chrono::{naive::serde::ts_microseconds, Duration, NaiveDateTime};
use serde::Deserialize;
use sqlx::postgres::PgPool;

pub async fn confirm_ticket(
) -> impl IntoResponse {
    "asdfas"
}

pub async fn book_flight() {
}

#[allow(unused)]
#[cfg(test)]
mod tests {}
