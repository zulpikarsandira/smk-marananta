-- EMERGENCY FIX: DISABLE RLS on ptsp_submissions
-- This ensures that permissions are NOT the reason the update is failing.
-- Run this to confirm if the app logic is working.
-- Later, we can re-enable and fix policies.

ALTER TABLE public.ptsp_submissions DISABLE ROW LEVEL SECURITY;
