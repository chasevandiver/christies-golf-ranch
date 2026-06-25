/**
 * Christie's Golf Ranch — single source of truth for NAP and site config.
 *
 * NAP (Name / Address / Phone / hours) lives HERE and nowhere else. Every page,
 * the header, the footer, and the LocalBusiness JSON-LD all read from this file
 * so the business details can never drift. Pulled from the approved design,
 * christies-golf-ranch-texas.html. Confirm hours/pricing with Chase before launch.
 */

export const site = {
  name: "Christie's Golf Ranch",
  legalName: "Christie's Golf Ranch",
  tagline: 'Pilot Point · Texas',
  established: 2008,
  url: 'https://christiesgolfranch.com',

  // --- Contact ---
  phone: '(214) 317-1488',
  phoneHref: 'tel:2143171488',
  phoneE164: '+1-214-317-1488',
  email: 'christiesgolfranch@gmail.com',

  // --- Address ---
  address: {
    street: '920 US Highway 377',
    locality: 'Pilot Point',
    region: 'TX',
    regionName: 'Texas',
    postalCode: '76258',
    country: 'US',
  },

  // --- Hours ---
  // Range is open daily; the par-3 course opens for events & monthly Play Days.
  hours: {
    rangeHuman: 'Every day, 8am till dark',
    courseHuman: 'Special events & monthly Play Days',
    // schema.org openingHours shorthand. Closing is sunset ("dark"); 20:00 is a
    // schema-friendly approximation — the live "Open now" badge uses real sunset.
    schema: 'Mo-Su 08:00-20:00',
    opens: '08:00',
    closesApprox: '20:00',
  },

  // IANA timezone — used by the live "Open now" sunset badge and Play Day countdown.
  timezone: 'America/Chicago',

  // --- SEO / schema ---
  priceRange: '$$',
  geo: { latitude: 33.3568, longitude: -96.9886 }, // approx — verify before launch
  // Nearby towns for local-search areaServed. Pilot Point is home; the rest are
  // within the realistic drive radius for a North Texas grass range.
  areaServed: ['Pilot Point', 'Aubrey', 'Denton', 'Cross Roads', 'Krugerville', 'Tioga', 'Little Elm'],

  // --- Social / sameAs (also used for footer icons) ---
  social: {
    facebook: 'https://www.facebook.com/1419209578311681',
    instagram: 'https://www.instagram.com/christiesgolfranch',
    yelp: 'https://www.yelp.com/biz/GSfhPbVG0eBEn4cgxnV5pg',
  },

  // External links used in CTAs until Phase 2 (Clover) is wired.
  links: {
    juniorCampForm:
      'https://docs.google.com/forms/d/1ZBeZ7lZ-l9Z81URQeMBAvZqUVKW-TpYJ_AMKosipxIg',
    map: 'https://maps.google.com/maps?q=920%20US%20Highway%20377%2C%20Pilot%20Point%2C%20TX%2076258&t=&z=13&ie=UTF8&iwloc=&output=embed',
    // Turn-by-turn directions (used by the sticky mobile action bar). Opens the
    // device's default maps app to navigate to the ranch.
    directions:
      'https://www.google.com/maps/dir/?api=1&destination=920%20US%20Highway%20377%2C%20Pilot%20Point%2C%20TX%2076258',
  },
} as const;

/**
 * Lesson packages → Clover Payment Links (ticket 1.1).
 *
 * Paste each item's Clover Payment Link URL into `checkout`. Until a URL is
 * filled in, that lesson's CTA falls back to the phone number (see
 * `checkoutHref` below), so nothing ever links to a dead button. Clover handles
 * all PCI — we only ever store/serve the hosted link, never card data.
 */
export const lessonPackages = [
  { id: 'single', label: 'Single hour', price: '$95', note: 'One focused hour — best way to start.', checkout: '' },
  { id: 'pack3', label: '3-lesson package', price: '$270', note: '$90 each — lock in a change.', checkout: '' },
  { id: 'pack5', label: '5-lesson package', price: '$425', note: '$85 each — full progression.', checkout: '' },
  { id: 'pack7', label: '7-lesson package', price: '$560', note: '$80 each — best per-lesson value.', checkout: '' },
] as const;

/** Resolve a lesson's CTA: its Clover link if set, otherwise call to book. */
export function checkoutHref(pkg: { checkout: string }): string {
  return pkg.checkout || site.phoneHref;
}

/** Primary navigation — rendered in the header and the mobile drawer. */
export const nav: { label: string; href: string }[] = [
  { label: 'The Ranch', href: '/the-ranch' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Instruction', href: '/instruction' },
  { label: 'Memberships', href: '/memberships' },
  { label: 'Junior Camp', href: '/junior-camp' },
  { label: 'Our Story', href: '/our-story' },
  { label: 'Visit', href: '/visit' },
];

/** Convenience: full one-line address string. */
export const addressLine = `${site.address.street}, ${site.address.locality}, ${site.address.region} ${site.address.postalCode}`;
