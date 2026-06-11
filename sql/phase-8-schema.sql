-- Phase 8: Notification preferences, message digest queue, performance indexes
-- Run after phase-7-schema.sql

create table if not exists public.notification_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email_messages text not null default 'instant'
    check (email_messages in ('instant', 'digest', 'off')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.message_digest_queue (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid not null references auth.users(id) on delete cascade,
  thread_id uuid,
  subject text,
  preview text,
  created_at timestamptz default now(),
  sent_at timestamptz
);

alter table public.notification_preferences enable row level security;
alter table public.message_digest_queue enable row level security;

drop policy if exists "user manages own notification prefs" on public.notification_preferences;
create policy "user manages own notification prefs"
on public.notification_preferences for all using (user_id = auth.uid());

drop policy if exists "user reads own digest queue" on public.message_digest_queue;
create policy "user reads own digest queue"
on public.message_digest_queue for select using (recipient_id = auth.uid());

-- Service role / cron processes digest queue (no client insert policy — server actions use service role)

create index if not exists idx_teachers_featured_approved
on public.teachers(is_featured desc, created_at desc)
where status = 'approved';

create index if not exists idx_message_digest_pending
on public.message_digest_queue(recipient_id, created_at)
where sent_at is null;

create index if not exists idx_teacher_reviews_teacher_id
on public.teacher_reviews(teacher_id);
