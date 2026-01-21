use sqlx::postgres::{PgPool, PgPoolOptions};
use std::env;
use std::time::Duration;

pub async fn establish_connection() -> PgPool {
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");

    // Use connect_lazy to allow the server to start even if DB is currently unreachable (e.g. IPv6 issues)
    // The connection will be established only when a Query is actually executed.
    PgPoolOptions::new()
        .max_connections(20)
        .acquire_timeout(Duration::from_secs(3))
        .connect_lazy(&database_url)
        .expect("Failed to create pool")
}
