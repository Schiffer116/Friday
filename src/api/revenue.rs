#![allow(unused)]

use crate::internal_error;
use axum::{
    extract::{Json, State, Path},
    http::StatusCode,
};

use serde::Serialize;
use sqlx::postgres::PgPool;

#[derive(Serialize)]
pub struct MonthRevenue {
    designator: String,
    flights: Vec<FlightStat>,
}

#[derive(Serialize)]
struct FlightStat {
}

pub async fn month_revenue(
    Path(month): Path<i32>
) -> Result<Json<MonthRevenue>, (StatusCode, String)> {

    todo!()
}

pub async fn year_revenue(
    Path(year): Path<i32>
) -> Result<(), (StatusCode, String)> {
    Ok(())
}

#[allow(unused)]
#[cfg(test)]
mod tests {}
