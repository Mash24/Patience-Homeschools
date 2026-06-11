-- Phase 1: Allow parents to read their own leads by email
-- Run in Supabase SQL Editor after main schema

create policy if not exists "parent can read own leads"
on parent_leads for select
to authenticated
using (
  email = (select email from auth.users where id = auth.uid())
);
