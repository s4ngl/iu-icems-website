-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.certifications (
  cert_id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  cert_type smallint NOT NULL,
  file_path character varying,
  upload_date timestamp with time zone DEFAULT now(),
  is_approved boolean DEFAULT false,
  expiration_date date,
  approved_by uuid,
  approved_date timestamp with time zone,
  CONSTRAINT certifications_pkey PRIMARY KEY (cert_id),
  CONSTRAINT certifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.members(user_id),
  CONSTRAINT certifications_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES public.members(user_id)
);
CREATE TABLE public.emergency_contacts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  first_name character varying NOT NULL,
  last_name character varying NOT NULL,
  phone_number character varying NOT NULL,
  CONSTRAINT emergency_contacts_pkey PRIMARY KEY (id),
  CONSTRAINT emergency_contacts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.members(user_id)
);
CREATE TABLE public.event_hours (
  hour_id uuid NOT NULL DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL,
  user_id uuid NOT NULL,
  calculated_hours numeric,
  confirmed_hours numeric,
  confirmed_by uuid,
  is_confirmed boolean DEFAULT false,
  confirmed_date timestamp with time zone,
  CONSTRAINT event_hours_pkey PRIMARY KEY (hour_id),
  CONSTRAINT event_hours_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(event_id),
  CONSTRAINT event_hours_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.members(user_id),
  CONSTRAINT event_hours_confirmed_by_fkey FOREIGN KEY (confirmed_by) REFERENCES public.members(user_id)
);
CREATE TABLE public.event_signups (
  signup_id uuid NOT NULL DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL,
  user_id uuid NOT NULL,
  position_type smallint NOT NULL,
  signup_time timestamp with time zone DEFAULT now(),
  is_assigned boolean DEFAULT false,
  assigned_by uuid,
  assigned_time timestamp with time zone,
  CONSTRAINT event_signups_pkey PRIMARY KEY (signup_id),
  CONSTRAINT event_signups_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(event_id),
  CONSTRAINT event_signups_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.members(user_id),
  CONSTRAINT event_signups_assigned_by_fkey FOREIGN KEY (assigned_by) REFERENCES public.members(user_id)
);
CREATE TABLE public.events (
  event_id uuid NOT NULL DEFAULT gen_random_uuid(),
  event_name character varying NOT NULL,
  event_date date NOT NULL,
  start_time time without time zone NOT NULL,
  end_time time without time zone NOT NULL,
  location character varying NOT NULL,
  description text,
  fa_emr_needed integer DEFAULT 0,
  emt_needed integer DEFAULT 0,
  supervisor_needed integer DEFAULT 1,
  is_finalized boolean DEFAULT false,
  created_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT events_pkey PRIMARY KEY (event_id),
  CONSTRAINT events_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.members(user_id)
);
CREATE TABLE public.members (
  user_id uuid NOT NULL,
  first_name character varying NOT NULL,
  last_name character varying NOT NULL,
  iu_email character varying NOT NULL UNIQUE,
  phone_number character varying,
  gender smallint,
  class_year smallint,
  pronouns smallint,
  position_club smallint DEFAULT 0,
  position_web smallint DEFAULT 3,
  psid character varying,
  student_id character varying,
  total_hours numeric DEFAULT 0,
  pending_hours numeric DEFAULT 0,
  dues_paid boolean DEFAULT false,
  dues_expiration date,
  account_status smallint DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT members_pkey PRIMARY KEY (user_id),
  CONSTRAINT members_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.penalty_points (
  point_id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  points integer NOT NULL,
  reason text NOT NULL,
  assigned_by uuid,
  assigned_date timestamp with time zone DEFAULT now(),
  auto_remove_date date,
  is_active boolean DEFAULT true,
  CONSTRAINT penalty_points_pkey PRIMARY KEY (point_id),
  CONSTRAINT penalty_points_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.members(user_id),
  CONSTRAINT penalty_points_assigned_by_fkey FOREIGN KEY (assigned_by) REFERENCES public.members(user_id)
);
CREATE TABLE public.training_sessions (
  training_id uuid NOT NULL DEFAULT gen_random_uuid(),
  training_name character varying NOT NULL,
  training_date date NOT NULL,
  start_time time without time zone NOT NULL,
  end_time time without time zone NOT NULL,
  location character varying NOT NULL,
  description text,
  max_participants integer,
  is_aha_training boolean DEFAULT false,
  cpr_cost numeric,
  fa_cost numeric,
  both_cost numeric,
  point_contact character varying,
  created_by uuid,
  CONSTRAINT training_sessions_pkey PRIMARY KEY (training_id),
  CONSTRAINT training_sessions_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.members(user_id)
);
CREATE TABLE public.training_signups (
  signup_id uuid NOT NULL DEFAULT gen_random_uuid(),
  training_id uuid NOT NULL,
  user_id uuid NOT NULL,
  signup_type smallint NOT NULL,
  payment_confirmed boolean DEFAULT false,
  confirmed_by uuid,
  signup_time timestamp with time zone DEFAULT now(),
  CONSTRAINT training_signups_pkey PRIMARY KEY (signup_id),
  CONSTRAINT training_signups_training_id_fkey FOREIGN KEY (training_id) REFERENCES public.training_sessions(training_id),
  CONSTRAINT training_signups_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.members(user_id),
  CONSTRAINT training_signups_confirmed_by_fkey FOREIGN KEY (confirmed_by) REFERENCES public.members(user_id)
);
