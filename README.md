# IC-EMS at IU — Member Portal

A Next.js web application for Indiana University's Intra-Collegiate Emergency Medical Service (IC-EMS) student organization. Features member management, event scheduling, training coordination, certification tracking, and hours logging — all backed by Supabase.

## Environment Variables

Create a `.env.local` file in the project root with the following variables:

```env
# Supabase — required
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<your-anon-public-key>

# Supabase — available but not used in client code
DATABASE_PASSWORD=<your-database-password>
DATABASE_PROJECT_URL=<your-project-url>
DATABASE_API_KEY=<your-service-role-key>
```

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard → Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase Dashboard → Settings → API → `anon` `public` key |
| `DATABASE_PASSWORD` | Set during Supabase project creation |
| `DATABASE_PROJECT_URL` | Supabase Dashboard → Settings → Database → Connection string |
| `DATABASE_API_KEY` | Supabase Dashboard → Settings → API → `service_role` key (keep secret) |

## Database Schema

The schema is defined in `supabase/migrations/`. Apply all migrations in order. Below are the core table definitions:

```sql
-- Members (linked to Supabase Auth)
CREATE TABLE public.members (
  user_id       UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name    VARCHAR(100) NOT NULL,
  last_name     VARCHAR(100) NOT NULL,
  iu_email      VARCHAR(255) UNIQUE NOT NULL,
  phone_number  VARCHAR(14),
  gender        SMALLINT,
  class_year    SMALLINT,
  pronouns      SMALLINT,
  position_club SMALLINT DEFAULT 0,
  position_web  SMALLINT DEFAULT 3,   -- 0=Admin, 1=Board, 2=Supervisor, 3=Member
  psid          VARCHAR(9),
  student_id    VARCHAR(20),
  total_hours   NUMERIC(5,2) DEFAULT 0,
  pending_hours NUMERIC(5,2) DEFAULT 0,
  dues_paid     BOOLEAN DEFAULT FALSE,
  dues_expiration DATE,
  account_status SMALLINT DEFAULT 0,  -- 0=Pending, 1=Active, 2=Inactive
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Emergency Contacts
CREATE TABLE public.emergency_contacts (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES public.members(user_id) ON DELETE CASCADE,
  first_name   VARCHAR(100) NOT NULL,
  last_name    VARCHAR(100) NOT NULL,
  phone_number VARCHAR(14) NOT NULL
);

-- Certifications
CREATE TABLE public.certifications (
  cert_id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES public.members(user_id) ON DELETE CASCADE,
  cert_type       SMALLINT NOT NULL, -- 0=FA,1=BLS/CPR,2=EMT,3=EMR,4-7=ICS forms
  file_path       VARCHAR(500),
  upload_date     TIMESTAMPTZ DEFAULT NOW(),
  is_approved     BOOLEAN DEFAULT FALSE,
  expiration_date DATE,
  approved_by     UUID REFERENCES public.members(user_id),
  approved_date   TIMESTAMPTZ
);

-- Events
CREATE TABLE public.events (
  event_id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name       VARCHAR(500) NOT NULL,
  event_date       DATE NOT NULL,
  start_time       TIME NOT NULL,
  end_time         TIME NOT NULL,
  location         VARCHAR(500) NOT NULL,
  description      TEXT,
  fa_emr_needed    INTEGER DEFAULT 0,
  emt_needed       INTEGER DEFAULT 0,
  supervisor_needed INTEGER DEFAULT 1,
  is_finalized     BOOLEAN DEFAULT FALSE,
  created_by       UUID REFERENCES public.members(user_id),
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- Event Signups
CREATE TABLE public.event_signups (
  signup_id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id      UUID NOT NULL REFERENCES public.events(event_id) ON DELETE CASCADE,
  user_id       UUID NOT NULL REFERENCES public.members(user_id) ON DELETE CASCADE,
  position_type SMALLINT NOT NULL, -- 0=Supervisor, 1=EMT, 2=FA/EMR
  signup_time   TIMESTAMPTZ DEFAULT NOW(),
  is_assigned   BOOLEAN DEFAULT FALSE,
  assigned_by   UUID REFERENCES public.members(user_id),
  assigned_time TIMESTAMPTZ,
  UNIQUE(event_id, user_id)
);

-- Event Hours
CREATE TABLE public.event_hours (
  hour_id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id         UUID NOT NULL REFERENCES public.events(event_id) ON DELETE CASCADE,
  user_id          UUID NOT NULL REFERENCES public.members(user_id) ON DELETE CASCADE,
  calculated_hours NUMERIC(4,2),
  confirmed_hours  NUMERIC(4,2),
  confirmed_by     UUID REFERENCES public.members(user_id),
  is_confirmed     BOOLEAN DEFAULT FALSE,
  confirmed_date   TIMESTAMPTZ,
  UNIQUE(event_id, user_id)
);

-- Penalty Points
CREATE TABLE public.penalty_points (
  point_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES public.members(user_id) ON DELETE CASCADE,
  points          INTEGER NOT NULL,
  reason          TEXT NOT NULL,
  assigned_by     UUID REFERENCES public.members(user_id),
  assigned_date   TIMESTAMPTZ DEFAULT NOW(),
  auto_remove_date DATE,
  is_active       BOOLEAN DEFAULT TRUE
);

-- Training Sessions
CREATE TABLE public.training_sessions (
  training_id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  training_name    VARCHAR(500) NOT NULL,
  training_date    DATE NOT NULL,
  start_time       TIME NOT NULL,
  end_time         TIME NOT NULL,
  location         VARCHAR(500) NOT NULL,
  description      TEXT,
  max_participants INTEGER,
  is_aha_training  BOOLEAN DEFAULT FALSE,
  cpr_cost         NUMERIC(6,2),
  fa_cost          NUMERIC(6,2),
  both_cost        NUMERIC(6,2),
  point_contact    VARCHAR(255),
  created_by       UUID REFERENCES public.members(user_id)
);

-- Training Signups
CREATE TABLE public.training_signups (
  signup_id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  training_id       UUID NOT NULL REFERENCES public.training_sessions(training_id) ON DELETE CASCADE,
  user_id           UUID NOT NULL REFERENCES public.members(user_id) ON DELETE CASCADE,
  signup_type       SMALLINT NOT NULL, -- 0=CPR Only, 1=FA Only, 2=Both
  payment_confirmed BOOLEAN DEFAULT FALSE,
  confirmed_by      UUID REFERENCES public.members(user_id),
  signup_time       TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(training_id, user_id)
);
```

