-- Christie's Golf Ranch — core schema
-- Three tables power the site: content_blocks (CMS copy/images),
-- events (auto-populating calendar), contacts (CRM email capture).

-- ---------------------------------------------------------------------------
-- content_blocks: every editable piece of text/image on the public site.
-- The admin renders a friendly form grouped by `section`, labeled by `label`.
-- ---------------------------------------------------------------------------
create table if not exists public.content_blocks (
  id         uuid primary key default gen_random_uuid(),
  key        text not null unique,                 -- machine key, e.g. 'hero.headline'
  section    text not null,                         -- friendly group, e.g. 'Home — Hero'
  label      text not null,                         -- friendly field label
  help       text,                                  -- optional hint shown in admin
  type       text not null default 'text'
             check (type in ('text','textarea','image','url')),
  value      text,                                  -- the actual content
  sort       integer not null default 0,            -- ordering within a section
  updated_at timestamptz not null default now()
);
create index if not exists content_blocks_section_idx on public.content_blocks (section, sort);

-- ---------------------------------------------------------------------------
-- events: one row per event. Recurring events auto-generate future dates in
-- application code (lib/events.ts), so staff never re-enter dates.
-- ---------------------------------------------------------------------------
create table if not exists public.events (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  description   text,
  start_date    date not null,                      -- first / anchor date
  start_time    text,                               -- free text, e.g. '8:00 AM'
  end_time      text,
  location      text default 'Christie''s Golf Ranch',
  price         text,                               -- free text, e.g. '$25'
  recurrence    text not null default 'none'
                check (recurrence in ('none','weekly','monthly-last')),
  recurrence_dow integer
                check (recurrence_dow between 0 and 6), -- 0=Sun .. 6=Sat
  is_published  boolean not null default true,
  sort          integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists events_published_idx on public.events (is_published, start_date);

-- ---------------------------------------------------------------------------
-- contacts: CRM email capture. Consent stored at point of collection.
-- ---------------------------------------------------------------------------
create table if not exists public.contacts (
  id           uuid primary key default gen_random_uuid(),
  email        text not null,
  name         text,
  phone        text,
  birthday     date,                                -- optional ("free bucket on your birthday")
  source       text not null default 'website',
  consent      boolean not null default false,
  consent_at   timestamptz,
  unsubscribed boolean not null default false,
  created_at   timestamptz not null default now()
);
create unique index if not exists contacts_email_unique on public.contacts (lower(email));

-- keep updated_at fresh
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists content_blocks_touch on public.content_blocks;
create trigger content_blocks_touch before update on public.content_blocks
  for each row execute function public.touch_updated_at();

drop trigger if exists events_touch on public.events;
create trigger events_touch before update on public.events
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
--   public (anon): read content + events; insert a contact (signup only).
--   authenticated (admin): full control of content/events/contacts.
-- ---------------------------------------------------------------------------
alter table public.content_blocks enable row level security;
alter table public.events         enable row level security;
alter table public.contacts       enable row level security;

-- content_blocks
drop policy if exists content_public_read on public.content_blocks;
create policy content_public_read on public.content_blocks
  for select to anon, authenticated using (true);
drop policy if exists content_admin_write on public.content_blocks;
create policy content_admin_write on public.content_blocks
  for all to authenticated using (true) with check (true);

-- events
drop policy if exists events_public_read on public.events;
create policy events_public_read on public.events
  for select to anon, authenticated using (true);
drop policy if exists events_admin_write on public.events;
create policy events_admin_write on public.events
  for all to authenticated using (true) with check (true);

-- contacts: anon may only INSERT (sign up). Reading/editing is admin-only.
drop policy if exists contacts_public_insert on public.contacts;
create policy contacts_public_insert on public.contacts
  for insert to anon, authenticated with check (true);
drop policy if exists contacts_admin_read on public.contacts;
create policy contacts_admin_read on public.contacts
  for select to authenticated using (true);
drop policy if exists contacts_admin_update on public.contacts;
create policy contacts_admin_update on public.contacts
  for update to authenticated using (true) with check (true);
drop policy if exists contacts_admin_delete on public.contacts;
create policy contacts_admin_delete on public.contacts
  for delete to authenticated using (true);
