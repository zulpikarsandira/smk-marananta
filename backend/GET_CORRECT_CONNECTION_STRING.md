# 🎯 CARA PASTI MENDAPATKAN CONNECTION STRING YANG BENAR

## ⚠️ PENTING: Ikuti Langkah Ini PERSIS!

### **Step 1: Buka Supabase Dashboard**
1. Buka browser: https://supabase.com/dashboard
2. Login jika belum
3. Klik project: **hhcqjrlvupoktcdhhraj**

### **Step 2: Buka Settings Database**
1. Di sidebar kiri, klik **⚙️ Settings** (paling bawah)
2. Pilih **Database**

### **Step 3: Scroll ke "Connection String"**
1. Scroll ke bawah sampai menemukan bagian **"Connection String"**
2. Anda akan melihat beberapa tab

### **Step 4: PILIH TAB "URI"** (BUKAN Pooler!)
1. Klik tab **"URI"** (tab pertama)
2. Anda akan melihat connection string seperti ini:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.hhcqjrlvupoktcdhhraj.supabase.co:5432/postgres
   ```

### **Step 5: Klik Tombol "Copy"**
1. Klik tombol **"Copy"** di sebelah kanan connection string
2. Connection string sudah ter-copy ke clipboard

### **Step 6: Ganti [YOUR-PASSWORD]**
1. Paste connection string ke notepad
2. Ganti `[YOUR-PASSWORD]` dengan password Anda: `Project202699k**`
3. Hasil akhir:
   ```
   postgresql://postgres:Project202699k**@db.hhcqjrlvupoktcdhhraj.supabase.co:5432/postgres
   ```

### **Step 7: Update File .env**
1. Buka file: `backend\.env`
2. Ganti baris `DATABASE_URL=` dengan connection string yang baru
3. **PENTING:** Pastikan tidak ada spasi di awal/akhir!
4. Save file

### **Step 8: Restart Server**
```powershell
# Di terminal cargo run, tekan Ctrl+C
cargo run
```

### **Step 9: Test Ulang**
```powershell
cd backend
.\test_ptsp.ps1
```

---

## 🔍 ALTERNATIF: Jika Password Lupa

### **Reset Password Database:**

1. Di halaman Settings → Database yang sama
2. Scroll ke bagian **"Database Password"**
3. Klik **"Reset Database Password"**
4. **PENTING:** Copy password baru yang muncul!
5. Password akan terlihat seperti: `abcd1234EFGH5678`
6. Gunakan password ini di connection string
7. Update `.env` dan restart server

---

## ✅ VERIFIKASI CONNECTION STRING BENAR

Connection string yang BENAR harus:
- ✅ Dimulai dengan `postgresql://` (bukan `postgres://`)
- ✅ Format: `postgresql://postgres:PASSWORD@db.hhcqjrlvupoktcdhhraj.supabase.co:5432/postgres`
- ✅ Port: `5432` (untuk direct connection)
- ✅ Password: Tidak ada `[YOUR-PASSWORD]`, sudah diganti dengan password asli

---

## 📝 CONTOH FILE .ENV YANG BENAR

```env
# Direct Connection (Port 5432)
DATABASE_URL="postgresql://postgres:Project202699k**@db.hhcqjrlvupoktcdhhraj.supabase.co:5432/postgres"

SUPABASE_URL="https://hhcqjrlvupoktcdhhraj.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhoY3Fqcmx2dXBva3RjZGhocmFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5MDMwNzIsImV4cCI6MjA4NDQ3OTA3Mn0.cKiGs5ZC6780ONdCVUMWT729awQ792X25nfcougoeFU"
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhoY3Fqcmx2dXBva3RjZGhocmFqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODkwMzA3MiwiZXhwIjoyMDg0NDc5MDcyfQ.hTtTFwGAMnumalkyeoQDqK8k5CxRvlb83nbNs2bEvs8"
```

---

## 🎯 EXPECTED RESULT

Setelah restart dan test ulang, Anda seharusnya melihat:

```
✅ SUKSES!
{
    "success":  true,
    "message":  "Permohonan berhasil dikirim",
    "data":  {
        "id":  "uuid-here",
        "nama_pemohon":  "Budi Santoso",
        "jenis_layanan":  "Legalisir Ijazah",
        "status":  "Pending",
        "dokumen_url":  "https://...",
        "created_at":  "2026-01-20T..."
    }
}
```

---

## 🆘 JIKA MASIH ERROR

Jika setelah mengikuti semua langkah di atas masih error:

1. **Screenshot error message** lengkap
2. **Copy isi file `.env`** (sensor password jika mau share)
3. **Cek di Supabase Dashboard:**
   - Database status: Active atau Paused?
   - Connection pooling settings
4. **Coba connection string dari tab "Pooler"** sebagai alternatif

---

**Silakan ikuti langkah-langkah di atas dengan teliti, dan beri tahu saya hasilnya!** 🚀
