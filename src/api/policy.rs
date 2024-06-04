use crate::{internal_error, AppState};

use axum::{
    extract::State,
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

struct PolicyQueryTarget {
    #[allow(unused)]
    lock: String,
    min_flight_duration: PgInterval,
    min_layover_duration: PgInterval,
    max_layover_duration: PgInterval,
    max_layover_count: i32,
    advance_book_deadline: PgInterval,
    cancellation_deadline: PgInterval,
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

    Ok(Json(target.into()))
}

pub async fn change_policy(
    State(state): State<Arc<AppState>>,
    Json(policy): Json<Policy>
) -> Result<(), (StatusCode, String)> {
    sqlx::query!(r"
            UPDATE policy
            SET
                min_flight_duration = $1,
                min_layover_duration = $2,
                max_layover_duration = $3,
                max_layover_count = $4,
                advance_book_deadline = $5,
                cancellation_deadline = $6
        ",
        i64_to_interval(policy.min_flight_duration),
        i64_to_interval(policy.min_layover_duration),
        i64_to_interval(policy.max_layover_duration),
        policy.max_layover_count,
        i64_to_interval(policy.advance_book_deadline),
        i64_to_interval(policy.cancellation_deadline)
    )
    .execute(&state.db)
    .await
    .map_err(internal_error)?;

    Ok(())
}

fn i64_to_interval(raw: i64) -> PgInterval {
    PgInterval {
        months: 0,
        days: 0,
        microseconds: raw,
    }
}

impl From<PolicyQueryTarget> for Policy {
    fn from(value: PolicyQueryTarget) -> Self {
        Policy {
            min_flight_duration: value.min_flight_duration.microseconds,
            min_layover_duration: value.min_layover_duration.microseconds,
            max_layover_duration: value.max_layover_duration.microseconds,
            max_layover_count: value.max_layover_count,
            advance_book_deadline: value.advance_book_deadline.microseconds,
            cancellation_deadline: value.cancellation_deadline.microseconds,
        }
    }
}
