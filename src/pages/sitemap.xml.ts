import type { APIRoute } from 'astro';
import { site } from '../config/site';

/**
 * sitemap.xml (ticket 2.4) — lists the real, indexable pages on the production
 * domain. The /styles/* exploration drafts are intentionally excluded (they're
 * noindex) so they never enter the index. Canonicals come from the production
 * `site` URL in astro.config, not the vercel.app preview host.
 */
const paths = [
  '/',
  '/the-ranch',
  '/pricing',
  '/instruction',
  '/memberships',
  '/junior-camp',
  '/our-story',
  '/visit',
];

export const GET: APIRoute = () => {
  const today = new Date().toISOString().split('T')[0];
  const urls = paths
    .map((p) => {
      const loc = new URL(p, site.url).href;
      const priority = p === '/' ? '1.0' : '0.8';
      return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${priority}</priority>\n  </url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
