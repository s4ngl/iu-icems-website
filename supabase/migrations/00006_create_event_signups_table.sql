CREATE TABLE IF NOT EXISTS public.event_signups (
  signup_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(event_id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.members(user_id) ON DELETE CASCADE,
  position_type SMALLINT NOT NULL,
  signup_time TIMESTAMPTZ DEFAULT NOW(),
  is_assigned BOOLEAN DEFAULT FALSE,
  assigned_by UUID REFERENCES public.members(user_id),
  assigned_time TIMESTAMPTZ,
  UNIQUE(event_id, user_id)
);

ALTER TABLE public.event_signups ENABLE ROW LEVEL SECURITY;