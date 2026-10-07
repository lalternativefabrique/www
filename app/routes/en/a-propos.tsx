import { Link, createFileRoute } from '@tanstack/react-router'
import { applicationsEn, projetsEn } from '@/content/catalogue.en'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/en/a-propos')({
  component: AProposPageEn,
  head: () =>
    seo({
      title: "About — L'Alternative Fabrique",
      description:
        "Why L'Alternative Fabrique exists, what it has already built, and how to help: by using, sharing, supporting, proposing ideas and bringing skills.",
      path: '/en/a-propos',
      locale: 'en',
      alternate: { fr: '/a-propos', en: '/en/a-propos' },
    }),
})

const aides = [
  {
    titre: 'Use',
    detail:
      'Try an application. If it serves you, your subscription funds all the others.',
  },
  {
    titre: 'Share',
    detail:
      'Tell people around you. Today, that is what we lack most: being known.',
  },
  {
    titre: 'Support',
    detail:
      'A financial contribution, even a modest one, gives us the visibility we lack to move forward.',
  },
  {
    titre: 'Propose',
    detail:
      'An idea for a project, a need nobody covers: what comes next is written with you.',
  },
  {
    titre: 'Take part',
    detail:
      'Marketing, communication, administration, legal, accounting, development: your skills move things faster than anything else.',
  },
  {
    titre: 'Encourage',
    detail:
      'A message, some feedback, a word of support. It counts more than one would think.',
  },
]

function AProposPageEn() {
  const ouvertes = applicationsEn.filter(
    (application) => application.statut !== 'Bientôt',
  ).length

  return (
    <div>
      <section className="border-b-2 border-text">
        <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:py-28">
          <p className="label text-text/60">The approach</p>
          <h1 className="display-xl mt-6">About</h1>
          <p className="chapeau mt-10 max-w-2xl">
            A still small organisation, proving that we can take back our
            means of producing online, and asking only to be helped.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto w-full max-w-3xl px-6 py-20 sm:py-28">
          <p className="label text-accent-primary">The observation</p>
          <h2 className="font-heading mt-6 text-4xl uppercase leading-tight sm:text-5xl">
            We build on other people's ground.
          </h2>
          <div className="prose-editorial mt-10 text-text/85">
            <p>
              Launching an online service takes almost nothing any more. A
              host, an email-sending service, a platform to publish on, a
              provider to collect payments: it all plugs together in an
              afternoon.
            </p>
            <p>
              The price shows up later. Each of these services sets its
              prices, its rules and its limits, and can change them. As the
              activity grows, you find that your means of producing belong to
              others.
            </p>
            <p>
              These services are often excellent, and for many projects they
              remain the right choice. The problem starts when you want to
              last without depending on a decision taken elsewhere.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t-2 border-text">
        <div className="mx-auto w-full max-w-3xl px-6 py-20 sm:py-28">
          <p className="label text-accent-primary">What we do</p>
          <h2 className="font-heading mt-6 text-4xl uppercase leading-tight sm:text-5xl">
            Take those means back, one by one.
          </h2>
          <div className="prose-editorial mt-10 text-text/85">
            <p>
              We build the applications that replace those services.{' '}
              {ouvertes} are usable today, openly or in beta, and{' '}
              {projetsEn.length} projects are under way.
            </p>
            <p>
              Thanks to a shared organisation, a single stream of funding keeps
              every application alive. The revenue of one funds the others:
              those that exist, the betas, those planned and those still to be
              imagined.
            </p>
            <p>
              We do not ask you to buy into a promise. Try an application: if
              it serves you, you fund what comes next.
            </p>
          </div>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/en/outils"
              className="label inline-flex w-fit items-center gap-3 border-2 border-text bg-text px-6 py-3 text-bg hover:bg-accent-primary"
            >
              See the applications <span aria-hidden>→</span>
            </Link>
            <Link
              to="/en/projets"
              className="label inline-flex w-fit items-center gap-2 self-center border-b-2 border-text pb-1 hover:opacity-70"
            >
              See the projects <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t-2 border-text bg-warm">
        <div className="mx-auto w-full max-w-7xl px-6 py-16 sm:py-24">
          <p className="label text-text/60">How to help us</p>
          <h2 className="font-heading mt-6 max-w-3xl text-4xl uppercase leading-tight sm:text-5xl">
            Imagine it with your help.
          </h2>
          <p className="chapeau mt-8 max-w-2xl">
            We are few, and we are proving that a lot can already be done. Our
            one fragility is the lack of financial visibility: we have just
            laid the base. Help us get past it.
          </p>
          <div className="mt-14 grid grid-cols-1 gap-px bg-text sm:grid-cols-2 lg:grid-cols-3">
            {aides.map((aide) => (
              <div key={aide.titre} className="bg-bg p-8 sm:p-10">
                <p className="font-heading text-2xl uppercase leading-tight">
                  {aide.titre}
                </p>
                <p className="mt-4 text-base text-text/80">{aide.detail}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 flex flex-wrap gap-4">
            <Link
              to="/en/contact"
              className="label inline-flex w-fit items-center gap-3 border-2 border-text bg-text px-6 py-3 text-bg hover:bg-accent-primary"
            >
              Offer your help <span aria-hidden>→</span>
            </Link>
            <Link
              to="/en/pot"
              hash="chip-in"
              className="label inline-flex w-fit items-center gap-2 self-center border-b-2 border-text pb-1 hover:opacity-70"
            >
              Contribute financially <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-text text-bg">
        <div className="mx-auto w-full max-w-7xl px-6 py-24 sm:py-32">
          <div className="grid gap-10 sm:grid-cols-12">
            <div className="sm:col-span-5">
              <p className="label opacity-70">Contact</p>
              <p className="font-heading mt-6 text-5xl uppercase leading-none sm:text-7xl">
                Write to us.
              </p>
            </div>
            <div className="flex flex-col justify-end sm:col-span-7">
              <p className="chapeau opacity-90">
                A question, an idea, a skill to bring: we read everything and
                we answer.
              </p>
              <Link
                to="/en/contact"
                className="label mt-8 inline-flex w-fit items-center gap-3 border-2 border-bg px-6 py-3 hover:bg-bg hover:text-text"
              >
                Write <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
