-- Phase 7: Document verification indexes
-- Run after phase-6-schema.sql

create index if not exists idx_teacher_documents_pending
on public.teacher_documents(created_at desc)
where verified_at is null and rejection_reason is null;
