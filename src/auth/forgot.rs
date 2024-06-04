use crate::{internal_error, AppState};

use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::IntoResponse,
};
use lettre::message::header::ContentType;
use lettre::transport::smtp::authentication::Credentials;
use lettre::{Message, SmtpTransport, Transport};

use rand::Rng;
use rand::distributions::Alphanumeric;

use std::sync::Arc;

pub async fn forgot(
    State(state): State<Arc<AppState>>,
    Path(email): Path<String>
) -> Result<impl IntoResponse, (StatusCode, String)> {
    let new_password_length = 32;
    let new_password: String = rand::thread_rng()
        .sample_iter(&Alphanumeric)
        .take(new_password_length)
        .map(char::from)
        .collect();

    // sqlx::query!(r"
    //         UPDATE user_data
    //         SET password_hash = $1
    //         WHERE email = $2
    //     ",
    //     hash,
    //     todo!(),
    // )
    // .execute(&state.db)
    // .await
    // .map_err(internal_error);

    let email = Message::builder()
        .from("friday.airline.bot@gmail.com".parse().unwrap())
        .to(email.parse().unwrap())
        .subject("Your new password")
        .header(ContentType::TEXT_PLAIN)
        .body(format!("Your new password is: {new_password}"))
        .unwrap();

    let creds = Credentials::new(
        "friday.airline.bot@gmail.com".to_string(),
        state.env.app_password.clone()
    );

    let mailer = SmtpTransport::relay("smtp.gmail.com")
        .unwrap()
        .credentials(creds)
        .build();

    match mailer.send(&email) {
        Ok(_) => {
            println!("Email sent successfully!");
            Ok(())
        }
        Err(e) => Err(internal_error(e)),
    }
}
