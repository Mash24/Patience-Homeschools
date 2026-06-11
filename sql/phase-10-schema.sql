-- Phase 10: Parent onboarding flag (no payments)
-- Run after phase-9-schema.sql

alter table public.profiles
add column if not exists onboarding_completed boolean default false;

create index if not exists idx_profiles_onboarding
on public.profiles(role, onboarding_completed)
where role = 'parent';
