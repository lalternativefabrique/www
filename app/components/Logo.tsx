type LogoProps = {
  size?: number
  className?: string
}

export function Logo({ size = 64, className }: LogoProps) {
  return (
    <svg
      viewBox="0 0 104 48"
      width={size}
      height={(size * 48) / 104}
      className={className}
      role="img"
      aria-label="L'Alternative Fabrique"
    >
      <path d="M0 48 L27 0 H43 L16 48 Z" fill="#2c5266" />
      <path d="M30 48 L57 0 H73 L46 48 Z" fill="currentColor" />
      <path d="M60 48 L87 0 H100 Q104 0 104 4 V44 Q104 48 100 48 Z" fill="#e2654f" />
    </svg>
  )
}
