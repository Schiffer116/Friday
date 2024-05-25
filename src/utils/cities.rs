use crate::{
    internal_error,
    AppState
};

use axum::{
    extract::{Json, State},
    http::StatusCode,
};
use serde::Serialize;
use std::sync::Arc;

#[derive(Serialize)]
pub struct AirportCity {
    airport: String,
    city: String,
    status: bool,
}

pub async fn list_cities(
    State(state): State<Arc<AppState>>
) -> Result<Json<Vec<AirportCity>>, (StatusCode, String)> {

    let pair = sqlx::query_as!(
        AirportCity,
        r#"
        SELECT city, id as "airport", status
        FROM airport
    "#)
    .fetch_all(&state.db)
    .await
    .map_err(internal_error)?;

    Ok(Json(pair))
}
