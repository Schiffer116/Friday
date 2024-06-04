use crate::{
    internal_error,
    AppState,
};

use axum::{
    extract::{Json, State},
    http::StatusCode,
    response::IntoResponse,
};
use serde::Deserialize;

use std::sync::Arc;

#[derive(Debug, Deserialize)]
pub struct ChangeInfo {
    email: String,
    old_password: String,
    new_password: String,
}

#[tracing::instrument(skip_all)]
pub async fn login(
    State(state): State<Arc<AppState>>,
    Json(change_info): Json<ChangeInfo>,
) -> Result<impl IntoResponse, (StatusCode, String)> {

    let ChangeInfo {
        email,
        old_password,
        new_password
    } = change_info;

    let hash = sqlx::query_scalar!(r"
            SELECT password_hash AS hash
            FROM user_data
            WHERE email = $1
        ",
        email
    )
    .fetch_one(&state.db)
    .await
    .map_err(|err| match err {
        sqlx::Error::RowNotFound => (
            StatusCode::BAD_REQUEST,
            "user doens't exist".to_string()
        ),
        _ => internal_error(err)
    })?;

    if !bcrypt::verify(old_password, &hash).map_err(internal_error)? {
        return Err((
            StatusCode::UNAUTHORIZED,
            "old password is incorrect".to_string()
        ))
    }

    let new_hash = bcrypt::hash(new_password, state.hash_cost)
        .map_err(internal_error)?;

    sqlx::query!(r"
            UPDATE user_data
            SET password_hash = $1
            WHERE email = $2
        ",
        new_hash,
        email,
    )
    .execute(&state.db)
    .await
    .map_err(internal_error)?;

    Ok(())
}
