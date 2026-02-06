CREATE TABLE IF NOT EXISTS public.event_hours (
  hour_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(event_id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.members(user_id) ON DELETE CASCADE,
  calculated_hours NUMERIC(4,2),
  confirmed_hours NUMERIC(4,2),
  confirmed_by UUID REFERENCES public.members(user_id),
  is_confirmed BOOLEAN DEFAULT FALSE,
  confirmed_date TIMESTAMPTZ,
  UNIQUE(event_id, user_id)
);

ALTER TABLE public.event_hours ENABLE ROW LEVEL SECURITY;