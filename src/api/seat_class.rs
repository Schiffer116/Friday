use crate::{internal_error, AppState};
use axum::{
    extract::{Json, State},
    http::StatusCode,
};
use std::sync::Arc;

pub async fn ticket_class(
    State(state): State<Arc<AppState>>,
) -> Result<Json<Vec<String>>, (StatusCode, String)> {
    let a = sqlx::query_scalar!(r"
            SELECT class
            FROM ticket_class
         ",
    )
    .fetch_all(&state.db)
    .await
    .map_err(internal_error)?;

    Ok(Json(a))
}
