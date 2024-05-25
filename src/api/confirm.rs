use crate::{
    internal_error,
    AppState,
};

use axum::{
    http::StatusCode,
    extract::{Path, State},
};
use sqlx::query;

use std::sync::Arc;

pub async fn confirm_ticket(
    State(state): State<Arc<AppState>>,
    Path(id): Path<i32>,
) -> Result<(), (StatusCode, String)> {
    query!(r"
           UPDATE ticket
           SET status = 'confirmed'
           WHERE id = $1
        ",
        id
    )
    .execute(&state.db)
    .await
    .map_err(internal_error)?;

    Ok(())
}
