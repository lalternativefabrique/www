import { Link, createFileRoute } from '@tanstack/react-router'
import { applicationsEn, statutEn } from '@/content/catalogue.en'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/en/projets')({
  component: ProjetsPageEn,
  head: () =>
    seo({
      title: "The projects — L'Alternative Fabrique",
      description:
        'What the revenue of the applications builds: Reczi, to publish without YouTube or Substack, and collecting payments without a middleman. And the ideas open to proposals.',
      path: '/en/projets',
      locale: 'en',
      alternate: { fr: '/projets', en: '/en/projets' },
    }),
})

function ProjetsPageEn() {
  return (
    <div>
      <section className="border-b-2 border-text">
        <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:py-28">
          <p className="label text-text/60">What is being built</p>
          <h1 className="display-xl mt-6">The projects</h1>
          <p className="chapeau mt-8 max-w-2xl">
            Two projects are under way. Neither is usable yet: they are funded
            by the applications that are.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#shipped"
              className="label inline-flex w-fit items-center gap-2 border-b-2 border-accent-primary pb-1 text-accent-primary hover:opacity-70"
            >
              Already shipped <span aria-hidden>↓</span>
            </a>
            <a
              href="#reczi"
              className="label inline-flex w-fit items-center gap-2 border-b-2 border-text pb-1 hover:text-accent-primary"
            >
              Reczi <span aria-hidden>↓</span>
            </a>
            <a
              href="#payments"
              className="label inline-flex w-fit items-center gap-2 border-b-2 border-text pb-1 hover:text-accent-primary"
            >
              Payments without a middleman <span aria-hidden>↓</span>
            </a>
            <a
              href="#ideas"
              className="label inline-flex w-fit items-center gap-2 border-b-2 border-text pb-1 hover:text-accent-primary"
            >
              The ideas <span aria-hidden>↓</span>
            </a>
          </div>
        </div>
      </section>

      <section id="shipped" className="scroll-mt-6 border-b-2 border-text">
        <div className="mx-auto w-full max-w-7xl px-6 py-12 sm:py-16">
          <div className="grid gap-8 sm:grid-cols-12">
            <div className="sm:col-span-4">
              <p className="label text-accent-primary">Already shipped</p>
              <p className="font-heading mt-4 text-3xl uppercase leading-tight sm:text-4xl">
                {applicationsEn.length} applications are running.
              </p>
              <Link
                to="/en/outils"
                className="label mt-6 inline-flex w-fit items-center gap-2 border-b-2 border-text pb-1 hover:text-accent-primary"
              >
                See them in detail <span aria-hidden>→</span>
              </Link>
            </div>
            <ul className="flex flex-wrap content-start gap-3 sm:col-span-8">
              {applicationsEn.map((application) => {
                const contenu = (
                  <>
                    <span className="font-heading text-xl uppercase leading-none">
                      {application.name}
                    </span>
                    <span className="label opacity-60">
                      {statutEn[application.statut]}
                    </span>
                  </>
                )
                const classes =
                  'flex items-baseline gap-3 border-2 border-text px-4 py-3'
                return (
                  <li key={application.name}>
                    {application.url ? (
                      <a
                        href={application.url}
                        className={`${classes} hover:bg-text hover:text-bg`}
                      >
                        {contenu}
                      </a>
                    ) : (
                      <span className={`${classes} opacity-70`}>{contenu}</span>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </section>

      <section id="reczi" className="scroll-mt-6 bg-accent-primary text-bg">
        <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:py-28">
          <div className="grid gap-10 sm:grid-cols-12">
            <div className="sm:col-span-5">
              <p className="label opacity-70">Project — under way</p>
              <h2 className="display-card mt-6 sm:text-8xl">Reczi</h2>
              <p className="mt-6 text-lg font-medium">
                Independent journalists and creators
              </p>
            </div>
            <div className="flex flex-col justify-end sm:col-span-7">
              <p className="chapeau">
                Publish videos, articles and podcasts on your own journal,
                without depending on YouTube or Substack.
              </p>
              <dl className="mt-10 space-y-6">
                <div>
                  <dt className="label opacity-60">The problem</dt>
                  <dd className="mt-2 text-base opacity-90">
                    YouTube and Substack do two things very well: host for
                    free and bring an audience. The difficulty starts when you
                    want to make a living from it. Recommendation, the cut
                    taken and the publishing conditions are decided without
                    you, and can change overnight.
                  </dd>
                </div>
                <div>
                  <dt className="label opacity-60">What Reczi will do</dt>
                  <dd className="mt-2 text-base opacity-90">
                    You drop in your rushes, audio, scripts and notes.
                    Everything is transcribed and indexed, and any passage can
                    be found to the second. You then publish on a journal that
                    is yours.
                  </dd>
                </div>
                <div>
                  <dt className="label opacity-60">What it will not do</dt>
                  <dd className="mt-2 text-base opacity-90">
                    Bring you a ready-made audience. Reczi replaces the tool
                    and the hosting, not the recommendation algorithm. If
                    being discovered through the platform is your first need,
                    YouTube remains the right choice.
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      <section
        id="payments"
        className="scroll-mt-6 bg-accent-secondary text-bg"
      >
        <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:py-28">
          <div className="grid gap-10 sm:grid-cols-12">
            <div className="sm:col-span-5">
              <p className="label opacity-70">Project — under way</p>
              <h2 className="display-card mt-6 sm:text-6xl">
                Collecting payments without a middleman
              </h2>
              <p className="mt-6 text-lg font-medium">Anyone who sells online</p>
            </div>
            <div className="flex flex-col justify-end sm:col-span-7">
              <p className="chapeau">
                Make Lungor an authorised payment institution, instead of
                depending on someone else's licence.
              </p>
              <dl className="mt-10 space-y-6">
                <div>
                  <dt className="label opacity-60">The problem</dt>
                  <dd className="mt-2 text-base opacity-90">
                    Collecting money is a regulated trade. So everyone goes
                    through a licensed provider, which takes its cut and sets
                    its terms. The dependency is regulatory, not technical.
                  </dd>
                </div>
                <div>
                  <dt className="label opacity-60">Where we stand</dt>
                  <dd className="mt-2 text-base opacity-90">
                    Lungor collects today under the licence of a regulated
                    provider. The project is to make it that provider, or
                    failing that the only front in front of it. Four
                    regulatory steps lead there; we are on the first.
                  </dd>
                </div>
              </dl>
              <Link
                to="/en/paiement"
                className="label mt-10 inline-flex w-fit items-center gap-3 border-2 border-current px-6 py-3 hover:bg-bg hover:text-accent-secondary"
              >
                The four steps, in detail <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="ideas" className="scroll-mt-6 border-b-2 border-text bg-warm">
        <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:py-28">
          <div className="grid gap-10 sm:grid-cols-12">
            <div className="sm:col-span-5">
              <p className="label text-text/60">Open to proposals</p>
              <h2 className="display-card mt-6 sm:text-7xl">The ideas</h2>
            </div>
            <div className="flex flex-col justify-end sm:col-span-7">
              <p className="chapeau">
                What comes next is not written, and we would rather say so.
              </p>
              <p className="mt-6 text-base text-text/85">
                A service you depend on that costs you too much, a tool
                independents lack, a means nobody offers outside the large
                platforms: describe it. We read everything, we answer, and an
                idea we take on is published here with its author if they
                wish.
              </p>
              <Link
                to="/en/contact"
                className="label mt-10 inline-flex w-fit items-center gap-3 border-2 border-text bg-text px-6 py-3 text-bg hover:bg-accent-primary"
              >
                Propose an idea <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto w-full max-w-3xl px-6 py-20 sm:py-28">
          <p className="label text-accent-primary">Who pays</p>
          <h2 className="font-heading mt-6 text-4xl uppercase leading-tight sm:text-5xl">
            The applications fund the projects.
          </h2>
          <div className="prose-editorial mt-10 text-text/85">
            <p>
              Thanks to a shared organisation, a single stream of funding keeps
              every application alive, including those on their way. Using an
              application is the most direct way to move these projects
              forward.
            </p>
          </div>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/en/outils"
              className="label inline-flex w-fit items-center gap-3 border-2 border-text px-6 py-3 hover:bg-text hover:text-bg"
            >
              See the applications <span aria-hidden>→</span>
            </Link>
            <Link
              to="/en/pot"
              className="label inline-flex w-fit items-center gap-2 self-center border-b-2 border-text pb-1 hover:opacity-70"
            >
              The funding <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
