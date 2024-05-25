use crate::{
    internal_error,
    AppState,
};

use axum::{
    http::StatusCode,
    extract::{Path, State, Extension},
};
use sqlx::query;

use std::sync::Arc;

pub async fn cancel_ticket(
    Extension(email): Extension<String>,
    State(state): State<Arc<AppState>>,
    Path(id): Path<i32>,
) -> Result<(), (StatusCode, String)> {
    query!(r"
           UPDATE ticket
           SET status = 'cancelled'
           WHERE id = $1 and book_email = $2
        ",
        id,
        email
    )
    .execute(&state.db)
    .await
    .map_err(internal_error)?;

    Ok(())
}
