-- Secure RLS Policies for Admin System
-- Run this in Supabase SQL Editor

-- Enable RLS on profiles table
alter table public.profiles enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Users can view own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "read own profile" on public.profiles;
drop policy if exists "no client role updates" on public.profiles;

-- Users can read only their own profile
create policy "read own profile"
on public.profiles for select
to authenticated
using (auth.uid() = id);

-- No one (except service role) can change roles via client
create policy "no client role updates"
on public.profiles for update 
using (false) 
with check (false);

-- Users can update their own profile (except role)
create policy "update own profile"
on public.profiles for update
to authenticated
using (auth.uid() = id)
with check (
  auth.uid() = id 
  and role = (select role from public.profiles where id = auth.uid())
);

-- Service role can do everything (for admin operations)
create policy "service role full access"
on public.profiles for all
to service_role
using (true)
with check (true);

-- Ensure admin profile exists and is readable
-- This will create the admin profile if it doesn't exist
insert into public.profiles (id, role, full_name)
values (
  'bd8a254c-5627-4714-bdeb-f394c5a8ead8', 
  'admin', 
  'System Administrator'
)
on conflict (id) do update set 
  role = 'admin',
  full_name = 'System Administrator';

-- Verify the admin profile exists
select id, role, full_name from public.profiles where role = 'admin';
