/** The branding-iron seal used in the hero. */
export default function Seal() {
  return (
    <div className="hero-seal">
      <svg viewBox="0 0 220 220" fill="none" aria-label="Christie's Golf Ranch seal">
        <circle cx="110" cy="110" r="104" stroke="#B0883F" strokeWidth="2.5" />
        <circle cx="110" cy="110" r="94" stroke="#B0883F" strokeWidth="1.2" />
        <circle cx="110" cy="110" r="70" stroke="#B0883F" strokeWidth="1" strokeDasharray="1 7" />
        <defs>
          <path id="topArc" d="M38 110 A72 72 0 0 1 182 110" />
        </defs>
        <text fill="#D4B26C" fontFamily="Mulish, sans-serif" fontSize="13" fontWeight="800" letterSpacing="4" textAnchor="middle">
          <textPath href="#topArc" startOffset="50%">
            PILOT POINT · TEXAS
          </textPath>
        </text>
        <path d="M96 132V78" stroke="#D4B26C" strokeWidth="4" strokeLinecap="round" />
        <path d="M96 78l30 10-30 10V78z" fill="#D4B26C" />
        <ellipse cx="110" cy="133" rx="30" ry="5" fill="#44542F" />
        <circle cx="124" cy="129" r="3" fill="#F1E8D4" />
        <text x="110" y="160" fill="#F1E8D4" fontFamily="Bitter, serif" fontSize="16" fontWeight="800" letterSpacing="1" textAnchor="middle">
          CHRISTIE&apos;S
        </text>
        <text x="110" y="178" fill="#F1E8D4" fontFamily="Bitter, serif" fontSize="13" fontWeight="700" letterSpacing="2" textAnchor="middle">
          GOLF RANCH
        </text>
        <line x1="74" y1="190" x2="92" y2="190" stroke="#B0883F" strokeWidth="1.4" />
        <line x1="128" y1="190" x2="146" y2="190" stroke="#B0883F" strokeWidth="1.4" />
        <text x="110" y="194" fill="#D4B26C" fontFamily="Mulish, sans-serif" fontSize="9" fontWeight="800" letterSpacing="3" textAnchor="middle">
          EST. 2008
        </text>
      </svg>
    </div>
  );
}
