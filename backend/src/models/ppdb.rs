use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct PPDBSiswa {
    pub id: Option<String>, // UUID
    pub nama: String,
    pub nilai_raport: f64,
    pub jarak_zonasi_km: f64,
    pub umur_bulan: i32,
    pub jalur_pendaftaran: String, // "ZONASI", "PRESTASI", "AFIRMASI"
    pub skor_akhir: Option<f64>,
    pub status: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct RankingRequest {
    pub students: Vec<PPDBSiswa>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct RankingResponse {
    pub ranked_students: Vec<PPDBSiswa>,
    pub stats: PPDBStats,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PPDBStats {
    pub total_processed: usize,
    pub average_score: f64,
}
