use crate::{
    internal_error,
    HASH_COST,
    hash_version,
};
use axum::{
    extract::{Json, State},
    http::StatusCode,
};
use serde::Deserialize;
use sqlx::postgres::PgPool;
use bcrypt::hash_with_salt;

#[derive(Deserialize)]
pub struct LoginInfo {
    user_name: String,
    password: String,
}

struct Password {
    hash: String,
    salt: String,
}

pub async fn login(
    State(connection): State<PgPool>,
    Json(login_info): Json<LoginInfo>,
) -> Result<(), (StatusCode, String)> {
    let LoginInfo {
        user_name,
        password
    } = login_info;

    let Password { hash: stored_hash, salt } = sqlx::query_as!(
        Password,
        r"
            SELECT password_hash AS hash, password_salt AS salt
            FROM user_data
            WHERE user_name = $1
        ",
        user_name
    )
    .fetch_one(&connection)
    .await
    .map_err(|err| match err {
        sqlx::Error::RowNotFound => (StatusCode::UNAUTHORIZED, "username or password is incorrect".to_string()),
        _ => internal_error(err)
    })?;

    let computed_hash = hash_with_salt(
        password,
        HASH_COST,
        salt
            .as_bytes()
            .try_into()
            .map_err(internal_error)?
    )
    .map_err(internal_error)?
    .format_for_version(hash_version());

    if stored_hash != computed_hash {
        Err((StatusCode::UNAUTHORIZED, "username or password is incorrect".to_string()))
    } else {
        Ok(())
    }
}
