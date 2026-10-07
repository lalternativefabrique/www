import { Link, createFileRoute } from '@tanstack/react-router'
import { Inscription } from '@/components/Inscription'
import {
  applicationsEn,
  applicationsEnDuPilier,
  etatEn,
  pilierEn,
  piliersEn,
  projetsEn,
  statutEn,
} from '@/content/catalogue.en'
import { seo } from '@/lib/seo'

const homeSeo = seo({
  title: "L'Alternative Fabrique — using one funds the next",
  description:
    'We are taking back, one by one, our means of producing online. Applications already run: using them funds the projects that follow.',
  path: '/en',
  locale: 'en',
  alternate: { fr: '/', en: '/en' },
})

export const Route = createFileRoute('/en/')({
  component: LandingPageEn,
  head: () => homeSeo,
})

function LandingPageEn() {
  return (
    <div>
      <section className="border-b-2 border-text">
        <div className="mx-auto w-full max-w-7xl px-6 pb-20 pt-12 sm:pb-28 sm:pt-16">
          <p className="label text-accent-primary">01 — The goal</p>

          <h1 className="display-xxl mt-8 w-fit sm:mt-10">
            L'Alternative
            <span className="block text-right text-[0.58em] leading-[0.95] text-accent-primary">
              Fabrique
            </span>
          </h1>

          <div className="mt-10 grid gap-10 sm:mt-14 sm:grid-cols-12">
            <div className="sm:col-span-7">
              <p className="chapeau">
                Hosting, sending an email, publishing, collecting a payment:
                our means of producing online belong to others. We are taking
                them back one by one, with applications you can use.
              </p>
              <Link
                to="/en/outils"
                className="label mt-10 inline-flex w-fit items-center gap-3 border-2 border-text bg-text px-6 py-3 text-bg hover:bg-accent-primary"
              >
                See the applications <span aria-hidden>→</span>
              </Link>
            </div>
            <div className="sm:col-span-4 sm:col-start-9 sm:self-end">
              <p className="label text-text/60">The reasoning</p>
              <ul className="mt-3 space-y-1 text-base">
                <li>— {applicationsEn.length} applications running</li>
                <li>— Their revenue funds what comes next</li>
                <li>— {projetsEn.length} projects under way</li>
                <li>— Ideas open to proposals</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b-2 border-text">
        <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:py-28">
          <p className="label text-accent-primary">02 — The proof</p>
          <div className="mt-6 grid gap-8 sm:grid-cols-12">
            <h2 className="display-lg sm:col-span-7">Applications that run.</h2>
            <p className="chapeau sm:col-span-5 sm:self-end">
              Some are open, some in beta, one is on its way. Each takes back
              one specific means.
            </p>
          </div>

          <div className="mt-14 grid gap-px bg-text sm:grid-cols-2 lg:grid-cols-3">
            {applicationsEn.map((application) => {
              const contenu = (
                <>
                  <p
                    className={`label ${
                      application.statut === 'Disponible'
                        ? 'text-accent-primary'
                        : 'text-text/50'
                    }`}
                  >
                    {statutEn[application.statut]}
                  </p>
                  <h3 className="font-heading mt-5 text-4xl uppercase leading-none">
                    {application.name}
                  </h3>
                  <p className="mt-5 text-base text-text/75">
                    {application.resume}
                  </p>
                </>
              )
              return application.url ? (
                <a
                  key={application.name}
                  href={application.url}
                  className="bg-bg p-8 hover:bg-warm sm:p-10"
                >
                  {contenu}
                </a>
              ) : (
                <article key={application.name} className="bg-bg p-8 sm:p-10">
                  {contenu}
                </article>
              )
            })}
          </div>

          <Link
            to="/en/outils"
            className="label mt-10 inline-flex w-fit items-center gap-3 border-2 border-text px-6 py-3 hover:bg-text hover:text-bg"
          >
            Each application in detail <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      <section className="border-b-2 border-text bg-text text-bg">
        <div className="mx-auto w-full max-w-7xl px-6 py-24 sm:py-32">
          <p className="label opacity-70">03 — The mechanism</p>
          <h2 className="display-xl mt-6">
            Using one{' '}
            <span className="text-accent-primary">funds the next</span>.
          </h2>
          <p className="chapeau mt-10 max-w-3xl opacity-90">
            Thanks to a shared organisation, a single stream of funding keeps
            every application alive. What you pay for one funds the others:
            those that exist, those in beta, those on their way and those
            still to be imagined.
          </p>
          <Link
            to="/en/pot"
            className="label mt-10 inline-flex w-fit items-center gap-3 border-2 border-bg px-6 py-3 hover:bg-bg hover:text-text"
          >
            How the funding works <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      <section className="bg-accent-secondary text-bg">
        <div className="mx-auto w-full max-w-7xl px-6 py-24 sm:py-32">
          <p className="label opacity-70">04 — The projects</p>
          <h2 className="display-lg mt-6">What that money builds.</h2>
          <div className="mt-14 grid gap-px bg-bg/40 sm:grid-cols-2">
            {projetsEn.map((projet) => (
              <article
                key={projet.nom}
                className="bg-accent-secondary p-8 sm:p-10"
              >
                <p className="label opacity-70">{etatEn[projet.etat]}</p>
                <h3 className="font-heading mt-5 text-3xl uppercase leading-none sm:text-4xl">
                  {projet.nom}
                </h3>
                <p className="mt-5 text-base opacity-90">{projet.resume}</p>
              </article>
            ))}
          </div>
          <Link
            to="/en/projets"
            className="label mt-10 inline-flex w-fit items-center gap-3 border-2 border-bg px-6 py-3 hover:bg-bg hover:text-accent-secondary"
          >
            See the projects <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      <section className="border-b-2 border-text bg-warm">
        <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:py-28">
          <div className="grid gap-10 sm:grid-cols-12">
            <div className="sm:col-span-6">
              <p className="label text-text/60">05 — The ideas</p>
              <h2 className="display-lg mt-6">What comes next is open.</h2>
            </div>
            <div className="flex flex-col justify-end sm:col-span-6">
              <p className="chapeau">
                What comes after is not written. A means you lack, a
                dependency that costs you: propose it.
              </p>
              <Link
                to="/en/projets"
                hash="ideas"
                className="label mt-8 inline-flex w-fit items-center gap-3 border-2 border-text px-6 py-3 hover:bg-text hover:text-bg"
              >
                Propose an idea <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="pillars" className="scroll-mt-6 border-b-2 border-text">
        <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:py-28">
          <p className="label text-accent-primary">The overview</p>
          <h2 className="display-lg mt-6">Four pillars.</h2>
          <p className="chapeau mt-8 max-w-2xl">
            Every application and every project takes back one of these four
            means.
          </p>
          <div className="mt-12 grid gap-px bg-text sm:grid-cols-2 lg:grid-cols-4">
            {piliersEn.map((pilier, index) => (
              <article key={pilier.name} className="bg-bg p-6">
                <p className="label text-text/45">
                  {String(index + 1).padStart(2, '0')}
                </p>
                <h3 className="font-heading mt-5 text-2xl uppercase leading-none">
                  {pilierEn[pilier.name]}
                </h3>
                <p className="mt-4 text-sm text-text/70">{pilier.phrase}</p>
                <p className="label mt-6 text-accent-primary">
                  {applicationsEnDuPilier(pilier.name)
                    .map((application) => application.name)
                    .join(' · ')}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto w-full max-w-3xl px-6 py-20 sm:py-28">
          <Inscription />
          <Link
            to="/en/blog"
            className="label mt-10 inline-flex w-fit items-center gap-2 text-accent-primary hover:underline"
          >
            Read the review <span aria-hidden>→</span>
          </Link>
        </div>
      </section>
    </div>
  )
}
