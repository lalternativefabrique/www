/**
 * Circular seal logo: AF monogram inside a ring, with the full name curved
 * around it — "L'ALTERNATIVE" over the top, "FABRIQUE" under the bottom.
 *
 * Inline SVG rather than an image file: it inherits currentColor, so the same
 * component works on the cream background and on the dark footer without
 * shipping two assets. Text is drawn with textPath on two invisible arcs.
 *
 * Archivo is the heading face used across the site; it is loaded by __root's
 * Google Fonts link, so the SVG needs no font of its own.
 */

type LogoProps = {
  /** Rendered size in px. The viewBox is fixed, so this scales everything. */
  size?: number
  className?: string
  /** Accent colour for the FABRIQUE arc. Defaults to the brand red. */
  accent?: string
}

export function Logo({
  size = 64,
  className,
  accent = 'var(--color-accent-primary)',
}: LogoProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="L'Alternative Fabrique"
    >
      <defs>
        {/* Top arc: sweeps left → right over the top; glyphs sit upright. */}
        <path
          id="af-arc-top"
          d="M 28 100 A 72 72 0 0 1 172 100"
          fill="none"
        />
        {/*
         * Bottom arc: also left → right, but with sweep-flag 0 so it bows
         * under the circle. Text on a right-to-left arc renders upside down,
         * which is the trap here.
         */}
        <path
          id="af-arc-bottom"
          d="M 34 100 A 66 66 0 0 0 166 100"
          fill="none"
        />
      </defs>

      {/* Outer ring */}
      <circle
        cx="100"
        cy="100"
        r="94"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
      />

      {/* AF monogram — the anchor of the mark */}
      <text
        x="100"
        y="96"
        textAnchor="middle"
        dominantBaseline="central"
        fill="currentColor"
        fontFamily="var(--font-heading), 'Archivo', sans-serif"
        fontSize="86"
        letterSpacing="-1"
      >
        AF
      </text>

      {/* L'ALTERNATIVE — curved over the top */}
      <text
        fill="currentColor"
        fontFamily="var(--font-heading), 'Archivo', sans-serif"
        fontSize="21"
        letterSpacing="3.4"
      >
        <textPath href="#af-arc-top" startOffset="50%" textAnchor="middle">
          L&#x2019;ALTERNATIVE
        </textPath>
      </text>

      {/*
       * FABRIQUE — curved under the bottom, in the accent colour.
       * dominantBaseline hanging drops the glyphs below the path, keeping them
       * inside the ring instead of straddling it.
       */}
      <text
        fill={accent}
        fontFamily="var(--font-heading), 'Archivo', sans-serif"
        fontSize="21"
        letterSpacing="5"
        dominantBaseline="hanging"
      >
        <textPath href="#af-arc-bottom" startOffset="50%" textAnchor="middle">
          FABRIQUE
        </textPath>
      </text>

      {/* The two dots separating the arcs, as on the seal */}
      <circle cx="17" cy="100" r="3.6" fill="currentColor" />
      <circle cx="183" cy="100" r="3.6" fill="currentColor" />
    </svg>
  )
}
