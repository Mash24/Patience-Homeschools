-- Phase 3: Reviews, session logs RLS, content tables (no payments)
-- Run after phase-2-schema.sql

-- Parent can read session logs for their assignments
drop policy if exists "parent reads session logs" on public.session_logs;
create policy "parent reads session logs"
on public.session_logs for select using (
  exists (
    select 1 from public.assignments a
    where a.id = assignment_id and a.parent_id = auth.uid()
  )
  or public.is_admin()
);

-- Teacher reviews: parent can read own reviews
drop policy if exists "parent reads own reviews" on public.teacher_reviews;
create policy "parent reads own reviews"
on public.teacher_reviews for select using (
  parent_id = auth.uid() or public.is_admin()
);

-- Events CMS (if not exists)
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  event_type text default 'workshop',
  date timestamptz not null,
  location text,
  max_attendees int,
  status text default 'published' check (status in ('draft','published','cancelled')),
  created_at timestamptz default now()
);

-- Resources CMS (if not exists)
create table if not exists public.resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text default 'guide',
  file_url text,
  is_premium boolean default false,
  status text default 'published' check (status in ('draft','published','archived')),
  created_at timestamptz default now()
);

alter table public.events enable row level security;
alter table public.resources enable row level security;

drop policy if exists "public read published events" on public.events;
create policy "public read published events"
on public.events for select using (status = 'published' or public.is_admin());

drop policy if exists "admin manages events" on public.events;
create policy "admin manages events"
on public.events for all using (public.is_admin());

drop policy if exists "public read published resources" on public.resources;
create policy "public read published resources"
on public.resources for select using (status = 'published' or public.is_admin());

drop policy if exists "admin manages resources" on public.resources;
create policy "admin manages resources"
on public.resources for all using (public.is_admin());
