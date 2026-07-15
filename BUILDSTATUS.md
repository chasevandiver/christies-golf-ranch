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
- [x] Supabase Auth — staff logins (`/admin/login`, session middleware)
- [x] Admin dashboard shell (plain-language, big buttons)
- [x] Content editors: hours / events / pricing / images
- [x] Email list view + one-click CSV export (the "CRM", `/admin/contacts`)
- [ ] QR code (front desk) → mobile signup → `contacts`
- [ ] Website email pop-up → `contacts` (inline signup section exists; pop-up not built)
- [ ] Verify sending domain (SPF/DKIM) — do now, gates Phase 4/6 email

**Done when:** staff can log in, edit hours, add an event, and export the list unaided.

---

## Phase 4 — Native posting engine (headline build)

- [ ] `posts` table (body, media_url, channels[], scheduled_at, status, result_log)
- [ ] Compose screen (message + media + channel checkboxes + when)
- [ ] Preview screen (renders FB / IG / email before sending)
- [ ] Queue view (upcoming + sent; edit/cancel until it fires)
- [ ] Vercel Cron → `/api/dispatch` (idempotent, no double-sends)
- [!] Facebook + Instagram via Meta Graph API — **blocked on Meta app + long-lived Page
      token + app review; IG must be a Business account linked to the Page. Start during
      Phase 3.**
- [ ] Email dispatch via Resend to subscribers
- [ ] Retiree-simple UI pass (plain verbs, one decision/screen, preview-before-send)

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

## Guardrails (do not build)

- No auto-generated posts that bypass Jeff's approval — his voice is the asset.
- No backend complexity that breaks retiree usability — simplicity is the veto.
- No ads targeted only at "golfers" — everyone's welcome is the wedge.
- No Topgolf-style tech/entertainment features — win on findability + authenticity.
