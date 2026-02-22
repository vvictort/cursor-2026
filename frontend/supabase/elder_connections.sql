-- Run this once in the Supabase SQL editor.
-- This sets up:
-- 1) One profile row per authenticated user (default role = elder)
-- 2) Connections where elders can store loved-one emails/profile info
-- 3) RLS so users only access their own rows

create extension if not exists pgcrypto;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type public.user_role as enum ('elder', 'loved_one');
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'connection_status') then
    create type public.connection_status as enum ('pending', 'accepted', 'blocked');
  end if;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role public.user_role not null default 'elder',
  full_name text,
  timezone text not null default 'UTC',
  preferences jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

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
  constraint connection_target_check check (loved_one_id is not null or invite_email is not null),
  constraint invite_email_valid check (
    invite_email is null or invite_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  )
);

create unique index if not exists connections_unique_invite_per_elder
  on public.connections (elder_id, invite_email)
  where invite_email is not null;

create unique index if not exists connections_unique_profile_per_elder
  on public.connections (elder_id, loved_one_id)
  where loved_one_id is not null;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_connections_updated_at on public.connections;
create trigger set_connections_updated_at
before update on public.connections
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role, full_name, timezone)
  values (
    new.id,
    case
      when coalesce(new.raw_user_meta_data ->> 'role', '') = 'loved_one'
        then 'loved_one'::public.user_role
      else 'elder'::public.user_role
    end,
    nullif(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(nullif(new.raw_user_meta_data ->> 'timezone', ''), 'UTC')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile
after insert on auth.users
for each row execute function public.handle_new_user_profile();

alter table public.profiles enable row level security;
alter table public.connections enable row level security;

drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own
  on public.profiles
  for select
  using (auth.uid() = id);

drop policy if exists profiles_insert_own on public.profiles;
create policy profiles_insert_own
  on public.profiles
  for insert
  with check (auth.uid() = id);

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists connections_select_related on public.connections;
create policy connections_select_related
  on public.connections
  for select
  using (auth.uid() = elder_id or auth.uid() = loved_one_id);

drop policy if exists connections_insert_by_elder on public.connections;
create policy connections_insert_by_elder
  on public.connections
  for insert
  with check (
    auth.uid() = elder_id
    and exists (
      select 1
      from public.profiles p
      where p.id = auth.uid() and p.role = 'elder'
    )
  );

drop policy if exists connections_update_by_elder on public.connections;
create policy connections_update_by_elder
  on public.connections
  for update
  using (auth.uid() = elder_id)
  with check (auth.uid() = elder_id);

drop policy if exists connections_delete_by_elder on public.connections;
create policy connections_delete_by_elder
  on public.connections
  for delete
  using (auth.uid() = elder_id);

grant select, insert, update on public.profiles to authenticated;
grant select, insert, update, delete on public.connections to authenticated;
