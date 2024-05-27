use crate::{
    request_error,
    query_error,
    AppState,
};

use axum::{
    http::StatusCode,
    extract::State,
};
use sqlx::query;

use std::sync::Arc;

pub async fn confirm_ticket(
    State(state): State<Arc<AppState>>,
    id: String
) -> Result<(), (StatusCode, String)> {
    query!(r"
           UPDATE ticket
           SET status = 'confirmed'
           WHERE id = $1
        ",
        id.parse::<i32>().map_err(request_error)?
    )
    .execute(&state.db)
    .await
    .map_err(query_error)?;

    Ok(())
}
