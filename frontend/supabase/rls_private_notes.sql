-- Run this once in the Supabase SQL editor.
-- It creates a user-scoped table for frontend RLS smoke testing.

create extension if not exists pgcrypto;

create table if not exists public.private_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  note text not null check (char_length(note) > 0 and char_length(note) <= 500),
  created_at timestamptz not null default now()
);

create index if not exists private_notes_user_id_created_at_idx
  on public.private_notes (user_id, created_at desc);

alter table public.private_notes enable row level security;

drop policy if exists private_notes_select_own on public.private_notes;
create policy private_notes_select_own
  on public.private_notes
  for select
  using (auth.uid() = user_id);

drop policy if exists private_notes_insert_own on public.private_notes;
create policy private_notes_insert_own
  on public.private_notes
  for insert
  with check (auth.uid() = user_id);

drop policy if exists private_notes_delete_own on public.private_notes;
create policy private_notes_delete_own
  on public.private_notes
  for delete
  using (auth.uid() = user_id);

grant select, insert, delete on public.private_notes to authenticated;
