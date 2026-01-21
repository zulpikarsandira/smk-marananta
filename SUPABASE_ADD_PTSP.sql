-- 1. Create PTSP Table if not exists (You might have run this via SUPABASE_PTSP.sql already)
-- Just ensuring you create it if you missed step 1.

CREATE TABLE IF NOT EXISTS public.ptsp_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  full_name TEXT NOT NULL,
  nis TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  service_type TEXT NOT NULL,
  purpose TEXT,
  status TEXT DEFAULT 'Pending',
  resi_number TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Add 'resi_number' column if it doesn't exist (Migration safety)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ptsp_submissions' AND column_name='resi_number') THEN
        ALTER TABLE public.ptsp_submissions ADD COLUMN resi_number TEXT UNIQUE;
    END IF;
END $$;

-- 3. Enable RLS
ALTER TABLE public.ptsp_submissions ENABLE ROW LEVEL SECURITY;

-- 4. Policies (Re-run if needed, idempotent usually fails if exists, so check first or just use for reference)
-- Please run SUPABASE_PTSP.sql for full fresh install.
