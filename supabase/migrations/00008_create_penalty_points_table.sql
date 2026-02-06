CREATE TABLE IF NOT EXISTS public.penalty_points (
  point_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.members(user_id) ON DELETE CASCADE,
  points INTEGER NOT NULL,
  reason TEXT NOT NULL,
  assigned_by UUID REFERENCES public.members(user_id),
  assigned_date TIMESTAMPTZ DEFAULT NOW(),
  auto_remove_date DATE,
  is_active BOOLEAN DEFAULT TRUE
);

ALTER TABLE public.penalty_points ENABLE ROW LEVEL SECURITY;