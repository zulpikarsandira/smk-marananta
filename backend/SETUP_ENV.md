# 🔧 Setup Environment Variables untuk PTSP Upload

## ⚠️ Masalah yang Ditemukan

Saat testing PTSP upload, ditemukan error:
- ❌ Upload gagal: "Invalid Compact JWS" 
- ❌ Database error: "No such host is known"

## 🔍 Analisis

1. **File `.env` tidak memiliki `SUPABASE_SERVICE_ROLE_KEY`**
   - Diperlukan untuk upload file ke Supabase Storage
   - `SUPABASE_ANON_KEY` tidak memiliki permission untuk upload

2. **DATABASE_URL menggunakan direct connection**
   - Bisa menyebabkan masalah DNS di beberapa environment
   - Lebih baik gunakan pooler untuk production

## ✅ Solusi

### **Step 1: Dapatkan Service Role Key**

1. Buka Supabase Dashboard: https://supabase.com/dashboard
2. Pilih project Anda
3. Klik **Settings** → **API**
4. Di bagian **Project API keys**, copy **service_role** key (bukan anon key!)

⚠️ **PENTING:** Service role key sangat powerful! Jangan commit ke Git!

### **Step 2: Update File `.env`**

Tambahkan baris ini ke file `.env`:

```env
# Supabase Service Role Key (untuk upload file)
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3M..."
```

**File `.env` lengkap seharusnya seperti ini:**

```env
# Database Connection
DATABASE_URL="postgres://postgres:Project202699k**@db.hhcqjrlvupoktcdhhraj.supabase.co:5432/postgres"

# Supabase API Configuration
SUPABASE_URL="https://hhcqjrlvupoktcdhhraj.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhoY3Fqcmx2dXBva3RjZGhocmFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5MDMwNzIsImV4cCI6MjA4NDQ3OTA3Mn0.cKiGs5ZC6780ONdCVUMWT729awQ792X25nfcougoeFU"

# Service Role Key (untuk backend operations seperti upload file)
SUPABASE_SERVICE_ROLE_KEY="PASTE_YOUR_SERVICE_ROLE_KEY_HERE"
```

### **Step 3: Setup Database Schema**

Pastikan tabel dan storage bucket sudah dibuat di Supabase:

1. Buka Supabase Dashboard → **SQL Editor**
2. Jalankan script dari `SUPABASE_SCHEMA.sql`:

```sql
-- 1. Create Table for PTSP Requests
create table if not exists ptsp_permohonan (
  id uuid default gen_random_uuid() primary key,
  nama_pemohon text not null,
  jenis_layanan text not null,
  status text default 'Pending',
  dokumen_url text,
  keterangan_admin text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Create Storage Bucket
insert into storage.buckets (id, name, public) 
values ('berkas_ptsp', 'berkas_ptsp', true)
on conflict (id) do nothing;

-- 3. Storage Policies
create policy "Public Upload" on storage.objects
  for insert with check ( bucket_id = 'berkas_ptsp' );

create policy "Public Read" on storage.objects
  for select using ( bucket_id = 'berkas_ptsp' );
```

### **Step 4: Restart Server**

Setelah update `.env`:

```powershell
# Stop server (Ctrl+C di terminal cargo run)
# Kemudian jalankan lagi:
cargo run
```

### **Step 5: Test Ulang**

```powershell
.\test_ptsp.ps1
```

## 📋 Checklist

Sebelum test PTSP upload, pastikan:

- [ ] `SUPABASE_SERVICE_ROLE_KEY` sudah ditambahkan ke `.env`
- [ ] Tabel `ptsp_permohonan` sudah dibuat di Supabase
- [ ] Storage bucket `berkas_ptsp` sudah dibuat
- [ ] Storage policies sudah dibuat
- [ ] Server sudah di-restart setelah update `.env`

## 🔒 Security Notes

**JANGAN PERNAH:**
- ❌ Commit file `.env` ke Git
- ❌ Share `SUPABASE_SERVICE_ROLE_KEY` ke public
- ❌ Gunakan service role key di frontend

**SELALU:**
- ✅ Tambahkan `.env` ke `.gitignore`
- ✅ Gunakan service role key hanya di backend
- ✅ Gunakan anon key di frontend
- ✅ Setup Row Level Security (RLS) di Supabase

## 🎯 Expected Result

Setelah setup lengkap, test PTSP seharusnya menghasilkan:

```json
{
  "success": true,
  "message": "Permohonan berhasil dikirim",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "nama_pemohon": "Budi Santoso",
    "jenis_layanan": "Legalisir Ijazah",
    "status": "Pending",
    "dokumen_url": "https://hhcqjrlvupoktcdhhraj.supabase.co/storage/v1/object/public/berkas_ptsp/uuid_test_document.txt",
    "created_at": "2026-01-20T13:32:00+00:00"
  }
}
```

## 🐛 Troubleshooting

### Error: "Invalid Compact JWS"
**Penyebab:** Service role key salah atau tidak ada  
**Solusi:** Cek dan update `SUPABASE_SERVICE_ROLE_KEY` di `.env`

### Error: "No such host is known"
**Penyebab:** DATABASE_URL tidak valid atau masalah DNS  
**Solusi:** 
1. Cek koneksi internet
2. Verifikasi DATABASE_URL di Supabase Dashboard
3. Coba gunakan pooler URL jika direct connection gagal

### Error: "Bucket not found"
**Penyebab:** Storage bucket belum dibuat  
**Solusi:** Jalankan SQL untuk create bucket (Step 3)

### Error: "Permission denied"
**Penyebab:** Storage policies belum dibuat  
**Solusi:** Jalankan SQL untuk create policies (Step 3)
