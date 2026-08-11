import { Link, createFileRoute } from '@tanstack/react-router'
import { seo } from '@/lib/seo'

const homeSeo = seo({
  title: "L'Alternative Fabrique — frugal tools to build an alternative",
  description:
    'Five organs — knowledge, technique, creation, funding, communication — and one frugal tool for each. One organ at a time.',
  path: '/en',
  locale: 'en',
  alternate: { fr: '/', en: '/en' },
})

export const Route = createFileRoute('/en/')({
  component: LandingPageEn,
  head: () => ({
    ...homeSeo,
    meta: [...homeSeo.meta],
  }),
})

type Capacite = {
  name: string
  tagline: string
  kicker: string
  /** True once an organ has a shipped tool. Tools are named on /outils, not here. */
  shipped?: boolean
  /** Shipped but invite-only: shown as "By invitation", not "Available". */
  beta?: boolean
}

/** Shared "Available →" / "In progress" state line for an organ tile. */
function OrganeStatus({ shipped, beta }: { shipped?: boolean; beta?: boolean }) {
  if (!shipped && !beta) return <p className="label mt-6 opacity-50">In progress</p>
  return (
    <Link
      to="/en/outils"
      className="label mt-6 inline-flex w-fit items-center gap-2 border-b-2 border-current pb-1 hover:opacity-70"
    >
      {beta ? 'By invitation' : 'Available'} <span aria-hidden>→</span>
    </Link>
  )
}

const capacites: Capacite[] = [
  {
    name: 'Knowledge',
    tagline: 'Have the ideas, keep a hold on what you know.',
    kicker: 'The starting point',
    shipped: true,
  },
  {
    name: 'Technique',
    tagline: 'Hold your own tools, depend on no one.',
    kicker: 'The machine',
    shipped: true,
  },
  {
    name: 'Creation',
    tagline: 'Give shape to what you set in motion.',
    kicker: 'Produce',
  },
  {
    name: 'Funding',
    tagline: 'Fund what you undertake, with no middleman taking a cut.',
    kicker: 'The nerve',
    beta: true,
  },
  {
    name: 'Communication',
    tagline: 'Be heard by your own means.',
    kicker: 'Make yourself heard',
    shipped: true,
  },
]

