CREATE TABLE IF NOT EXISTS public.training_signups (
  signup_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  training_id UUID NOT NULL REFERENCES public.training_sessions(training_id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.members(user_id) ON DELETE CASCADE,
  signup_type SMALLINT NOT NULL,
  payment_confirmed BOOLEAN DEFAULT FALSE,
  confirmed_by UUID REFERENCES public.members(user_id),
  signup_time TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(training_id, user_id)
);

ALTER TABLE public.training_signups ENABLE ROW LEVEL SECURITY;