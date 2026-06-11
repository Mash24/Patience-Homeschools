-- Nelimac Learning Database Schema
-- Run this in Supabase SQL Editor

-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- PROFILES (extends auth.users)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text check (role in ('parent','teacher','admin')) default 'parent',
  full_name text,
  phone text,
  created_at timestamptz default now()
);

-- PARENT LEADS (for teacher matching requests)
create table if not exists parent_leads (
  id uuid primary key default gen_random_uuid(),
  parent_name text not null,
  email text not null,
  phone text,
  city text,
  child_first_name text,
  grade_level text,
  curricula text[] not null,
  subjects text[] not null,
  goals text,
  mode text check (mode in ('in_home','online','hybrid')) default 'in_home',
  location_area text,
  schedule_note text,
  budget_band text,
  status text check (status in ('new','shortlisted','matched','closed')) default 'new',
  created_at timestamptz default now()
);

-- PARENTS (registered parent accounts)
create table if not exists parents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  city text,
  area text,
  address text,
  preferred_curricula text[],
  preferred_subjects text[],
  teaching_mode text check (teaching_mode in ('in_home','online','hybrid')) default 'in_home',
  goals text,
  budget_considerations text,
  schedule_preferences text,
  emergency_contact text,
  preferred_contact_method text check (preferred_contact_method in ('email','phone','whatsapp')) default 'email',
  newsletter_subscription boolean default true,
  sms_notifications boolean default true,
  status text check (status in ('active','inactive','suspended')) default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- CHILDREN (children of registered parents)
create table if not exists children (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references parents(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  date_of_birth date,
  grade_level text,
  school text,
  special_needs text,
  interests text[],
  status text check (status in ('active','inactive')) default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- TEACHERS
create table if not exists teachers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  id_number text,
  bio text,
  city text,
  curricula text[] not null,
  subjects text[] not null,
  levels text[] not null,
  mode text check (mode in ('in_home','online','both')) default 'both',
  service_areas text[],
  years_experience int default 0,
  rate_min int,
  rate_max int,
  tsc_number text,
  year_of_graduation int,
  additional_certifications text,
  previous_schools text,
  references text,
  verified boolean default false,
  status text check (status in ('pending','approved','rejected')) default 'pending',
  score numeric default 0,
  created_at timestamptz default now()
);

-- TEACHER DOCUMENTS
create table if not exists teacher_documents (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid references teachers(id) on delete cascade,
  kind text not null, -- 'tscCertificate','cv','profilePhoto','otherDocuments'
  file_path text not null,
  file_name text,
  file_size bigint,
  verified_at timestamptz,
  created_at timestamptz default now()
);

-- MATCHES (MVP placeholder)
create table if not exists matches (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references parent_leads(id) on delete cascade,
  teacher_id uuid references teachers(id) on delete cascade,
  score numeric,
  status text check (status in ('suggested','sent','accepted','declined')) default 'suggested',
  created_at timestamptz default now()
);

-- EVENTS
create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  event_type text check (event_type in ('workshop','seminar','social','educational')) default 'workshop',
  date timestamptz not null,
  location text,
  max_attendees int,
  current_attendees int default 0,
  price numeric default 0,
  status text check (status in ('draft','published','cancelled','completed')) default 'draft',
  created_at timestamptz default now()
);

-- RESOURCES
create table if not exists resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text check (category in ('curriculum','assessment','activity','guide','other')) default 'other',
  file_url text,
  is_premium boolean default false,
  download_count int default 0,
  status text check (status in ('draft','published','archived')) default 'draft',
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table profiles enable row level security;
alter table parent_leads enable row level security;
alter table parents enable row level security;
alter table children enable row level security;
alter table teachers enable row level security;
alter table teacher_documents enable row level security;
alter table matches enable row level security;
alter table events enable row level security;
alter table resources enable row level security;

-- RLS POLICIES

-- Profiles policies
create policy "Users can view own profile"
on profiles for select
to authenticated
using (auth.uid() = id);

create policy "Users can update own profile"
on profiles for update
to authenticated
using (auth.uid() = id);

