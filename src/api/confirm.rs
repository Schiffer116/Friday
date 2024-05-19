use crate::internal_error;
use axum::{
    extract::State,
    http::StatusCode,
    extract::Path,
};
use sqlx::{
    postgres::PgPool,
    query,
};

pub async fn confirm_ticket(
    State(pool): State<PgPool>,
    Path(id): Path<i32>,
) -> Result<(), (StatusCode, String)> {
    query!(r"
           UPDATE ticket SET status = 'confirmed' where id = $1
        ",
        id
    )
    .execute(&pool)
    .await
    .map_err(internal_error)?;

    Ok(())
}
