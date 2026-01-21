-- Force update the table structure for existing tables
DO $$
BEGIN
    -- 1. Add user_id if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ptsp_permohonan' AND column_name='user_id') THEN
        ALTER TABLE public.ptsp_permohonan ADD COLUMN user_id UUID;
    END IF;

    -- 2. Add respon_admin_url if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ptsp_permohonan' AND column_name='respon_admin_url') THEN
        ALTER TABLE public.ptsp_permohonan ADD COLUMN respon_admin_url TEXT;
    END IF;

    -- 3. Add catatan_admin if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ptsp_permohonan' AND column_name='catatan_admin') THEN
        ALTER TABLE public.ptsp_permohonan ADD COLUMN catatan_admin TEXT;
    END IF;

    -- 4. Add updated_at if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ptsp_permohonan' AND column_name='updated_at') THEN
        ALTER TABLE public.ptsp_permohonan ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- NOW re-run the policies (Safe to re-run due to OR REPLACE or IF NOT EXISTS logic usually, but let's drop to be clean)

DROP POLICY IF EXISTS "Users can view own data" ON public.ptsp_permohonan;
CREATE POLICY "Users can view own data" 
ON public.ptsp_permohonan 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create Index
CREATE INDEX IF NOT EXISTS idx_ptsp_user_id ON public.ptsp_permohonan(user_id);
