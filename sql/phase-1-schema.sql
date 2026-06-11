-- Nelimac Learning Phase 1 Database Schema
-- Run this in Supabase SQL Editor

-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Update profiles table to ensure proper role coverage
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('teacher','admin','parent')),
  full_name text,
  phone text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Children of parents
create table if not exists public.children (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references public.profiles(id) on delete cascade,
  full_name text not null,
  birthdate date,
  level text, -- "Grade 6", "Form 2", etc.
  notes text,
  created_at timestamptz default now()
);

-- Assignments (parent ↔ teacher link)
create table if not exists public.assignments (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.teachers(id) on delete cascade,
  parent_id uuid not null references public.profiles(id) on delete cascade,
  child_id uuid references public.children(id) on delete cascade,
  subject text,
  student_level text,
  location text,
  status text not null default 'active'
    check (status in ('active','completed','cancelled')),
  payment_type text check (payment_type in ('hourly','contract')),
  hourly_rate numeric,
  contract_amount numeric,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Class sessions (recurring schedule entries)
create table if not exists public.class_sessions (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.assignments(id) on delete cascade,
  day_of_week text check (day_of_week in ('Mon','Tue','Wed','Thu','Fri','Sat','Sun')),
  start_time time not null,
  end_time time not null,
  location text,
  notes text,
  created_at timestamptz default now()
);

-- Session logs (attendance, completion records)
create table if not exists public.session_logs (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.assignments(id) on delete cascade,
  session_date date not null,
  start_time time not null,
  end_time time not null,
  duration_minutes int generated always as
    (extract(epoch from (end_time - start_time)) / 60)::int stored,
  notes text,
  created_at timestamptz default now()
);

-- Helper function for admin checks
create or replace function public.is_admin() returns boolean
language sql stable as $$
  select exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'
  );
$$;

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.children enable row level security;
alter table public.assignments enable row level security;
alter table public.class_sessions enable row level security;
alter table public.session_logs enable row level security;

-- RLS Policies

-- Profiles policies
create policy "user can read own profile"
on public.profiles for select using (id = auth.uid() or public.is_admin());

create policy "user can update own profile"
on public.profiles for update using (id = auth.uid());

create policy "user can insert own profile"
on public.profiles for insert with check (id = auth.uid());

-- Children policies
create policy "parent manages own children"
on public.children for all using (parent_id = auth.uid() or public.is_admin());

-- Assignments policies
create policy "teacher sees own assignments"
on public.assignments for select using (teacher_id = auth.uid() or public.is_admin());

create policy "parent sees their assignments"
on public.assignments for select using (parent_id = auth.uid() or public.is_admin());

create policy "admin manages assignments"
on public.assignments for all using (public.is_admin());

-- Class sessions policies
create policy "teacher sees own sessions"
on public.class_sessions for select using (
  exists (select 1 from public.assignments a
          where a.id = assignment_id and a.teacher_id = auth.uid())
  or public.is_admin()
);

create policy "teacher manages own sessions"
on public.class_sessions for all using (
  exists (select 1 from public.assignments a
          where a.id = assignment_id and a.teacher_id = auth.uid())
  or public.is_admin()
);

-- Session logs policies
create policy "teacher manages logs for their assignments"
on public.session_logs for all using (
  exists (select 1 from public.assignments a
          where a.id = assignment_id and a.teacher_id = auth.uid())
  or public.is_admin()
);

-- Create indexes for better performance
create index if not exists idx_children_parent_id on public.children(parent_id);
create index if not exists idx_assignments_teacher_id on public.assignments(teacher_id);
create index if not exists idx_assignments_parent_id on public.assignments(parent_id);
create index if not exists idx_assignments_child_id on public.assignments(child_id);
create index if not exists idx_assignments_status on public.assignments(status);
create index if not exists idx_class_sessions_assignment_id on public.class_sessions(assignment_id);
create index if not exists idx_class_sessions_day_of_week on public.class_sessions(day_of_week);
create index if not exists idx_session_logs_assignment_id on public.session_logs(assignment_id);
create index if not exists idx_session_logs_session_date on public.session_logs(session_date);

-- Update the existing handle_new_user function to handle parent role
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, new.raw_user_meta_data->>'full_name', 'parent');
  return new;
end;
$$ language plpgsql security definer;
