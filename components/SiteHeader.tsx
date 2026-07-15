"use client";

import { useState } from "react";

const NAV = [
  { href: "#range", label: "The Ranch" },
  { href: "#pricing", label: "Pricing" },
  { href: "#lessons", label: "Lessons" },
  { href: "#events", label: "Events" },
  { href: "#camps", label: "Junior Camp" },
  { href: "#visit", label: "Visit" },
];

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

export default function SiteHeader({
  phoneDisplay,
  phoneTel,
}: {
  phoneDisplay: string;
  phoneTel: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <header>
      <div className="wrap nav">
        <a className="brand" href="#top" aria-label="Christie's Golf Ranch home">
          <svg className="mark" viewBox="0 0 100 100" fill="none" aria-hidden="true">
            <circle cx="50" cy="50" r="46" stroke="#C7913C" strokeWidth="2.5" />
            <circle cx="50" cy="50" r="39" stroke="#C7913C" strokeWidth="1" />
            <path d="M42 70V34" stroke="#DCAE58" strokeWidth="3" strokeLinecap="round" />
            <path d="M42 34l18 6-18 6V34z" fill="#DCAE58" />
            <ellipse cx="50" cy="71" rx="16" ry="3" fill="#517A57" />
          </svg>
          <span className="name">
            Christie&apos;s Golf Ranch<small>Pilot Point · Texas</small>
          </span>
        </a>
        <ul className="links">
          {NAV.map((n) => (
            <li key={n.href}>
              <a href={n.href}>{n.label}</a>
            </li>
          ))}
        </ul>
        <div className="nav-right">
          <a className="navphone" href={`tel:${phoneTel}`}>
            <PhoneIcon />
            <span>{phoneDisplay}</span>
          </a>
          <a className="btn btn-brass" href="#visit">
            Plan a Visit
          </a>
          <button
            className="menu-btn"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </div>
      <div className={`drawer${open ? " open" : ""}`}>
        <ul>
          {NAV.map((n) => (
            <li key={n.href}>
              <a href={n.href} onClick={() => setOpen(false)}>
                {n.label}
              </a>
            </li>
          ))}
        </ul>
        <a className="btn btn-brass" href={`tel:${phoneTel}`}>
          Call {phoneDisplay}
        </a>
      </div>
    </header>
  );
}
