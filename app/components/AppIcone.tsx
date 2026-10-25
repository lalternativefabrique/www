import type { Application } from '@/content/catalogue'

const tailles = {
  md: { px: 40, box: 'size-10', lettre: 'text-2xl' },
  lg: { px: 96, box: 'size-16 sm:size-24', lettre: 'text-5xl' },
}

export function AppIcone({
  application,
  size = 'md',
}: {
  application: Application
  size?: keyof typeof tailles
}) {
  const t = tailles[size]
  if (!application.icone) {
    return (
      <span
        aria-hidden
        className={`font-heading grid ${t.box} shrink-0 place-items-center rounded-[22%] bg-white ${t.lettre} text-text`}
      >
        {application.name.charAt(0)}
      </span>
    )
  }
  return (
    <img
      src={application.icone}
      alt=""
      width={t.px}
      height={t.px}
      loading="lazy"
      className={`${t.box} shrink-0 rounded-[22%]`}
    />
  )
}
