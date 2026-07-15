import { getContent, c } from "@/lib/content";
import { getUpcomingEvents } from "@/lib/events";
import SiteHeader from "@/components/SiteHeader";
import RevealInit from "@/components/RevealInit";
import Photo from "@/components/Photo";
import Seal from "@/components/Seal";
import EventsList from "@/components/EventsList";
import SignupForm from "@/components/SignupForm";

export const revalidate = 60; // edits in the admin appear within ~60s

function Check() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

const FEAT_ICONS = [
  <path key="i" d="M12 2v13M12 2l7 2.5L12 7" />,
  <g key="i">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18M3 12h18" />
  </g>,
  <g key="i">
    <path d="M5 18c0-4 3-7 7-7s7 3 7 7" />
    <path d="M3 18h18" />
    <circle cx="12" cy="8" r="2" />
  </g>,
  <g key="i">
    <path d="M2 16c4-6 8 4 12-2s6 2 8-2" />
    <path d="M2 20h20" />
  </g>,
  <path key="i" d="M12 2l3 7 7 .5-5.5 4.5L18 21l-6-4-6 4 1.5-7L2 9.5 9 9z" />,
  <g key="i">
    <path d="M3 9l9-6 9 6v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
    <path d="M9 21v-6h6v6" />
  </g>,
];

