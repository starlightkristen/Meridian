-- GymTracker — Session 2 initial schema
-- Paste this entire file into Supabase SQL editor and run.
-- Blocks run in order; each is self-contained and idempotent-safe for a fresh project.

-- ══════════════════════════════════════════════════════════════
-- BLOCK 1 — USER PROFILES
-- ══════════════════════════════════════════════════════════════
create table public.user_profiles (
  id uuid references auth.users on delete cascade primary key,
  goals text[] default '{}',
  gym_type text default 'planet_fitness',
  home_equipment text[] default '{}',
  location_preference text default 'gym',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table user_profiles enable row level security;
create policy "Users manage own profile"
  on user_profiles for all using (auth.uid() = id);

-- ══════════════════════════════════════════════════════════════
-- BLOCK 2 — SCHEDULES
-- ══════════════════════════════════════════════════════════════
create table public.schedules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  day_of_week text not null,
  routine_type text not null,
  location text default 'gym',
  created_at timestamptz default now()
);
alter table schedules enable row level security;
create policy "Users manage own schedules"
  on schedules for all using (auth.uid() = user_id);

-- ══════════════════════════════════════════════════════════════
-- BLOCK 3 — EXERCISES
-- ══════════════════════════════════════════════════════════════
create table public.exercises (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  muscle_primary text not null,
  muscle_secondary text[] default '{}',
  equipment text not null,
  location text not null,
  exercise_type text not null,
  difficulty text default 'beginner',
  default_sets int default 3,
  default_reps int default 10,
  default_rest_seconds int default 90,
  default_hold_seconds int,
  gif_url text,
  instructions text[] default '{}',
  tips text[] default '{}',
  alternatives uuid[] default '{}',
  source text,
  created_at timestamptz default now()
);
alter table exercises enable row level security;
create policy "Exercises are public"
  on exercises for select using (true);
create policy "Service role can insert exercises"
  on exercises for insert with check (true);

-- ══════════════════════════════════════════════════════════════
-- BLOCK 4 — LOGS
-- ══════════════════════════════════════════════════════════════
create table public.logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  exercise_id uuid references exercises(id),
  exercise_name text,
  session_date date not null default current_date,
  set_number int not null,
  weight_lbs numeric,
  reps int,
  hold_seconds int,
  created_at timestamptz default now()
);
alter table logs enable row level security;
create policy "Users manage own logs"
  on logs for all using (auth.uid() = user_id);
create index idx_logs_user_date on logs(user_id, session_date desc);
create index idx_logs_exercise on logs(exercise_id, user_id);

-- ══════════════════════════════════════════════════════════════
-- BLOCK 5 — WORKOUT SESSIONS
-- ══════════════════════════════════════════════════════════════
create table public.workout_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  session_date date not null default current_date,
  routine_type text,
  location text,
  duration_minutes int,
  total_volume_lbs numeric,
  exercises_completed int,
  prs_hit text[] default '{}',
  created_at timestamptz default now()
);
alter table workout_sessions enable row level security;
create policy "Users manage own sessions"
  on workout_sessions for all using (auth.uid() = user_id);

-- ══════════════════════════════════════════════════════════════
-- BLOCK 6 — MACHINE MAP
-- ══════════════════════════════════════════════════════════════
create table public.machine_map (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  qr_value text not null,
  exercise_id uuid references exercises(id),
  machine_name text,
  created_at timestamptz default now(),
  unique(user_id, qr_value)
);
alter table machine_map enable row level security;
create policy "Users manage own machine map"
  on machine_map for all using (auth.uid() = user_id);

-- ══════════════════════════════════════════════════════════════
-- BLOCK 7 — MARTIAL ARTS
-- ══════════════════════════════════════════════════════════════
create table public.martial_arts_techniques (
  id uuid primary key default gen_random_uuid(),
  art text not null,
  category text not null,
  content_type text not null,
  name text not null,
  native_name text,
  difficulty text default 'beginner',
  target text,
  threat_level text,
  description text,
  steps jsonb default '[]',
  common_mistakes text[] default '{}',
  tips text[] default '{}',
  gif_url text,
  conditioning_benefit text,
  technique_sequence uuid[] default '{}',
  rhythm_guide text,
  attacks_from_here text[] default '{}',
  sweeps_from_here text[] default '{}',
  escapes text[] default '{}',
  transitions_to text[] default '{}',
  created_at timestamptz default now()
);
alter table martial_arts_techniques enable row level security;
create policy "Martial arts content is public"
  on martial_arts_techniques for select using (true);
create policy "Service role can insert martial arts"
  on martial_arts_techniques for insert with check (true);

-- ══════════════════════════════════════════════════════════════
-- BLOCK 8 — STRETCH SESSIONS
-- ══════════════════════════════════════════════════════════════
create table public.stretch_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  session_date date not null default current_date,
  category text,
  duration_minutes int,
  stretches_completed int,
  created_at timestamptz default now()
);
alter table stretch_sessions enable row level security;
create policy "Users manage own stretch sessions"
  on stretch_sessions for all using (auth.uid() = user_id);

-- ══════════════════════════════════════════════════════════════
-- BLOCK 9 — PROGRESSIONS
-- ══════════════════════════════════════════════════════════════
create table public.progressions (
  id uuid primary key default gen_random_uuid(),
  exercise_family text not null,
  level int not null,
  name text not null,
  target_sets int,
  target_reps int,
  target_hold_seconds int,
  unlocks_next_at_reps int,
  created_at timestamptz default now()
);
create table public.user_progressions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  progression_id uuid references progressions(id),
  status text default 'locked',
  unlocked_at timestamptz,
  created_at timestamptz default now(),
  unique(user_id, progression_id)
);
alter table progressions enable row level security;
alter table user_progressions enable row level security;
create policy "Progressions are public"
  on progressions for select using (true);
create policy "Service role can insert progressions"
  on progressions for insert with check (true);
create policy "Users manage own progression status"
  on user_progressions for all using (auth.uid() = user_id);

-- ══════════════════════════════════════════════════════════════
-- BLOCK 10 — INDEXES
-- ══════════════════════════════════════════════════════════════
create index idx_schedules_user_day
  on schedules(user_id, day_of_week);
create index idx_martial_arts_type
  on martial_arts_techniques(art, content_type);
create index idx_exercises_type_location
  on exercises(exercise_type, location);
