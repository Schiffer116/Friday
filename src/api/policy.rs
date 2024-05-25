use crate::{internal_error, AppState};

use axum::{
    extract::{Query, State},
    http::StatusCode,
    Json,
};
use sqlx::postgres::types::PgInterval;
use serde::{Deserialize, Serialize};
use std::sync::Arc;

#[derive(Deserialize, Serialize)]
pub struct Policy {
    min_flight_duration: i64,
    min_layover_duration: i64,
    max_layover_duration: i64,
    max_layover_count: i32,
    advance_book_deadline: i64,
    cancellation_deadline: i64,
}

pub struct PolicyQueryTarget {
    #[allow(unused)]
    lock: String,
    min_flight_duration: PgInterval,
    min_layover_duration: PgInterval,
    max_layover_duration: PgInterval,
    max_layover_count: i32,
    advance_book_deadline: PgInterval,
    cancellation_deadline: PgInterval,
}

fn int_to_interval(raw: i64) -> PgInterval {
    PgInterval {
        months: 0,
        days: 0,
        microseconds: raw,
    }
}

pub async fn get_policy(
    State(state): State<Arc<AppState>>,
) -> Result<Json<Policy>, (StatusCode, String)> {
    let target = sqlx::query_as!(
        PolicyQueryTarget,
        r"
            SELECT *
            FROM policy
        ",
    )
    .fetch_one(&state.db)
    .await
    .map_err(internal_error)?;
    Ok(Json(Policy {
        min_flight_duration: target.min_flight_duration.microseconds,
        min_layover_duration: target.min_layover_duration.microseconds,
        max_layover_duration: target.max_layover_duration.microseconds,
        max_layover_count: target.max_layover_count,
        advance_book_deadline: target.advance_book_deadline.microseconds,
        cancellation_deadline: target.cancellation_deadline.microseconds,
    }))
}

pub async fn change_policy(
    State(state): State<Arc<AppState>>,
    Query(policy): Query<Policy>
) -> Result<(), (StatusCode, String)> {
    sqlx::query!(r"
            UPDATE policy
            SET
                min_flight_duration = $1::INTERVAL,
                min_layover_duration = $2,
                max_layover_duration = $3,
                max_layover_count = $4,
                advance_book_deadline = $5,
                cancellation_deadline = $6
        ",
        int_to_interval(policy.min_flight_duration),
        int_to_interval(policy.min_layover_duration),
        int_to_interval(policy.max_layover_duration),
        policy.max_layover_count,
        int_to_interval(policy.advance_book_deadline),
        int_to_interval(policy.cancellation_deadline)
    )
    .execute(&state.db)
    .await
    .map_err(internal_error)?;

    Ok(())
}
