CREATE TABLE IF NOT EXISTS public.certifications (
  cert_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.members(user_id) ON DELETE CASCADE,
  cert_type SMALLINT NOT NULL,
  file_path VARCHAR(500),
  upload_date TIMESTAMPTZ DEFAULT NOW(),
  is_approved BOOLEAN DEFAULT FALSE,
  expiration_date DATE,
  approved_by UUID REFERENCES public.members(user_id),
  approved_date TIMESTAMPTZ
);

ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;