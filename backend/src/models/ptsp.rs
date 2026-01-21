use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow, Clone)]
pub struct PtspPermohonan {
    pub id: Option<String>,
    pub user_id: Option<String>, // Added user connection
    pub nama_pemohon: String,
    pub jenis_layanan: String,
    pub status: Option<String>,
    pub dokumen_url: Option<String>,
    pub respon_admin_url: Option<String>, // Added admin response doc
    pub catatan_admin: Option<String>,    // Added admin notes
    pub created_at: Option<String>,
    pub updated_at: Option<String>, // Added timestamp
}

#[derive(Debug, Serialize)]
pub struct UploadResponse {
    pub success: bool,
    pub message: String,
    pub data: Option<PtspPermohonan>,
}
