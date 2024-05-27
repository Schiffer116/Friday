use axum::{
    middleware,
    http::{StatusCode, Method, HeaderValue},
    response::{Html, IntoResponse},
    routing::{get, post},
    extract::Request,
    Router,
};

use tower_http::{
    services::ServeDir,
    classify::ServerErrorsFailureClass,
    trace::TraceLayer,
    cors::CorsLayer,
};

use tracing::{info_span, Span};

use std::{
    net::SocketAddr,
    time::Duration,
    sync::Arc,
};

use crate::{
    api::{
        schedule::{list_schedule, add_schedule, remove_schedule, update_schedule},
        book::book_flight,
        confirm::confirm_ticket,
        revenue::{month_report, year_report},
        airport::{list_airport, add_airport, remove_airport},
        class::{get_class, add_class, remove_class},
        history::{user_history, full_history},
        cancel::cancel_ticket,
        policy::{get_policy, change_policy},
    },
    auth::{
        login::login,
        logout::logout,
        register::register,
        forgot::forgot,
    },
    AppState,
    utils::{
        jwt::{auth_admin, auth_private},
        ticket::price,
    },
};

macro_rules! trace_layer {
    () => {
        TraceLayer::new_for_http()
            .make_span_with(|request: &Request<_>| {
                let matched_path = request.uri().path();
                info_span!(
                    "http_request",
                    method = ?request.method(),
                    matched_path,
                )
            })
            .on_request(|request: &Request<_>, _span: &Span| {
                tracing::info!("started {} {}", request.method(), request.uri().path())
            })
            .on_failure(|_error: ServerErrorsFailureClass, _latency: Duration, _span: &Span| {
                tracing::info!("something went wrong")
            })
    }
}

pub fn frontend() -> Router {
    Router::new()
        .nest_service("/assets", ServeDir::new("client/src/dist/assets"))
        .fallback(frontend_routing)
}

pub fn backend(app_state: Arc<AppState>) -> Router {
    Router::new()
        .merge(public_api(app_state.clone()))
        .merge(private_api(app_state.clone()))
        .merge(admin_api(app_state.clone()))
        .merge(util_routes(app_state.clone()))

        .with_state(app_state.clone())
        .fallback(handler_404)
        .layer(
            CorsLayer::new()
                .allow_origin("http://localhost:5000".parse::<HeaderValue>().unwrap())
                .allow_headers([axum::http::header::CONTENT_TYPE])
                .allow_methods([Method::DELETE, Method::GET, Method::POST])
                .allow_credentials(true)
        )
        .route_layer(trace_layer!())
}

pub async fn serve(app: Router, port: u16) {
    let addr = SocketAddr::from(([127, 0, 0, 1], port));
    let listener = match tokio::net::TcpListener::bind(addr).await {
        Ok(listener) => {
            tracing::info!("listening on {}", listener.local_addr().unwrap());
            listener
        },
        Err(_) => panic!("Failed to bind port")
    };
    axum::serve(listener, app).await.unwrap();
}

async fn frontend_routing() -> impl IntoResponse {
    Html(include_str!("../client/src/dist/index.html"))
}

async fn handler_404() -> impl IntoResponse {
    (StatusCode::NOT_FOUND, "nothing to see here")
}

fn public_api(app_state: Arc<AppState>) -> Router<Arc<AppState>> {
    Router::new()
        .route("/login", post(login))
        .route("/logout", get(logout))
        .route("/register", post(register))
        .route("/forgot/:email", post(forgot))
        .with_state(app_state)
}

fn private_api(app_state: Arc<AppState>) -> Router<Arc<AppState>> {
    Router::new()
        .route("/book", post(book_flight))
        .route("/cancel/:id", get(cancel_ticket))
        .route("/class", get(get_class))
        .route("/schedule", get(list_schedule))
        .route("/user-history", get(user_history))
        .route_layer(middleware::from_fn_with_state(app_state.clone(), auth_private))
        .with_state(app_state)
}

fn admin_api(app_state: Arc<AppState>) -> Router<Arc<AppState>> {
    Router::new()
        .route("/schedule", post(add_schedule).delete(remove_schedule).put(update_schedule))
        .route("/confirm", post(confirm_ticket))

        .route("/revenue/:year", get(year_report))
        .route("/revenue/:year/:month", get(month_report))
        .route("/class", post(add_class).delete(remove_class))
        .route("/airport", post(add_airport).delete(remove_airport))
        .route("/full-history", get(full_history))
        .route("/policy", get(get_policy).put(change_policy))
        .route_layer(middleware::from_fn_with_state(app_state.clone(), auth_admin))
        .with_state(app_state)
}

fn util_routes(app_state: Arc<AppState>) -> Router<Arc<AppState>> {
    Router::new()
        .route("/price", get(price))
        .route("/airport", get(list_airport))
        .with_state(app_state)
}
