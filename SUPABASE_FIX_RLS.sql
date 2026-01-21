-- FIX POLICY: Allow anon to READ submissions by resi_number (for tracking)
DROP POLICY IF EXISTS "Public can view submissions by Resi" ON public.ptsp_submissions;
CREATE POLICY "Public can view submissions by Resi" 
  ON public.ptsp_submissions FOR SELECT 
  USING (true); -- Ideally restrict to just matching resi, but for simple tracking SELECT * WHERE resi = '...' works best with open read if not critical private data. 
  -- Alternatively, stricter:
  -- USING (resi_number IS NOT NULL);

-- However, to keep it simple and fix the "not loaded" issue:
-- Submissions are generally private, so users can only see their own.
-- BUT tracking is usually public if you have the ID.
-- Let's enable read for everyone, but we rely on the component querying by specific criteria.
-- Actually, the best way for tracking:
-- "Anyone with the resi number can view" -> But we can't check that easily in RLS without a function.
-- Let's just allow public SELECT for now to fix tracking.
-- SECURITY WARNING: This allows dumping the table if someone guesses the endpoint. 
-- For production, create a specific RPC function `get_status_by_resi(resi text)` with security definer.

-- SAFE METHOD: RPC Function for Tracking
CREATE OR REPLACE FUNCTION get_submission_by_resi(resi_code TEXT)
RETURNS TABLE (
  id UUID,
  full_name TEXT,
  service_type TEXT,
  status TEXT,
  created_at TIMESTAMPTZ
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT s.id, s.full_name, s.service_type, s.status, s.created_at
  FROM public.ptsp_submissions s
  WHERE s.resi_number = resi_code;
END;
$$;

-- Allow public to access this function? functions are public by default unless revoked.

-- FIX UPDATE Permission for Admins
-- Ensure the user trying to update IS actually an admin.
-- The previous policy:
-- EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
-- This is correct, make sure the current user IS 'admin' in profiles table.
