# Panduan Mengatasi Error Kompilasi Rust di Windows

## Masalah: "os error 32 - The process cannot access the file"

### Solusi 1: Disable Windows Defender Real-Time Protection (Sementara)
1. Buka Windows Security
2. Virus & threat protection → Manage settings
3. Matikan "Real-time protection" (hanya saat kompilasi)
4. Jalankan `cargo build --release` lagi
5. Aktifkan kembali setelah selesai

### Solusi 2: Exclude Folder dari Antivirus
1. Windows Security → Virus & threat protection
2. Manage settings → Exclusions → Add or remove exclusions
3. Tambahkan folder: `d:\web sekolah marantaa\backend\target`

### Solusi 3: Gunakan Dev Build (Lebih Cepat, Tidak Optimal)
```powershell
cd "d:\web sekolah marantaa\backend"
cargo run
```

### Solusi 4: Restart & Clean Build
```powershell
# Tutup semua VS Code dan terminal
# Restart komputer
cd "d:\web sekolah marantaa\backend"
cargo clean
cargo build --release
```

### Monitoring Manual
Buka terminal baru dan jalankan:
```powershell
cd "d:\web sekolah marantaa\backend"
cargo run
```

Anda akan melihat progress kompilasi secara real-time.
