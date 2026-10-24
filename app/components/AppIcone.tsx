import type { Application } from '@/content/catalogue'

export function AppIcone({ application }: { application: Application }) {
  if (!application.icone) {
    return (
      <span
        aria-hidden
        className="font-heading grid size-10 place-items-center rounded-[22%] bg-text text-xl uppercase text-bg"
      >
        {application.name.charAt(0)}
      </span>
    )
  }
  return (
    <img
      src={application.icone}
      alt=""
      width={40}
      height={40}
      loading="lazy"
      className="size-10 rounded-[22%]"
    />
  )
}
