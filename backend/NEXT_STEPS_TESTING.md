# 🧪 Langkah Testing Selanjutnya - Backend Rust API

**Tanggal:** 20 Januari 2026  
**Status Saat Ini:** Backend siap untuk testing lanjutan

---

## 📊 **RECAP: Status Testing**

### **✅ Yang Sudah BERHASIL (75%):**
1. ✅ Health Check endpoint
2. ✅ PPDB Stats endpoint
3. ✅ PPDB Ranking algorithm (bekerja sempurna!)
4. ✅ PTSP File Upload ke Supabase Storage (BERHASIL!)
5. ✅ Service Role Key authentication
6. ✅ CORS configuration
7. ✅ Multipart form parsing

### **⚠️ Yang Masih Perlu Diperbaiki:**
- Database connection untuk PTSP (error: "Tenant or user not found")
- Kemungkinan penyebab: Password, DNS, atau database paused

---

## 🎯 **TEST YANG PERLU DILAKUKAN SELANJUTNYA**

### **Test 1: Restart Backend & Verify Running** ⭐

**Tujuan:** Memastikan backend berjalan dengan baik

**Langkah:**
```powershell
# 1. Masuk ke folder backend
cd backend

# 2. Jalankan server
cargo run

# 3. Tunggu sampai muncul:
# 🚀 Rust Backend running on http://127.0.0.1:8080
```

**Expected Output:**
```
🔌 Connecting to Supabase Database High-Performance Pool...
✅ Database connection established!
🚀 Rust Backend running on http://127.0.0.1:8080
```

**Verifikasi:**
```powershell
# Di terminal baru
curl http://127.0.0.1:8080/
```

**Expected Response:**
```
Marantaa High Performance Backend is Running 🦀
```

---

### **Test 2: Test PPDB Endpoints dari Frontend** 🔗

**Tujuan:** Verifikasi integrasi frontend-backend

**Langkah:**
1. Pastikan backend running (port 8080)
2. Pastikan frontend running (port 3000)
3. Buka browser: http://localhost:3000/ppdb
4. Coba fitur PPDB di halaman tersebut

**Yang Perlu Dicek:**
- [ ] Halaman PPDB bisa load
- [ ] Bisa fetch stats dari backend
- [ ] Bisa submit form ranking
- [ ] Data muncul dengan benar

---

### **Test 3: Test PTSP Upload dari Frontend** 📤

**Tujuan:** Test upload file dari UI frontend

**Langkah:**
1. Buka browser: http://localhost:3000/ptsp
2. Isi form permohonan PTSP
3. Upload file dokumen
4. Submit form

**Yang Perlu Dicek:**
- [ ] Form bisa diisi
- [ ] File bisa dipilih
- [ ] Upload berhasil (lihat response)
- [ ] File muncul di Supabase Storage

---

### **Test 4: Performance Testing** ⚡

**Tujuan:** Test performa backend dengan load

**Test 4a: PPDB Ranking dengan Banyak Data**

Buat file `backend/test_ppdb_large.json`:
```json
{
  "students": [
    // ... 100 siswa
  ]
}
```

Test:
```powershell
Measure-Command {
  $json = Get-Content test_ppdb_large.json -Raw
  Invoke-RestMethod -Uri "http://127.0.0.1:8080/api/ppdb/ranking" -Method Post -Body $json -ContentType "application/json"
}
```

**Expected:** < 1 detik untuk 100 siswa

**Test 4b: Concurrent Requests**

```powershell
# Test 10 request bersamaan
1..10 | ForEach-Object -Parallel {
  Invoke-RestMethod -Uri "http://127.0.0.1:8080/api/ppdb/stats"
}
```

**Expected:** Semua request berhasil tanpa error

---

### **Test 5: Error Handling** ❌

**Tujuan:** Verifikasi backend handle error dengan baik

**Test 5a: Invalid Data**
```powershell
# Test dengan data kosong
Invoke-RestMethod -Uri "http://127.0.0.1:8080/api/ppdb/ranking" -Method Post -Body '{"students":[]}' -ContentType "application/json"
```

**Expected:** Response dengan stats kosong atau error message yang jelas

**Test 5b: Missing Fields**
```powershell
# Test dengan field yang hilang
Invoke-RestMethod -Uri "http://127.0.0.1:8080/api/ppdb/ranking" -Method Post -Body '{"students":[{"nama":"Test"}]}' -ContentType "application/json"
```

**Expected:** Error message yang informatif

---

### **Test 6: CORS Testing** 🌐

**Tujuan:** Verifikasi CORS bekerja untuk frontend

