use crate::{
    internal_error,
    AppState,
    utils::jwt::{
        TokenClaims,
        UserRole,
    }
};

use axum::{
    extract::{Json, State},
    http::{StatusCode, header},
    response::{Response, IntoResponse},
};
use axum_extra::extract::cookie::{Cookie, SameSite};
use chrono::Utc;
use serde::Deserialize;
use jsonwebtoken::{encode, EncodingKey, Header};

use std::sync::Arc;

#[derive(Debug, Deserialize)]
pub struct LoginInfo {
    email: String,
    password: String,
}

#[tracing::instrument(skip_all)]
pub async fn login(
    State(state): State<Arc<AppState>>,
    Json(login_info): Json<LoginInfo>,
) -> Result<impl IntoResponse, (StatusCode, String)> {

    let LoginInfo {
        email,
        password
    } = login_info;

    let hash = sqlx::query_scalar!(r"
            SELECT password_hash AS hash
            FROM user_data
            WHERE email = $1
        ",
        email
    )
    .fetch_one(&state.db)
    .await
    .map_err(|err| match err {
        sqlx::Error::RowNotFound => (
            StatusCode::UNAUTHORIZED,
            "Email or password is incorrect".to_string()
        ),
        _ => internal_error(err)
    })?;

    if !bcrypt::verify(password, &hash).map_err(internal_error)? {
        return Err((
            StatusCode::UNAUTHORIZED,
            "email or password is incorrect".to_string()
        ))
    }

    let now = Utc::now();
    let iat = now.timestamp() as usize;
    let exp = (now + chrono::Duration::minutes(60)).timestamp() as usize;

    let role = sqlx::query_scalar!(r#"
            SELECT role AS "user_role!: UserRole"
            FROM user_data
            WHERE email = $1
        "#,
        email
    )
    .fetch_one(&state.db)
    .await
    .map_err(internal_error)?;

    let claims: TokenClaims = TokenClaims {
        sub: email,
        role: role.clone(),
        exp,
        iat,
    };

    let token = encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(state.env.jwt_secret.as_ref()),
    )
    .map_err(internal_error)?;

    let cookie = Cookie::build(("token", token.to_owned()))
        .path("/")
        .max_age(time::Duration::hours(1))
        .same_site(SameSite::Lax)
        .http_only(true)
        .secure(true);

    let mut response = Response::new(token);


    response
        .headers_mut()
        .insert(header::SET_COOKIE, cookie.to_string().parse().map_err(internal_error)?);

    tracing::debug!("{response:?}");

    Ok(response)
}
