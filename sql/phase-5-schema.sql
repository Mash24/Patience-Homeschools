-- Phase 5: Event registrations (no payments)
-- Run after phase-4-schema.sql

create table if not exists public.event_registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text,
  notes text,
  status text default 'pending' check (status in ('pending','confirmed','cancelled')),
  created_at timestamptz default now()
);

create index if not exists event_registrations_event_id_idx on public.event_registrations(event_id);
create unique index if not exists event_registrations_event_email_idx on public.event_registrations(event_id, email);

alter table public.event_registrations enable row level security;

drop policy if exists "public registers for events" on public.event_registrations;
create policy "public registers for events"
on public.event_registrations for insert with check (true);

drop policy if exists "admin manages event registrations" on public.event_registrations;
create policy "admin manages event registrations"
on public.event_registrations for all using (public.is_admin());

drop policy if exists "registrant reads own" on public.event_registrations;
create policy "registrant reads own"
on public.event_registrations for select using (
  email = (auth.jwt() ->> 'email') or public.is_admin()
);
