use axum::http::StatusCode;

use sqlx::{
    postgres::{
        PgPoolOptions,
        PgConnectOptions,
        PgPool,
    },
    ConnectOptions
};

use tracing_subscriber::{
    layer::SubscriberExt,
    util::SubscriberInitExt
};

use std::sync::Arc;

pub mod router;
pub mod auth;
pub mod config;
pub mod api;
pub mod utils;

use config::Config;
use router::{frontend, backend, serve};

#[derive(Debug)]
pub struct AppState {
    db: PgPool,
    env: Config,
    hash_cost: u32,
}

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

    let config = config::Config::new();

    let pool = connect_database(config.database_url.clone()).await;

    let app_state = Arc::new(AppState {
        db: pool,
        env: config,
        hash_cost: bcrypt::DEFAULT_COST,
    });

    let frontend = async { serve(frontend(), 5000).await };
    let backend = async { serve(backend(app_state), 3000).await };
    tokio::join!(frontend, backend);
}

async fn connect_database(database_url: String) -> PgPool {
    let con_opt = database_url
        .parse::<PgConnectOptions>()
        .unwrap()
        .disable_statement_logging();

    match PgPoolOptions::new().max_connections(8).connect_with(con_opt).await {
        Ok(pool) => {
            tracing::info!("Connection to the database is successful!");
            pool
        },
        Err(_) => panic!("Failed to connect to database"),
    }
}

fn internal_error(err: impl std::error::Error) -> (StatusCode, String) {
    (StatusCode::INTERNAL_SERVER_ERROR, err.to_string())
}
