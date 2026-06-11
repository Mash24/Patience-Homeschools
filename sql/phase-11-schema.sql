-- Phase 11: Reporting & matching performance indexes (no payments)
-- Run after phase-10-schema.sql

create index if not exists idx_parent_leads_status
on public.parent_leads(status, created_at desc);

create index if not exists idx_assignments_status_created
on public.assignments(status, created_at desc);

create index if not exists idx_teachers_status_subjects
on public.teachers(status)
where status = 'approved';
