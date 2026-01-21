-- Script untuk verifikasi dan fix database PTSP
-- Jalankan di Supabase SQL Editor

-- 1. Cek apakah tabel sudah ada
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'ptsp_permohonan'
) as table_exists;

-- 2. Jika tabel belum ada, buat tabel
CREATE TABLE IF NOT EXISTS ptsp_permohonan (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nama_pemohon text NOT NULL,
  jenis_layanan text NOT NULL,
  status text DEFAULT 'Pending',
  dokumen_url text,
  keterangan_admin text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- 3. Cek struktur tabel
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'ptsp_permohonan'
ORDER BY ordinal_position;

-- 4. Cek storage bucket
SELECT * FROM storage.buckets WHERE id = 'berkas_ptsp';

-- 5. Cek storage policies
SELECT 
  policyname,
  tablename,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'objects' AND policyname LIKE '%ptsp%' OR policyname LIKE '%Public%';

-- 6. Test insert manual (untuk verifikasi)
INSERT INTO ptsp_permohonan (nama_pemohon, jenis_layanan, dokumen_url, status)
VALUES ('Test User', 'Test Layanan', 'https://test.com/file.pdf', 'Pending')
RETURNING *;

-- 7. Cek data yang sudah masuk
SELECT * FROM ptsp_permohonan ORDER BY created_at DESC LIMIT 5;

-- 8. Hapus data test (opsional)
-- DELETE FROM ptsp_permohonan WHERE nama_pemohon = 'Test User';
