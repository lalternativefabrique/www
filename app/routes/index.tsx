import { Link, createFileRoute } from '@tanstack/react-router'
import { Inscription } from '@/components/Inscription'
import {
  applications,
  applicationsDuPilier,
  piliers,
  projets,
  projetsEnCours,
} from '@/content/catalogue'
import { ORGANIZATION, SITE_URL, jsonLd, seo } from '@/lib/seo'

const homeSeo = seo({
  title: "L'Alternative Fabrique — utiliser, c'est financer la suite",
  description:
    "Nous reprenons un par un nos moyens de produire en ligne. Des applications tournent déjà : les utiliser finance les projets suivants.",
  path: '/',
})

export const Route = createFileRoute('/')({
  component: LandingPage,
  head: () => ({
    ...homeSeo,
    meta: [
      ...homeSeo.meta,
      jsonLd({
        '@context': 'https://schema.org',
        '@graph': [
          ORGANIZATION,
          {
            '@type': 'WebSite',
            '@id': `${SITE_URL}/#website`,
            url: SITE_URL,
            name: "L'Alternative Fabrique",
            inLanguage: 'fr-FR',
            publisher: { '@id': `${SITE_URL}/#organization` },
          },
        ],
      }),
    ],
  }),
})

function LandingPage() {
  return (
    <div>
      <section className="border-b-2 border-text">
        <div className="mx-auto w-full max-w-7xl px-6 pb-20 pt-12 sm:pb-28 sm:pt-16">
          <p className="label text-accent-primary">01 — L'objectif</p>

          <h1 className="display-xxl mt-8 w-fit sm:mt-10">
            L'Alternative
            <span className="block text-right text-[0.58em] leading-[0.95] text-accent-primary">
              Fabrique
            </span>
          </h1>

          <div className="mt-10 grid gap-10 sm:mt-14 sm:grid-cols-12">
            <div className="sm:col-span-7">
              <p className="chapeau">
                Héberger, envoyer un email, publier, encaisser : nos moyens de
                produire en ligne appartiennent à d'autres. Nous les reprenons
                un par un, avec des applications que vous pouvez utiliser.
              </p>
              <Link
                to="/outils"
                className="label mt-10 inline-flex w-fit items-center gap-3 border-2 border-text bg-text px-6 py-3 text-bg hover:bg-accent-primary"
              >
                Voir les applications <span aria-hidden>→</span>
              </Link>
            </div>
            <div className="sm:col-span-4 sm:col-start-9 sm:self-end">
              <p className="label text-text/60">Le raisonnement</p>
              <ul className="mt-3 space-y-1 text-base">
                <li>— {applications.length} applications qui tournent</li>
                <li>— Leurs revenus financent la suite</li>
                <li>— {projetsEnCours.length} projets en cours</li>
                <li>— Des idées ouvertes à proposition</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b-2 border-text">
        <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:py-28">
          <p className="label text-accent-primary">02 — La preuve</p>
          <div className="mt-6 grid gap-8 sm:grid-cols-12">
            <h2 className="display-lg sm:col-span-7">
              Des applications qui tournent.
            </h2>
            <p className="chapeau sm:col-span-5 sm:self-end">
              Certaines sont ouvertes, d'autres en bêta, une arrive. Chacune
              reprend un moyen précis.
            </p>
          </div>

          <div className="mt-14 grid gap-px bg-text sm:grid-cols-2 lg:grid-cols-3">
            {applications.map((application) => {
              const contenu = (
                <>
                  <p
                    className={`label ${
                      application.statut === 'Disponible'
                        ? 'text-accent-primary'
                        : 'text-text/50'
                    }`}
                  >
                    {application.statut}
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
            to="/outils"
            className="label mt-10 inline-flex w-fit items-center gap-3 border-2 border-text px-6 py-3 hover:bg-text hover:text-bg"
          >
            Le détail de chaque application <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      <section className="border-b-2 border-text bg-text text-bg">
        <div className="mx-auto w-full max-w-7xl px-6 py-24 sm:py-32">
          <p className="label opacity-70">03 — Le mécanisme</p>
          <h2 className="display-xl mt-6">
            Utiliser, c'est{' '}
            <span className="text-accent-primary">financer la suite</span>.
          </h2>
          <p className="chapeau mt-10 max-w-3xl opacity-90">
            Grâce à une organisation commune, un seul financement fait vivre
            toutes les applications. Ce que vous payez pour l'une finance
            les autres : celles qui existent, celles en bêta, celles qui
            arrivent et celles qui restent à imaginer.
          </p>
          <Link
            to="/pot"
            className="label mt-10 inline-flex w-fit items-center gap-3 border-2 border-bg px-6 py-3 hover:bg-bg hover:text-text"
          >
            Comment le financement fonctionne <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      <section className="bg-accent-secondary text-bg">
        <div className="mx-auto w-full max-w-7xl px-6 py-24 sm:py-32">
          <p className="label opacity-70">04 — Les projets</p>
          <h2 className="display-lg mt-6">Ce que cet argent construit.</h2>
          <div className="mt-14 grid gap-px bg-bg/40 sm:grid-cols-2">
            {projets.map((projet) => (
              <article
                key={projet.nom}
                className="bg-accent-secondary p-8 sm:p-10"
              >
                <p className="label opacity-70">{projet.etat}</p>
                <h3 className="font-heading mt-5 text-3xl uppercase leading-none sm:text-4xl">
                  {projet.nom}
                </h3>
                <p className="mt-5 text-base opacity-90">{projet.resume}</p>
              </article>
            ))}
          </div>
          <Link
            to="/projets"
            className="label mt-10 inline-flex w-fit items-center gap-3 border-2 border-bg px-6 py-3 hover:bg-bg hover:text-accent-secondary"
          >
            Voir les projets <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      <section className="border-b-2 border-text bg-warm">
        <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:py-28">
          <div className="grid gap-10 sm:grid-cols-12">
            <div className="sm:col-span-6">
              <p className="label text-text/60">05 — Les idées</p>
              <h2 className="display-lg mt-6">La suite est ouverte.</h2>
            </div>
            <div className="flex flex-col justify-end sm:col-span-6">
              <p className="chapeau">
                Ce qui vient après n'est pas écrit. Un moyen qui vous manque,
                une dépendance qui vous coûte : proposez-le.
              </p>
              <Link
                to="/projets"
                hash="idees"
                className="label mt-8 inline-flex w-fit items-center gap-3 border-2 border-text px-6 py-3 hover:bg-text hover:text-bg"
              >
                Proposer une idée <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="piliers" className="scroll-mt-6 border-b-2 border-text">
        <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:py-28">
          <p className="label text-accent-primary">La vue d'ensemble</p>
          <h2 className="display-lg mt-6">Quatre piliers.</h2>
          <p className="chapeau mt-8 max-w-2xl">
            Chaque application et chaque projet reprend l'un de ces quatre
            moyens.
          </p>
          <div className="mt-12 grid gap-px bg-text sm:grid-cols-2 lg:grid-cols-4">
            {piliers.map((pilier, index) => (
              <article key={pilier.name} className="bg-bg p-6">
                <p className="label text-text/45">
                  {String(index + 1).padStart(2, '0')}
                </p>
                <h3 className="font-heading mt-5 text-2xl uppercase leading-none">
                  {pilier.name}
                </h3>
                <p className="mt-4 text-sm text-text/70">{pilier.phrase}</p>
                <p className="label mt-6 text-accent-primary">
                  {applicationsDuPilier(pilier.name)
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
            to="/blog"
            className="label mt-10 inline-flex w-fit items-center gap-2 text-accent-primary hover:underline"
          >
            Lire la revue <span aria-hidden>→</span>
          </Link>
        </div>
      </section>
    </div>
  )
}
