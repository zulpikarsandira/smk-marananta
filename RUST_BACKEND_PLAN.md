# Analisis Implementasi Backend Rust & Supabase
## "Maximum Performance Architecture" untuk Portal Sekolah Marantaa

### 1. Mengapa Rust untuk Kasus Ini?
Anda meminta performa maksimal, dan Rust adalah pilihan tepat (State-of-the-art) untuk sistem sekolah yang memiliki karakteristik "Burst Traffic" (Lonjakan trafik tiba-tiba), terutama saat **PPDB (Penerimaan Siswa Baru)** dan **Pengumuman Kelulusan**.

Berikut analisis keunggulan Rust dibandingkan Node.js/Python untuk project ini:

#### A. Komputasi Algoritma Seleksi PPDB (The Heavy Lifting)
*   **Case**: Saat sistem harus memproses peringkat ratusan/ribuan pendaftar berdasarkan Nilai Raport (70%) + Jarak Zonasi (30%) + Usia.
*   **Rust Advantage**: Rust memiliki *Zero-cost abstractions*. Tidak ada *Garbage Collector* (GC) yang berjalan tiba-tiba (yang biasa menyebabkan "stutter" atau jeda di Node.js saat memproses array besar).
*   **Result**: Sorting dan scoring 10.000 data siswa bisa selesai dalam hitungan *microsecond*, jauh lebih cepat dan stabil.

#### B. Memory Safety & Concurrency (PTSP Flow)
*   **Case**: Ratusan wali murid mengupload berkas PDF secara bersamaan untuk verifikasi PTSP.
*   **Rust Advantage**: Model kepemilikan memori (*Ownership Model*) Rust menjamin tidak ada *Data Race* saat banyak request mengubah status database secara bersamaan.
*   **Result**: Server tetap stabil dengan penggunaan RAM sangat kecil (<50MB) meskipun melayani ribuan koneksi konkuren.

#### C. Type Safety (Keandalan Data)
*   **Case**: Data NIP Guru, NISN Siswa, dan Status Validasi tidak boleh salah input atau *undefined*.
*   **Rust Advantage**: Sistem tipe Rust sangat ketat (*Strict Type System*). Error akan ditangkap saat *compile time*, bukan saat runtime (saat user menggunakan aplikasi).

---

### 2. Arsitektur "Hybrid Performance"
Untuk mencapai performa maksimal, kita tidak hanya mengganti backend, tapi mengubah arsitektur datanya.

*   **Database**: Supabase (PostgreSQL) - Sebagai *Single Source of Truth*.
*   **High-Performance API (Rust)**: Bertugas melakukan "Heavy Lifting" (Write operations, Complex Calculations, Batch Processing).
*   **Frontend (Next.js)**: Hanya bertugas merender UI. Untuk data ringan (Read-only), Next.js bisa "Cache" data dari Rust.

**Flow Data:**
1.  **User Input** -> **Next.js** -> **Rust API** (Validasi & Processing) -> **Supabase DB**.
2.  **User View** -> **Next.js** -> **Rust API** (Cached/Aggregated Data).

---

### 3. Implementasi Plan (Langkah Demi Langkah)

#### Phase 1: Setup Environment Rust & Project Structure
Kita akan menggunakan framework **Axum** (dibuat oleh tim Toko, sangat cepat & modular) atau **Actix-web** (Mature & Benchmark king). Saya merekomendasikan **Axum** untuk ergonomi development modern.

**Stack Backend:**
*   **Framework**: Axum
*   **Database Driver**: `sqlx` (Async, Pure Rust, Compile-time SQL verification). *Ini jauh lebih cepat daripada menggunakan Supabase JS Client via HTTP.*
*   **Serialization**: `serde`, `serde_json` (Standard industri untuk JSON).
*   **Runtime**: `tokio` (Async runtime).

#### Phase 2: Koneksi Database (Critical for Performance)
Untuk performa "Bare Metal", Rust **TIDAK BOLEH** menggunakan REST API Supabase (via HTTP `https://...`). Itu lambat.
Rust harus terhubung langsung ke **PostgreSQL Connection Pool** Supabase via TCP.

*   **Requirement**: Kita membutuhkan **Database Connection String** (bukan hanya URL/Anon Key).
*   *Format*: `postgres://postgres.[ref]:[password]@[host]:6543/postgres?pgbouncer=true`
*   *Action*: Anda perlu menyiapkan password database Supabase Anda.

#### Phase 3: Implementasi Modul Utama (Endpoint)

**A. Modul PPDB ( /api/ppdb )**
*   `POST /calculate-ranking`: Menerima array data siswa, menghitung skor zonasi (Haversine formula), mengurutkan, dan menyimpan ke DB.
*   `GET /stats`: Mengembalikan statistik real-time (jumlah pendaftar, gender ratio) dengan Query SQL yang dioptimasi.

**B. Modul PTSP ( /api/ptsp )**
*   `POST /submit`: Menerima multipart form data (dokumen), upload ke Supabase Storage, catat metadata ke DB.
*   `PUT /verify/{id}`: Endpoint atomik untuk mengubah status menjadi "Approved" dan memicu notifikasi.

#### Phase 4: Integrasi Frontend
Next.js tidak lagi memanggil Supabase secara langsung untuk fitur-fitur berat ini. Next.js akan memanggil:
`fetch('http://localhost:8080/api/ppdb/stats')`

---

### 4. Strategi Eksekusi Berikutnya
Saya akan memulai inisialisasi project Rust di folder `backend/`.

**Langkah 1**: Buat struktur folder backend.
**Langkah 2**: Setup `Cargo.toml` dengan dependensi performa tinggi (`axum`, `sqlx`, `tokio`, `dotenv`).
**Langkah 3**: Buat file konfigurasi koneksi database.

*Apakah Anda memiliki Password Database Supabase (yang dibuat saat create project)?* Kita memerlukannya untuk koneksi `sqlx` langsung. Jika tidak, kita terpaksa menggunakan REST API (via reqwest) yang sedikit lebih lambat namun tetap aman.
