# Christie's Golf Ranch — Claude Code Build Handoff

**Owner:** Chase (pro bono) · **Facility:** Christie's Golf Ranch, Pilot Point, TX
**Purpose of this doc:** A complete, ordered build spec to hand to Claude Code. Drop it in the repo root and point Claude Code at it. Each phase is independently shippable.

---

## How to use this doc

1. Create the repo (Phase 0), commit this file as `PLAN.md` and the `CLAUDE.md` block at the bottom as `CLAUDE.md`.
2. Work phases **in order** — each one depends on the prior. Don't start Phase 3 before Clover is live.
3. Before each phase, Claude Code should read the "What it needs from Chase" list and stop to collect any missing credentials/decisions rather than scaffolding around them.
4. Anything labeled **[CONTENT IN]** is a slot where copy/strategy comes from Chase or Stelos — Claude Code builds the container, not the marketing voice.

---

## Project context (the non-negotiables)

- **Positioning:** Low-pressure, quick, accessible. Family- and beginner-friendly. This is the competitive moat vs. full golf courses — every page, button, and email should reinforce it, not mimic country-club tone.
- **Prime revenue driver:** Local search (Google Map Pack + Google Business Profile). The website's job is partly to feed organic blue-link rankings via real indexed on-page text; GBP feeds the Map Pack. They are parallel systems, so on-page SEO is **in scope for the build**, not an afterthought.
- **Facility facts to use consistently (NAP must match everywhere):** all-grass driving range + 9-hole par-3 course, 15 acres, 55 grass stations. Offerings: private lessons (Jeff), memberships, junior camps, monthly play day, weekly men's group.
- **Existing site:** GoDaddy single-page builder, being replaced. Known defects to NOT carry over: garbled testimonials, placeholder content, inconsistent hours, NAP inconsistencies across directories.
- **Already built:** `index.html` (homepage) and `range.html` (interior range page) with a shared template, fairway-green / flag-yellow / white palette, breadcrumb nav, page-specific meta descriptions, SEO-targeted copy.

---

## The four workstreams + build order

```
Phase 0  Repo + foundation              (½ day)
Phase 1  Finish the website             ← everything hangs off this
Phase 2  Clover Hosted Checkout         ← can't transact without it
Phase 3  Capture + review/email engine  ← needs Clover webhooks + signup data flowing
Phase 4  Marketing asset pipeline       ← lowest dependency, can run in parallel w/ 3
```

Rationale: the website is the surface that hosts the Clover buttons, the SEO text, and the review links. Payments must exist before automation has anything to react to. Marketing assets depend on nothing structural and can run alongside Phase 3.

---

## Phase 0 — Repo + foundation

**Goal:** A clean repo, deployable, with secrets handling in place.

**Approach:**
- Vercel-hosted project (Chase already uses Vercel for Stelos). Static site + serverless functions in one repo keeps Clover webhooks and the site together.
- Suggested structure:

```
/site            static pages (index.html, range.html, + new pages)
  /assets        css, js, images, shared partials
/api             Vercel serverless functions (Clover sessions, webhooks, cron)
/lib             shared helpers (clover client, supabase client, email)
/emails          email + SMS templates
/db              supabase schema + migrations
CLAUDE.md
PLAN.md          (this file)
.env.example     every required key, no values
```

- `.env.example` documents every secret; real values go in Vercel project env vars, never committed.

**What it needs from Chase:** GitHub repo access, Vercel project (or permission to create one), confirmation of the production domain (christiesgolfranch.com vs. a subdomain during build).

**Done when:** Empty site deploys to a Vercel preview URL; CI/deploy on push works.

---

## Phase 1 — Finish the website

**Goal:** All pages built on the existing shared template, with real indexed SEO text and consistent NAP.

**Pages remaining:** Par-3 Course, Lessons, Memberships, Junior Camps, Our Story, Visit.

