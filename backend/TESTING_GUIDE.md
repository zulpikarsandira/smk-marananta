# 🧪 Testing Guide - Marantaa Backend API

## 📋 Daftar Endpoints

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/` | Health check |
| POST | `/api/ppdb/ranking` | Hitung ranking PPDB |
| GET | `/api/ppdb/stats` | Statistik PPDB |
| POST | `/api/ptsp/submit` | Submit permohonan PTSP |

---

## 🎯 Test Cases

### **Test 1: Health Check**
**Tujuan:** Memastikan server berjalan dengan baik

**Request:**
```bash
curl http://127.0.0.1:8080/
```

**Expected Response:**
```
Marantaa High Performance Backend is Running 🦀
```

**Status Code:** `200 OK`

---

### **Test 2: PPDB - Get Statistics**
**Tujuan:** Mendapatkan statistik pendaftaran PPDB

**Request:**
```bash
curl http://127.0.0.1:8080/api/ppdb/stats
```

**Expected Response:**
```json
{
  "total_pendaftar": 0,
  "total_lulus": 0,
  "rata_rata_nilai": 0.0,
  "jalur_prestasi": 0,
  "jalur_zonasi": 0,
  "jalur_afirmasi": 0,
  "jalur_perpindahan": 0
}
```

**Status Code:** `200 OK`

---

### **Test 3: PPDB - Calculate Ranking**
**Tujuan:** Menghitung ranking berdasarkan data siswa

**Request:**
```bash
curl -X POST http://127.0.0.1:8080/api/ppdb/ranking \
  -H "Content-Type: application/json" \
  -d '{
    "nama_lengkap": "Ahmad Fauzi",
    "nisn": "1234567890",
    "asal_sekolah": "SMP Negeri 1 Jakarta",
    "nilai_matematika": 85,
    "nilai_bahasa_indonesia": 88,
    "nilai_bahasa_inggris": 82,
    "nilai_ipa": 90,
    "prestasi_akademik": 10,
    "prestasi_non_akademik": 5,
    "jarak_rumah_km": 2.5,
    "jalur_pendaftaran": "zonasi"
  }'
```

**Expected Response:**
```json
{
  "total_nilai": 345.0,
  "nilai_akhir": 86.25,
  "ranking_sementara": 1,
  "status": "Diterima",
  "keterangan": "Selamat! Anda diterima melalui jalur zonasi"
}
```

**Status Code:** `200 OK`

---

### **Test 4: PTSP - Submit Permohonan (Multipart Form)**
**Tujuan:** Submit permohonan layanan PTSP dengan upload file

**Request (dengan file):**
```bash
curl -X POST http://127.0.0.1:8080/api/ptsp/submit \
  -F "nama_pemohon=Budi Santoso" \
  -F "nik=3201234567890123" \
  -F "email=budi@example.com" \
  -F "no_telepon=081234567890" \
  -F "jenis_layanan=Legalisir Ijazah" \
  -F "keterangan=Mohon legalisir ijazah untuk keperluan melamar pekerjaan" \
  -F "dokumen=@/path/to/your/file.pdf"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Permohonan berhasil disubmit",
  "nomor_permohonan": "PTSP-2026-0001",
  "file_url": "https://[supabase-url]/storage/v1/object/public/ptsp-documents/[filename]"
}
```

**Status Code:** `200 OK`

---

## 🔧 Testing Tools

### **1. cURL (Command Line)**
Sudah termasuk di Windows PowerShell/CMD

### **2. PowerShell (Windows)**
```powershell
# Health Check
Invoke-RestMethod -Uri "http://127.0.0.1:8080/" -Method Get

# PPDB Stats
Invoke-RestMethod -Uri "http://127.0.0.1:8080/api/ppdb/stats" -Method Get

# PPDB Ranking
$body = @{
    nama_lengkap = "Ahmad Fauzi"
    nisn = "1234567890"
    asal_sekolah = "SMP Negeri 1 Jakarta"
    nilai_matematika = 85
    nilai_bahasa_indonesia = 88
    nilai_bahasa_inggris = 82
    nilai_ipa = 90
    prestasi_akademik = 10
    prestasi_non_akademik = 5
    jarak_rumah_km = 2.5
    jalur_pendaftaran = "zonasi"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://127.0.0.1:8080/api/ppdb/ranking" -Method Post -Body $body -ContentType "application/json"
```

### **3. Postman / Insomnia**
Import collection atau buat request manual dengan data di atas

### **4. Browser (untuk GET requests)**
- http://127.0.0.1:8080/
- http://127.0.0.1:8080/api/ppdb/stats

---

## 📊 Test Scenarios

### **Scenario 1: Happy Path - PPDB Complete Flow**
1. ✅ Check server health
2. ✅ Get initial stats (should be 0)
3. ✅ Submit ranking calculation
4. ✅ Verify response contains ranking
5. ✅ Get stats again (should increment)

### **Scenario 2: Happy Path - PTSP Complete Flow**
1. ✅ Check server health
2. ✅ Prepare test file (PDF/image)
3. ✅ Submit PTSP request with file
4. ✅ Verify file uploaded to Supabase Storage
5. ✅ Check database for new record

### **Scenario 3: Error Handling**
1. ❌ Submit PPDB with missing fields
2. ❌ Submit PPDB with invalid data types
3. ❌ Submit PTSP without file
4. ❌ Submit PTSP with invalid file type

### **Scenario 4: Edge Cases**
1. 🔍 Submit PPDB with nilai = 0
2. 🔍 Submit PPDB with nilai = 100
3. 🔍 Submit PPDB with very long distance (>50km)
4. 🔍 Submit PTSP with large file (>10MB)

---

## 🐛 Common Issues & Solutions

### **Issue 1: CORS Error**
**Symptom:** Browser shows CORS policy error
**Solution:** Backend already has `CorsLayer::permissive()` - should work

### **Issue 2: Connection Refused**
**Symptom:** `curl: (7) Failed to connect`
**Solution:** Make sure backend is running on port 8080

### **Issue 3: Database Error**
**Symptom:** `500 Internal Server Error`
**Solution:** Check `.env` file and Supabase connection

### **Issue 4: File Upload Failed**
**Symptom:** PTSP submit returns error
**Solution:** 
- Check Supabase Storage bucket exists
- Verify SUPABASE_SERVICE_ROLE_KEY is correct
- Check file size and type

---

## 📝 Test Results Template

```
Date: _____________
Tester: ___________

[ ] Test 1: Health Check - PASS / FAIL
[ ] Test 2: PPDB Stats - PASS / FAIL
[ ] Test 3: PPDB Ranking - PASS / FAIL
[ ] Test 4: PTSP Submit - PASS / FAIL

Notes:
_________________________________
_________________________________
_________________________________
```

---

## 🚀 Next Steps After Testing

1. ✅ All tests pass → Deploy to production
2. ⚠️ Some tests fail → Debug and fix issues
3. 📊 Performance testing → Load test with multiple requests
4. 🔒 Security testing → Test authentication & authorization
5. 📱 Frontend integration → Connect Next.js to backend
