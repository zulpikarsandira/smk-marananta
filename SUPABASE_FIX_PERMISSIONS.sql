-- CRITICAL FIX: Allow Admins to Update
-- 1. Check if profiles table exists and has admin user.
-- 2. Allow PUBLIC READ for ptsp_submissions so Realtime Tracking works for anonymous users.
--    In a real app, you'd scope this carefully, but for this demo, it's necessary for the "Tracking" feature to work without login.

DROP POLICY IF EXISTS "Admins can update submissions" ON public.ptsp_submissions;
DROP POLICY IF EXISTS "Admins can view all submissions" ON public.ptsp_submissions;
DROP POLICY IF EXISTS "Users can view own submissions" ON public.ptsp_submissions;
DROP POLICY IF EXISTS "Public can view submissions by Resi" ON public.ptsp_submissions;

-- Allow SELECT for EVERYONE (needed for tracking & admin)
CREATE POLICY "Enable read access for all users"
ON public.ptsp_submissions FOR SELECT
USING (true);

-- Allow UPDATE only for Admins (based on email or role)
-- Simplified: Allow update if user has role 'admin' in profiles
CREATE POLICY "Enable update for admins"
ON public.ptsp_submissions FOR UPDATE
USING (
  auth.uid() IN (
    SELECT id FROM public.profiles WHERE role = 'admin'
  )
);

-- Allow INSERT for Authenticated Users (users creating submissions)
CREATE POLICY "Enable insert for authenticated users"
ON public.ptsp_submissions FOR INSERT
WITH CHECK (auth.role() = 'authenticated');
