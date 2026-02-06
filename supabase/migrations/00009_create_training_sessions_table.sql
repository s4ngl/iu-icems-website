CREATE TABLE IF NOT EXISTS public.training_sessions (
  training_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  training_name VARCHAR(500) NOT NULL,
  training_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  location VARCHAR(500) NOT NULL,
  description TEXT,
  max_participants INTEGER,
  is_aha_training BOOLEAN DEFAULT FALSE,
  cpr_cost NUMERIC(6,2),
  fa_cost NUMERIC(6,2),
  both_cost NUMERIC(6,2),
  point_contact VARCHAR(255),
  created_by UUID REFERENCES public.members(user_id)
);

ALTER TABLE public.training_sessions ENABLE ROW LEVEL SECURITY;