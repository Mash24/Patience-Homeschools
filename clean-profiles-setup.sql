-- Clean Profiles Table and RLS Policies
-- Run this in Supabase SQL Editor

-- Drop existing profiles table if it exists
drop table if exists public.profiles cascade;

-- Create clean profiles table
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  role text check (role in ('admin','teacher','parent')) default 'parent',
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Drop existing policies if they exist
drop policy if exists "read own profile" on public.profiles;
drop policy if exists "no client role updates" on public.profiles;
drop policy if exists "update own profile" on public.profiles;
drop policy if exists "service role full access" on public.profiles;

-- Users can read only their own profile
create policy "read own profile" on public.profiles
for select to authenticated using (auth.uid() = id);

-- No client role updates (only service role can change roles)
create policy "no client role updates" on public.profiles
for update using (false) with check (false);

-- Service role can do everything (for admin operations)
create policy "service role full access" on public.profiles
for all to service_role using (true) with check (true);

-- Auto-create profile on user signup with role from app_metadata
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, role)
  values (
    new.id, 
    new.email, 
    coalesce(new.raw_app_meta_data->>'role', 'parent')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Drop existing trigger if it exists
drop trigger if exists on_auth_user_created on auth.users;

-- Create trigger for new user signup
create trigger on_auth_user_created
after insert on auth.users for each row execute function public.handle_new_user();

-- Ensure admin profile exists
insert into public.profiles (id, email, role)
values (
  'bd8a254c-5627-4714-bdeb-f394c5a8ead8', 
  'jackmwakano@gmail.com',
  'admin'
)
on conflict (id) do update set 
  role = 'admin',
  email = 'jackmwakano@gmail.com';

-- Verify the admin profile exists
select id, email, role, created_at from public.profiles where role = 'admin';
