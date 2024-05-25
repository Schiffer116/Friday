use crate::{internal_error, AppState};
use axum::{
    extract::{Path, Json, State},
    http::StatusCode,
};
use serde::Deserialize;
use std::sync::Arc;

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Airport {
    id: String,
    name: String,
    city: String,
}

pub async fn add_airport(
    State(state): State<Arc<AppState>>,
    Json(airport): Json<Airport>,
) -> Result<(), (StatusCode, String)> {
    sqlx::query!(r"
            INSERT INTO airport
                (id, name, city)
            VALUES ($1, $2, $3)
         ",
         airport.id,
         airport.name,
         airport.city,
    )
    .execute(&state.db)
    .await
    .map_err(internal_error)?;

    Ok(())
}

pub async fn remove_airport(
    State(state): State<Arc<AppState>>,
    Path(id): Path<String>,
) -> Result<(), (StatusCode, String)> {
    sqlx::query!(r"
            UPDATE airport
            SET status = false
            where id = $1
         ",
         id
    )
    .execute(&state.db)
    .await
    .map_err(internal_error)?;

    Ok(())
}
