use crate::{query_error, internal_error, AppState};
use axum::{
    extract::{Json, State},
    http::StatusCode,
};
use serde::{Serialize, Deserialize};
use std::sync::Arc;

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TicketClass {
    class: String,
    multiplier: i16,
    status: bool,
}

pub async fn get_class(
    State(state): State<Arc<AppState>>,
) -> Result<Json<Vec<TicketClass>>, (StatusCode, String)> {
    let classes = sqlx::query_as!(
        TicketClass,
        r"
            SELECT class, multiplier, status
            FROM ticket_class
         ",
    )
    .fetch_all(&state.db)
    .await
    .map_err(internal_error)?;

    Ok(Json(classes))
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
         ticket_class.class,
         ticket_class.multiplier,
    )
    .execute(&state.db)
    .await
    .map_err(query_error)?;

    Ok(())
}

pub async fn update_class(
    State(state): State<Arc<AppState>>,
    Json(ticket_class): Json<TicketClass>,
) -> Result<(), (StatusCode, String)> {
    sqlx::query!(r"
            UPDATE ticket_class
            SET class = $1, multiplier = $2, status = $3
            WHERE class = $1
         ",
         ticket_class.class,
         ticket_class.multiplier,
         ticket_class.status,
    )
    .execute(&state.db)
    .await
    .map_err(query_error)?;

    Ok(())
}
