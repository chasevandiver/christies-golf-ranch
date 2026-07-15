-- Christie's Golf Ranch — native posting engine (BUILDSTATUS Phase 4)
-- One row per post Jeff writes. The dispatcher (/api/dispatch, run by pg_cron
-- every 5 minutes) sends due posts to their channels and records the outcome
-- per channel in result_log, so a re-run never double-sends.

create table if not exists public.posts (
  id            uuid primary key default gen_random_uuid(),
  body          text not null,
  media_url     text,                                -- public image URL (required for Instagram)
  channels      text[] not null default '{}',        -- any of: 'facebook','instagram','email'
  email_subject text,                                -- subject line when 'email' is a channel
  scheduled_at  timestamptz not null,
  status        text not null default 'scheduled'
                check (status in ('scheduled','sending','sent','failed','canceled')),
  result_log    jsonb not null default '{}'::jsonb,  -- { channel: {ok, detail, at} }
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists posts_due_idx on public.posts (status, scheduled_at);

drop trigger if exists posts_touch on public.posts;
create trigger posts_touch before update on public.posts
  for each row execute function public.touch_updated_at();

-- Admin-only: the public site never reads posts; the dispatcher uses the
-- service role (bypasses RLS). No anon policies on purpose.
alter table public.posts enable row level security;
drop policy if exists posts_admin_all on public.posts;
create policy posts_admin_all on public.posts
  for all to authenticated using (true) with check (true);

-- Unsubscribe tokens for CAN-SPAM one-click unsubscribe links in campaign
-- emails (/api/unsubscribe?id=...&t=...).
alter table public.contacts
  add column if not exists unsubscribe_token uuid not null default gen_random_uuid();
