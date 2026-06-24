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

---

## Implementation notes (this repo)

- Built with **Astro**, deployed on **Vercel**. Pages live in `src/pages/`,
  shared UI in `src/components/`, the base shell in `src/layouts/Layout.astro`.
- **NAP single source of truth:** `src/config/site.ts`. Address, phone, hours,
  email, socials, and nav all come from here. The LocalBusiness/GolfCourse
  JSON-LD (`src/components/JsonLd.astro`) is generated from this config and
  rendered on every page via the layout. Do not hardcode NAP anywhere else.
- **Design source of truth:** `christies-golf-ranch-texas.html` — palette,
  branding-iron seal, Bitter/Mulish type, fence-line motif, real pricing/content.
  Global styles extracted to `src/styles/global.css`.
- **Photos** are styled SVG placeholders for now. Every slot is marked with a
  `<!-- PHOTO: ... -->` comment so real images can be dropped in later.
- **Payments are NOT wired yet** (Phase 2). Membership/lesson/camp CTAs point at
  the phone number or existing Google Form. Leave clear hooks for Clover.
