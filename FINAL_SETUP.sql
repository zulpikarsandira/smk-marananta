-- 1. Create the Master Table (ptsp_permohonan)
-- This matches the Rust 'PtspPermohonan' struct exactly.
CREATE TABLE IF NOT EXISTS public.ptsp_permohonan (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID, -- Links to auth.users (can be null for guest requests if needed)
    nama_pemohon TEXT NOT NULL,
    jenis_layanan TEXT NOT NULL,
    dokumen_url TEXT,
    status TEXT DEFAULT 'Pending', -- 'Pending', 'Diproses', 'Selesai', 'Ditolak'
    respon_admin_url TEXT, -- Admin's reply file
    catatan_admin TEXT, -- Admin's notes
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Storage Bucket for Files
-- We try to insert; if it fails (duplicate), we ignore.
INSERT INTO storage.buckets (id, name, public)
VALUES ('berkas_ptsp', 'berkas_ptsp', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Security Policies (RLS)
-- Enable RLS
ALTER TABLE public.ptsp_permohonan ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their OWN history
CREATE POLICY "Users can view own data" 
ON public.ptsp_permohonan 
FOR SELECT 
USING (auth.uid() = user_id);

-- Policy: Service Role (Rust Backend) has full access
-- (Service role bypasses RLS by default, but good to be explicit/safe)
-- No explicit policy needed for Service Role usually.

-- Policy: Allow Public Insert (for now, or Authenticated Insert)
-- Since your Rust backend handles the INSERT using Service Role,
-- we actually DON'T need an Insert policy for the Client. 
-- The Client uploads to Storage (via Rust) and Rust inserts to DB.
-- So the DB is safe.

-- 4. Storage Policies
-- Allow anyone to read (Public)
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'berkas_ptsp' );

-- Allow Service Role to upload (Backend)
-- By default Service Role has full access.

-- 5. Indexes
CREATE INDEX IF NOT EXISTS idx_ptsp_user_id ON public.ptsp_permohonan(user_id);
