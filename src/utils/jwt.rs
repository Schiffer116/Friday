use crate::{
    internal_error,
    AppState,
};

use axum::{
    extract::State,
    http::{header, Request, StatusCode},
    middleware::Next,
    response::IntoResponse,
    body::Body,
};
use serde::{Deserialize, Serialize};
use axum_extra::extract::cookie::CookieJar;
use jsonwebtoken::{decode, DecodingKey, Validation};

use std::sync::Arc;

#[derive(Clone, Deserialize, Serialize, Debug, sqlx::Type, PartialEq, Eq, PartialOrd, Ord)]
#[sqlx(type_name = "user_role", rename_all = "lowercase")]
pub enum UserRole {
    Customer,
    Admin,
}

impl UserRole {
    pub fn to_string(&self) -> String {
        match self {
            UserRole::Admin => "admin".to_string(),
            UserRole::Customer => "customer".to_string(),
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct TokenClaims {
    pub sub: String,
    pub role: UserRole,
    pub iat: usize,
    pub exp: usize,
}

macro_rules! authorization_generator {
    ($func_name:ident, $min_role:expr) => {
        pub async fn $func_name(
            cookie_jar: CookieJar,
            State(state): State<Arc<AppState>>,
            mut req: Request<Body>,
            next: Next,
        ) -> Result<impl IntoResponse, (StatusCode, String)> {
            let token = cookie_jar
                .get("token")
                .map(|cookie| cookie.value().to_string())
                .or_else(|| {
                    req.headers()
                        .get(header::AUTHORIZATION)
                        .and_then(|auth_header| auth_header.to_str().ok())
                        .and_then(|auth_value| {
                            if auth_value.starts_with("Bearer ") {
                                Some(auth_value[7..].to_owned())
                            } else {
                                None
                            }
                        })
                })
                .ok_or((
                    StatusCode::UNAUTHORIZED,
                    "You are not logged in, please provide token".to_string()
                ))?;

            let claims = decode::<TokenClaims>(
                &token,
                &DecodingKey::from_secret(state.env.jwt_secret.as_ref()),
                &Validation::default(),
            )
            .map_err(|_| (
                StatusCode::UNAUTHORIZED,
                "Invalid token".to_string()
            ))?
            .claims;

            let email = claims.sub;

            let _ = sqlx::query_scalar!(
                "SELECT email FROM user_data WHERE email = $1",
                email,
            )
            .fetch_one(&state.db)
            .await
            .map_err(|err| match err {
                sqlx::Error::RowNotFound => (
                    StatusCode::UNAUTHORIZED,
                    "Error fetching user from database".to_string()
                ),
                _ => internal_error(err),
            })?;

            let role: UserRole = sqlx::query_scalar!(r#"
                    SELECT role AS "user_role: UserRole"
                    FROM user_data
                    WHERE email = $1
                "#,
                email,
            )
            .fetch_one(&state.db)
            .await
            .map_err(|err| match err {
                sqlx::Error::RowNotFound => (
                    StatusCode::UNAUTHORIZED,
                    "Error fetching user from database".to_string()
                ),
                _ => internal_error(err),
            })?;

            if role < $min_role {
                return Err((
                    StatusCode::UNAUTHORIZED,
                    "You do not have permission to access the requested resource.".to_string()
                ));
            }

            req.extensions_mut().insert(email);

            Ok(next.run(req).await)
        }
    }
}

authorization_generator!(auth_private, UserRole::Customer);
authorization_generator!(auth_admin, UserRole::Admin);