**Test:**
```powershell
# Test CORS headers
curl -H "Origin: http://localhost:3000" -H "Access-Control-Request-Method: POST" -H "Access-Control-Request-Headers: Content-Type" -X OPTIONS http://127.0.0.1:8080/api/ppdb/ranking -v
```

**Expected:** Response dengan CORS headers yang benar

---

### **Test 7: Database Connection (Jika Sudah Fix)** 💾

**Tujuan:** Verifikasi PTSP bisa save ke database

**Langkah:**
1. Pastikan DATABASE_URL sudah benar di `.env`
2. Pastikan tabel `ptsp_permohonan` sudah dibuat
3. Jalankan test PTSP

```powershell
.\test_ptsp.ps1
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Permohonan berhasil dikirim",
  "data": {
    "id": "uuid-here",
    "nama_pemohon": "Budi Santoso",
    "jenis_layanan": "Legalisir Ijazah",
    "status": "Pending",
    "dokumen_url": "https://...",
    "created_at": "2026-01-20T..."
  }
}
```

**Verifikasi di Supabase:**
1. Buka Supabase Dashboard
2. Table Editor → `ptsp_permohonan`
3. Cek ada data baru

---

### **Test 8: End-to-End Testing** 🎬

**Tujuan:** Test complete user flow

**Scenario 1: PPDB Registration Flow**
1. User buka halaman PPDB
2. User lihat statistik
3. User isi form pendaftaran
4. User submit
5. User lihat ranking

**Scenario 2: PTSP Request Flow**
1. User buka halaman PTSP
2. User isi form permohonan
3. User upload dokumen
4. User submit
5. User dapat konfirmasi

---

## 📝 **CHECKLIST TESTING**

### **Backend Testing:**
- [ ] Server bisa start tanpa error
- [ ] Health check endpoint working
- [ ] PPDB stats endpoint working
- [ ] PPDB ranking endpoint working
- [ ] PTSP upload endpoint working (file upload)
- [ ] PTSP database insert working
- [ ] CORS headers correct
- [ ] Error handling proper

### **Integration Testing:**
- [ ] Frontend bisa connect ke backend
- [ ] PPDB page bisa fetch data
- [ ] PPDB form bisa submit
- [ ] PTSP page bisa fetch data
- [ ] PTSP form bisa submit
- [ ] File upload dari frontend working

### **Performance Testing:**
- [ ] Response time < 500ms untuk simple requests
- [ ] Can handle 100 students ranking < 1s
- [ ] Can handle 10 concurrent requests
- [ ] No memory leaks

### **Security Testing:**
- [ ] CORS properly configured
- [ ] Service Role Key tidak exposed
- [ ] Database credentials secure
- [ ] File upload size limited

---

## 🚀 **PRIORITAS TESTING**

### **HIGH PRIORITY (Lakukan Sekarang):**
1. ✅ Restart backend server
2. ✅ Test health check
3. ✅ Test PPDB endpoints
4. ⚠️ Fix database connection untuk PTSP

### **MEDIUM PRIORITY (Setelah Backend Stabil):**
5. Test integrasi frontend-backend
6. Test PTSP upload dari frontend
7. Performance testing

### **LOW PRIORITY (Optional):**
8. Load testing dengan banyak data
9. Security audit
10. Monitoring & logging

---

## 🔧 **TROUBLESHOOTING GUIDE**

### **Jika Backend Tidak Start:**
```powershell
# Cek port 8080 sudah digunakan?
netstat -ano | findstr :8080

# Kill process jika perlu
taskkill /PID <PID> /F

# Coba lagi
cargo run
```

### **Jika Database Error:**
1. Cek `.env` file
2. Verifikasi DATABASE_URL
3. Cek database tidak paused di Supabase
4. Test connection manual

### **Jika CORS Error:**
1. Cek backend running
2. Verifikasi CORS layer di `main.rs`
3. Cek frontend URL benar

---

## 📊 **METRICS TO TRACK**

### **Performance Metrics:**
- Response time (avg, p95, p99)
- Throughput (requests/second)
- Error rate
- Database query time

### **Business Metrics:**
- PPDB registrations processed
- PTSP requests submitted
- File uploads successful
- Average ranking calculation time

---

## 🎯 **SUCCESS CRITERIA**

Backend dianggap **PRODUCTION READY** jika:
- ✅ All endpoints working (100%)
- ✅ Response time < 500ms (95th percentile)
- ✅ Can handle 50+ concurrent users
- ✅ Error rate < 1%
- ✅ Database connection stable
- ✅ File upload working reliably
- ✅ CORS configured properly
- ✅ Security best practices followed

---

**Mulai dari Test 1 dan lanjutkan secara berurutan!** 🚀
