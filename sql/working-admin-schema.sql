-- Complete Admin Panel Database Schema for Nelimac Learning
-- Run this in your Supabase SQL Editor

-- USERS live in auth.users; mirror minimal info in profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text check (role in ('admin','teacher','parent')) default 'parent',
  full_name text,
  created_at timestamptz default now()
);

-- TEACHERS
create table if not exists public.teachers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text,
  location text,
  subjects text[] default '{}',
  experience_years int default 0,
  education_level text,
  tsc_number text,
  status text check (status in ('submitted','under_review','approved','rejected')) default 'submitted',
  rejection_reason text,
  created_at timestamptz default now()
);
create index if not exists idx_teachers_status on public.teachers(status);

-- TEACHER DOCUMENTS
create table if not exists public.teacher_documents (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid references public.teachers(id) on delete cascade,
  kind text check (kind in ('cv','certificate','id','tsc','other')),
  storage_path text not null, -- Supabase Storage path
  created_at timestamptz default now()
);

-- PARENTS (LEADS)
create table if not exists public.parents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users(id) on delete set null,
  full_name text not null,
  email text not null,
  phone text,
  location text,
  child_name text,
  child_grade text,
  child_age int,
  subjects_needed text[] default '{}',
  budget_range text,
  schedule_preferences text,
  special_requirements text,
  status text check (status in ('pending','qualified','assigned','completed','rejected')) default 'pending',
  created_at timestamptz default now()
);
create index if not exists idx_parents_status on public.parents(status);

-- ASSIGNMENTS (teacher <-> parent)
create table if not exists public.assignments (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references public.parents(id) on delete cascade,
  teacher_id uuid references public.teachers(id) on delete cascade,
  status text check (status in ('pending','active','completed','cancelled')) default 'pending',
  start_date date,
  end_date date,
  hourly_rate numeric,
  total_hours int default 0,
  notes text,
  created_at timestamptz default now()
);
create index if not exists idx_assignments_status on public.assignments(status);

-- MESSAGING
create table if not exists public.message_threads (
  id uuid primary key default gen_random_uuid(),
  subject text,
  created_by uuid references auth.users(id) on delete set null,
  context jsonb default '{}'::jsonb, -- optional: assignment_id, parent_id, teacher_id
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
create index if not exists idx_messages_thread on public.messages(thread_id);

-- NOTIFICATIONS (in-app log; email is sent by Edge Function)
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid references auth.users(id) on delete cascade,
  recipient_role text check (recipient_role in ('admin','teacher','parent')),
  title text not null,
  body text not null,
  is_read boolean default false,
  created_at timestamptz default now()
);

-- AUDIT LOG
create table if not exists public.admin_actions (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid references auth.users(id),
  entity_type text check (entity_type in ('teacher','parent','assignment','message','system')),
  entity_id uuid,
  action text, -- 'approve','reject','assign','close_thread', etc.
  meta jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.teachers enable row level security;
alter table public.teacher_documents enable row level security;
alter table public.parents enable row level security;
alter table public.assignments enable row level security;
alter table public.message_threads enable row level security;
alter table public.messages enable row level security;
alter table public.notifications enable row level security;
alter table public.admin_actions enable row level security;

-- Admin: full access
create policy admin_all_profiles on public.profiles
for all using ((auth.jwt() ->> 'role') = 'admin') with check ((auth.jwt() ->> 'role') = 'admin');

create policy admin_all_teachers on public.teachers
for all using ((auth.jwt() ->> 'role') = 'admin') with check ((auth.jwt() ->> 'role') = 'admin');

create policy admin_all_teacher_docs on public.teacher_documents
for all using ((auth.jwt() ->> 'role') = 'admin') with check ((auth.jwt() ->> 'role') = 'admin');

create policy admin_all_parents on public.parents
for all using ((auth.jwt() ->> 'role') = 'admin') with check ((auth.jwt() ->> 'role') = 'admin');

create policy admin_all_assignments on public.assignments
for all using ((auth.jwt() ->> 'role') = 'admin') with check ((auth.jwt() ->> 'role') = 'admin');

create policy admin_all_threads on public.message_threads
for all using ((auth.jwt() ->> 'role') = 'admin') with check ((auth.jwt() ->> 'role') = 'admin');

create policy admin_all_messages on public.messages
for all using ((auth.jwt() ->> 'role') = 'admin') with check ((auth.jwt() ->> 'role') = 'admin');

create policy admin_all_notifications on public.notifications
for all using ((auth.jwt() ->> 'role') = 'admin') with check ((auth.jwt() ->> 'role') = 'admin');

create policy admin_all_admin_actions on public.admin_actions
for all using ((auth.jwt() ->> 'role') = 'admin') with check ((auth.jwt() ->> 'role') = 'admin');

-- Teachers: can read/update their own teacher row (limited)
create policy teacher_read_self on public.teachers
for select using (user_id = auth.uid());

create policy teacher_update_own_profile on public.teachers
for update using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Parents: can read/update their own lead row (limited)
create policy parent_read_self on public.parents
for select using (email = (select email from auth.users where id = auth.uid()) or user_id = auth.uid());

create policy parent_update_self on public.parents
for update using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Messages: participants or admin can read/write
create policy msg_read_admin_or_participant on public.messages
for select using (
  (auth.jwt() ->> 'role') = 'admin' OR sender_id = auth.uid()
);

create policy msg_insert_admin_or_participant on public.messages
for insert with check (
  (auth.jwt() ->> 'role') = 'admin' OR sender_id = auth.uid()
);

-- Notifications: recipients can read their own
create policy notif_read_self on public.notifications
for select using (recipient_id = auth.uid());

-- Insert default admin profile
insert into public.profiles (id, role, full_name) 
values (
  (select id from auth.users where email = 'admin@nelimaclearning.co.ke' limit 1),
  'admin',
  'Admin User'
) on conflict (id) do update set role = 'admin';
