use crate::models::ppdb::{PPDBStats, RankingRequest, RankingResponse};
use axum::{extract::State, response::IntoResponse, Json};
use sqlx::PgPool;
use std::sync::Arc;

// "Heavy Lifting" Calculation for PPDB Scoring
// Logic:
// 1. ZONASI: Score = (100 - (distance * 10)) + (Average Report * 0.3)
// 2. PRESTASI: Score = (Average Report * 0.7) + (AchievementBonus * 0.3) -- simplified for now
// 3. Sorting: High score first.

pub async fn calculate_ranking(
    State(_pool): State<Arc<PgPool>>, // In a real app, we'd save results to DB
    Json(payload): Json<RankingRequest>,
) -> impl IntoResponse {
    let mut ranked_students = payload.students;

    // Parallel processing could be used here with Rayon if list is massive (>100k)
    // For now, simple iter_mut is lightning fast in Rust.
    for student in &mut ranked_students {
        let score = if student.jalur_pendaftaran == "ZONASI" {
            // Formula Zonasi: Prioritize Distance.
            // Max distance 10km implies 0 score distance.
            let distance_score = 100.0 - (student.jarak_zonasi_km * 10.0);
            let distance_score = if distance_score < 0.0 {
                0.0
            } else {
                distance_score
            };

            (distance_score * 0.7) + (student.nilai_raport * 0.3)
        } else {
            // Formula Prestasi: Pure Academic
            student.nilai_raport
        };

        student.skor_akhir = Some((score * 100.0).round() / 100.0);

        // Auto-determine status (Example logic)
        if score >= 70.0 {
            student.status = Some("Lolos".to_string());
        } else {
            student.status = Some("Cadangan".to_string());
        }
    }

    // Sort by Score Descending
    ranked_students.sort_by(|a, b| {
        b.skor_akhir
            .unwrap_or(0.0)
            .partial_cmp(&a.skor_akhir.unwrap_or(0.0))
            .unwrap()
    });

    // Calculate Stats
    let total = ranked_students.len();
    let sum_score: f64 = ranked_students
        .iter()
        .map(|s| s.skor_akhir.unwrap_or(0.0))
        .sum();
    let avg = if total > 0 {
        sum_score / total as f64
    } else {
        0.0
    };

    let response = RankingResponse {
        ranked_students,
        stats: PPDBStats {
            total_processed: total,
            average_score: avg,
        },
    };

    Json(response)
}

pub async fn get_stats() -> impl IntoResponse {
    Json(serde_json::json!({
        "status": "active",
        "ppdb_period": "2026/2027",
        "quota": 300
    }))
}
