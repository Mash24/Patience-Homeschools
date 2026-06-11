-- Phase 4: Newsletter, platform settings (no payments)
-- Run after phase-3-schema.sql

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz default now()
);

create table if not exists public.platform_settings (
  id text primary key default 'default',
  settings jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);

insert into public.platform_settings (id, settings)
values (
  'default',
  '{
    "email_templates": {
      "approval": "Your teacher application has been approved!",
      "rejection": "Your teacher application was not approved.",
      "assignment": "You have been assigned a new student."
    },
    "auto_approval_rules": {
      "enabled": false,
      "min_experience": 2,
      "required_documents": ["degree", "id"]
    },
    "notification_settings": {
      "email_enabled": true,
      "in_app_enabled": true,
      "admin_alerts": true
    },
    "platform_settings": {
      "site_name": "Nelimac Learning",
      "site_url": "https://nelimaclearning.co.ke",
      "support_email": "support@nelimaclearning.co.ke",
      "max_file_size": 10
    }
  }'::jsonb
)
on conflict (id) do nothing;

alter table public.newsletter_subscribers enable row level security;
alter table public.platform_settings enable row level security;

drop policy if exists "admin reads newsletter" on public.newsletter_subscribers;
create policy "admin reads newsletter"
on public.newsletter_subscribers for select using (public.is_admin());

drop policy if exists "public subscribes newsletter" on public.newsletter_subscribers;
create policy "public subscribes newsletter"
on public.newsletter_subscribers for insert with check (true);

drop policy if exists "admin manages settings" on public.platform_settings;
create policy "admin manages settings"
on public.platform_settings for all using (public.is_admin());

drop policy if exists "public reads settings meta" on public.platform_settings;
create policy "public reads settings meta"
on public.platform_settings for select using (true);
