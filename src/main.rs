use axum::{
    http::StatusCode,
    response::{Html, Response, IntoResponse},
    routing::{get, post},
    extract::Request,
    Router,
};

use sqlx::{
    postgres::{PgPoolOptions, PgConnectOptions},
    ConnectOptions
};

use std::time::Duration;
use tower_http::{
    services::ServeDir,
    classify::ServerErrorsFailureClass,
    trace::TraceLayer
};

use tracing::{info_span, Span};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

use bcrypt::Version;

pub mod api;
pub mod utils;

use api::{
    schedule::schedule_flight,
    book::book_flight,
    confirm::confirm_ticket,
    list_flight::list_flight,
    revenue::{month_report, year_report},
    price::ticket_price,
    login::login,
    register::register,
};

static HASH_COST: u32 = 5;

#[tokio::main]
async fn main() {
    tracing_subscriber::registry()
    .with(
        tracing_subscriber::EnvFilter::try_from_default_env().unwrap_or_else(|_| {
            "friday=debug,tower_http=debug,axum::rejection=trace".into()
        }),
    )
    .with(tracing_subscriber::fmt::layer())
    .init();


    let db_url = std::env::var("DATABASE_URL").unwrap_or_else(|_| {
        "postgres://docker:docker@localhost:5432/flight_ticket_management".to_string()
    });

    let con_opt: PgConnectOptions = db_url
        .parse::<PgConnectOptions>()
        .unwrap()
        .disable_statement_logging();

    let pool = PgPoolOptions::new()
        .max_connections(12)
        .connect_with(con_opt)
        .await
        .expect(&format!("Couldn't connect to database at {db_url}"));


    let app = Router::new()
        .nest_service("/assets", ServeDir::new("client/dist/assets"))
        .route("/", get(root))

        // Add ticket_count ._.
        .route("/schedule", post(schedule_flight))
        .route("/book", post(book_flight))
        .route("/confirm/:id", post(confirm_ticket))
        .route("/list", get(list_flight))
        .route("/revenue/:year", get(year_report))
        .route("/revenue/:year/:month", get(month_report))

        .route("/login", post(login))
        .route("/register", post(register))

        .route("/price", get(ticket_price))
        .with_state(pool)
        .fallback(handler_404)
        .layer(
            TraceLayer::new_for_http()
                .make_span_with(|request: &Request<_>| {
                    let matched_path = request
                        .uri()
                        .path();

                    info_span!(
                        "http_request",
                        method = ?request.method(),
                        matched_path,
                    )
                })
                .on_request(|request: &Request<_>, _span: &Span| {
                    tracing::info!("started {} {}", request.method(), request.uri().path())
                })
                .on_response(|_response: &Response, latency: Duration, _span: &Span| {
                    tracing::info!("response generated in {:?}", latency)
                })
                .on_failure(|_error: ServerErrorsFailureClass, _latency: Duration, _span: &Span| {
                    tracing::info!("something went wrong")
                })
        );


    let listener = tokio::net::TcpListener::bind("127.0.0.1:3000")
        .await
        .expect("Unable to bind to port");
    tracing::info!("listening on {}", listener.local_addr().unwrap());
    axum::serve(listener, app).await.unwrap();
}

async fn root() -> Html<&'static str> {
    Html("hello world")
}

async fn handler_404() -> impl IntoResponse {
    (StatusCode::NOT_FOUND, "nothing to see here")
}

fn internal_error(err: impl std::error::Error) -> (StatusCode, String) {
    (StatusCode::INTERNAL_SERVER_ERROR, err.to_string())
}

fn hash_version() -> Version {
    Version::TwoB
}
