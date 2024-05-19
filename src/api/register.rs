#![allow(unused)]

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
use sqlx::postgres::{
    PgPool,
    types::{
        PgMoney,
        PgInterval,
    }
};
use bcrypt::hash_with_salt;

#[derive(Deserialize)]
pub struct RegisterInfo {
    user_name: String,
    name: String,
    password: String,
    email: String,
}

pub async fn register(
    State(connection): State<PgPool>,
    Json(register_info): Json<RegisterInfo>,
) -> Result<(), (StatusCode, String)> {

    let RegisterInfo {
        user_name,
        name,
        password,
        email,
    } = register_info;

    let hash = bcrypt::hash_with_result(password, HASH_COST)
        .map_err(internal_error)?;

    sqlx::query!(r"
            INSERT INTO user_data
                (user_name, name, password_hash, password_salt, email)
            VALUES ($1, $2, $3, $4, $5)
        ",
        user_name,
        name,
        hash.format_for_version(hash_version()),
        hash.get_salt(),
        email
    )
    .execute(&connection)
    .await
    .map_err(internal_error)?;

    Ok(())
}
