# Christie's Golf Ranch — Build Status

**Single source of truth for what's done and what's left.** Claude Code: check this before
starting work, and update the boxes as you complete items. Pairs with
`christies-claude-code-handoff.md` (the original detailed spec).

**Legend:** `[x]` done · `[ ]` to do · `[~]` in progress · `[!]` blocked (see note)

**Site:** christies-golf-ranch.vercel.app · **Stack:** Next.js (App Router) · Vercel · Supabase ·
Meta Graph API · Resend
**Last updated:** July 15, 2026

> Stack note: the site began as an Astro scaffold, then was rebuilt as a Next.js app so the
> public site, admin CMS, and CRM live in one deploy. The Astro branch's extras (SEO infra,
> FAQ, admin-editable Clover lesson links) were ported over. The public site is a single
> long-scroll page with anchor nav plus `/admin`.

---

## Decisions

### Locked

- **Brand color: Fairway Green.** Replaces brown as the primary. Keep everything else in
  the brand system — Bitter type, the branding-iron seal, the fence-line motif —
  unchanged. Only the color changes; this is not a redesign. Tokens (applied in
  `app/globals.css`):

  ```css
  --base:       #F6F2E8;  /* canvas / page background */
  --surface:    #FCFAF4;  /* cards, panels */
  --ink:        #23281F;  /* body text */
  --ink-soft:   #5A6152;  /* secondary text */
  --brand:      #3A5A40;  /* fairway green — primary */
  --brand-deep: #2A4430;  /* headers, dark bars */
  --brand-tint: #E7EEE4;  /* selected/active fills */
  --accent:     #C7913C;  /* golden-hour wheat — accent only */
  --line:       #DED6C4;  /* borders, dividers */
  ```

### Still pending

- Confirm ad geo-radius / target cities with Jeff (gates Phase 5).
- Confirm email service: Resend to start (revisit ESP at Phase 6).

---

## Phase 1 — Get it live

- [x] Site scaffolded and deployed to Vercel (Next.js rebuild; public page + `/admin`)
- [x] Brand system applied (seal, fence-line motif, Bitter type)
- [x] **Apply Fairway Green palette** — swapped brown for green across the public site and
      admin (`app/globals.css`, `app/admin/admin.css`, seal/fence/photo SVGs, theme-color);
      Bitter, the seal, and the fence-line motif unchanged
- [!] Integrate real photography/video — **blocked on Jeff & Susan's media drop**
      (admin image-upload slots are ready; placeholders auto-swap when images are uploaded)
- [~] Replace placeholder testimonials — garbled placeholders removed; the reviews section
      stays hidden until genuine reviews are entered in the admin