function LandingPageEn() {
  return (
    <div>
      {/* COVER */}
      <section className="border-b-2 border-text">
        <div className="mx-auto w-full max-w-7xl px-6 pb-20 pt-12 sm:pb-28 sm:pt-16">
          <div className="flex items-center justify-between">
            <p className="label text-text/60">№ 01 — Current edition</p>
            <p className="label text-accent-primary">Manifesto</p>
          </div>

          {/*
           * Two lines, one whole word each, so the eye never has to reassemble
           * the name. w-fit shrinks the heading onto its widest line so the
           * ranged-right second line lands under the final E of L'ALTERNATIVE
           * rather than at the far edge of the container, where it would read
           * as a detached word instead of the rest of the name.
           */}
          <h1 className="display-xxl mt-8 w-fit sm:mt-10">
            L'Alternative
            {/*
             * FABRIQUE sits smaller and flush right, tucked under the final E
             * of the line above. Set at the same size and flush left it left a
             * hole under the right half of the block; ranged right it closes
             * that gap and reads as a signature under the name rather than a
             * line that ran out of letters.
             */}
            <span className="block text-right text-[0.58em] leading-[0.95] text-accent-primary">
              Fabrique
            </span>
          </h1>

          <div className="mt-10 grid gap-10 sm:mt-14 sm:grid-cols-12">
            <p className="chapeau sm:col-span-7 sm:col-start-1">
              Taking back the means of production. Technical, economic and
              governance: the organs an alternative needs to actually exist. We
              are building them one by one.
            </p>
            <div className="sm:col-span-4 sm:col-start-9 sm:self-end">
              <p className="label text-text/60">In this issue</p>
              <ul className="mt-3 space-y-1 text-base">
                <li>— Five organs to take back</li>
                <li>— A common pot, in the open</li>
                <li>— A review to come</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ORGANES — asymmetric editorial cards */}
      <section className="border-b-2 border-text">
        <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:py-28">
          <div className="flex items-baseline justify-between gap-6">
            <h2 className="display-lg">The organs</h2>
            <Link
              to="/en/apps"
              className="label text-accent-primary hover:underline"
            >
              See them all →
            </Link>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-px bg-text sm:grid-cols-12">
            {/* big tile */}
            <article className="col-span-1 bg-accent-primary p-8 text-bg sm:col-span-7 sm:p-12">
              <p className="label opacity-80">{capacites[0].kicker}</p>
              <h3 className="display-card mt-6 sm:text-8xl">
                {capacites[0].name}
              </h3>
              <p className="chapeau mt-6 max-w-md">{capacites[0].tagline}</p>
              <OrganeStatus shipped={capacites[0].shipped} />
            </article>

            <article className="col-span-1 bg-bg p-8 sm:col-span-5 sm:p-12">
              <p className="label text-text/60">{capacites[1].kicker}</p>
              <h3 className="display-card mt-6 sm:text-7xl">
                {capacites[1].name}
              </h3>
              <p className="mt-6 text-base text-text/80">{capacites[1].tagline}</p>
              <OrganeStatus shipped={capacites[1].shipped} />
            </article>

            <article className="col-span-1 bg-accent-secondary p-8 text-bg sm:col-span-5 sm:p-12">
              <p className="label opacity-70">{capacites[2].kicker}</p>
              <h3 className="display-card mt-6 sm:text-7xl">
                {capacites[2].name}
              </h3>
              <p className="mt-6 text-base opacity-90">{capacites[2].tagline}</p>
              <OrganeStatus shipped={capacites[2].shipped} />
            </article>

            <article className="col-span-1 bg-warm p-8 sm:col-span-7 sm:p-12">
              <p className="label text-text/70">{capacites[3].kicker}</p>
              <h3 className="display-card mt-6 sm:text-8xl">
                {capacites[3].name}
              </h3>
              <p className="chapeau mt-6 max-w-md">{capacites[3].tagline}</p>
              <OrganeStatus shipped={capacites[3].shipped} beta={capacites[3].beta} />
            </article>

            <article className="col-span-1 bg-text p-8 text-bg sm:col-span-12 sm:p-12">
              <p className="label opacity-70">{capacites[4].kicker}</p>
              <h3 className="display-card mt-6 sm:text-8xl">
                {capacites[4].name}
              </h3>
              <p className="chapeau mt-6 max-w-xl opacity-90">
                {capacites[4].tagline}
              </p>
              <OrganeStatus shipped={capacites[4].shipped} />
            </article>
          </div>
        </div>
      </section>

      {/* POT COMMUN — full bleed colored block */}
      <section className="bg-accent-secondary text-bg">
        <div className="mx-auto w-full max-w-7xl px-6 py-24 sm:py-32">
          <div className="grid gap-12 sm:grid-cols-12">
            <div className="sm:col-span-7">
              <p className="label opacity-70">The common pot</p>
              <h2 className="display-xl mt-6">
                Every penny <br />
                comes back here.
              </h2>
            </div>
            <div className="flex flex-col justify-end sm:col-span-5">
              <p className="chapeau opacity-90">
                A share of what each tool earns feeds a common pot, spent on
                reforging our own digital means. An idea only becomes real once
                it is funded: rather than raise money, we take back revenue that
                already slips through our hands.
              </p>
              <Link
                to="/en/pot"
                className="mt-10 inline-flex w-fit items-center gap-3 border-2 border-bg px-6 py-3 label hover:bg-bg hover:text-accent-secondary"
              >
                See the pot <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* QUOTE / STATEMENT */}
      <section>
        <div className="mx-auto w-full max-w-7xl px-6 py-24 sm:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <p className="label text-text/50">The fixed idea</p>
            <p className="font-heading mt-8 text-4xl uppercase leading-tight sm:text-6xl">
              Take back the means, one by one.
              <br />
              The means to build an{' '}
              <span className="text-accent-primary">alternative</span>.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
