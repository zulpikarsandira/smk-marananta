# 🔍 Troubleshooting Database Connection - PTSP

## 📊 Error yang Terjadi

```
Database Error: "Tenant or user not found"
Database Error: "No such host is known"
```

## 🔧 Solusi yang Perlu Dicoba

### **Opsi 1: Direct Connection (IPv4)**
```env
DATABASE_URL="postgresql://postgres:Project202699k**@db.hhcqjrlvupoktcdhhraj.supabase.co:5432/postgres"
```

### **Opsi 2: Pooler Connection (Transaction Mode)**
```env
DATABASE_URL="postgresql://postgres.hhcqjrlvupoktcdhhraj:Project202699k**@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
```

### **Opsi 3: Pooler Connection (Session Mode)**
```env
DATABASE_URL="postgresql://postgres.hhcqjrlvupoktcdhhraj:Project202699k**@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"
```

### **Opsi 4: Connection dengan SSL Mode**
```env
DATABASE_URL="postgresql://postgres:Project202699k**@db.hhcqjrlvupoktcdhhraj.supabase.co:5432/postgres?sslmode=require"
```

## 📋 Langkah Troubleshooting

### **1. Verifikasi di Supabase Dashboard**

Buka: https://supabase.com/dashboard/project/hhcqjrlvupoktcdhhraj

**Cek:**
- [ ] Database status: **Active** (bukan Paused)
- [ ] Settings → Database → Connection String
- [ ] Copy connection string yang benar

### **2. Test Connection Manual**

Jika punya `psql` installed:

```powershell
# Test direct connection
psql "postgresql://postgres:Project202699k**@db.hhcqjrlvupoktcdhhraj.supabase.co:5432/postgres"

# Jika berhasil connect, jalankan:
\dt  # List tables
\q   # Quit
```

### **3. Cek DNS Resolution**

```powershell
# Test DNS resolve
nslookup db.hhcqjrlvupoktcdhhraj.supabase.co
nslookup aws-0-ap-southeast-1.pooler.supabase.com

# Test ping
ping db.hhcqjrlvupoktcdhhraj.supabase.co
```

### **4. Cek Firewall/Antivirus**

Pastikan:
- Windows Firewall tidak block port 5432/6543
- Antivirus tidak block koneksi ke Supabase
- VPN tidak interfere dengan connection

### **5. Test dengan Supabase Client Library**

Coba test connection dengan library lain untuk memastikan bukan masalah SQLX:

```rust
// Tambahkan di Cargo.toml (temporary)
[dependencies]
postgres = "0.19"

// Test connection
use postgres::{Client, NoTls};

let mut client = Client::connect(
    "postgresql://postgres:Project202699k**@db.hhcqjrlvupoktcdhhraj.supabase.co:5432/postgres",
    NoTls
)?;

let rows = client.query("SELECT 1", &[])?;
println!("Connection OK: {:?}", rows);
```

## 🎯 Kemungkinan Penyebab & Solusi

### **Penyebab 1: Database Paused**
**Solusi:** 
1. Buka Supabase Dashboard
2. Klik "Resume" jika database paused
3. Tunggu 30 detik
4. Test ulang

### **Penyebab 2: Password Salah**
**Solusi:**
1. Settings → Database → Reset Password
2. Copy password baru
3. Update `.env`
4. Restart server

### **Penyebab 3: DNS Resolution Failed**
**Solusi:**
1. Flush DNS cache:
   ```powershell
   ipconfig /flushdns
   ```
2. Coba gunakan pooler connection
3. Restart komputer jika perlu

### **Penyebab 4: Connection Limit Reached**
**Solusi:**
1. Cek di Supabase Dashboard → Database → Connection Pooling
2. Gunakan pooler connection (port 6543)
3. Set max connections di code

### **Penyebab 5: SSL/TLS Issue**
**Solusi:**
1. Tambahkan `?sslmode=require` ke connection string
2. Atau gunakan `?sslmode=disable` untuk testing

### **Penyebab 6: Region/Network Issue**
**Solusi:**
1. Cek koneksi internet stabil
2. Coba dari network lain
3. Disable VPN jika ada

## 🔄 Workflow Fix

```
1. Cek database status di Dashboard
   ↓
2. Verifikasi password benar
   ↓
3. Test DNS resolution
   ↓
4. Coba connection string alternatif
   ↓
5. Flush DNS cache
   ↓
6. Restart server
   ↓
7. Test ulang
```

## 📝 Checklist Sebelum Test

- [ ] Database status: Active
- [ ] Password: Benar dan ter-update
- [ ] DNS: Bisa resolve hostname
- [ ] Firewall: Tidak block port
- [ ] `.env`: File sudah di-save
- [ ] Server: Sudah di-restart

## 🚀 Quick Fix Commands

```powershell
# 1. Flush DNS
ipconfig /flushdns

# 2. Update .env dengan connection string baru
# (Edit manual di file)

# 3. Restart server
# Ctrl+C di terminal cargo run
cargo run

# 4. Test PTSP
cd backend
.\test_ptsp.ps1
```

## 📊 Expected Result Setelah Fix

```json
{
  "success": true,
  "message": "Permohonan berhasil dikirim",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "nama_pemohon": "Budi Santoso",
    "jenis_layanan": "Legalisir Ijazah",
    "status": "Pending",
    "dokumen_url": "https://hhcqjrlvupoktcdhhraj.supabase.co/storage/v1/object/public/berkas_ptsp/...",
    "created_at": "2026-01-20T14:27:00+00:00"
  }
}
```

## 🆘 Jika Masih Error

Jika semua cara di atas sudah dicoba dan masih error:

1. **Screenshot error message** lengkap
2. **Copy connection string** yang digunakan (sensor password)
3. **Cek Supabase status page**: https://status.supabase.com
4. **Contact Supabase support** atau cek Discord/Forum

## 💡 Workaround Sementara

Jika database connection tidak bisa fix segera, bisa:

1. **Skip database insert** untuk sementara
2. **Hanya simpan file ke Storage** (sudah working!)
3. **Log data ke file** untuk manual entry nanti
4. **Gunakan mock database** untuk development

```rust
// Workaround: Skip database, return success
Json(UploadResponse {
    success: true,
    message: "File berhasil diupload (database disabled)".to_string(),
    data: None,
})
```