**Approach:**
- Reuse the `index.html` / `range.html` template, breadcrumb nav, and per-page meta pattern. Do not redesign — match what exists.
- Each page gets: a unique `<title>`, a unique meta description, an H1 with the page's primary query, and **genuine indexable body copy** (not just hero images). Target real local queries, e.g. "junior golf camp near Denton," "golf lessons Pilot Point," "driving range Pilot Point TX."
- Add **LocalBusiness structured data (JSON-LD)** sitewide: name, address, phone, hours, geo, price range, sameAs links to GBP + social. This is the single highest-leverage SEO addition for a foot-traffic business.
- **NAP consistency:** define name/address/phone/hours **once** in a shared config or partial, render it on every page and into the JSON-LD. One source of truth so it can't drift.
- The Memberships, Lessons, and Junior Camps pages need a **"Sign up" / "Register" CTA placeholder** wired to Phase 2 (leave a clearly-marked hook so Phase 2 just drops in the Clover button).
- Fix-forward the existing defects: real testimonials (or remove the section until Chase supplies them), real hours, no Lorem-style placeholders.

**[CONTENT IN]:** Page body copy and offer descriptions. Claude Code can draft serviceable first-pass SEO copy, but final voice/offers should come from Chase or Stelos. Mark drafted copy with a `<!-- DRAFT: review -->` comment.

**What it needs from Chase:** Confirmed hours, current pricing per offering (even rough), 3–5 real testimonials if available, Jeff's bio for Lessons/Our Story, any photos.

**Done when:** All six pages live, pass a Lighthouse SEO check, JSON-LD validates in Google's Rich Results test, NAP identical across every page.

---

## Phase 2 — Clover payments (Hosted Checkout)

**Goal:** Members, lesson clients, and camp families can pay online from the site.

**Why Hosted Checkout (and not the alternatives):**
- **Payment Links (no-code):** simplest, zero backend — good as a literal fallback, but static and not dynamic per product.
- **Hosted Checkout (CHOSEN):** REST API creates a checkout session, customer is redirected to a Clover-hosted page, then back to the site. Clover handles PCI. Supports redirect URLs (success/fail/incomplete) and **webhooks** — which Phase 3 needs.
- **Hosted iframe:** keeps customer on-site but adds CORS/SDK complexity for marginal benefit here.
- **Full Ecommerce API:** requires independent PCI DSS certification. Out of scope.

**Approach:**
- `/api/create-checkout`: serverless function that calls Clover's **Create checkout** endpoint with the line item(s) for the chosen product (membership tier, lesson package, camp registration), returns the hosted checkout URL, redirects the customer.
- Define products as a small catalog in code/Supabase (name, price, SKU/id, type) so buttons across the site reference the same source.
- Set redirect URLs: success → a `/thank-you` page (which also kicks the welcome email in Phase 3), failure/incomplete → back to the product page with a retry.
- **Memberships = upfront fixed-term packages (e.g., 3-month) charged as one-time Hosted Checkout orders** for v1. Hosted Checkout is built for simple orders, not subscriptions. Recurring renewals are handled **staff-side via Clover's recurring-payment tooling**, not auto-billed through the site in v1. This keeps v1 simple and avoids subscription-API scope.
- Register a **webhook URL** (`/api/clover-webhook`) on the Hosted Checkout config so Phase 3 receives payment/order events.

**What it needs from Chase:**
- A **Clover Global Developer account** + the merchant's **Ecommerce API token (private token + merchantId)** for Hosted Checkout, generated from the Clover Merchant Dashboard. (Two-factor auth must be enabled on the dashboard first.)
- Sandbox credentials for testing before going live.
- Final product list + prices (memberships tiers, lesson packages, camp SKUs).

**Done when:** A test purchase in **sandbox** completes end-to-end (button → Clover page → success redirect → webhook received), then the same in production with one real low-value transaction.

---

## Phase 3 — Capture + review & email engine

**Goal:** Turn real visitors and signups into (a) a clean contact list with consent, (b) automated genuine review requests, and (c) a welcome/nurture email flow.

> **Read the Compliance Guardrails section before building this phase.** Reviews and messaging have hard legal/policy rules.

