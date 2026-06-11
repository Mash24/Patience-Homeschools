-- Phase 2: Messaging, notifications RLS, sessions for parents, teacher reviews
-- Run in Supabase SQL Editor after phase-1-schema.sql

-- Messaging (skip if already created via working-admin-schema.sql)
create table if not exists public.message_threads (
  id uuid primary key default gen_random_uuid(),
  subject text,
  created_by uuid references auth.users(id) on delete set null,
  context jsonb default '{}'::jsonb,
  status text check (status in ('open','closed')) default 'open',
  created_at timestamptz default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid references public.message_threads(id) on delete cascade,
  sender_id uuid references auth.users(id) on delete set null,
  sender_role text check (sender_role in ('admin','teacher','parent')) not null,
  body text not null,
  created_at timestamptz default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid references auth.users(id) on delete cascade,
  recipient_role text check (recipient_role in ('admin','teacher','parent')),
  title text not null,
  body text not null,
  is_read boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.teacher_reviews (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.teachers(id) on delete cascade,
  parent_id uuid not null references public.profiles(id) on delete cascade,
  assignment_id uuid references public.assignments(id) on delete set null,
  rating int not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz default now(),
  unique (teacher_id, parent_id, assignment_id)
);

create index if not exists idx_messages_thread on public.messages(thread_id);
create index if not exists idx_notifications_recipient on public.notifications(recipient_id);
create index if not exists idx_teacher_reviews_teacher on public.teacher_reviews(teacher_id);

alter table public.message_threads enable row level security;
alter table public.messages enable row level security;
alter table public.notifications enable row level security;
alter table public.teacher_reviews enable row level security;

-- Parents can view sessions for their assignments
drop policy if exists "parent sees own sessions" on public.class_sessions;
create policy "parent sees own sessions"
on public.class_sessions for select using (
  exists (
    select 1 from public.assignments a
    where a.id = assignment_id and a.parent_id = auth.uid()
  )
  or public.is_admin()
);

-- Thread access: admin, creator, or participant in context
drop policy if exists "thread participant read" on public.message_threads;
create policy "thread participant read"
on public.message_threads for select using (
  public.is_admin()
  or created_by = auth.uid()
  or (context->>'parent_id')::uuid = auth.uid()
  or (context->>'teacher_id')::uuid = auth.uid()
);

drop policy if exists "thread participant insert" on public.message_threads;
create policy "thread participant insert"
on public.message_threads for insert with check (
  public.is_admin() or created_by = auth.uid()
);

drop policy if exists "thread admin update" on public.message_threads;
create policy "thread admin update"
on public.message_threads for update using (public.is_admin());

drop policy if exists "msg read participant" on public.messages;
create policy "msg read participant"
on public.messages for select using (
  public.is_admin()
  or sender_id = auth.uid()
  or exists (
    select 1 from public.message_threads t
    where t.id = thread_id
    and (
      t.created_by = auth.uid()
      or (t.context->>'parent_id')::uuid = auth.uid()
      or (t.context->>'teacher_id')::uuid = auth.uid()
    )
  )
);

drop policy if exists "msg insert participant" on public.messages;
create policy "msg insert participant"
on public.messages for insert with check (
  sender_id = auth.uid()
  and (
    public.is_admin()
    or exists (
      select 1 from public.message_threads t
      where t.id = thread_id
      and t.status = 'open'
      and (
        t.created_by = auth.uid()
        or (t.context->>'parent_id')::uuid = auth.uid()
        or (t.context->>'teacher_id')::uuid = auth.uid()
      )
    )
  )
);

drop policy if exists "notif read self" on public.notifications;
create policy "notif read self"
on public.notifications for select using (
  recipient_id = auth.uid() or public.is_admin()
);

drop policy if exists "notif update self" on public.notifications;
create policy "notif update self"
on public.notifications for update using (
  recipient_id = auth.uid() or public.is_admin()
);

drop policy if exists "reviews public read" on public.teacher_reviews;
create policy "reviews public read"
on public.teacher_reviews for select using (true);

drop policy if exists "parent insert review" on public.teacher_reviews;
create policy "parent insert review"
on public.teacher_reviews for insert with check (
  parent_id = auth.uid()
);
