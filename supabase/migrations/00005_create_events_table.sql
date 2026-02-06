CREATE TABLE IF NOT EXISTS public.events (
  event_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name VARCHAR(500) NOT NULL,
  event_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  location VARCHAR(500) NOT NULL,
  description TEXT,
  fa_emr_needed INTEGER DEFAULT 0,
  emt_needed INTEGER DEFAULT 0,
  supervisor_needed INTEGER DEFAULT 1,
  is_finalized BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES public.members(user_id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;