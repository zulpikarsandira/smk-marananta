-- Copy Paste this into Supabase SQL Editor
-- Script ini aman dijalankan berulang kali (idempotent)

-- 1. Create Table for PTSP Requests
create table if not exists ptsp_permohonan (
  id uuid default gen_random_uuid() primary key,
  nama_pemohon text not null,
  jenis_layanan text not null,
  status text default 'Pending', -- Pending, Diproses, Selesai, Ditolak
  dokumen_url text,
  keterangan_admin text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Create Storage Bucket (if not exists)
insert into storage.buckets (id, name, public) 
values ('berkas_ptsp', 'berkas_ptsp', true)
on conflict (id) do nothing;

-- 3. Drop existing policies (jika ada) dan buat ulang
drop policy if exists "Public Upload" on storage.objects;
drop policy if exists "Public Read" on storage.objects;

-- 4. Create new policies
create policy "Public Upload" on storage.objects
  for insert with check ( bucket_id = 'berkas_ptsp' );

create policy "Public Read" on storage.objects
  for select using ( bucket_id = 'berkas_ptsp' );

-- 5. Verifikasi: Cek apakah tabel dan bucket sudah dibuat
-- Uncomment untuk melihat hasil:
-- select * from ptsp_permohonan limit 1;
-- select * from storage.buckets where id = 'berkas_ptsp';
