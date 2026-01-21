# Panduan Setup Desktop App (Tauri 2.0)

Saya telah menyiapkan Environment Next.js Anda agar kompatibel dengan Tauri. Berikut adalah langkah terakhir untuk mengaktifkan mode Desktop.

## 1. Instalasi (Sudah dilakukan otomatis)
CLI `@tauri-apps/cli` sudah terinstal di project Anda.

## 2. Inisiasi Project (Lakukan Manual)
Karena perintah otomatis membutuhkan input interaktif, silakan jalankan perintah ini di terminal **"web sekolah marantaa"**:

```bash
npx tauri init
```

Isi jawaban seperti berikut saat diminta:
- **Project name:** `admin-desktop`
- **Identifier:** `com.marantaa.admin`
- **Frontend language:** `TypeScript / JavaScript`
- **Package manager:** `npm`
- **UI Template:** `Next.js` (atau pilih `React` > `Next.js`)
- **Dev Server URL:** `http://localhost:3000` (PENTING: Jangan ubah)
- **Frontend Dist:** `../out` (PENTING: Harus sesuai konfigurasi export)

## 3. Jalankan Aplikasi
Setelah init selesai, jalankan aplikasi desktop dengan:

```bash
npm run tauri dev
```
(Pastikan server Next.js `npm run dev` juga sedang berjalan di terminal lain).

## 4. Permissions (PENTING)
Agar aplikasi bisa konek ke Supabase, buka file `src-tauri/capabilities/default.json` (jika ada) atau `tauri.conf.json` dan pastikan izin internet aktif.
Biasanya secara default sudah bisa akses HTTP.

Selamat! Admin Desktop Anda siap digunakan.
