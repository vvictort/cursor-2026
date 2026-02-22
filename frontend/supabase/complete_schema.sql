-- =========================================================
-- ELDER CARE APP — FULL SUPABASE SCHEMA (PASTE + RUN)
-- =========================================================
-- Paste this whole file into Supabase Dashboard → SQL Editor
-- and click "Run". It is safe to re-run (drops/recreates policies/triggers).
-- =========================================================

-- 1) EXTENSIONS
create extension if not exists pgcrypto;

-- 2) TYPES (Enums)
do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type public.user_role as enum ('elder', 'loved_one');
  end if;

  if not exists (select 1 from pg_type where typname = 'connection_status') then
    create type public.connection_status as enum ('pending', 'accepted', 'blocked');
  end if;

  if not exists (select 1 from pg_type where typname = 'metric_type') then
    create type public.metric_type as enum (
      'blood_pressure', 'glucose', 'oxygen', 'heart_rate', 'hrv', 'calories', 'sleep'
    );
  end if;
end $$;

-- 3) TABLES

-- Profiles: one row per authenticated user
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role public.user_role not null default 'elder',
  full_name text,
  timezone text not null default 'UTC',
  preferences jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Connections: links between Elders and Loved Ones
create table if not exists public.connections (
  id uuid primary key default gen_random_uuid(),
  elder_id uuid not null references public.profiles (id) on delete cascade,
  loved_one_id uuid references public.profiles (id) on delete set null,
  invite_email text,
  loved_one_name text,
  relationship text,
  phone_number text,
  status public.connection_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint connection_target_check check (loved_one_id is not null or invite_email is not null)
);

-- Health Metrics
create table if not exists public.health_metrics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  type public.metric_type not null,
  value_numeric numeric,           -- for single-value metrics (e.g., oxygen)
  value_json jsonb,                -- for complex metrics (e.g., {sys:120, dia:80})
  notes text,
  recorded_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- Medications
create table if not exists public.medications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  dosage text,
  frequency text,
  reminder_time time,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Symptoms
create table if not exists public.symptoms (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  description text not null,
  severity int check (severity between 1 and 5),
  recorded_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- 4) AUTOMATION (Triggers)

-- updated_at helper
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- drop triggers (so this script can be re-run)
drop trigger if exists set_profiles_updated_at on public.profiles;
drop trigger if exists set_connections_updated_at on public.connections;

create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger set_connections_updated_at
before update on public.connections
for each row execute function public.set_updated_at();

-- auto-create a profile when a new auth user signs up
create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role, full_name)
  values (
    new.id,
    case
      when (new.raw_user_meta_data ->> 'role') in ('elder','loved_one')
      then (new.raw_user_meta_data ->> 'role')::public.user_role
      else 'elder'
    end,
    nullif(new.raw_user_meta_data ->> 'full_name', '')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_profile on auth.users;

create trigger on_auth_user_created_profile
after insert on auth.users
for each row execute function public.handle_new_user_profile();

-- 5) SECURITY (RLS)

alter table public.profiles enable row level security;
alter table public.connections enable row level security;
alter table public.health_metrics enable row level security;
alter table public.medications enable row level security;
alter table public.symptoms enable row level security;

-- Drop policies (re-runnable)
drop policy if exists "Users can view own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;

drop policy if exists "Users can view their connections" on public.connections;
drop policy if exists "Elders can create connections" on public.connections;
drop policy if exists "Users can update their connections" on public.connections;
drop policy if exists "Elders can delete connections" on public.connections;

drop policy if exists "Users can manage own metrics" on public.health_metrics;
drop policy if exists "Loved Ones can view elder metrics" on public.health_metrics;

drop policy if exists "Users can manage own medications" on public.medications;
drop policy if exists "Loved Ones can view elder medications" on public.medications;

drop policy if exists "Users can manage own symptoms" on public.symptoms;
drop policy if exists "Loved Ones can view elder symptoms" on public.symptoms;

-- Profiles
create policy "Users can view own profile"
on public.profiles
for select
using (auth.uid() = id);

create policy "Users can update own profile"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

-- Connections
create policy "Users can view their connections"
on public.connections
for select
using (auth.uid() = elder_id or auth.uid() = loved_one_id);

create policy "Elders can create connections"
on public.connections
for insert
with check (auth.uid() = elder_id);

create policy "Users can update their connections"
on public.connections
for update
using (auth.uid() = elder_id or auth.uid() = loved_one_id)
with check (auth.uid() = elder_id or auth.uid() = loved_one_id);

create policy "Elders can delete connections"
on public.connections
for delete
using (auth.uid() = elder_id);

-- Health metrics
create policy "Users can manage own metrics"
on public.health_metrics
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Loved Ones can view elder metrics"
on public.health_metrics
for select
using (
  exists (
    select 1
    from public.connections c
    where c.loved_one_id = auth.uid()
      and c.elder_id = health_metrics.user_id
      and c.status = 'accepted'
  )
);

-- Medications
create policy "Users can manage own medications"
on public.medications
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Loved Ones can view elder medications"
on public.medications
for select
using (
  exists (
    select 1
    from public.connections c
    where c.loved_one_id = auth.uid()
      and c.elder_id = medications.user_id
      and c.status = 'accepted'
  )
);

-- Symptoms
create policy "Users can manage own symptoms"
on public.symptoms
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Loved Ones can view elder symptoms"
on public.symptoms
for select
using (
  exists (
    select 1
    from public.connections c
    where c.loved_one_id = auth.uid()
      and c.elder_id = symptoms.user_id
      and c.status = 'accepted'
  )
);

-- 6) INDEXES / CONSTRAINT HELPERS (recommended)

-- prevent duplicates
create unique index if not exists connections_unique_pair
on public.connections (elder_id, loved_one_id)
where loved_one_id is not null;

create unique index if not exists connections_unique_invite
on public.connections (elder_id, invite_email)
where invite_email is not null;

-- helpful query indexes
create index if not exists connections_elder_id_idx on public.connections (elder_id);
create index if not exists connections_loved_one_id_idx on public.connections (loved_one_id);
create index if not exists health_metrics_user_recorded_idx on public.health_metrics (user_id, recorded_at desc);

-- 7) GRANTS
grant usage on schema public to anon, authenticated;
grant all on all tables in schema public to authenticated;
grant all on all sequences in schema public to authenticated;