- [~] Fix the unrendered Google Map embed — fresh embed is in the code; verify it renders
      on production (can't be checked from the build sandbox)
- [~] Clover booking integration — "Book & Pay" buttons wired to admin-editable Payment
      Link URLs (`lessons.pN.checkout` content blocks); **URLs still empty — needs the
      actual Clover Payment Links from the merchant dashboard**
- [x] Basic email capture field → Supabase `contacts` (with consent flag + timestamp)

**Done when:** site is public, no placeholders, map renders, visitor can book + join the list.

---

## Phase 2 — Get found (local search)

- [x] Schema markup (GolfCourse JSON-LD: address, hours, geo, sameAs)
- [x] Sitemap + robots (`app/sitemap.ts`, `app/robots.ts`)
- [x] Title/meta targeting local queries (single public page; unique title + description)
- [~] Open Graph cards done; explicit Twitter card tags not yet added
- [ ] Google Business Profile claimed + optimized
- [ ] NAP consistency cleanup (site / Yelp / Yahoo / Chamber currently disagree)
- [ ] Review consolidation → drive new reviews to Google

**Done when:** consistent NAP everywhere, GBP live, schema validates, review path exists.

---

## Phase 3 — The control room (CRM + admin) — foundation for Phase 4

- [x] Supabase project: Postgres + Auth + Storage (migrations `0001`–`0005`)
- [x] Subscribers table — implemented as `contacts` (email, name, source, consent, created_at)
- [x] Site content — implemented as `content_blocks` (~138 editable blocks: hours, events
      copy, pricing, etc.)
- [~] Supabase Auth — staff logins (`/admin/login` + middleware built; **no users created
      yet** — add Jeff + Chase in Supabase dashboard → Authentication → Users)
- [x] Admin dashboard shell (plain-language, big buttons)
- [x] Content editors: hours / events / pricing / images
- [x] Email list view + one-click CSV export (the "CRM", `/admin/contacts`)
- [ ] QR code (front desk) → mobile signup → `contacts`
- [ ] Website email pop-up → `contacts` (inline signup section exists; pop-up not built)
- [ ] Verify sending domain (SPF/DKIM) — do now, gates Phase 4/6 email

**Done when:** staff can log in, edit hours, add an event, and export the list unaided.

---

## Phase 4 — Native posting engine (headline build)

- [x] `posts` table (body, media_url, channels[], scheduled_at, status, result_log)
      — migration `0006`, RLS admin-only
- [x] Compose screen (message + media + channel checkboxes + when) — `/admin/posts/new`
- [x] Preview screen (renders FB / IG / email before sending) — built into the composer;
      nothing sends without passing through it
- [x] Queue view (upcoming + sent; edit/cancel until it fires; failed posts show
      per-channel errors and can be retried) — `/admin/posts`
- [x] Cron → `/api/dispatch` (idempotent, no double-sends) — driven by Supabase pg_cron
      (`dispatch-posts`, every 5 min) instead of Vercel Cron, which is daily-only on the
      Hobby plan; posts are atomically claimed and per-channel results logged so retries
      never re-send a channel that succeeded
- [~] Facebook + Instagram via Meta Graph API — **code shipped** (`lib/social.ts`), lights
      up when `META_PAGE_ID` / `META_PAGE_ACCESS_TOKEN` / `META_IG_USER_ID` land in Vercel;
      **still blocked on Meta app + long-lived Page token + app review; IG must be a
      Business account linked to the Page**
- [~] Email dispatch via Resend to subscribers — **code shipped** (`lib/email.ts`, CAN-SPAM
      footer + per-contact unsubscribe links via `/api/unsubscribe`); needs
      `RESEND_API_KEY` / `RESEND_FROM` + verified sending domain
- [x] Retiree-simple UI pass (numbered steps, plain verbs, preview-before-send; sidebar
      admin with one section per page)

**Done when:** staff schedule one post to all three channels in <1 min; it fires at the set
time; scheduled posts are editable/cancelable.

---

## Phase 5 — Paid acquisition (ads)

- [ ] Google Search campaigns (local high-intent queries)
- [ ] Facebook / Instagram ad campaigns — audience widened past avid golfers (families,
      beginners, date night)
- [ ] Geo-target nearby cities
- [ ] Conversion landing pages + tracking (GA4, Meta pixel, Google conversion tags)

**Done when:** campaigns live, geo-scoped, tracked to booking/signup.

---

## Phase 6 — Newsletter & signatures (later)

- [ ] Monthly newsletter (event dates + Jeff's tip of the month)
- [ ] "Open now · closes around [sunset] today" live indicator (Pilot Point sunset)
- [ ] First-timer walkthrough
- [ ] FAQ schema

**Done when:** newsletter sends on a monthly cadence; sunset indicator live.

---

## Operational setup (dashboards, not code — blocks the phases above)

- [ ] Create the two admin users in Supabase Auth (Jeff + Chase) — nothing admin works
      until this exists
- [ ] Vercel env vars: `NEXT_PUBLIC_*` trio + `SUPABASE_SERVICE_ROLE_KEY` + `CRON_SECRET`
      (values in `SETUP.md`) — gates the CMS content on production and the post dispatcher
- [ ] Merge the sidebar-admin / posting-engine branch to `main` after preview review
- [ ] Point `christiesgolfranch.com` at the Vercel project (currently on .vercel.app)
- [ ] Clover: generate the 4 lesson Payment Links, paste into Admin → Lessons
- [ ] Resend: verify sending domain (SPF/DKIM), then set `RESEND_API_KEY` / `RESEND_FROM`
- [ ] Meta: developer app + link IG Business account to the FB Page + long-lived Page
      token + app review → set the three `META_*` env vars
- [ ] Verify the Google Map embed renders on production

---

## Backlog — agreed or discussed, not yet scheduled

- [ ] **Email-capture pop-up** on first visit — appears once per visitor (cookie),
      shows after a short delay, consent checkbox, closes politely; feeds `contacts`
      (companion to the Phase 3 checklist item)
- [ ] QR code for the front desk → `/join` mobile signup page (Phase 3 item; the page
      needs building, then print the code)
- [ ] Automated post-visit review requests with the GBP "write a review" deep link,
      deduped per contact (handoff Phase 3) — depends on Clover webhooks for visit data;
      same public link for everyone, no gating, no incentives
- [ ] Birthday "free bucket" email — `contacts.birthday` column already exists; monthly
      automated send via the posting pipeline
- [ ] Memberships + junior-camp checkout via Clover Hosted Checkout with webhooks
      (handoff Phase 2; lessons-via-Payment-Links is the v1)
- [ ] Newsletter automation (Phase 6) — monthly assembly of upcoming events + Jeff's tip,
      reusing the posting engine's email channel
- [ ] "Open now · closes around [sunset] today" live badge (Phase 6; a version existed on
      the Astro branch — port it)
- [ ] First-timer walkthrough section (Phase 6)
- [ ] Twitter card meta tags (small Phase 2 leftover)
- [ ] Marketing asset generator — templated, correctly-sized images per channel from one
      headline + photo (handoff Phase 4)
- [ ] Weather-triggered promo *flagging* (suggest, never auto-send — handoff Phase 4)
- [ ] SMS via Twilio, opt-in only (TCPA) — optional, higher review conversion
- [ ] GA4 + Meta pixel + conversion tracking (gates Phase 5 ads)

---

## Guardrails (do not build)

- No auto-generated posts that bypass Jeff's approval — his voice is the asset.
- No backend complexity that breaks retiree usability — simplicity is the veto.
- No ads targeted only at "golfers" — everyone's welcome is the wedge.
- No Topgolf-style tech/entertainment features — win on findability + authenticity.
