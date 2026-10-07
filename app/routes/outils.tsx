import { Link, createFileRoute } from '@tanstack/react-router'
import { applications, type Application } from '@/content/catalogue'
import { ORGANIZATION, SITE_URL, jsonLd, seo } from '@/lib/seo'

const outilsSeo = seo({
  title: "Les applications — L'Alternative Fabrique",
  description:
    "Les applications de L'Alternative Fabrique : Synthiz, Spore, Partage, Messag, Lungor, Skalpai et L'Alter. Les utiliser finance les projets suivants.",
  path: '/outils',
})

const publiees = applications.filter((application) => application.url)

export const Route = createFileRoute('/outils')({
  component: OutilsPage,
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
  if (application.statut === 'Disponible') return `Ouvrir ${application.name}`
  if (application.statut === 'Bêta') return 'Essayer la bêta'
  return null
}

function OutilsPage() {
  return (
    <div>
      <section className="border-b-2 border-text">
        <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:py-28">
          <p className="label text-text/60">La preuve</p>
          <h1 className="display-xl mt-6">Les applications</h1>
          <p className="chapeau mt-8 max-w-2xl">
            Chacune reprend un moyen précis. Grâce à une organisation
            commune, en utiliser une finance toutes les autres.
          </p>
          <Link
            to="/projets"
            className="label mt-8 inline-flex w-fit items-center gap-2 text-accent-primary hover:underline"
          >
            Ce que votre usage finance <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      {applications.map((application, i) => {
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
                    {String(i + 1).padStart(2, '0')} — {application.statut}
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
                      <dt className="label shrink-0 opacity-60">Pour</dt>
                      <dd className="opacity-90">{application.pour}</dd>
                    </div>
                    <div className="flex gap-3">
                      <dt className="label shrink-0 opacity-60">Pilier</dt>
                      <dd className="opacity-90">{application.pilier}</dd>
                    </div>
                    {application.prix ? (
                      <div className="flex gap-3">
                        <dt className="label shrink-0 opacity-60">Prix</dt>
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
                    <p className="label mt-10 opacity-60">
                      Pas encore ouverte
                    </p>
                  )}
                  {application.projet ? (
                    <Link
                      to="/paiement"
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
          <p className="label text-accent-primary">Ce qui les relie</p>
          <h2 className="font-heading mt-6 text-4xl uppercase leading-tight sm:text-5xl">
            Utiliser, c'est financer la suite.
          </h2>
          <div className="prose-editorial mt-10 text-text/85">
            <p>
              Grâce à une organisation commune, un seul financement fait
              vivre toutes les applications. Ce que vous payez pour l'une
              finance les autres : celles qui existent, celles en bêta,
              celles qui arrivent et celles qui restent à imaginer.
            </p>
          </div>
          <Link
            to="/projets"
            className="label mt-10 inline-flex w-fit items-center gap-3 border-2 border-text px-6 py-3 hover:bg-text hover:text-bg"
          >
            Voir les projets <span aria-hidden>→</span>
          </Link>
        </div>
      </section>
    </div>
  )
}
