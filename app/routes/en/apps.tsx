import { Link, createFileRoute } from '@tanstack/react-router'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/en/apps')({
  component: AppsPageEn,
  head: () =>
    seo({
      title: "The organs — L'Alternative Fabrique",
      description:
        'The five organs of an alternative: knowledge, technique, creation, funding, communication. One frugal tool for each.',
      path: '/en/apps',
      locale: 'en',
      alternate: { fr: '/apps', en: '/en/apps' },
    }),
})

type Capacite = {
  name: string
  description: string
  kicker: string
  detail: string
  accent: 'primary' | 'secondary' | 'warm' | 'paper'
  /** True once an organ has a shipped tool. Tools are named on /outils, not here. */
  shipped?: boolean
  /** Shipped but invite-only: shown as "Sur invitation", not "Disponible". */
  beta?: boolean
}

const capacites: Capacite[] = [
  {
    name: 'Knowledge',
    kicker: 'Have the ideas',
    description: 'Capture, connect and retrieve what you learn.',
    detail:
      'A memory that belongs to you: your notes, your sources, your ideas, organised by you. The starting point — without ideas, nothing begins.',
    accent: 'primary',
    shipped: true,
  },
  {
    name: 'Technique',
    kicker: 'Hold your tools',
    description: 'Understand and steer what keeps your projects running.',
    detail:
      "See what your infrastructure is doing, without depending on a team or a budget you don't have. Keep your hand on the machine rather than submit to it.",
    accent: 'paper',
    shipped: true,
  },
  {
    name: 'Creation',
    kicker: 'Bring into being',
    description: 'Produce and give form to what you launch.',
    detail:
      'From idea to product: the tools to build, iterate and ship what you create, with no chain of middlemen between you and your work.',
    accent: 'secondary',
  },
  {
    name: 'Funding',
    kicker: 'The sinews of war',
    description: 'Fund what you undertake, with no intermediary taking a cut.',
    detail:
      'Two parts: raising funds and investing, and collecting your payments by your own means, without depending on an intermediary that takes its share.',
    accent: 'warm',
    beta: true,
  },
  {
    name: 'Communication',
    kicker: 'Make yourself known',
    description: 'Send, reach, be heard — by your own means.',
    detail:
      'Your messages leave from your own place, with no intermediary filtering or monetising your audience. Speak to the world without asking permission.',
    accent: 'paper',
    shipped: true,
  },
]

const accentClass: Record<Capacite['accent'], string> = {
  primary: 'bg-accent-primary text-bg',
  secondary: 'bg-accent-secondary text-bg',
  warm: 'bg-warm text-text',
  paper: 'bg-bg text-text border-y-2 border-text',
}

function AppsPageEn() {
  return (
    <div>
      {/* Title block */}
      <section className="border-b-2 border-text">
        <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:py-28">
          <p className="label text-text/60">The organs — № 01</p>
          <h1 className="display-xl mt-6">The organs</h1>
          <p className="chapeau mt-8 max-w-2xl">
            From knowledge to funding, from building to broadcasting: the organs
            an alternative needs to exist. We build them one by one, then we
            connect them into a coherent system.
          </p>
        </div>
      </section>

      {/* Editorial entries — alternating */}
      {capacites.map((capacite, i) => {
        const reverse = i % 2 === 1
        return (
          <section key={capacite.name} className={accentClass[capacite.accent]}>
            <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:py-28">
              <div
                className={`grid gap-10 sm:grid-cols-12 ${
                  reverse ? 'sm:[direction:rtl]' : ''
                }`}
              >
                <div
                  className={`sm:col-span-7 ${
                    reverse ? 'sm:[direction:ltr]' : ''
                  }`}
                >
                  <p className="label opacity-70">
                    {String(i + 1).padStart(2, '0')} — {capacite.kicker}
                  </p>
                  <h2 className="display-column mt-6">
                    {capacite.name}
                  </h2>
                </div>
                <div
                  className={`flex flex-col justify-end sm:col-span-5 ${
                    reverse ? 'sm:[direction:ltr]' : ''
                  }`}
                >
                  <p className="chapeau">{capacite.description}</p>
                  <p className="mt-6 text-base opacity-80">{capacite.detail}</p>
                  {capacite.shipped || capacite.beta ? (
                    <Link
                      to="/en/outils"
                      className="label mt-8 inline-flex w-fit items-center gap-2 border-b-2 border-current pb-1 hover:opacity-70"
                    >
                      {capacite.beta ? 'By invitation' : 'Available'}{' '}
                      <span aria-hidden>→</span>
                    </Link>
                  ) : (
                    <p className="label mt-8 opacity-50">In progress</p>
                  )}
                </div>
              </div>
            </div>
          </section>
        )
      })}
    </div>
  )
}
