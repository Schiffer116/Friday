use crate::{internal_error, AppState};
use axum::{
    extract::{Path, Json, State},
    http::StatusCode,
};
use serde::Deserialize;
use std::sync::Arc;

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TicketClass {
    name: String,
    multiplier: i16,
}

pub async fn add_class(
    State(state): State<Arc<AppState>>,
    Json(ticket_class): Json<TicketClass>,
) -> Result<(), (StatusCode, String)> {
    sqlx::query!(r"
            INSERT INTO ticket_class
                (class, multiplier)
            VALUES ($1, $2)
         ",
         ticket_class.name,
         ticket_class.multiplier,
    )
    .execute(&state.db)
    .await
    .map_err(internal_error)?;

    Ok(())
}

pub async fn remove_class(
    State(state): State<Arc<AppState>>,
    Path(class): Path<String>,
) -> Result<(), (StatusCode, String)> {
    sqlx::query!(r"
            UPDATE ticket_class
            SET status = false
            WHERE class = $1
         ",
         class
    )
    .execute(&state.db)
    .await
    .map_err(internal_error)?;

    Ok(())
}
