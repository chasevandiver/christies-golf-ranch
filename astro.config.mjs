// @ts-check
import { defineConfig } from 'astro/config';

// Static output — Vercel auto-detects Astro and serves the built site.
// Phase 2 will add the @astrojs/vercel adapter for serverless functions
// (Clover checkout sessions + webhooks). Keep it static until then.
export default defineConfig({
  site: 'https://christiesgolfranch.com',
});
