CREATE INDEX IF NOT EXISTS idx_members_email ON public.members(iu_email);
CREATE INDEX IF NOT EXISTS idx_members_status ON public.members(account_status);
CREATE INDEX IF NOT EXISTS idx_members_position ON public.members(position_web);

CREATE INDEX IF NOT EXISTS idx_certifications_user ON public.certifications(user_id);
CREATE INDEX IF NOT EXISTS idx_certifications_type ON public.certifications(cert_type);
CREATE INDEX IF NOT EXISTS idx_certifications_approved ON public.certifications(is_approved);

CREATE INDEX IF NOT EXISTS idx_events_date ON public.events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_finalized ON public.events(is_finalized);

CREATE INDEX IF NOT EXISTS idx_event_signups_event ON public.event_signups(event_id);
CREATE INDEX IF NOT EXISTS idx_event_signups_user ON public.event_signups(user_id);

CREATE INDEX IF NOT EXISTS idx_event_hours_event ON public.event_hours(event_id);
CREATE INDEX IF NOT EXISTS idx_event_hours_user ON public.event_hours(user_id);

CREATE INDEX IF NOT EXISTS idx_penalty_points_user ON public.penalty_points(user_id);
CREATE INDEX IF NOT EXISTS idx_penalty_points_active ON public.penalty_points(is_active);

CREATE INDEX IF NOT EXISTS idx_training_sessions_date ON public.training_sessions(training_date);

CREATE INDEX IF NOT EXISTS idx_training_signups_training ON public.training_signups(training_id);
CREATE INDEX IF NOT EXISTS idx_training_signups_user ON public.training_signups(user_id);