use crate::models::ptsp::{PtspPermohonan, UploadResponse};
use axum::{
    extract::{Multipart, Path, Query, State},
    response::IntoResponse,
    Json,
};
use reqwest::Client;
use sqlx::PgPool;
use std::env;
use std::sync::Arc;

pub async fn submit_permohonan(
    State(_pool): State<Arc<PgPool>>,
    mut multipart: Multipart,
) -> impl IntoResponse {
    let mut nama_pemohon = String::new();
    let mut nik = String::new();
    let mut _user_id = String::new(); // New field capture
    let mut _email = String::new();
    let mut _no_telepon = String::new();
    let mut jenis_layanan = String::new();
    let mut _keterangan = String::new();
    let mut file_url = String::new();

    let supabase_url = env::var("SUPABASE_URL").unwrap_or_default();
    let supabase_key = env::var("SUPABASE_SERVICE_ROLE_KEY").unwrap_or_default();

    println!("📥 Menerima request PTSP...");

    while let Some(field) = multipart.next_field().await.unwrap() {
        let name = field.name().unwrap().to_string();
        println!("📋 Field: {}", name);

        if name == "dokumen" {
            let file_name = field.file_name().unwrap().to_string();
            let content_type = field
                .content_type()
                .unwrap_or("application/octet-stream")
                .to_string();
            let data = field.bytes().await.unwrap();

            println!("📎 File: {} ({} bytes)", file_name, data.len());

            // 1. Upload to Supabase Storage
            let client = Client::new();
            let unique_name = format!("{}_{}", uuid::Uuid::new_v4(), file_name);
            let url = format!(
                "{}/storage/v1/object/berkas_ptsp/{}",
                supabase_url, unique_name
            );

            println!("☁️ Uploading ke Supabase Storage...");

            let res = client
                .post(&url)
                .header("Authorization", format!("Bearer {}", supabase_key))
                .header("Content-Type", content_type)
                .body(data)
                .send()
                .await;

            match res {
                Ok(response) => {
                    if response.status().is_success() {
                        file_url = format!(
                            "{}/storage/v1/object/public/berkas_ptsp/{}",
                            supabase_url, unique_name
                        );
                        println!("✅ Upload berhasil: {}", file_url);
                    } else {
                        let error_text = response.text().await.unwrap_or_default();
                        println!("❌ Upload gagal: {}", error_text);
                    }
                }
                Err(e) => println!("❌ Storage Error: {:?}", e),
            }
        } else if name == "nama_pemohon" {
            nama_pemohon = field.text().await.unwrap();
        } else if name == "nik" {
            nik = field.text().await.unwrap();
        } else if name == "email" {
            _email = field.text().await.unwrap();
        } else if name == "no_telepon" {
            _no_telepon = field.text().await.unwrap();
        } else if name == "jenis_layanan" {
            jenis_layanan = field.text().await.unwrap();
        } else if name == "keterangan" {
            _keterangan = field.text().await.unwrap();
        } else if name == "user_id" {
            _user_id = field.text().await.unwrap();
        }
    }

    println!("💾 Menyimpan ke database...");
    println!("   Nama: {}", nama_pemohon);
    println!("   NIK: {}", nik);
    println!("   Layanan: {}", jenis_layanan);

    println!("💾 Menyimpan ke database...");

    // 2. Insert to Database using SQLX
    // 2. Insert to Database using REST API (Bypassing SQL Connection Pool Issues)
    let body = serde_json::json!({
        "user_id": if _user_id.is_empty() { None } else { Some(_user_id) },
        "nama_pemohon": nama_pemohon,
        "jenis_layanan": jenis_layanan,
        "dokumen_url": file_url,
        "status": "Pending"
    });

    let client = Client::new();
    let res = client
        .post(format!("{}/rest/v1/ptsp_permohonan", supabase_url))
        .header("apikey", &supabase_key)
        .header("Authorization", format!("Bearer {}", supabase_key))
        .header("Content-Type", "application/json")
        .header("Prefer", "return=representation")
        .json(&body)
        .send()
        .await;

    match res {
        Ok(response) => {
            if response.status().is_success() {
                let records: Vec<PtspPermohonan> = response.json().await.unwrap_or_default();
                let record = records.first().cloned();

                Json(UploadResponse {
                    success: true,
                    message: "Permohonan berhasil dikirim".to_string(),
                    data: record,
                })
            } else {
                let err_text = response.text().await.unwrap_or_default();
                println!("REST Insert Error: {}", err_text);
                Json(UploadResponse {
                    success: false,
                    message: format!("Gagal menyimpan: {}", err_text),
                    data: None,
                })
            }
        }
        Err(e) => {
            println!("Reqwest Error: {:?}", e);
            Json(UploadResponse {
                success: false,
                message: "Gagal koneksi ke database API".to_string(),
                data: None,
            })
        }
    }
}

// --- New Handlers for Feedback Loop ---

#[derive(serde::Deserialize)]
pub struct HistoryQuery {
    user_id: String,
}

