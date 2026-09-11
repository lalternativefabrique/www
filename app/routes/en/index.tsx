import { Link, createFileRoute } from '@tanstack/react-router'
import { seo } from '@/lib/seo'

const homeSeo = seo({
  title: "L'Alternative Fabrique — the alternative already exists",
  description:
    'Five solutions are already available. See what we have built, the projects under way and the pillars of the alternative.',
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

const solutions = [
  ['Synthiz', 'Find and connect your sources.'],
  ['Techtuel', 'Turn spoken content into text.'],
  ['Spore', 'Send email from independent infrastructure.'],
  ['Lungor', 'Steer the revenue of your software.'],
  ['Skalpai', 'Run and observe your applications.'],
] as const

const projects = [
  {
    status: 'Under way',
    name: 'Payments',
    detail: 'Take payments without letting a middleman write the rules.',
  },
  {
    status: 'Next',
    name: 'Investment',
    detail: 'Let anyone directly fund what is being built.',
  },
] as const

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
              The alternative is possible. It already exists. We build concrete
              solutions to take back control of how we produce, fund and
              communicate.
            </p>
            <div className="sm:col-span-4 sm:col-start-9 sm:self-end">
              <p className="label text-text/60">In this issue</p>
              <ul className="mt-3 space-y-1 text-base">
                <li>— 5 solutions available</li>
                <li>— 2 projects to follow</li>
                <li>— 5 pillars to master</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT ALREADY EXISTS */}
      <section className="border-b-2 border-text">
        <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:py-28">
          <p className="label text-accent-primary">What already exists</p>
          <div className="mt-6 grid gap-8 sm:grid-cols-12">
            <h2 className="display-lg sm:col-span-7">
              5 solutions.<br />Available now.
            </h2>
            <p className="chapeau sm:col-span-5 sm:self-end">
              Not a promise for later. Working products you can try and use
              today.
            </p>
          </div>

          <div className="mt-14 grid gap-px bg-text sm:grid-cols-2">
            {solutions.map(([name, detail], index) => (
              <article key={name} className="bg-bg p-8 sm:p-10">
                <p className="label text-text/50">
                  {String(index + 1).padStart(2, '0')} — Available
                </p>
                <h3 className="font-heading mt-5 text-4xl uppercase leading-none sm:text-5xl">
                  {name}
                </h3>
                <p className="mt-5 text-base text-text/75">{detail}</p>
              </article>
            ))}
          </div>

          <Link
            to="/en/outils"
            className="label mt-10 inline-flex w-fit items-center gap-3 border-2 border-text px-6 py-3 hover:bg-text hover:text-bg"
          >
            Discover the 5 solutions <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      {/* CURRENT PROJECTS */}
      <section className="bg-accent-secondary text-bg">
        <div className="mx-auto w-full max-w-7xl px-6 py-24 sm:py-32">
          <p className="label opacity-70">What we are building</p>
          <h2 className="display-xl mt-6">Projects under way.</h2>
          <div className="mt-14 grid gap-px bg-bg/40 sm:grid-cols-2">
            {projects.map((project) => (
              <article key={project.name} className="bg-accent-secondary p-8 sm:p-10">
                <p className="label opacity-70">{project.status}</p>
                <h3 className="font-heading mt-5 text-4xl uppercase leading-none sm:text-5xl">
                  {project.name}
                </h3>
                <p className="mt-5 text-base opacity-90">{project.detail}</p>
              </article>
            ))}
          </div>
          <p className="chapeau mt-12 max-w-3xl opacity-90">
            A share of the revenue from our solutions directly funds what comes
            next. What is available pays for what is being built.
          </p>
          <Link
            to="/en/pot"
            className="label mt-10 inline-flex w-fit items-center gap-3 border-2 border-bg px-6 py-3 hover:bg-bg hover:text-accent-secondary"
          >
            See the projects and their funding <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      {/* PILLARS */}
      <section className="border-b-2 border-text">
        <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:py-28">
          <p className="label text-accent-primary">The whole picture</p>
          <h2 className="display-lg mt-6">5 pillars to master.</h2>
          <p className="chapeau mt-8 max-w-2xl">
            Knowledge, technique, creation, funding and communication: the five
            capabilities an alternative needs to last.
          </p>
          <div className="mt-12 grid gap-px bg-text sm:grid-cols-5">
            {capacites.map((capacite, index) => (
              <article key={capacite.name} className="bg-bg p-6">
                <p className="label text-text/45">
                  {String(index + 1).padStart(2, '0')}
                </p>
                <h3 className="font-heading mt-5 text-2xl uppercase leading-none">
                  {capacite.name}
                </h3>
                <p className="mt-4 text-sm text-text/70">{capacite.tagline}</p>
              </article>
            ))}
          </div>
          <Link
            to="/en/apps"
            className="label mt-10 inline-flex w-fit items-center gap-2 text-accent-primary hover:underline"
          >
            Understand the 5 pillars <span aria-hidden>→</span>
          </Link>
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
