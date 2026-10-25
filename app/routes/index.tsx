import { Link, createFileRoute } from '@tanstack/react-router'
import { AppIcone } from '@/components/AppIcone'
import { Conviction } from '@/components/Conviction'
import { Inscription } from '@/components/Inscription'
import {
  applications,
  applicationsDuPilier,
  enService,
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

function SectionHead({ titre, repere }: { titre: string; repere: string }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-4 border-b-[3px] border-text pb-3">
      <h2 className="display-lg">{titre}</h2>
      <span className="label">{repere}</span>
    </div>
  )
}

const lienTrait =
  'label inline-flex w-fit items-center gap-2 border-b border-current pb-1 pt-3 hover:text-accent-primary'

function LandingPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
      <section className="border-b-[3px] border-text pb-14 pt-16 sm:pt-20">
        <p className="label text-accent-primary">§ 01 — L'objectif</p>
        <h1 className="display-xxl normal-case mt-7">
          L'Alternative
          <br />
          Fabrique<span className="text-accent-primary">.</span>
        </h1>
        <div className="mt-14 grid gap-10 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="chapeau">
              Brique par brique, nous construisons les outils numériques
              essentiels — messagerie, publication, paiement, hébergement — pour
              bâtir une industrie indépendante. Nous puisons dans des décennies
              de{' '}
              <Link to="/litterature" className="font-bold text-text hover:text-accent-primary">
                standards et de savoir-faire éprouvés
                <span aria-hidden className="text-accent-primary"> →</span>
              </Link>{' '}
              pour les rendre robustes, sobres et durables.
            </p>
            <Link
              to="/outils"
              className="mt-8 inline-flex min-h-11 w-fit items-center gap-3 bg-text px-6 font-semibold text-bg hover:bg-accent-primary"
            >
              Voir les applications <span aria-hidden>→</span>
            </Link>
          </div>
          <div className="border-t border-text pt-4 md:col-span-4 md:col-start-9 md:self-end">
            <p className="label">Le principe</p>
            <ol className="mt-3 grid grid-cols-[2.5rem_1fr] gap-y-2 font-mono text-sm">
              {[
                `${enService.length} applications en service`,
                'Leurs revenus financent la suite',
                `${projetsEnCours.length} projets en cours`,
                'Des idées ouvertes à proposition',
              ].map((ligne, index) => (
                <li key={ligne} className="contents">
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <span>{ligne}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>


      <section className="pt-20 sm:pt-24">
        <SectionHead titre="Des applications en service." repere="§ 02 — La preuve" />
        <p className="mt-5 max-w-xl text-text/75">
          Certaines sont ouvertes, d'autres en bêta, certaines arrivent. Chacune
          remplace un outil précis.
        </p>
        <div className="mt-10 grid border-t border-text sm:grid-cols-2 lg:grid-cols-3">
          {applications.map((application, index) => {
            const contenu = (
              <>
                <span className="label flex justify-between gap-3">
                  <span className="text-text/60">
                    A-{String(index + 1).padStart(2, '0')} · {application.pilier}
                  </span>
                  <span
                    className={
                      application.statut === 'Disponible'
                        ? 'bg-accent-primary px-1.5 text-bg'
                        : 'border border-text px-1.5'
                    }
                  >
                    {application.statut}
                  </span>
                </span>
                <span className="mt-4 flex items-center gap-3">
                  <AppIcone application={application} />
                  <h3 className="text-3xl">{application.name}</h3>
                </span>
                <p className="mt-3 text-text/75">{application.resume}</p>
              </>
            )
            const classes = 'block border-b border-text/25 py-7 sm:pr-6'
            return application.url ? (
              <a
                key={application.name}
                href={application.url}
                className={`${classes} hover:text-accent-primary`}
              >
                {contenu}
              </a>
            ) : (
              <article key={application.name} className={classes}>
                {contenu}
              </article>
            )
          })}
        </div>
        <Link to="/outils" className={`${lienTrait} mt-7`}>
          Le détail de chaque application <span aria-hidden>→</span>
        </Link>
      </section>

      <div className="mt-24 sm:mt-28">
        <Conviction />
      </div>

      <section className="pt-24 sm:pt-28">
        <SectionHead titre="Ce que cet argent construit." repere="§ 03 — Les projets" />
        <p className="mt-5 max-w-xl text-text/75">
          Des projets prêts, d'autres en cours. Les premiers financent les
          suivants et les gardent indépendants : hébergement, maintenance,
          aucun investisseur.
        </p>
        <div className="grid gap-x-12 md:grid-cols-2">
          {projets.map((projet, index) => (
            <article key={projet.nom} className="border-b border-text/25 py-8">
              <p className="label text-accent-primary">
                P-{String(index + 1).padStart(2, '0')} · {projet.etat}
              </p>
              <h3 className="mt-4 text-3xl">{projet.nom}</h3>
              <p className="mt-3 text-text/75">{projet.resume}</p>
            </article>
          ))}
        </div>
        <Link to="/projets" className={`${lienTrait} mt-7`}>
          Voir les projets <span aria-hidden>→</span>
        </Link>
      </section>

      <section className="mt-24 grid gap-8 border-y border-text border-t-[3px] py-12 sm:mt-28 md:grid-cols-2">
        <div>
          <p className="label">§ 04 — Les idées</p>
          <h2 className="display-lg mt-5">La suite est ouverte.</h2>
        </div>
        <div className="flex flex-col justify-end gap-6">
          <p className="chapeau">
            Ce qui vient après n'est pas écrit. Un outil qui vous manque, une
            dépendance qui vous pèse : proposez-le.
          </p>
          <Link
            to="/projets"
            hash="idees"
            className="inline-flex min-h-11 w-fit items-center gap-3 border-2 border-text px-6 font-semibold hover:bg-text hover:text-bg"
          >
            Proposer une idée <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      <section id="piliers" className="scroll-mt-6 pt-20 sm:pt-24">
        <SectionHead titre="Quatre piliers." repere="Vue d'ensemble" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4">
          {piliers.map((pilier, index) => (
            <article key={pilier.name} className="border-b border-text/25 py-7 sm:pr-6">
              <p className="font-mono text-4xl text-accent-primary">
                {String(index + 1).padStart(2, '0')}
              </p>
              <h3 className="mt-3 text-2xl">{pilier.name}</h3>
              <p className="mt-3 text-sm text-text/75">{pilier.phrase}</p>
              <p className="label mt-4">
                {applicationsDuPilier(pilier.name)
                  .map((application) => application.name)
                  .join(' · ')}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-24 border-t border-text pb-20 pt-12 sm:mt-28">
        <div className="max-w-3xl">
          <Inscription />
          <Link to="/blog" className={`${lienTrait} mt-8`}>
            Lire la revue <span aria-hidden>→</span>
          </Link>
        </div>
      </section>
    </div>
  )
}
