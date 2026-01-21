# 🚀 Panduan Deployment Full Stack (Rust + Next.js + Tauri)

Panduan ini akan memandu Anda memindahkan aplikasi dari "Localhost" ke "Online Production".

---

## 🏗️ Tahap 1: Deploy Backend Rust (Jantung Sistem)

Backend harus online dulu, karena Frontend dan Desktop butuh URL API-nya. Kita gunakan **Railway** (Mudah & Support Docker).

1.  **Push Kode ke GitHub**
    *   Pastikan seluruh folder project `web sekolah marantaa` sudah di-push ke repository GitHub Anda.

2.  **Daftar Railway**
    *   Buka [railway.app](https://railway.app/) dan Login dengan GitHub.

3.  **Buat Project Baru di Railway**
    *   Klik "New Project" -> "Deploy from GitHub repo".
    *   Pilih repository Anda.
    *   **PENTING:** Railway akan mendeteksi folder root. Karena backend ada di folder `backend`, kita harus setting root directory.
    *   Klik "Variables" atau "Settings" pada service yang baru dibuat.
    *   Cari pengaturan **Root Directory** -> Ubah menjadi `/backend`.
    *   Railway akan otomatis mendeteksi `Dockerfile` yang baru saya buat.

4.  **Setting Environment Variables**
    Di Dashboard Railway backend Anda, masuk ke tab **Variables**. Masukkan data sama persis dengan `.env` di laptop Anda:
    *   `DATABASE_URL`: (Copy dari .env)
    *   `SUPABASE_URL`: (Copy dari .env)
    *   `SUPABASE_SERVICE_ROLE_KEY`: (Copy dari .env)
    *   `PORT`: `8080`

5.  **Dapatkan URL Public**
    *   Ke tab **Settings** -> **Networking**.
    *   Klik "Generate Domain".
    *   Anda akan dapat URL, misal: `https://backend-production.up.railway.app`.
    *   **SIMPAN URL INI.** Ini pengganti `http://localhost:8080`.

---

## 🌐 Tahap 2: Deploy Frontend Web (Next.js)

1.  **Buka Vercel**
    *   Login [vercel.com](https://vercel.com).
    *   "Add New..." -> "Project".
    *   Import repository GitHub Anda.

2.  **Konfigurasi Environment**
    *   Vercel otomatis mendeteksi Next.js.
    *   Buka bagian "Environment Variables".
    *   Tambahkan:
        *   `NEXT_PUBLIC_API_URL`: Masukkan URL Backend Railway tadi (Contoh: `https://backend-production.up.railway.app`). **JANGAN PAKAI localhost**.
        *   `NEXT_PUBLIC_SUPABASE_URL`: (Copy dari .env)
        *   `NEXT_PUBLIC_SUPABASE_ANON_KEY`: (Copy dari .env)

3.  **Deploy**
    *   Klik "Deploy".
    *   Web User sekarang sudah online!

---

## 🖥️ Tahap 3: Build Aplikasi Desktop (Tauri)

Aplikasi desktop tidak di-hosting, tapi di-build jadi `.exe` yang sudah "tertanam" URL server online.

1.  **Edit File `src/lib/api.ts` (Lokal)**
    Sebelum build, kita harus pastikan aplikasi desktop menembak server online, bukan lokal.
    
    Buka `.env.local` di laptop Anda, ubah sementara (atau buat file `.env.production`):
    ```env
    NEXT_PUBLIC_API_URL="https://backend-production.up.railway.app" 
    ```
    *(Ganti dengan URL Railway asli Anda)*

2.  **Update Identifier (Wajib)**
    Buka `src-tauri/tauri.conf.json`. Pastikan `identifier` unik, misal:
    ```json
    "identifier": "com.sekolahmarantaa.admin"
    ```

3.  **Build Installer**
    Jalankan perintah ini di terminal:
    ```powershell
    npm run tauri build
    ```
    *Proses ini akan memakan waktu agak lama (download library, compile Rust desktop shell).*

4.  **Ambil File .exe**
    Setelah selesai, file installer ada di:
    `src-tauri/target/release/bundle/nsis/admin-desktop_0.1.0_x64-setup.exe`

    File inilah yang Anda kirim ke Admin Sekolah / Staff TU lewat WhatsApp atau Google Drive. Mereka tinggal install, login, dan data akan connect ke Server Cloud.

---

## ✅ Ringkasan

| Komponen | Lokasi File | Lokasi Running | URL Akses |
| :--- | :--- | :--- | :--- |
| **Backend** | `/backend` | Railway (Cloud) | `https://xxx.railway.app` |
| **Web User** | `/src` | Vercel (Cloud) | `https://sekolah-marantaa.vercel.app` |
| **Desktop** | `/src-tauri` | Laptop Admin | Install via `.exe` |

Selamat! Sistem Anda sekarang siap Production. 🚀