-- Parent leads policies (allow anonymous inserts for lead capture)
create policy "anyone can insert leads"
on parent_leads for insert
to anon
with check (true);

create policy "admin can select all leads"
on parent_leads for select
to authenticated
using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "admin can update leads"
on parent_leads for update
to authenticated
using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));

-- Parents policies
create policy "parents can view own data"
on parents for select
to authenticated
using (user_id = auth.uid());

create policy "parents can update own data"
on parents for update
to authenticated
using (user_id = auth.uid());

create policy "admin can select all parents"
on parents for select
to authenticated
using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "admin can update parents"
on parents for update
to authenticated
using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));

-- Children policies
create policy "parents can view own children"
on children for select
to authenticated
using (exists (select 1 from parents p where p.id = parent_id and p.user_id = auth.uid()));

create policy "parents can update own children"
on children for update
to authenticated
using (exists (select 1 from parents p where p.id = parent_id and p.user_id = auth.uid()));

create policy "parents can insert own children"
on children for insert
to authenticated
with check (exists (select 1 from parents p where p.id = parent_id and p.user_id = auth.uid()));

create policy "admin can select all children"
on children for select
to authenticated
using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));

-- Teachers policies (allow anonymous inserts for applications)
create policy "anyone can insert teachers"
on teachers for insert
to anon
with check (true);

create policy "admin can select all teachers"
on teachers for select
to authenticated
using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "admin can update teachers"
on teachers for update
to authenticated
using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "approved teachers can view own profile"
on teachers for select
to authenticated
using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'teacher' and p.id = id));

-- Teacher documents policies
create policy "anyone can insert teacher docs"
on teacher_documents for insert
to anon
with check (true);

create policy "admin can select all docs"
on teacher_documents for select
to authenticated
using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));

-- Matches policies
create policy "admin can manage matches"
on matches for all
to authenticated
using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));

-- Events policies
create policy "anyone can view published events"
on events for select
to anon
using (status = 'published');

create policy "admin can manage events"
on events for all
to authenticated
using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));

-- Resources policies
create policy "anyone can view published resources"
on resources for select
to anon
using (status = 'published');

create policy "admin can manage resources"
on resources for all
to authenticated
using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));

-- Create indexes for better performance
create index if not exists idx_parent_leads_status on parent_leads(status);
create index if not exists idx_parent_leads_created_at on parent_leads(created_at desc);
create index if not exists idx_parents_user_id on parents(user_id);
create index if not exists idx_parents_status on parents(status);
create index if not exists idx_parents_city on parents(city);
create index if not exists idx_parents_created_at on parents(created_at desc);
create index if not exists idx_children_parent_id on children(parent_id);
create index if not exists idx_children_status on children(status);
create index if not exists idx_children_grade_level on children(grade_level);
create index if not exists idx_teachers_status on teachers(status);
create index if not exists idx_teachers_curricula on teachers using gin(curricula);
create index if not exists idx_teachers_subjects on teachers using gin(subjects);
create index if not exists idx_teachers_verified on teachers(verified);
create index if not exists idx_teachers_email on teachers(email);
create index if not exists idx_teachers_tsc_number on teachers(tsc_number);
create index if not exists idx_teacher_documents_teacher_id on teacher_documents(teacher_id);
create index if not exists idx_teacher_documents_kind on teacher_documents(kind);
create index if not exists idx_events_date on events(date);
create index if not exists idx_events_status on events(status);
create index if not exists idx_resources_category on resources(category);
create index if not exists idx_resources_status on resources(status);

-- Create storage bucket for teacher documents
insert into storage.buckets (id, name, public) values ('teacher-docs', 'teacher-docs', false);

-- Storage policies for teacher documents
create policy "Teacher documents are private"
on storage.objects for select
to authenticated
using (bucket_id = 'teacher-docs');

create policy "Anyone can upload teacher documents"
on storage.objects for insert
to anon
with check (bucket_id = 'teacher-docs');

-- Function to automatically create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, new.raw_user_meta_data->>'full_name', 'parent');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile on user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
