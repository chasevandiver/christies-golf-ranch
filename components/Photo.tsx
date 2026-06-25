/**
 * Renders an uploaded photo when present, otherwise a tasteful designed
 * placeholder so the page never looks broken before Jeff adds images.
 */
export default function Photo({
  url,
  tag,
  variant = "range",
  className = "",
}: {
  url?: string;
  tag?: string;
  variant?: "range" | "green" | "juniors";
  className?: string;
}) {
  return (
    <div className={`photo ${className}`.trim()} aria-label={url ? tag : "Photo placeholder"}>
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="real" src={url} alt={tag || "Christie's Golf Ranch"} />
      ) : (
        <>
          <Scene variant={variant} />
          {tag ? (
            <span className="tag">
              <b>Add photo:</b> {tag}
            </span>
          ) : null}
        </>
      )}
    </div>
  );
}

function Scene({ variant }: { variant: "range" | "green" | "juniors" }) {
  if (variant === "green") {
    return (
      <svg className="scene" viewBox="0 0 600 480" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect width="600" height="480" fill="#4C3826" />
        <path d="M0 300 C150 280 320 320 460 300 C540 290 600 300 600 298 L600 480 L0 480Z" fill="#3E4A2B" />
        <path d="M0 360 C200 344 400 380 600 358 L600 480 L0 480Z" fill="#44542F" />
        <line x1="430" y1="360" x2="430" y2="270" stroke="#D4B26C" strokeWidth="5" />
        <path d="M430 270l26 9-26 9z" fill="#D4B26C" />
      </svg>
    );
  }
  if (variant === "juniors") {
    return (
      <svg className="scene" viewBox="0 0 600 480" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect width="600" height="480" fill="#4C3826" />
        <path d="M0 340 C200 322 400 360 600 338 L600 480 L0 480Z" fill="#44542F" />
        <circle cx="120" cy="110" r="40" fill="#D9B878" opacity=".8" />
      </svg>
    );
  }
  return (
    <svg className="scene" viewBox="0 0 600 480" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="600" height="480" fill="#4C3826" />
      <path d="M0 300 C150 280 320 320 460 300 C540 290 600 300 600 298 L600 480 L0 480Z" fill="#3E4A2B" />
      <path d="M0 360 C200 344 400 380 600 358 L600 480 L0 480Z" fill="#44542F" />
      <g stroke="#2A1D12" strokeWidth="4">
        <line x1="60" y1="320" x2="60" y2="380" />
        <line x1="180" y1="316" x2="180" y2="380" />
        <line x1="300" y1="320" x2="300" y2="382" />
        <line x1="40" y1="338" x2="320" y2="334" />
      </g>
      <circle cx="470" cy="120" r="46" fill="#D9B878" opacity=".8" />
    </svg>
  );
}
