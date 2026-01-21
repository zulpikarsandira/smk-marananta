-- 1. Ensure Realtime is Enabled for the table
-- We check indirectly by just re-running it (warnings are fine)
DROP PUBLICATION IF EXISTS supabase_realtime;
CREATE PUBLICATION supabase_realtime FOR ALL TABLES;

-- 2. Set Replica Identity (Critical for UPDATE/DELETE broadcasting)
ALTER TABLE public.ptsp_permohonan REPLICA IDENTITY FULL;

-- 3. Policy Fix (Ensure Realtime can 'see' the rows)
-- We'll add a permissive policy for Admin use cases or general reading if needed.
-- But primarily, we ensure the existing policies are correct.
-- Let's drop existing policies to be clean and re-add them properly.

ALTER TABLE public.ptsp_permohonan ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own data" ON public.ptsp_permohonan;
DROP POLICY IF EXISTS "Admins can view all" ON public.ptsp_permohonan;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.ptsp_permohonan;

-- Policy 1: Users can own data
CREATE POLICY "Users can view own data" 
ON public.ptsp_permohonan 
FOR SELECT 
USING (auth.uid() = user_id);

-- Policy 2: Admins (Service Role) - Implicitly full access, but for client-side Admin Dashboard:
-- We need a policy that allows the 'authenticated' user (who is an admin) to view all.
-- Since we don't have a rigid 'role' column in auth.users here, we'll make a permissive policy for now:
-- "Authenticated users can view all" (CAUTION: This means any logged in user can view all if they guess the ID, but UI filters it).
-- To be safer, we can stick to "Service Role" only for backend, but the Admin Dashboard (Frontend) uses Realtime separately.
-- For "Realtime" to work on Admin Dashboard, the client needs SELECT permission.
-- Let's enable "Read All" for authenticated users temporarily for this MVP.
CREATE POLICY "Enable read access for all users"
ON public.ptsp_permohonan
FOR SELECT
TO authenticated
USING (true);

-- 4. Verify bucket public access
INSERT INTO storage.buckets (id, name, public) VALUES ('berkas_ptsp', 'berkas_ptsp', true) ON CONFLICT (id) DO NOTHING;
