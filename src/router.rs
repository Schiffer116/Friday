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
        schedule::schedule_flight,
        book::book_flight,
        confirm::confirm_ticket,
        list_flight::list_flight,
        revenue::{month_report, year_report},
        airport::add_airport,
        class::add_class,
        history::{user_history, full_history},
        cancel::cancel_ticket,
        policy::{get_policy, change_policy},
        seat_class::ticket_class,
    },
    auth::{
        login::login,
        register::register,
        forgot::forgot,
    },
    AppState,
    utils::{
        jwt::{auth_admin, auth_private},
        ticket::price,
        cities::list_cities,
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
                .allow_methods([Method::GET, Method::POST])
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
        .route("/register", post(register))
        .route("/forgot/:email", post(forgot))
        .route("/class", get(ticket_class))
        .with_state(app_state)
}

fn private_api(app_state: Arc<AppState>) -> Router<Arc<AppState>> {
    Router::new()
        .route("/book", post(book_flight))
        .route("/cancel/:id", get(cancel_ticket))
        .route("/list", get(list_flight))
        .route("/user-history", get(user_history))
        .route_layer(middleware::from_fn_with_state(app_state.clone(), auth_private))
        .with_state(app_state)
}

fn admin_api(app_state: Arc<AppState>) -> Router<Arc<AppState>> {
    Router::new()
        .route("/schedule", post(schedule_flight))
        .route("/confirm/:id", post(confirm_ticket))
        .route("/revenue/:year", get(year_report))
        .route("/revenue/:year/:month", get(month_report))
        .route("/add-class", post(add_class))
        .route("/add-airport", post(add_airport))
        .route("/full-history", get(full_history))
        .route("/get-policy", get(get_policy))
        .route("/change-policy", post(change_policy))
        .route_layer(middleware::from_fn_with_state(app_state.clone(), auth_admin))
        .with_state(app_state)
}

fn util_routes(app_state: Arc<AppState>) -> Router<Arc<AppState>> {
    Router::new()
        .route("/price", get(price))
        .route("/cities", get(list_cities))
        .with_state(app_state)
}
