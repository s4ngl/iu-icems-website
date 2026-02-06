-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for members table
CREATE TRIGGER on_members_updated
  BEFORE UPDATE ON public.members
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Function to update total_hours when event_hours are confirmed
CREATE OR REPLACE FUNCTION public.update_member_hours()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_confirmed = TRUE AND (OLD.is_confirmed IS NULL OR OLD.is_confirmed = FALSE) THEN
    UPDATE public.members
    SET total_hours = total_hours + COALESCE(NEW.confirmed_hours, 0),
        pending_hours = GREATEST(0, pending_hours - COALESCE(NEW.calculated_hours, 0))
    WHERE user_id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_hours_confirmed
  AFTER UPDATE ON public.event_hours
  FOR EACH ROW
  EXECUTE FUNCTION public.update_member_hours();

-- Function to add pending hours when a member is assigned to an event
CREATE OR REPLACE FUNCTION public.add_pending_hours()
RETURNS TRIGGER AS $$
DECLARE
  event_record RECORD;
  calc_hours NUMERIC(4,2);
BEGIN
  IF NEW.is_assigned = TRUE AND (OLD.is_assigned IS NULL OR OLD.is_assigned = FALSE) THEN
    SELECT * INTO event_record FROM public.events WHERE event_id = NEW.event_id;
    IF event_record IS NOT NULL THEN
      calc_hours := EXTRACT(EPOCH FROM (event_record.end_time - event_record.start_time)) / 3600.0;
      INSERT INTO public.event_hours (event_id, user_id, calculated_hours)
      VALUES (NEW.event_id, NEW.user_id, calc_hours)
      ON CONFLICT (event_id, user_id) DO UPDATE SET calculated_hours = EXCLUDED.calculated_hours;
      UPDATE public.members
      SET pending_hours = pending_hours + calc_hours
      WHERE user_id = NEW.user_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_member_assigned
  AFTER UPDATE ON public.event_signups
  FOR EACH ROW
  EXECUTE FUNCTION public.add_pending_hours();