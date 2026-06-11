-- Phase 9: Session reminder log (no payments)
-- Run after phase-8-schema.sql

create table if not exists public.session_reminder_log (
  id uuid primary key default gen_random_uuid(),
  class_session_id uuid not null references public.class_sessions(id) on delete cascade,
  reminder_date date not null,
  sent_at timestamptz default now(),
  unique(class_session_id, reminder_date)
);

alter table public.session_reminder_log enable row level security;

drop policy if exists "admin reads session reminders" on public.session_reminder_log;
create policy "admin reads session reminders"
on public.session_reminder_log for select using (public.is_admin());

create index if not exists idx_class_sessions_day
on public.class_sessions(day_of_week);

create index if not exists idx_assignments_active
on public.assignments(status)
where status = 'active';
