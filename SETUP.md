# Christie's Golf Ranch — Setup & Handoff

Next.js site + Supabase backend (CMS, CRM, events calendar). Deployed on Vercel.

## What's already done
- **Supabase project** `christies-golf-ranch` (ref `baodiunvfmmglvqfjzca`) — created,
  schema applied, content + events seeded. Tables: `content_blocks`, `events`, `contacts`.
- **Code** — full site rebuilt; admin at `/admin`; build passes (`npm run build`).

## Remaining steps to go live

### 1. Set environment variables in Vercel
Project: **christies-golf-ranch** (team *Chase's projects*). Add these for
Production + Preview (Settings → Environment Variables):

```
NEXT_PUBLIC_SUPABASE_URL=https://baodiunvfmmglvqfjzca.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhb2RpdW52Zm1tZ2x2cWZqemNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzNDQ5MDksImV4cCI6MjA5NzkyMDkwOX0.D5LVg4xAIydPXChQ91pfvej_Gc9Yr8SY2mSNLOq0l58
NEXT_PUBLIC_SITE_URL=https://christiesgolfranch.com
```
(The anon key is public by design — safe to expose.)

**For the posting engine** (Social & Email Posts in the admin), also add:

```
SUPABASE_SERVICE_ROLE_KEY=   ← Supabase dashboard → Settings → API → service_role
CRON_SECRET=75636dc7c232f34fa6454764e5ee007b42a665e382a9a8d2
RESEND_API_KEY=              ← resend.com, after verifying the sending domain
RESEND_FROM=Christie's Golf Ranch <hello@christiesgolfranch.com>
META_PAGE_ID=                ← when the Meta app is approved
META_PAGE_ACCESS_TOKEN=      ← long-lived Page token
META_IG_USER_ID=             ← IG Business account linked to the Page
```

The `CRON_SECRET` value above must stay in sync with the Supabase pg_cron job
`dispatch-posts`, which calls `/api/dispatch` every 5 minutes. Channels whose
keys are missing fail gracefully with a "not connected yet" note in the post's
send report — email and Meta can be lit up independently, whenever their
credentials arrive.

### 2. Create the two admin logins
Supabase Dashboard → **Authentication → Users → Add user** (create with a password,
mark email confirmed). Suggested:
- `christiesgolfranch@gmail.com` (Jeff)
- `chasevandiver@gmail.com` (Chase)

They sign in at `/admin`. (Email signups are *not* open — only users added here can log in.)

### 3. Deploy
Push to the connected branch → Vercel builds a **preview**. Review it, then promote to
production / point the `christiesgolfranch.com` domain at it.

## Day-to-day for Jeff
- Go to **christiesgolfranch.com/admin**, sign in.
- **Website Text & Photos** — edit any wording or upload photos, press *Save changes*.
  Updates appear on the site within ~1 minute.
- **Events Calendar** — add/edit/remove events. Recurring ones fill their own dates.
- **Email List** — see everyone who signed up; *Download list (CSV)*.

## Notes / things to confirm
- The **men's group** day/time and **junior camp** dates are best-guess placeholders —
  fix them under Events.
- Photos: the site currently shows tasteful placeholders until Jeff uploads real photos.

## Local development
```
npm install
cp .env.example .env.local   # fill in the values above
npm run dev
```

## Database migrations
`supabase/migrations/*.sql` — already applied to the project. Re-runnable
(`on conflict do nothing`), so they won't overwrite edits made in the admin.
