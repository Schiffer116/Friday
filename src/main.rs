use rocket::fs::NamedFile;

#[macro_use] extern crate rocket;

#[get("/")]
async fn index() -> Option<NamedFile> {
    NamedFile::open("static/index.html").await.ok()
}

#[launch]
fn rocket() -> _ {
    rocket::build().mount("/", routes![index])
}

