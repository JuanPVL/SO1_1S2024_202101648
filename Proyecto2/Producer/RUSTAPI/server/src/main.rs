use rocket::response::status::BadRequest;
use std::env::args;
use rocket::serde::json::{json, Value as JsonValue};
use rocket::serde::json::Json;
use rocket::serde::json::to_string;
use rocket::config::SecretKey;
use rocket_cors::{AllowedOrigins, CorsOptions};
use rdkafka::ClientConfig;
use rdkafka::producer::{FutureProducer, FutureRecord};
use rdkafka::util::Timeout;
//use tokio::io::{AsyncBufReadExt, AsyncWriteExt, BufReader};
use uuid::{Uuid};

#[derive(rocket::serde::Deserialize,rocket::serde::Serialize)]
struct Data {
    name: String,
    album: String,
    year: String,
    rank: String,
}

#[rocket::post("/data", data = "<data>")]
async fn receive_data(data: Json<Data>) -> Result<String, BadRequest<String>> {
    let received_data = data.into_inner();
    let response = JsonValue::from(json!({
        "message": format!("Received data: name: {}, album: {}, year: {}, rank: {}", received_data.name, received_data.album, received_data.year, received_data.rank)
    }));
    send_data(received_data).await;
    Ok(response.to_string())
}

fn create_producer(bootstrap_server: &str) -> FutureProducer {
    ClientConfig::new()
        .set("bootstrap.servers", bootstrap_server)
        .set("queue.buffering.max.ms", "0")
        .create().expect("Failed to create client")
}

async fn send_data(data: Data) {
    let mut stdout = tokio::io::stdout();

    let producer = create_producer(&args().skip(1).next()
    .unwrap_or("my-cluster-kafka-bootstrap:9092".to_string()));

    producer.send(FutureRecord::to("myvote")
        .payload(&to_string(&data).unwrap())
        .key(&Uuid::new_v4().to_string()),
    Timeout::Never).await.expect("Failed to send message");
}


#[rocket::main]
async fn main() {
    let secret_key = SecretKey::generate(); // Genera una nueva clave secreta

    // Configuración de opciones CORS
    let cors = CorsOptions::default()
        .allowed_origins(AllowedOrigins::all())
        .to_cors()
        .expect("failed to create CORS fairing");

    let config = rocket::Config {
        address: "0.0.0.0".parse().unwrap(),
        port: 8080,
        secret_key: secret_key.unwrap(), // Desempaqueta la clave secreta generada
        ..rocket::Config::default()
    };

    // Montar la aplicación Rocket con el middleware CORS
    rocket::custom(config)
        .attach(cors)
        .mount("/", rocket::routes![receive_data])
        .launch()
        .await
        .unwrap();
}