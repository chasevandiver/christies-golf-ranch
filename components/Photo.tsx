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
        <rect width="600" height="480" fill="#3F5C46" />
        <path d="M0 300 C150 280 320 320 460 300 C540 290 600 300 600 298 L600 480 L0 480Z" fill="#35503B" />
        <path d="M0 360 C200 344 400 380 600 358 L600 480 L0 480Z" fill="#2E4632" />
        <line x1="430" y1="360" x2="430" y2="270" stroke="#DCAE58" strokeWidth="5" />
        <path d="M430 270l26 9-26 9z" fill="#DCAE58" />
      </svg>
    );
  }
  if (variant === "juniors") {
    return (
      <svg className="scene" viewBox="0 0 600 480" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <rect width="600" height="480" fill="#3F5C46" />
        <path d="M0 340 C200 322 400 360 600 338 L600 480 L0 480Z" fill="#2E4632" />
        <circle cx="120" cy="110" r="40" fill="#DCAE58" opacity=".8" />
      </svg>
    );
  }
  return (
    <svg className="scene" viewBox="0 0 600 480" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="600" height="480" fill="#3F5C46" />
      <path d="M0 300 C150 280 320 320 460 300 C540 290 600 300 600 298 L600 480 L0 480Z" fill="#35503B" />
      <path d="M0 360 C200 344 400 380 600 358 L600 480 L0 480Z" fill="#2E4632" />
      <g stroke="#1E3024" strokeWidth="4">
        <line x1="60" y1="320" x2="60" y2="380" />
        <line x1="180" y1="316" x2="180" y2="380" />
        <line x1="300" y1="320" x2="300" y2="382" />
        <line x1="40" y1="338" x2="320" y2="334" />
      </g>
      <circle cx="470" cy="120" r="46" fill="#DCAE58" opacity=".8" />
    </svg>
  );
}