pub async fn get_user_history(
    State(_pool): State<Arc<PgPool>>,
    Query(query): Query<HistoryQuery>,
) -> impl IntoResponse {
    let supabase_url = env::var("SUPABASE_URL").unwrap_or_default();
    let supabase_key = env::var("SUPABASE_SERVICE_ROLE_KEY").unwrap_or_default();
    let client = Client::new();

    let url = format!(
        "{}/rest/v1/ptsp_permohonan?user_id=eq.{}&order=created_at.desc",
        supabase_url, query.user_id
    );

    let res = client
        .get(&url)
        .header("apikey", &supabase_key)
        .header("Authorization", format!("Bearer {}", supabase_key))
        .send()
        .await;

    match res {
        Ok(response) => {
            if response.status().is_success() {
                let rows: Vec<PtspPermohonan> = response.json().await.unwrap_or_default();
                Json(serde_json::json!({ "success": true, "data": rows }))
            } else {
                Json(
                    serde_json::json!({ "success": false, "message": "Gagal mengambil history", "data": [] }),
                )
            }
        }
        Err(_) => Json(
            serde_json::json!({ "success": false, "message": "Error koneksi history", "data": [] }),
        ),
    }
}

pub async fn get_admin_requests(State(_pool): State<Arc<PgPool>>) -> impl IntoResponse {
    let supabase_url = env::var("SUPABASE_URL").unwrap_or_default();
    let supabase_key = env::var("SUPABASE_SERVICE_ROLE_KEY").unwrap_or_default();
    let client = Client::new();

    let url = format!(
        "{}/rest/v1/ptsp_permohonan?select=*&order=created_at.desc",
        supabase_url
    );

    let res = client
        .get(&url)
        .header("apikey", &supabase_key)
        .header("Authorization", format!("Bearer {}", supabase_key))
        .send()
        .await;

    match res {
        Ok(response) => {
            if response.status().is_success() {
                let rows: Vec<PtspPermohonan> = response.json().await.unwrap_or_default();
                Json(serde_json::json!({ "success": true, "data": rows }))
            } else {
                Json(
                    serde_json::json!({ "success": false, "message": "Gagal mengambil data admin", "data": [] }),
                )
            }
        }
        Err(_) => Json(
            serde_json::json!({ "success": false, "message": "Error koneksi admin", "data": [] }),
        ),
    }
}

pub async fn update_ptsp_status(
    State(_pool): State<Arc<PgPool>>,
    Path(id): Path<String>,
    mut multipart: Multipart,
) -> impl IntoResponse {
    let mut status = String::new();
    let mut catatan = String::new();
    let mut respon_url = String::new();

    let supabase_url = env::var("SUPABASE_URL").unwrap_or_default();
    let supabase_key = env::var("SUPABASE_SERVICE_ROLE_KEY").unwrap_or_default();

    while let Some(field) = multipart.next_field().await.unwrap() {
        let name = field.name().unwrap().to_string();

        if name == "dokumen_balasan" {
            let file_name = field.file_name().unwrap().to_string();
            let content_type = field
                .content_type()
                .unwrap_or("application/pdf")
                .to_string();
            let data = field.bytes().await.unwrap();

            // Upload Admin Response via REST (already correct, just ensure imports/context)
            let client = Client::new();
            let unique_name = format!("admin_{}_{}", uuid::Uuid::new_v4(), file_name);
            let url = format!(
                "{}/storage/v1/object/berkas_ptsp/{}",
                supabase_url, unique_name
            );

            let res = client
                .post(&url)
                .header("Authorization", format!("Bearer {}", supabase_key))
                .header("Content-Type", content_type)
                .body(data)
                .send()
                .await;

            if let Ok(response) = res {
                if response.status().is_success() {
                    respon_url = format!(
                        "{}/storage/v1/object/public/berkas_ptsp/{}",
                        supabase_url, unique_name
                    );
                }
            }
        } else if name == "status" {
            status = field.text().await.unwrap();
        } else if name == "catatan" {
            catatan = field.text().await.unwrap();
        }
    }

    // Dynamic Update Query via REST
    let mut body_map = serde_json::Map::new();
    body_map.insert("status".to_string(), serde_json::json!(status));
    body_map.insert("catatan_admin".to_string(), serde_json::json!(catatan));
    body_map.insert(
        "updated_at".to_string(),
        serde_json::json!(chrono::Utc::now().to_rfc3339()),
    );

    if !respon_url.is_empty() {
        body_map.insert(
            "respon_admin_url".to_string(),
            serde_json::json!(respon_url),
        );
    }

    let client = Client::new();
    let res = client
        .patch(format!(
            "{}/rest/v1/ptsp_permohonan?id=eq.{}",
            supabase_url, id
        ))
        .header("apikey", &supabase_key)
        .header("Authorization", format!("Bearer {}", supabase_key))
        .header("Content-Type", "application/json")
        .json(&serde_json::Value::Object(body_map))
        .send()
        .await;

    match res {
        Ok(response) => {
            if response.status().is_success() {
                Json(
                    serde_json::json!({ "success": true, "message": "Status berhasil diperbarui" }),
                )
            } else {
                Json(
                    serde_json::json!({ "success": false, "message": "Gagal update status via REST" }),
                )
            }
        }
        Err(e) => Json(serde_json::json!({ "success": false, "message": e.to_string() })),
    }
}
