CREATE TABLE IF NOT EXISTS public.members (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  iu_email VARCHAR(255) UNIQUE NOT NULL,
  phone_number VARCHAR(14),
  gender SMALLINT,
  class_year SMALLINT,
  pronouns SMALLINT,
  position_club SMALLINT DEFAULT 0,
  position_web SMALLINT DEFAULT 3,
  psid VARCHAR(9),
  student_id VARCHAR(20),
  total_hours NUMERIC(5,2) DEFAULT 0,
  pending_hours NUMERIC(5,2) DEFAULT 0,
  dues_paid BOOLEAN DEFAULT FALSE,
  dues_expiration DATE,
  account_status SMALLINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;