-- Enable Realtime for ptsp_permohonan table
-- This allows clients to listen to changes (INSERT, UPDATE, DELETE)

-- 1. Add table to publication
alter publication supabase_realtime add table public.ptsp_permohonan;

-- 2. Verify settings (Optional checking, usually expected to just work)
-- Ensure replica identity is set (default is usually fine, but FULL is safer for updates if needed)
ALTER TABLE public.ptsp_permohonan REPLICA IDENTITY FULL;
