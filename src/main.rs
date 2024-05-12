#![feature(async_closure)]

use axum::{
    http::StatusCode,
    response::Html,
    routing::{get, post},
    Router,
};
use sqlx::postgres::PgPoolOptions;
use tower_http::services::ServeDir;

pub mod api;
pub mod utils;

use api::schedule::schedule_flight;
use api::book::book_flight;
use api::confirm::confirm_ticket;
use api::revenue::{month_revenue,year_revenue};
use api::price::ticket_price;

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();

    let db_url = std::env::var("DATABASE_URL").unwrap_or_else(|_| {
        "postgres://docker:docker@localhost:5432/flight_ticket_management".to_string()
    });

    let pool = PgPoolOptions::new()
        .max_connections(8)
        .connect(&db_url)
        .await
        .expect("Couldn't connect to database at {DATABASE_URL}");

    let app = Router::new()
        .nest_service("/assets", ServeDir::new("client/dist/assets"))
        .route("/", get(root))
        .route("/schedule", post(schedule_flight))
        .route("/book", post(book_flight))
        .route("/confirm", post(confirm_ticket))
        .route("/revenue/month/:month", get(month_revenue))
        .route("/revenue/year/:year", get(year_revenue))

        .route("/price/:flight_id/:class/:type", get(ticket_price))
        .with_state(pool);

    let listener = tokio::net::TcpListener::bind("localhost:3000")
        .await
        .expect("Unable to bind to port");

    println!("Listening on: localhost:3000");
    axum::serve(listener, app).await.unwrap();
}

async fn root() -> Html<&'static str> {
    Html("hello world")
}

fn internal_error<E>(err: E) -> (StatusCode, String)
where
    E: std::error::Error,
{
    (StatusCode::INTERNAL_SERVER_ERROR, err.to_string())
}
