import { Link, createFileRoute } from '@tanstack/react-router'
import type { Application } from '@/content/catalogue'
import { applicationsEn, pilierEn, statutEn } from '@/content/catalogue.en'
import { ORGANIZATION, SITE_URL, jsonLd, seo } from '@/lib/seo'

const outilsSeo = seo({
  title: "The applications — L'Alternative Fabrique",
  description:
    "The applications of L'Alternative Fabrique: Synthiz, Spore, Partage, Messag, Lungor, Skalpai and L'Alter. Using them funds the projects that follow.",
  path: '/en/outils',
  locale: 'en',
  alternate: { fr: '/outils', en: '/en/outils' },
})

const publiees = applicationsEn.filter((application) => application.url)

export const Route = createFileRoute('/en/outils')({
  component: OutilsPageEn,
  head: () => ({
    ...outilsSeo,
    meta: [
      ...outilsSeo.meta,
      jsonLd({
        '@context': 'https://schema.org',
        '@graph': [
          {
            ...ORGANIZATION,
            sameAs: publiees.map((application) => application.url),
          },
          ...publiees.map((application) => ({
            '@type': 'SoftwareApplication',
            '@id': `${application.url}/#software`,
            name: application.name,
            url: application.url,
            applicationCategory: 'BusinessApplication',
            description: application.detail,
            audience: { '@type': 'Audience', audienceType: application.pour },
            publisher: { '@id': `${SITE_URL}/#organization` },
          })),
        ],
      }),
    ],
  }),
})

const accentClass: Record<Application['accent'], string> = {
  primary: 'bg-accent-primary text-bg',
  secondary: 'bg-accent-secondary text-bg',
  warm: 'bg-warm text-text',
  paper: 'bg-bg text-text border-y-2 border-text',
}

function action(application: Application) {
  if (application.statut === 'Disponible') return `Open ${application.name}`
  if (application.statut === 'Bêta') return 'Try the beta'
  return null
}

function OutilsPageEn() {
  return (
    <div>
      <section className="border-b-2 border-text">
        <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:py-28">
          <p className="label text-text/60">The proof</p>
          <h1 className="display-xl mt-6">The applications</h1>
          <p className="chapeau mt-8 max-w-2xl">
            Each takes back one specific means. Thanks to a shared
            organisation, using one funds all the others.
          </p>
          <Link
            to="/en/projets"
            className="label mt-8 inline-flex w-fit items-center gap-2 text-accent-primary hover:underline"
          >
            What your use funds <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      {applicationsEn.map((application, i) => {
        const libelle = action(application)
        return (
          <section
            key={application.name}
            className={accentClass[application.accent]}
          >
            <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:py-28">
              <div className="grid gap-10 sm:grid-cols-12">
                <div className="sm:col-span-5">
                  <p className="label opacity-70">
                    {String(i + 1).padStart(2, '0')} —{' '}
                    {statutEn[application.statut]}
                  </p>
                  <h2 className="display-card mt-6 sm:text-8xl">
                    {application.name}
                  </h2>
                </div>

                <div className="flex flex-col justify-end sm:col-span-7">
                  <p className="chapeau">{application.tagline}</p>
                  <p className="mt-6 text-base opacity-80">
                    {application.detail}
                  </p>

                  <dl className="mt-8 space-y-2 text-sm">
                    <div className="flex gap-3">
                      <dt className="label shrink-0 opacity-60">For</dt>
                      <dd className="opacity-90">{application.pour}</dd>
                    </div>
                    <div className="flex gap-3">
                      <dt className="label shrink-0 opacity-60">Pillar</dt>
                      <dd className="opacity-90">
                        {pilierEn[application.pilier]}
                      </dd>
                    </div>
                    {application.prix ? (
                      <div className="flex gap-3">
                        <dt className="label shrink-0 opacity-60">Price</dt>
                        <dd className="opacity-90">{application.prix}</dd>
                      </div>
                    ) : null}
                  </dl>

                  {application.url && libelle ? (
                    <a
                      href={application.url}
                      className="label mt-10 inline-flex w-fit items-center gap-3 border-2 border-current px-6 py-3 hover:opacity-70"
                    >
                      {libelle} <span aria-hidden>→</span>
                    </a>
                  ) : (
                    <p className="label mt-10 opacity-60">Not open yet</p>
                  )}
                  {application.projet ? (
                    <Link
                      to="/en/paiement"
                      className="label mt-6 inline-flex w-fit items-center gap-2 border-b-2 border-current pb-1 hover:opacity-70"
                    >
                      {application.projet} <span aria-hidden>→</span>
                    </Link>
                  ) : null}
                </div>
              </div>
            </div>
          </section>
        )
      })}

      <section className="border-t-2 border-text">
        <div className="mx-auto w-full max-w-3xl px-6 py-20 sm:py-28">
          <p className="label text-accent-primary">What connects them</p>
          <h2 className="font-heading mt-6 text-4xl uppercase leading-tight sm:text-5xl">
            Using one funds the next.
          </h2>
          <div className="prose-editorial mt-10 text-text/85">
            <p>
              Thanks to a shared organisation, a single stream of funding keeps
              every application alive. What you pay for one funds the others:
              those that exist, those in beta, those on their way and those
              still to be imagined.
            </p>
          </div>
          <Link
            to="/en/projets"
            className="label mt-10 inline-flex w-fit items-center gap-3 border-2 border-text px-6 py-3 hover:bg-text hover:text-bg"
          >
            See the projects <span aria-hidden>→</span>
          </Link>
        </div>
      </section>
    </div>
  )
}