Row-Level Security policies, indexes, functions, and triggers are in the migration files `00011`–`00013`.

## Setup Instructions

### 1. Install dependencies

```bash
npm install
```

### 2. Configure Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Copy the **Project URL** and **anon public key** from **Settings → API** into `.env.local`.
3. Run all migrations in `supabase/migrations/` (in numeric order) via the Supabase SQL Editor or the CLI:
   ```bash
   npx supabase db push
   ```

### 3. Configure Google OAuth

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project (or select an existing one).
3. Navigate to **APIs & Services → Credentials**.
4. Click **Create Credentials → OAuth client ID**.
5. Set application type to **Web application**.
6. Add the following to **Authorized redirect URIs**:
   ```
   https://<your-project-ref>.supabase.co/auth/v1/callback
   ```
   For local development also add:
   ```
   http://localhost:54321/auth/v1/callback
   ```
7. Copy the **Client ID** and **Client Secret**.
8. In Supabase Dashboard → **Authentication → Providers → Google**:
   - Enable the Google provider.
   - Paste the Client ID and Client Secret.
   - Save.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Usage Examples

### Using the `useAuth` hook (client components)

```tsx
"use client";

import { useAuth } from "@/hooks/use-auth";

export default function MyComponent() {
  const {
    user,
    member,
    isLoading,
    signInWithGoogle,
    signInWithPassword,
    signUp,
    signOut,
    resetPassword,
  } = useAuth();

  if (isLoading) return <p>Loading...</p>;

  if (!user) {
    return (
      <div>
        <button onClick={signInWithGoogle}>Sign in with Google</button>
        <button onClick={() => signInWithPassword("user@iu.edu", "password")}>
          Sign in with email
        </button>
      </div>
    );
  }

  return (
    <div>
      <p>Welcome, {member?.first_name}!</p>
      <p>Role: {member?.position_web}</p>
      <button onClick={signOut}>Sign out</button>
    </div>
  );
}
```

### Using server-side auth helpers (Server Components / Route Handlers)

```tsx
// In a Server Component
import { getCurrentMember } from "@/lib/auth/session";
import { getMemberRole, hasMinRole } from "@/lib/auth/permissions";
import { ROLES } from "@/config/roles";

export default async function DashboardPage() {
  const member = await getCurrentMember();

  if (!member) {
    return <p>Please log in.</p>;
  }

  const role = getMemberRole(member);
  const canManageEvents = hasMinRole(role, ROLES.BOARD);

  return (
    <div>
      <h1>Welcome, {member.first_name}</h1>
      <p>Total hours: {member.total_hours}</p>
      {canManageEvents && <a href="/manage-events">Manage Events</a>}
    </div>
  );
}
```

### Using services in API Route Handlers

```tsx
// src/app/api/events/route.ts
import { getEvents } from "@/services/eventService";
import { NextResponse } from "next/server";

export async function GET() {
  const events = await getEvents();
  return NextResponse.json({ data: events });
}
```

### Using the Supabase client directly

```tsx
// Server-side
import { createClient } from "@/lib/supabase/server";

export async function getServerData() {
  const supabase = await createClient();
  const { data } = await supabase.from("members").select("*");
  return data;
}

// Client-side
import { createClient } from "@/lib/supabase/client";

function ClientComponent() {
  const supabase = createClient();
  // Use supabase.from(...), supabase.auth.*, etc.
}
```

## Project Structure

```
src/
├── app/
│   ├── (auth)/         # Login, Register, Forgot/Reset Password
│   ├── (public)/       # Home, About, Services, Join
│   ├── (member)/       # Dashboard, Calendar, Events, Training, Profile
│   ├── (board)/        # Manage Members/Events/Training
│   ├── (supervisor)/   # Assigned Events
│   └── api/            # REST API routes
├── components/         # UI components (shadcn/ui)
├── config/             # App config (navigation, roles, site)
├── hooks/              # React hooks (useAuth, useMobile)
├── lib/
│   ├── auth/           # Server-side auth helpers
│   ├── supabase/       # Supabase client factories
│   └── utils/          # Utility functions
├── proxy.ts        # Next.js middleware (auth protection)
├── services/           # Business logic / data access layer
└── types/              # TypeScript type definitions
supabase/
├── migrations/         # SQL migration files
└── config.toml         # Supabase local config
```

## Deploy on Vercel

1. Push the repository to GitHub.
2. Import the project on [Vercel](https://vercel.com).
3. Add all environment variables from `.env.local` to the Vercel project settings.
4. Deploy.
