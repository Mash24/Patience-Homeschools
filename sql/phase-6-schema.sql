-- Phase 6: Parent lead self-service RLS (if not already applied)
-- Run after phase-5-schema.sql

drop policy if exists "parent can read own leads" on public.parent_leads;
create policy "parent can read own leads"
on public.parent_leads for select
to authenticated
using (
  lower(email) = lower((select email from auth.users where id = auth.uid()))
);
