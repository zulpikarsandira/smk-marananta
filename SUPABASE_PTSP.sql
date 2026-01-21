-- 1. Create table for PTSP Submissions
CREATE TABLE IF NOT EXISTS public.ptsp_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  full_name TEXT NOT NULL,
  nis TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  service_type TEXT NOT NULL,  -- 'legalisir', 'keterangan_aktif', 'keterangan_pindah'
  purpose TEXT,
  status TEXT DEFAULT 'Pending', -- 'Pending', 'Diproses', 'Selesai', 'Ditolak'
  resi_number TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable RLS
ALTER TABLE public.ptsp_submissions ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies

-- User can create their own submission
CREATE POLICY "Users can create submissions" 
  ON public.ptsp_submissions FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- User can view their own submissions
CREATE POLICY "Users can view own submissions" 
  ON public.ptsp_submissions FOR SELECT 
  USING (auth.uid() = user_id);

-- Admins can view ALL submissions
-- (Assuming we set 'role' in 'profiles' table as per previous setup)
CREATE POLICY "Admins can view all submissions" 
  ON public.ptsp_submissions FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Admins can update submissions (e.g. change status)
CREATE POLICY "Admins can update submissions" 
  ON public.ptsp_submissions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- 4. Storage for Files (Optional if you want to enable file uploads later)
-- insert into storage.buckets (id, name, public) values ('ptsp-files', 'ptsp-files', true);
