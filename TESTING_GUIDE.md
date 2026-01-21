### Panduan Testing & Langkah Selanjutnya

Masalah yang Anda lihat (`unused import: PPDBSiswa`) hanyalah **Peringatan (Warning)** dari Rust, bukan Error. Code tetap berjalan normal. Itu artinya saya meng-import tipe data `PPDBSiswa` tapi tidak secara eksplisit menulis namanya di dalam fungsi (karena sudah terbungkus di dalam `RankingRequest`).
*Status: Sudah saya bantu hapus barusan agar panel "Problems" Anda bersih.*

---

### Apa yang Harus dItest Sekarang?

Karena tombol "Run Scoring" sudah berhasil, sekarang saatnya menguji **Ketepatan Logika Ranking** dan **Integrasi Data**.

#### 1. Uji Logika Ranking (The "Smart" Test)
Tujuannya: Membuktikan bahwa Rust benar-benar menghitung skor (Nilai 70% + Jarak 30%).

1.  Buka file `src/lib/api.ts` di VS Code.
2.  Ubah data dummy `initialCandidates`:
    *   Ubah **Siswa Satu**: `nilai_raport: 60`, `jarak_zonasi_km: 10.0` (Harusnya skor rendah).
    *   Ubah **Siswa Dua**: `nilai_raport: 95`, `jarak_zonasi_km: 0.5` (Harusnya Juara 1).
3.  Simpan file. Browser akan refresh.
4.  Klik **"Run Scoring Algorithm"**.
5.  **Ekspektasi**: Siswa Dua harus otomatis melesat ke **Ranking #1** dengan nilai tinggi, dan Siswa Satu turun ke bawah.

#### 2. Uji Performance (The Speed Test)
1.  Perhatikan terminal Rust Anda.
2.  Klik tombol "Run Scoring" berkali-kali dengan cepat.
3.  **Ekspektasi**: Terminal Rust menampilkan log request `POST /api/ppdb/ranking` yang mengalir sangat cepat tanpa jeda/stutter. Ini membuktikan server Async sanggup menangani load tinggi.

---

### Next Step: Backend PTSP (Upload Dokumen) 📂
Jika tes di atas aman, fitur selanjutnya yang krusial adalah **PTSP (Pelayanan Terpadu Satu Pintu)**.
Ini lebih "menantang" karena melibatkan:
*   Frontend mengirim File (PDF/Gambar).
*   Rust menerima `Multipart` Upload.
*   Rust meng-upload file tersebut ke **Supabase Storage**.
*   Rust menyimpan metadata ke Database.

Apakah Anda siap lanjut ke implementasi PTSP?
