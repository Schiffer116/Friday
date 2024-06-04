use axum::{
    http::header,
    response::{IntoResponse, Response},
};
use axum_extra::extract::cookie::{Cookie, SameSite};
use serde_json::json;


pub async fn logout() -> impl IntoResponse {
    let cookie = Cookie::build(("token", ""))
        .path("/")
        .max_age(time::Duration::hours(-1))
        .same_site(SameSite::Lax)
        .http_only(true);

    let mut response = Response::new(json!({"status": "success"}).to_string());
    response
        .headers_mut()
        .insert(header::SET_COOKIE, cookie.to_string().parse().unwrap());
    response
}
