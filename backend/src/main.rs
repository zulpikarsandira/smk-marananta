use axum::{
    extract::FromRef,
    routing::{get, post},
    Router,
};
use sqlx::PgPool;
use std::net::SocketAddr;
use std::sync::Arc;
use tower_http::{cors::CorsLayer, trace::TraceLayer};

mod db;
mod handlers;
mod models;

use handlers::ppdb::{calculate_ranking, get_stats};

#[derive(Clone)]
struct AppState {
    pool: PgPool,
}

impl FromRef<AppState> for PgPool {
    fn from_ref(app_state: &AppState) -> PgPool {
        app_state.pool.clone()
    }
}

#[tokio::main]
async fn main() {
    // Load .env
    dotenvy::dotenv().ok();

    tracing_subscriber::fmt::init();

    println!("🔌 Connecting to Supabase Database High-Performance Pool...");
    let pool = db::establish_connection().await;
    println!("✅ Database connection established!");

    let shared_state = Arc::new(pool);

    // Cors Layer to allow Next.js
    let cors = CorsLayer::permissive();

    use handlers::ptsp::submit_permohonan;

    // ...

    let app = Router::new()
        .route("/", get(root))
        .route("/api/ppdb/ranking", post(calculate_ranking))
        .route("/api/ppdb/stats", get(get_stats))
        .route("/api/ptsp/submit", post(submit_permohonan))
        .route("/api/ptsp/history", get(handlers::ptsp::get_user_history))
        .route(
            "/api/ptsp/admin/list",
            get(handlers::ptsp::get_admin_requests),
        )
        .route(
            "/api/ptsp/admin/update/:id",
            post(handlers::ptsp::update_ptsp_status),
        )
        .layer(TraceLayer::new_for_http()) // Add logging
        .layer(cors)
        .with_state(shared_state);

    let addr = SocketAddr::from(([127, 0, 0, 1], 8080));
    println!("🚀 Rust Backend running on http://{}", addr);

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn root() -> &'static str {
    "Marantaa High Performance Backend is Running 🦀"
}
