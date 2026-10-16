type LogoProps = {
  size?: number
  className?: string
}

export function Logo({ size = 64, className }: LogoProps) {
  return (
    <svg
      viewBox="0 0 358 284"
      width={size}
      height={(size * 284) / 358}
      className={className}
      role="img"
      aria-label="L'Alternative Fabrique"
    >
      <path d="M3 152 L104 94 Q108 92 108 97 V284 H7 Q3 284 3 280 Z" fill="#1c2733" />
      <path
        d="M72 154 L196 89 Q200 87 200 92 V129 L278 87 Q282 85 282 90 V284 H72 Z"
        fill="#2b3b4e"
      />
      <path d="M174 212 H234 V284 H174 Z" fill="var(--color-bg)" />
      <path
        d="M285 36 L350 4 Q355 2 355 7 V280 Q355 284 351 284 H285 Z"
        fill="var(--color-accent-primary)"
      />
    </svg>
  )
}
