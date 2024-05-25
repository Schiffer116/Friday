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

#[derive(Deserialize)]
pub struct RegisterInfo {
    name: String,
    password: String,
    email: String,
}

pub async fn register(
    State(state): State<Arc<AppState>>,
    Json(register_info): Json<RegisterInfo>,
) -> Result<impl IntoResponse, (StatusCode, String)> {

    let RegisterInfo {
        name,
        password,
        email,
    } = register_info;

    let hash = bcrypt::hash(password, state.hash_cost)
        .map_err(internal_error)?;

    tracing::debug!(hash);

    sqlx::query!(r"
            INSERT INTO user_data
                (email, name, password_hash)
            VALUES ($1, $2, $3)
        ",
        email,
        name,
        hash,
    )
    .execute(&state.db)
    .await
    .map_err(|err| match err {
        sqlx::Error::Database(_) => (
            StatusCode::CONFLICT,
            "Email is already registered".to_string()
        ),
        _ => internal_error(err),
    })?;

    Ok(())
}