export default async function HomePage() {
  const m = await getContent();
  const events = await getUpcomingEvents();

  const phoneTel = c(m, "contact.phone_tel", "2143171488");
  const phoneDisplay = c(m, "contact.phone", "(214) 317-1488");
  const email = c(m, "contact.email", "christiesgolfranch@gmail.com");
  const heroImg = c(m, "hero.image");

  const storyParas = c(m, "about.body").split(/\n{2,}/).filter(Boolean);

  const siteUrl = "https://christiesgolfranch.com";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "GolfCourse",
    "@id": `${siteUrl}/#business`,
    name: "Christie's Golf Ranch",
    description:
      "An all-grass driving range and 9-hole par-3 golf course in Pilot Point, Texas.",
    url: `${siteUrl}/`,
    telephone: "+1-" + phoneTel.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3"),
    email,
    address: {
      "@type": "PostalAddress",
      streetAddress: c(m, "contact.address1", "920 US Highway 377"),
      addressLocality: "Pilot Point",
      addressRegion: "TX",
      postalCode: "76258",
      addressCountry: "US",
    },
    geo: { "@type": "GeoCoordinates", latitude: 33.3568, longitude: -96.9886 },
    hasMap:
      "https://www.google.com/maps/dir/?api=1&destination=920%20US%20Highway%20377%2C%20Pilot%20Point%2C%20TX%2076258",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "08:00",
      closes: "20:00",
    },
    areaServed: ["Pilot Point", "Aubrey", "Denton", "Cross Roads", "Krugerville", "Tioga", "Little Elm"].map(
      (name) => ({ "@type": "City", name })
    ),
    priceRange: "$$",
    sameAs: [
      "https://www.facebook.com/1419209578311681",
      "https://www.instagram.com/christiesgolfranch",
      "https://www.yelp.com/biz/GSfhPbVG0eBEn4cgxnV5pg",
    ],
  };

  const reviews = [1, 2, 3]
    .map((i) => ({ text: c(m, `review.${i}.text`), who: c(m, `review.${i}.who`) }))
    .filter((r) => r.text);

  const faqs = [1, 2, 3, 4, 5]
    .map((i) => ({ q: c(m, `faq.q${i}`), a: c(m, `faq.a${i}`) }))
    .filter((f) => f.q && f.a);
  const faqLd = faqs.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
    : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {faqLd ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      ) : null}
      <RevealInit />

      <div className="ribbon" dangerouslySetInnerHTML={{ __html: ribbonHtml(c(m, "ribbon.text")) }} />

      <SiteHeader phoneDisplay={phoneDisplay} phoneTel={phoneTel} />

      {/* HERO */}
      <section className={`hero${heroImg ? " has-photo" : ""}`} id="top" style={heroImg ? { backgroundImage: `url(${heroImg})` } : undefined}>
        <div className="hero-glow" />
        <svg className="hero-fence" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
          <g stroke="#1B2B1F" strokeWidth="6">
            {[60, 220, 380, 540, 700, 860, 1020, 1180, 1340].map((x) => (
              <line key={x} x1={x} y1="38" x2={x} y2="120" />
            ))}
          </g>
          <g stroke="#1B2B1F" strokeWidth="5">
            <line x1="0" y1="60" x2="1440" y2="56" />
            <line x1="0" y1="84" x2="1440" y2="80" />
          </g>
        </svg>
        <div className="hero-inner">
          <div>
            <span className="kicker">{c(m, "hero.kicker", "Pilot Point, Texas · Since 2008")}</span>
            <h1>{c(m, "hero.headline", "All grass. All welcome.")}</h1>
            <p className="lede">{c(m, "hero.lede")}</p>
            <div className="hero-actions">
              <a className="btn btn-brass btn-lg" href="#pricing">
                {c(m, "hero.cta_primary", "See Pricing")}
              </a>
              <a className="btn btn-outline btn-lg" href="#visit">
                {c(m, "hero.cta_secondary", "Hours & Directions")}
              </a>
            </div>
          </div>
          <Seal />
        </div>
        <div className="hero-stats">
          {[1, 2, 3, 4].map((i) => (
            <div className="stat" key={i}>
              <div className="num">{c(m, `stat.${i}.num`)}</div>
              <div className="lbl">{c(m, `stat.${i}.label`)}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section className="section" id="about">
        <div className="wrap about-grid">
          <div className="about-copy reveal">
            <span className="eyebrow">{c(m, "about.eyebrow", "Our Story")}</span>
            <h2>{c(m, "about.heading")}</h2>
            {storyParas.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            {c(m, "about.sig") ? <p className="sig">{c(m, "about.sig")}</p> : null}
          </div>
          <Photo url={c(m, "about.image")} tag="the range at first light" variant="range" className="reveal" />
        </div>
      </section>

      {/* FACILITY */}
      <section className="section on-dark" id="range">
        <div className="wrap">
          <div className="reveal">
            <span className="eyebrow">{c(m, "facility.eyebrow", "The Facility")}</span>
            <h2>{c(m, "facility.heading")}</h2>
            <p className="intro">{c(m, "facility.intro")}</p>
          </div>
          <div className="feat-grid reveal">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div className="feat" key={i}>
                <div className="ic">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    {FEAT_ICONS[i - 1]}
                  </svg>
                </div>
                <h3>{c(m, `feat.${i}.title`)}</h3>
                <p>{c(m, `feat.${i}.body`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="section" id="pricing">
        <div className="wrap">
          <div className="reveal">
            <span className="eyebrow">{c(m, "pricing.eyebrow", "Pricing & Memberships")}</span>
            <h2>{c(m, "pricing.heading")}</h2>
            <p className="intro">{c(m, "pricing.intro")}</p>
          </div>

          {/* Range */}
          <div className="price-band reveal">
            <div className="band-head">
              <h3>{c(m, "range.head", "At the range")}</h3>
              <span className="note">{c(m, "range.note")}</span>
            </div>
            <div className="pgrid c2">
              <div className="pcard">
                <h4>Small bucket</h4>
                <div className="amt">{c(m, "range.small.price")}</div>
                <p className="desc">{c(m, "range.small.desc")}</p>
              </div>
              <div className="pcard">
                <h4>Large bucket</h4>
                <div className="amt">{c(m, "range.large.price")}</div>
                <p className="desc">{c(m, "range.large.desc")}</p>
              </div>
            </div>
          </div>

          {/* Memberships */}
          <div className="price-band reveal">
            <div className="band-head">
              <h3>{c(m, "mem.head", "Memberships")}</h3>
              <span className="note">{c(m, "mem.note")}</span>
            </div>
            <div className="pgrid c2">
              <div className="pcard">
                <h4>{c(m, "mem.practice.name")}</h4>
                <div className="amt">
                  {c(m, "mem.practice.price")}
                  <span> {c(m, "mem.practice.unit")}</span>
                </div>
                <ul>
                  <li><Check />{c(m, "mem.practice.item1")}</li>
                  <li><Check />{c(m, "mem.practice.item2")}</li>
                </ul>
                <div className="cta">
                  <a className="btn btn-dark" href={`tel:${phoneTel}`}>{c(m, "mem.cta", "Call to Join")}</a>
                </div>
              </div>
              <div className="pcard hi">
                {c(m, "mem.combo.flag") ? <span className="flag">{c(m, "mem.combo.flag")}</span> : null}
                <h4>{c(m, "mem.combo.name")}</h4>
                <div className="amt">
                  {c(m, "mem.combo.price")}
                  <span> {c(m, "mem.combo.unit")}</span>
                </div>
                <ul>
                  <li><Check />{c(m, "mem.combo.item1")}</li>
                  <li><Check />{c(m, "mem.combo.item2")}</li>
                </ul>
                <div className="cta">
                  <a className="btn btn-brass" href={`tel:${phoneTel}`}>{c(m, "mem.cta", "Call to Join")}</a>
                </div>
              </div>
            </div>
          </div>

          {/* Lessons */}
          <div className="price-band reveal" id="lessons">
            <div className="band-head">
              <h3>{c(m, "lessons.head", "Lessons with Jeff")}</h3>
              <span className="note">{c(m, "lessons.note")}</span>
            </div>
            <div className="pgrid c2">
              <div className="pcard">
                <p className="desc" style={{ marginTop: 0 }}>{c(m, "lessons.body")}</p>
                <div style={{ marginTop: "1.2rem" }}>
                  {[1, 2, 3, 4].map((i) => {
                    const checkout = c(m, `lessons.p${i}.checkout`);
                    return (
                      <div className="tier" key={i}>
                        <span className="tn">{c(m, `lessons.p${i}.name`)}</span>
                        <span className="tp">
                          {c(m, `lessons.p${i}.price`)}
                          {checkout ? (
                            <a className="tier-book" href={checkout} target="_blank" rel="noopener">
                              Book &amp; Pay →
                            </a>
                          ) : null}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="pcard hi" style={{ justifyContent: "center", textAlign: "center", alignItems: "center" }}>
                <h4>{c(m, "lessons.cta.head", "Set up a lesson")}</h4>
                <p className="desc">{c(m, "lessons.cta.desc")}</p>
                <div className="cta">
                  <a className="btn btn-brass btn-lg" href={`tel:${phoneTel}`}>Call {phoneDisplay}</a>
                </div>
              </div>
            </div>
          </div>

          {/* Junior camp */}
          <div className="price-band reveal" id="camps">
            <div className="band-head">
              <h3>{c(m, "camp.head", "Junior Camp")}</h3>
              <span className="note">{c(m, "camp.note")}</span>
            </div>
            <div className="pgrid c2">
              <div className="pcard">
                <h4>{c(m, "camp.heading")}</h4>
                <p className="desc">{c(m, "camp.desc")}</p>
                <ul>
                  <li><Check />{c(m, "camp.item1")}</li>
                  <li><Check />{c(m, "camp.item2")}</li>
                </ul>
                <div className="cta">
                  <a className="btn btn-brass" href={c(m, "camp.register_url", "#")} target="_blank" rel="noopener">
                    {c(m, "camp.register_text", "Register")}
                  </a>
                </div>
              </div>
              <Photo url={c(m, "camp.image")} tag="juniors on the range" variant="juniors" />
            </div>
          </div>

          {c(m, "pricing.editnote") ? (
            <p className="editnote reveal">{c(m, "pricing.editnote")}</p>
          ) : null}
        </div>
      </section>

      {/* PLAY DAY */}
      <section className="section on-dark playday">
        <div className="wrap">
          <div className="copy reveal">
            <span className="eyebrow">{c(m, "playday.eyebrow")}</span>
            <h2>{c(m, "playday.heading")}</h2>
            <p className="intro">{c(m, "playday.intro")}</p>
          </div>
          <div className="price reveal">
            <div className="big">{c(m, "playday.price")}</div>
            <div className="sub">{c(m, "playday.price_sub")}</div>
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section className="section mission">
        <div className="wrap reveal">
          <span className="eyebrow">{c(m, "mission.eyebrow")}</span>
          <blockquote>{c(m, "mission.quote")}</blockquote>
          <p className="verse">{c(m, "mission.verse")}</p>
          <cite>{c(m, "mission.cite")}</cite>
        </div>
      </section>

      {/* EVENTS */}
      <section className="section" id="events">
        <div className="wrap">
          <div className="reveal">
            <span className="eyebrow">{c(m, "events.eyebrow", "What's Coming Up")}</span>
            <h2>{c(m, "events.heading", "Out at the ranch")}</h2>
            <p className="intro">{c(m, "events.intro")}</p>
          </div>
          <EventsList events={events} />
        </div>
      </section>

      {/* GALLERY */}
      <section className="section" id="gallery">
        <div className="wrap">
          <div className="reveal">
            <span className="eyebrow">{c(m, "gallery.eyebrow", "The Grounds")}</span>
            <h2>{c(m, "gallery.heading")}</h2>
            <p className="intro">{c(m, "gallery.intro")}</p>
          </div>
          <div className="gal reveal">
            <Photo url={c(m, "gallery.1")} tag="par-3 green" variant="green" className="tall" />
            <Photo url={c(m, "gallery.2")} tag="dawn tee box" variant="range" />
            <Photo url={c(m, "gallery.3")} tag="wide range view" variant="range" className="wide" />
            <Photo url={c(m, "gallery.4")} tag="pro shop" variant="range" />
            <Photo url={c(m, "gallery.5")} tag="lesson in progress" variant="juniors" className="wide" />
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      {reviews.length ? (
        <section className="section on-dark" id="reviews">
          <div className="wrap">
            <div className="reveal">
              <span className="eyebrow">{c(m, "reviews.eyebrow", "From Our Golfers")}</span>
              <h2>{c(m, "reviews.heading", "What folks say")}</h2>
            </div>
            <div className="quotes reveal">
              {reviews.map((r, i) => (
                <div className="quote" key={i}>
                  <div className="stars">★★★★★</div>
                  <p>{r.text}</p>
                  {r.who ? <span className="who">{r.who}</span> : null}
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* FAQ */}
      {faqs.length ? (
        <section className="section" id="faq">
          <div className="wrap">
            <div className="reveal">
              <span className="eyebrow">{c(m, "faq.eyebrow", "Good to Know")}</span>
              <h2>{c(m, "faq.heading", "Questions folks ask")}</h2>
            </div>
            <div className="faq-list reveal">
              {faqs.map((f, i) => (
                <details className="faq-item" key={i}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* SIGNUP */}
      <section className="section signup" id="signup">
        <div className="wrap reveal">
          <span className="eyebrow">{c(m, "signup.eyebrow", "Stay in the Loop")}</span>
          <h2>{c(m, "signup.heading")}</h2>
          <p className="intro">{c(m, "signup.body")}</p>
          <SignupForm buttonLabel={c(m, "signup.button", "Sign Me Up")} />
        </div>
      </section>

      {/* VISIT */}
      <section className="section on-dark" id="visit" style={{ background: "var(--brand-soft)" }}>
        <div className="wrap">
          <div className="reveal">
            <span className="eyebrow">{c(m, "contact.eyebrow", "Visit")}</span>
            <h2>{c(m, "contact.heading")}</h2>
          </div>
          <div className="visit-grid">
            <div className="reveal">
              <div className="irow">
                <div className="ic">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div>
                  <h4>Location</h4>
                  <p>
                    {c(m, "contact.address1")}
                    <br />
                    {c(m, "contact.address2")}
                  </p>
                </div>
              </div>
              <div className="irow">
                <div className="ic">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <circle cx="12" cy="12" r="9" />
                    <polyline points="12 7 12 12 16 14" />
                  </svg>
                </div>
                <div>
                  <h4>Hours</h4>
                  <p>
                    {c(m, "contact.hours1")}
                    <br />
                    {c(m, "contact.hours2")}
                  </p>
                </div>
              </div>
              <div className="irow">
                <div className="ic">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div>
                  <h4>Call</h4>
                  <p>
                    <a href={`tel:${phoneTel}`}>{phoneDisplay}</a>
                  </p>
                </div>
              </div>
              <div className="irow">
                <div className="ic">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M4 4h16v16H4z" />
                    <polyline points="22 6 12 13 2 6" />
                  </svg>
                </div>
                <div>
                  <h4>Email</h4>
                  <p>
                    <a href={`mailto:${email}`}>{email}</a>
                  </p>
                </div>
              </div>
            </div>
            <div className="map-card reveal">
              <iframe
                title="Map to Christie's Golf Ranch"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src="https://maps.google.com/maps?q=920%20US%20Highway%20377%2C%20Pilot%20Point%2C%20TX%2076258&t=&z=13&ie=UTF8&iwloc=&output=embed"
              />
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="wrap">
          <div className="foot">
            <a className="brand" href="#top" style={{ textDecoration: "none" }}>
              <svg className="mark" viewBox="0 0 100 100" fill="none" aria-hidden="true">
                <circle cx="50" cy="50" r="46" stroke="#C7913C" strokeWidth="2.5" />
                <circle cx="50" cy="50" r="39" stroke="#C7913C" strokeWidth="1" />
                <path d="M42 70V34" stroke="#DCAE58" strokeWidth="3" strokeLinecap="round" />
                <path d="M42 34l18 6-18 6V34z" fill="#DCAE58" />
              </svg>
              <span className="name" style={{ color: "var(--cream)" }}>
                Christie&apos;s Golf Ranch
              </span>
            </a>
            <div className="socials">
              <a href="https://www.facebook.com/1419209578311681" target="_blank" rel="noopener" aria-label="Facebook">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a href="https://www.instagram.com/christiesgolfranch" target="_blank" rel="noopener" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
                </svg>
              </a>
            </div>
          </div>
          <p className="copyright">
            © {new Date().getFullYear()} Christie&apos;s Golf Ranch · {c(m, "contact.address1")},{" "}
            {c(m, "contact.address2")} · {phoneDisplay} — All rights reserved.{" "}
            <a className="foot-admin" href="/admin">
              Staff login
            </a>
          </p>
        </div>
      </footer>
    </>
  );
}

/** Render the ribbon, bolding text wrapped in *asterisks* so staff can emphasize words. */
function ribbonHtml(text: string): string {
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return escaped
    .replace(/\*(.+?)\*/g, "<b>$1</b>")
    .replace(/ · /g, ' <span class="dot">·</span> ');
}
