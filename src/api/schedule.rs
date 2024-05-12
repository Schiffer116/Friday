use crate::internal_error;
use axum::{
    extract::{Json, State},
    http::StatusCode,
};
use chrono::{naive::serde::ts_microseconds, Duration, NaiveDateTime};
use serde::Deserialize;
use sqlx::postgres::PgPool;

#[derive(Debug, Deserialize)]
pub struct FlightSchedule {
    number: String,
    airline: String,
    price: i32,
    src: String,
    dst: String,
    #[serde(with = "ts_microseconds")]
    date_time: NaiveDateTime,
    duration: i64,
    layovers: Vec<Layover>,
}

#[derive(Debug, Deserialize)]
struct Layover {
    airport_id: String,
    ord: i16,
    duration: i64,
    note: String,
}

pub async fn schedule_flight(
    State(pool): State<PgPool>,
    Json(schedule): Json<FlightSchedule>,
) -> Result<(), (StatusCode, String)> {
    let FlightSchedule {
        number,
        airline,
        price,
        src,
        dst,
        date_time,
        duration,
        layovers,
    } = schedule;

    let mut transaction = pool.begin().await.map_err(|e| internal_error(e))?;

    let (flight_id,): (i32,) = sqlx::query_as(
        r#"
            INSERT INTO flight
                (flight_number, airline, ticket_price, source_airport_id, destination_airport_id, date_time, duration)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id
        "#,
    )
    .bind(number)
    .bind(airline)
    .bind(price)
    .bind(src)
    .bind(dst)
    .bind(date_time)
    .bind(Duration::minutes(duration))
    .fetch_one(&mut *transaction)
    .await
    .map_err(|e| internal_error(e))?;

    for layover in layovers {
        let _ = sqlx::query(r#"
                INSERT INTO layover
                    (flight_id, ordinal, airport_id, duration, note)
                VALUES ($1, $2, $3, $4, $5)
            "#)
            .bind(flight_id)
            .bind(layover.ord)
            .bind(layover.airport_id)
            .bind(Duration::minutes(layover.duration))
            .bind(layover.note)
            .fetch_one(&mut *transaction)
            .await
            .map_err(internal_error);
    }

    transaction.commit().await.map_err(|e| internal_error(e))?;

    Ok(())
}

#[allow(unused)]
#[cfg(test)]
mod tests {
    use crate::*;
    use axum::{
        body::Body,
        http::{self, Request, StatusCode},
    };
    use serde_json::{json, Value};
    use tokio::net::TcpListener;
    use tower::{Service, ServiceExt};


    #[tokio::test]
    async fn test_1() {
        let pool = PgPoolOptions::new()
            .max_connections(1)
            .connect("postgres://docker:docker@localhost:5432/flight_ticket_management")
            .await
            .expect("Couldn't connect to database");

        // let app = Router::new()
        //     .route("/schedule", post(schedule_flight))
        //     .with_state(pool);

        let json = r#"
            {
              "id": "VN123",
              "price": 12312,
              "src": "HAN",
              "dst": "DXB",
              "date_time": 1232131242312,
              "duration": 123,
              "layovers": [
                {
                  "airport_id": "ATL",
                  "ord": 1,
                  "duration": 123,
                  "note": "danger"
                },
                {
                  "airport_id": "HND",
                  "ord": 2,
                  "duration": 456,
                  "note": "danger"
                },
                {
                  "airport_id": "DXB",
                  "ord": 3,
                  "duration": 789,
                  "note": "danger"
                }
              ]
            }
        "#;
        // let response = app
        //     .oneshot(
        //         Request::builder()
        //          .uri("/schedule")
        //          .body(()).unwrap()
        //      )
        //     .await
        //     .unwrap();

        // assert_eq!(response.status(), StatusCode::OK)
    }
}
