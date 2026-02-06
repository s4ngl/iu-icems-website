-- Members table policies
CREATE POLICY "Users can view own member profile"
  ON public.members FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Board and admin can view all members"
  ON public.members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.members m
      WHERE m.user_id = auth.uid() AND m.position_web IN (0, 1)
    )
  );

CREATE POLICY "Users can update own profile"
  ON public.members FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Board and admin can update any member"
  ON public.members FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.members m
      WHERE m.user_id = auth.uid() AND m.position_web IN (0, 1)
    )
  );

CREATE POLICY "Authenticated users can insert own member record"
  ON public.members FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Emergency contacts policies
CREATE POLICY "Users can manage own emergency contacts"
  ON public.emergency_contacts FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Board can view all emergency contacts"
  ON public.emergency_contacts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.members m
      WHERE m.user_id = auth.uid() AND m.position_web IN (0, 1)
    )
  );

-- Certifications policies
CREATE POLICY "Users can view own certifications"
  ON public.certifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can upload own certifications"
  ON public.certifications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own certifications"
  ON public.certifications FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Board can manage all certifications"
  ON public.certifications FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.members m
      WHERE m.user_id = auth.uid() AND m.position_web IN (0, 1)
    )
  );

-- Events policies
CREATE POLICY "Authenticated users can view events"
  ON public.events FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Board can manage events"
  ON public.events FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.members m
      WHERE m.user_id = auth.uid() AND m.position_web IN (0, 1)
    )
  );

-- Event signups policies
CREATE POLICY "Users can view own signups"
  ON public.event_signups FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Certified users can sign up for events"
  ON public.event_signups FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Board can manage all signups"
  ON public.event_signups FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.members m
      WHERE m.user_id = auth.uid() AND m.position_web IN (0, 1)
    )
  );

CREATE POLICY "Supervisors can view signups for assigned events"
  ON public.event_signups FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.members m
      WHERE m.user_id = auth.uid() AND m.position_web IN (0, 1, 2)
    )
  );

-- Event hours policies
CREATE POLICY "Users can view own hours"
  ON public.event_hours FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Supervisors and board can manage hours"
  ON public.event_hours FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.members m
      WHERE m.user_id = auth.uid() AND m.position_web IN (0, 1, 2)
    )
  );

-- Penalty points policies
CREATE POLICY "Users can view own penalty points"
  ON public.penalty_points FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Board can manage penalty points"
  ON public.penalty_points FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.members m
      WHERE m.user_id = auth.uid() AND m.position_web IN (0, 1)
    )
  );

-- Training sessions policies
CREATE POLICY "Authenticated users can view training sessions"
  ON public.training_sessions FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Board can manage training sessions"
  ON public.training_sessions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.members m
      WHERE m.user_id = auth.uid() AND m.position_web IN (0, 1)
    )
  );

-- Training signups policies
CREATE POLICY "Users can view own training signups"
  ON public.training_signups FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can sign up for training"
  ON public.training_signups FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Board can manage all training signups"
  ON public.training_signups FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.members m
      WHERE m.user_id = auth.uid() AND m.position_web IN (0, 1)
    )
  );