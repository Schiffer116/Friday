use crate::{
    internal_error,
    query_error,
    AppState
};
use axum::{
    extract::{Json, State},
    http::StatusCode,
};
use serde::{Serialize, Deserialize};
use std::sync::Arc;

#[derive(Serialize, Deserialize)]
pub struct Airport {
    id: String,
    name: String,
    city: String,
    status: bool,
}

pub async fn list_airport(
    State(state): State<Arc<AppState>>
) -> Result<Json<Vec<Airport>>, (StatusCode, String)> {

    let pair = sqlx::query_as!(
        Airport,
        r#"
        SELECT city, id, status, name
        FROM airport
    "#)
    .fetch_all(&state.db)
    .await
    .map_err(internal_error)?;

    Ok(Json(pair))
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
    id: String,
) -> Result<(), (StatusCode, String)> {
    let result = sqlx::query!(r"
            DELETE FROM airport
            WHERE id = $1
         ",
         id
    )
    .execute(&state.db)
    .await;

    if result.is_ok() {
        return Ok(())
    }

    if let Err(sqlx::Error::Database(_)) = result {
        sqlx::query!(r"
                UPDATE airport
                SET status = false
                WHERE id = $1
             ",
             id
        )
        .execute(&state.db)
        .await
        .map_err(query_error)?;
    } else {
        result.map_err(internal_error)?;
    }
    Ok(())
}
