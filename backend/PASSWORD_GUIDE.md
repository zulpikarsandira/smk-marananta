# 🔐 Cara Mendapatkan Password Database yang Benar

## ⚠️ Masalah Saat Ini

Error yang muncul:
```
Database Error: "Tenant or user not found"
```

Ini berarti **PASSWORD SALAH** atau **DATABASE PAUSED**.

---

## 📋 LANGKAH-LANGKAH MENDAPATKAN PASSWORD YANG BENAR

### **Opsi 1: Cek Password yang Tersimpan**

1. Buka Supabase Dashboard: https://supabase.com/dashboard
2. Pilih project **hhcqjrlvupoktcdhhraj**
3. Klik **Settings** (⚙️) → **Database**
4. Scroll ke bagian **"Database Password"**
5. Jika Anda pernah menyimpan password, gunakan password tersebut
6. Jika tidak ingat, lanjut ke Opsi 2

### **Opsi 2: Reset Password Database**

1. Di halaman Settings → Database yang sama
2. Scroll ke bagian **"Database Password"**
3. Klik tombol **"Reset Database Password"**
4. Supabase akan generate password baru
5. **PENTING:** Copy dan simpan password ini dengan aman!
6. Password akan terlihat seperti: `abcdef123456GHIJKL`

### **Opsi 3: Gunakan Connection Pooler**

Jika direct connection tidak work, coba pooler:

1. Di Settings → Database
2. Scroll ke **"Connection String"**
3. Klik tab **"Pooler"** (bukan URI)
4. Pilih Mode: **"Session"**
5. Copy connection string
6. Ganti `[YOUR-PASSWORD]` dengan password Anda

---

## 🔧 UPDATE FILE .ENV

Setelah mendapatkan password yang benar, update file `backend\.env`:

### **Format 1: Direct Connection (Port 5432)**
```env
DATABASE_URL="postgresql://postgres:PASSWORD_ANDA_DISINI@db.hhcqjrlvupoktcdhhraj.supabase.co:5432/postgres"
```

### **Format 2: Pooler Connection (Port 6543)**
```env
DATABASE_URL="postgresql://postgres.hhcqjrlvupoktcdhhraj:PASSWORD_ANDA_DISINI@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"
```

**PENTING:** Ganti `PASSWORD_ANDA_DISINI` dengan password yang benar!

---

## ✅ VERIFIKASI PASSWORD BENAR

### **Test Connection dengan psql (Opsional)**

Jika Anda punya PostgreSQL client installed:

```powershell
# Test direct connection
psql "postgresql://postgres:PASSWORD_ANDA@db.hhcqjrlvupoktcdhhraj.supabase.co:5432/postgres"

# Jika berhasil, Anda akan masuk ke PostgreSQL prompt
# Ketik \q untuk keluar
```

### **Cek Database Tidak Paused**

1. Di Supabase Dashboard
2. Lihat status project di pojok kanan atas
3. Jika ada tulisan **"Paused"**, klik **"Resume"**
4. Tunggu beberapa detik sampai status menjadi **"Active"**

---

## 🎯 CHECKLIST

Sebelum test ulang, pastikan:

- [ ] Password sudah benar (dari Dashboard atau reset)
- [ ] Database status **Active** (tidak Paused)
- [ ] File `.env` sudah di-update dengan password baru
- [ ] File `.env` sudah di-save
- [ ] Server sudah di-restart (`cargo run`)

---

## 🚀 SETELAH UPDATE PASSWORD

1. **Restart server:**
   ```powershell
   # Di terminal cargo run, tekan Ctrl+C
   cargo run
   ```

2. **Test ulang:**
   ```powershell
   cd backend
   .\test_ptsp.ps1
   ```

3. **Expected result:**
   ```json
   {
     "success": true,
     "message": "Permohonan berhasil dikirim",
     "data": { ... }
   }
   ```

---

## 🔍 TROUBLESHOOTING

### Error: "Tenant or user not found"
**Penyebab:** Password salah  
**Solusi:** Reset password di Dashboard

### Error: "No such host is known"
**Penyebab:** DNS issue atau database paused  
**Solusi:** 
1. Cek database tidak paused
2. Coba gunakan pooler connection
3. Cek koneksi internet

### Error: "Connection refused"
**Penyebab:** Database paused  
**Solusi:** Resume database di Dashboard

---

## 📝 CATATAN PENTING

⚠️ **Password database berbeda dengan:**
- Password akun Supabase Anda
- API Keys (ANON_KEY atau SERVICE_ROLE_KEY)

✅ **Password database adalah:**
- Password khusus untuk PostgreSQL
- Dibuat saat pertama kali setup project
- Bisa di-reset kapan saja di Dashboard

---

**Silakan ikuti langkah di atas untuk mendapatkan password yang benar, lalu update file `.env` dan restart server!**