**Where "people who show up" actually comes from (capture is the bottleneck):**
1. **Online signups** (Phase 2) — email captured at checkout. Highest-quality contacts.
2. **Clover POS transactions** — in-person payments. Capture email/phone via Clover's **digital receipt prompt** at checkout, plus webhook on payment created.
3. **QR codes at the counter and bays** — link to a short opt-in form ("get tips from Jeff + a free bucket on your birthday"). Low-friction list building for cash/walk-in customers who otherwise leave no trace.

**Architecture (uses Chase's existing Supabase + Vercel):**
- **Supabase tables:** `contacts` (email/phone, source, consent flags, consent timestamp), `visits` (linked to Clover events), `messages` (what was sent, when, type), `reviews_requested` (dedupe so nobody gets asked twice).
- **`/api/clover-webhook`:** receives Clover payment/order/checkout events → upsert contact (only if contact info + consent present) → log visit → enqueue the right follow-up.
- **`/api/cron/*` (Vercel Cron):** scheduled jobs that send the post-visit review request (e.g., a few hours after a visit) and step the welcome sequence.
- **Email provider:** Resend or Postmark (transactional + sequences). **SMS (optional, higher review conversion):** Twilio — only to numbers with explicit opt-in.
- **Review request:** sends a message with a **direct Google review deep link** to the GBP "write a review" flow. Send everyone the same public link.

**[CONTENT IN]:** The actual email copy, subject lines, sequence cadence, and review-request wording → from Chase or Stelos. Claude Code builds the templates and the send logic; Stelos fills the voice. Build templates with clear merge-field slots (`{{first_name}}`, `{{review_link}}`, etc.).

**What it needs from Chase:** Email provider account + API key, Twilio account if doing SMS, the Google Business Profile review deep link, decision on send timing, and the actual copy (or a green light to draft placeholder copy marked for review).

**Done when:** A sandbox/test signup flows: webhook → contact stored with consent → welcome email sent → review request fires on schedule with a working Google link → dedupe prevents repeats.

---

## Phase 4 — Marketing asset pipeline

**Goal:** A repeatable way to produce on-brand assets, not one-off files.

**Approach:**
- Build a small **templated asset system**: HTML/SVG templates for the recurring content pillars (Jeff's monthly tips, practice challenges, family/beginner nights, weather-triggered promos, vertical-video title cards) using the site's palette and fonts so everything is visually consistent.
- A simple generator script that takes content (headline, body, image) and outputs sized assets per channel (Instagram square/story, Facebook event, GBP post).
- **Weather-triggered promo hook:** a serverless function that checks forecast and flags good-weather windows for a promo — flagging only; a human approves the send in v1.

**[CONTENT IN]:** Every actual campaign's copy, offers, and calendar → this is Stelos / Chase territory. Claude Code builds the templates and the rendering pipeline; the marketing strategy is the input, not the output. Do **not** have Claude Code invent the content calendar.

**What it needs from Chase:** Brand fonts/logo files, the channel list and target dimensions, weather-promo rules (which conditions trigger what offer).

**Done when:** Feeding one sample tip + image produces correctly-sized, on-brand assets for each channel from a single command.

---

## Consolidated credentials & accounts checklist (collect up front)

| Item | Phase | Notes |
|---|---|---|
| GitHub repo access | 0 | |
| Vercel project | 0 | likely reuse the Stelos account |
| Production domain decision | 0/1 | live domain vs. build subdomain |
| Hours / pricing / Jeff bio / testimonials / photos | 1 | content inputs |
| Clover Global Developer account | 2 | |
| Clover Ecommerce API token (private + merchantId) | 2 | enable 2FA on dashboard first |
| Clover sandbox credentials | 2 | test before live |
| Final product catalog + prices | 2 | memberships, lessons, camps |
| Email provider (Resend/Postmark) API key | 3 | |
| Twilio account | 3 | only if doing SMS |
| Google Business Profile review deep link | 3 | |
| Brand assets (logo, fonts) | 4 | |

---

## Compliance guardrails (do not skip)

**Reviews — these are hard rules, not preferences:**
- Solicit **only genuine reviews from real customers**. No fabricated reviews, ever.
- **No review gating.** Do not screen people by predicted sentiment and route only happy ones to Google — Google explicitly prohibits this. Everyone gets the same public review link. (You can offer a private feedback channel *in addition*, but not as a filter.)
- **No incentivizing positive reviews specifically.** Don't tie a discount to leaving a 5-star review.

**Email/SMS:**
- **Email (CAN-SPAM):** every send needs a working unsubscribe and a physical mailing address. Honor opt-outs promptly.
- **SMS (TCPA):** requires prior express consent before texting. Store consent + timestamp + source. Include opt-out (STOP) handling.
- Capture consent **at the point of collection** (the QR form, the checkout opt-in) and store it in the `contacts` table. No consent flag → no marketing send.

**Payments (PCI):**
- Stick to Hosted Checkout so Clover carries the card data and the PCI burden. Do not build anything that touches raw card numbers.

---

## What stays OUT of Claude Code (the honest division of labor)

Claude Code is the right tool for the **buildable systems**: the website, the Clover wiring, the capture/automation backend, the email-send infrastructure, the asset-rendering pipeline.

It is **not** the right tool for: brand voice, the content calendar, offer strategy, email copy, or which campaigns to run. That work belongs to **Stelos** (your marketing OS) or to a Claude project chat. The plan above leaves explicit `[CONTENT IN]` slots and merge fields so the two halves connect cleanly — Claude Code builds the pipes, Stelos fills them.

If you want, a natural follow-on is to point Stelos at this same goal and have it generate the welcome sequence + first month's calendar to drop into the Phase 3 templates.

---

## CLAUDE.md starter (copy into repo root as `CLAUDE.md`)

```markdown
# Christie's Golf Ranch — project guide for Claude Code

## What this is
Website + payments + lightweight CRM/automation for a family-owned all-grass
driving range and 9-hole par-3 course in Pilot Point, TX.

## Prime directives
- Positioning is low-pressure, quick, accessible, family/beginner-friendly.
  Never write country-club / luxury-golf tone.
- Local search is the main revenue driver. On-page SEO text and LocalBusiness
  JSON-LD are required on every page. NAP comes from one shared source — never
  hardcode address/phone/hours in more than one place.

## Stack
- Static site + Vercel serverless functions, one repo.
- Supabase for contacts/visits/messages.
- Clover Hosted Checkout for payments (Clover handles PCI — never touch raw cards).
- Resend/Postmark for email; Twilio for SMS (opt-in only).

## Hard rules
- No fake reviews, no review gating, no incentivizing positive reviews.
- Email needs unsubscribe + physical address (CAN-SPAM). SMS needs prior
  consent (TCPA). No marketing send without a stored consent flag.
- Secrets live in Vercel env vars. .env.example documents keys with no values.
- Marketing COPY and STRATEGY are inputs from Chase/Stelos, not for Claude Code
  to invent. Build templates with merge fields; mark any draft copy for review.

## Build order
Phase 0 repo → Phase 1 website → Phase 2 Clover → Phase 3 capture/automation →
Phase 4 asset pipeline. Don't start a phase before its dependency ships.

## Before each phase
Read PLAN.md for that phase's "What it needs from Chase" and stop to collect
missing credentials/decisions instead of scaffolding around them.
```

## Suggested first prompt to Claude Code

> Read PLAN.md and CLAUDE.md. We're starting Phase 0 then Phase 1. Set up the
> repo structure, wire Vercel deploy, create .env.example, and build the Visit
> page first using the existing index.html/range.html template — reuse the
> breadcrumb nav and per-page meta pattern exactly. Pull NAP from a single
> shared config and add LocalBusiness JSON-LD. Mark any body copy you draft
> with `<!-- DRAFT: review -->`. Stop and list what you need from me before
> Phase 2.
```
