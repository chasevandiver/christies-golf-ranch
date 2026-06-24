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
    // schema.org openingHours shorthand
    schema: 'Mo-Su 08:00-19:00',
  },

  // --- SEO / schema ---
  priceRange: '$$',
  geo: { latitude: 33.3568, longitude: -96.9886 }, // approx — verify before launch

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
  },
} as const;

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
