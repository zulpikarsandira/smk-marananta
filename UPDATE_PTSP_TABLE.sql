-- Add new columns for feedback loop feature
ALTER TABLE public.ptsp_permohonan
ADD COLUMN IF NOT EXISTS user_id UUID, -- To link request to specific user
ADD COLUMN IF NOT EXISTS respon_admin_url TEXT, -- URL for admin response document
ADD COLUMN IF NOT EXISTS catatan_admin TEXT, -- Admin feedback/notes
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create index for faster history connection
CREATE INDEX IF NOT EXISTS idx_ptsp_user_id ON public.ptsp_permohonan(user_id);
