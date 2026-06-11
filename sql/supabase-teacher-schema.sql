-- Nelimac Learning Database Schema - Teacher & Admin System
-- This schema extends the existing parent/children tables

-- =============================================
-- AUTHENTICATION & PROFILES
-- =============================================

-- User profiles with roles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('teacher','admin')),
  full_name text,
  email text,
  phone text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =============================================
-- TEACHER SYSTEM
-- =============================================

-- Teacher profiles and applications
create table if not exists public.teachers (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text,
  subjects text[] not null default '{}', -- e.g. ['Mathematics','Physics','Chemistry']
  curricula text[] not null default '{}', -- e.g. ['IGCSE','CBC','British']
  grade_levels text[] not null default '{}', -- e.g. ['Grade 1-3','Grade 4-6','Grade 7-9']
  bio text,
  experience_years integer default 0,
  education_background text,
  teaching_philosophy text,
  availability text[], -- e.g. ['mornings','evenings','weekends']
  hourly_rate_range text, -- e.g. 'KES 2000-3000'
  location_area text,
  tsc_number text,
  status text not null default 'draft' check (status in ('draft','submitted','under_review','approved','rejected','suspended')),
  application_date timestamptz,
  review_date timestamptz,
  approved_date timestamptz,
  rejection_reason text,
  admin_notes text,
  is_featured boolean default false,
  is_verified boolean default false,
  verification_date timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Teacher documents and certifications
create table if not exists public.teacher_documents (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.teachers(id) on delete cascade,
  kind text not null check (kind in ('cv','profile_photo','tsc_certificate','education_certificate','other_document')),
  file_name text not null,
  file_path text not null, -- storage key in bucket teacher-docs
  file_size integer,
  mime_type text,
  is_required boolean default false,
  verified_at timestamptz,
  verified_by uuid references public.profiles(id),
  rejection_reason text,
  created_at timestamptz default now()
);

-- Teacher specializations and achievements
create table if not exists public.teacher_specializations (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.teachers(id) on delete cascade,
  specialization text not null, -- e.g. 'Special Needs Education', 'Gifted Students', 'Exam Preparation'
  level text, -- e.g. 'Beginner', 'Intermediate', 'Advanced'
  certification_date date,
  created_at timestamptz default now()
);

-- Teacher availability schedule
create table if not exists public.teacher_availability (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.teachers(id) on delete cascade,
  day_of_week text not null check (day_of_week in ('monday','tuesday','wednesday','thursday','friday','saturday','sunday')),
  start_time time,
  end_time time,
  is_available boolean default true,
  created_at timestamptz default now()
);

-- =============================================
-- ADMIN SYSTEM
-- =============================================

-- Admin activity log
create table if not exists public.admin_activities (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid not null references public.profiles(id),
  action text not null, -- e.g. 'teacher_approved', 'teacher_rejected', 'document_verified'
  target_type text not null, -- e.g. 'teacher', 'document', 'application'
  target_id uuid not null,
  details jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz default now()
);

-- =============================================
-- APPLICATION TRACKING
-- =============================================

-- Teacher application steps completion
create table if not exists public.teacher_application_steps (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.teachers(id) on delete cascade,
  step_name text not null, -- e.g. 'personal_info', 'documents', 'review'
  is_completed boolean default false,
  completed_at timestamptz,
  data jsonb, -- store step-specific data
  created_at timestamptz default now()
);

-- =============================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.teachers enable row level security;
alter table public.teacher_documents enable row level security;
alter table public.teacher_specializations enable row level security;
alter table public.teacher_availability enable row level security;
alter table public.admin_activities enable row level security;
alter table public.teacher_application_steps enable row level security;

-- Helper function to check if user is admin
create or replace function public.is_admin() returns boolean
language sql stable as $$
  select exists (
    select 1 from public.profiles p 
    where p.id = auth.uid() and p.role = 'admin'
  );
$$;

-- Helper function to check if user is teacher
create or replace function public.is_teacher() returns boolean
language sql stable as $$
  select exists (
    select 1 from public.profiles p 
    where p.id = auth.uid() and p.role = 'teacher'
  );
$$;

-- Profiles policies
create policy "profiles_own_read" on public.profiles
for select using (id = auth.uid() or public.is_admin());

create policy "profiles_own_upsert" on public.profiles
for all using (id = auth.uid()) with check (id = auth.uid());

-- Teachers policies
create policy "teachers_own_read" on public.teachers
for select using (id = auth.uid() or public.is_admin());

create policy "teachers_own_write" on public.teachers
for update using (id = auth.uid()) with check (id = auth.uid());

create policy "teachers_insert_self" on public.teachers
for insert with check (id = auth.uid());

-- Public can view approved teachers (for hire-teacher page)
create policy "teachers_public_approved" on public.teachers
for select using (status = 'approved' and is_verified = true);

-- Teacher documents policies
create policy "teacher_documents_own_read" on public.teacher_documents
for select using (teacher_id = auth.uid() or public.is_admin());

create policy "teacher_documents_insert_self" on public.teacher_documents
for insert with check (teacher_id = auth.uid() or public.is_admin());

create policy "teacher_documents_delete_own" on public.teacher_documents
for delete using (teacher_id = auth.uid() or public.is_admin());

-- Teacher specializations policies
create policy "teacher_specializations_own_read" on public.teacher_specializations
for select using (teacher_id = auth.uid() or public.is_admin());

create policy "teacher_specializations_insert_self" on public.teacher_specializations
for insert with check (teacher_id = auth.uid());

create policy "teacher_specializations_update_own" on public.teacher_specializations
for update using (teacher_id = auth.uid()) with check (teacher_id = auth.uid());

-- Teacher availability policies
create policy "teacher_availability_own_read" on public.teacher_availability
for select using (teacher_id = auth.uid() or public.is_admin());

create policy "teacher_availability_insert_self" on public.teacher_availability
for insert with check (teacher_id = auth.uid());

create policy "teacher_availability_update_own" on public.teacher_availability
for update using (teacher_id = auth.uid()) with check (teacher_id = auth.uid());

-- Admin activities policies (admin only)
create policy "admin_activities_admin_only" on public.admin_activities
for all using (public.is_admin());

-- Application steps policies
create policy "application_steps_own_read" on public.teacher_application_steps
for select using (teacher_id = auth.uid() or public.is_admin());

create policy "application_steps_insert_self" on public.teacher_application_steps
for insert with check (teacher_id = auth.uid());

create policy "application_steps_update_own" on public.teacher_application_steps
for update using (teacher_id = auth.uid()) with check (teacher_id = auth.uid());

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Profiles indexes
create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_profiles_email on public.profiles(email);

-- Teachers indexes
create index if not exists idx_teachers_status on public.teachers(status);
create index if not exists idx_teachers_subjects on public.teachers using gin(subjects);
create index if not exists idx_teachers_curricula on public.teachers using gin(curricula);
create index if not exists idx_teachers_grade_levels on public.teachers using gin(grade_levels);
create index if not exists idx_teachers_location on public.teachers(location_area);
create index if not exists idx_teachers_is_featured on public.teachers(is_featured);
create index if not exists idx_teachers_is_verified on public.teachers(is_verified);
create index if not exists idx_teachers_created_at on public.teachers(created_at desc);

-- Teacher documents indexes
create index if not exists idx_teacher_documents_teacher_id on public.teacher_documents(teacher_id);
create index if not exists idx_teacher_documents_kind on public.teacher_documents(kind);
create index if not exists idx_teacher_documents_verified on public.teacher_documents(verified_at);

-- Teacher specializations indexes
create index if not exists idx_teacher_specializations_teacher_id on public.teacher_specializations(teacher_id);

-- Teacher availability indexes
create index if not exists idx_teacher_availability_teacher_id on public.teacher_availability(teacher_id);
create index if not exists idx_teacher_availability_day on public.teacher_availability(day_of_week);

-- Admin activities indexes
create index if not exists idx_admin_activities_admin_id on public.admin_activities(admin_id);
create index if not exists idx_admin_activities_target on public.admin_activities(target_type, target_id);
create index if not exists idx_admin_activities_created_at on public.admin_activities(created_at desc);

-- Application steps indexes
create index if not exists idx_application_steps_teacher_id on public.teacher_application_steps(teacher_id);
create index if not exists idx_application_steps_step_name on public.teacher_application_steps(step_name);

-- =============================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- =============================================

-- Function to update updated_at timestamp
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Apply updated_at trigger to relevant tables
create trigger update_profiles_updated_at before update on public.profiles
  for each row execute function public.update_updated_at_column();

create trigger update_teachers_updated_at before update on public.teachers
  for each row execute function public.update_updated_at_column();

-- =============================================
-- STORAGE POLICIES (for teacher-docs bucket)
-- =============================================

-- Note: These policies need to be created in Supabase Dashboard > Storage > Policies
-- or via the Supabase CLI. Here's the SQL equivalent:

-- Allow teachers to upload to their own folder
-- create policy "Teachers can upload to own folder" on storage.objects
-- for insert with check (
--   bucket_id = 'teacher-docs' and 
--   auth.uid()::text = (storage.foldername(name))[1]
-- );

-- Allow teachers to view their own files
-- create policy "Teachers can view own files" on storage.objects
-- for select using (
--   bucket_id = 'teacher-docs' and 
--   auth.uid()::text = (storage.foldername(name))[1]
-- );

-- Allow admins to view all files
-- create policy "Admins can view all files" on storage.objects
-- for select using (
--   bucket_id = 'teacher-docs' and 
--   public.is_admin()
-- );

-- =============================================
-- INITIAL DATA SEEDING
-- =============================================

-- Create default admin user (you'll need to replace with actual admin user ID)
-- insert into public.profiles (id, role, full_name, email)
-- values (
--   'your-admin-user-id-here',
--   'admin',
--   'System Administrator',
--   'admin@nelimaclearning.co.ke'
-- ) on conflict (id) do nothing;
