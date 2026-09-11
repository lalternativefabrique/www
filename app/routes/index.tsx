import { Link, createFileRoute } from '@tanstack/react-router'
import { ORGANIZATION, SITE_URL, jsonLd, seo } from '@/lib/seo'

const homeSeo = seo({
  title: "L'Alternative Fabrique — l'alternative existe déjà",
  description:
    "Cinq solutions sont déjà disponibles. Découvrez ce que nous avons construit, les projets en cours et les piliers de l'alternative.",
  path: '/',
})

export const Route = createFileRoute('/')({
  component: LandingPage,
  head: () => ({
    ...homeSeo,
    meta: [
      ...homeSeo.meta,
      // WebSite + Organization are declared once, on the home page: it is the
      // node every other page's publisher reference points back to.
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

type Capacite = {
  name: string
  tagline: string
  kicker: string
  /** True once an organ has a shipped tool. Tools are named on /outils, not here. */
  shipped?: boolean
  /** Shipped but invite-only: shown as "Sur invitation", not "Disponible". */
  beta?: boolean
}

const capacites: Capacite[] = [
  {
    name: 'Connaissance',
    tagline: 'Avoir les idées, garder la main sur son savoir.',
    kicker: 'Le point de départ',
    shipped: true,
  },
  {
    name: 'Technique',
    tagline: 'Tenir ses outils sans dépendre de personne.',
    kicker: 'La machine',
    shipped: true,
  },
  {
    name: 'Création',
    tagline: 'Faire exister ce que vous lancez.',
    kicker: 'Produire',
  },
  {
    name: 'Financement',
    tagline: 'Financer ce qu\'on entreprend, sans intermédiaire qui prélève.',
    kicker: 'Le nerf',
    beta: true,
  },
  {
    name: 'Communication',
    tagline: 'Se faire connaître par ses propres moyens.',
    kicker: 'Se faire entendre',
    shipped: true,
  },
]

const realisations = [
  ['Synthiz', 'Retrouver et relier ses sources.'],
  ['Techtuel', 'Transformer la parole en texte.'],
  ['Spore', 'Envoyer ses emails depuis une infrastructure indépendante.'],
  ['Lungor', 'Piloter les revenus de son logiciel.'],
  ['Skalpai', 'Faire tourner et observer ses applications.'],
] as const

const projets = [
  {
    statut: 'En cours',
    nom: 'Le paiement',
    detail: 'Encaisser sans laisser un intermédiaire décider des règles.',
  },
  {
    statut: 'Ensuite',
    nom: "L'investissement",
    detail: 'Permettre à chacun de financer directement ce qui se construit.',
  },
] as const

function LandingPage() {
  return (
    <div>
      {/* COVER */}
      <section className="border-b-2 border-text">
        <div className="mx-auto w-full max-w-7xl px-6 pb-20 pt-12 sm:pb-28 sm:pt-16">
          <div className="flex items-center justify-between">
            <p className="label text-text/60">№ 01 — Édition courante</p>
            <p className="label text-accent-primary">Manifeste</p>
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
              L'alternative est possible. Elle existe déjà. Nous construisons
              des solutions concrètes pour reprendre la main sur nos moyens de
              produire, de financer et de communiquer.
            </p>
            <div className="sm:col-span-4 sm:col-start-9 sm:self-end">
              <p className="label text-text/60">Au sommaire</p>
              <ul className="mt-3 space-y-1 text-base">
                <li>— 5 solutions disponibles</li>
                <li>— 2 projets à suivre</li>
                <li>— 5 piliers à maîtriser</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT ALREADY EXISTS */}
      <section className="border-b-2 border-text">
        <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:py-28">
          <p className="label text-accent-primary">Ce qui existe déjà</p>
          <div className="mt-6 grid gap-8 sm:grid-cols-12">
            <h2 className="display-lg sm:col-span-7">
              5 solutions.<br />Disponibles maintenant.
            </h2>
            <p className="chapeau sm:col-span-5 sm:self-end">
              Pas une promesse pour plus tard. Des produits qui tournent, que
              vous pouvez essayer et utiliser aujourd'hui.
            </p>
          </div>

          <div className="mt-14 grid gap-px bg-text sm:grid-cols-2">
            {realisations.map(([nom, detail], index) => (
              <article key={nom} className="bg-bg p-8 sm:p-10">
                <p className="label text-text/50">
                  {String(index + 1).padStart(2, '0')} — Disponible
                </p>
                <h3 className="font-heading mt-5 text-4xl uppercase leading-none sm:text-5xl">
                  {nom}
                </h3>
                <p className="mt-5 text-base text-text/75">{detail}</p>
              </article>
            ))}
          </div>

          <Link
            to="/outils"
            className="label mt-10 inline-flex w-fit items-center gap-3 border-2 border-text px-6 py-3 hover:bg-text hover:text-bg"
          >
            Découvrir les 5 solutions <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      {/* CURRENT PROJECTS */}
      <section className="bg-accent-secondary text-bg">
        <div className="mx-auto w-full max-w-7xl px-6 py-24 sm:py-32">
          <p className="label opacity-70">Ce que nous construisons</p>
          <h2 className="display-xl mt-6">Les projets en cours.</h2>
          <div className="mt-14 grid gap-px bg-bg/40 sm:grid-cols-2">
            {projets.map((projet) => (
              <article key={projet.nom} className="bg-accent-secondary p-8 sm:p-10">
                <p className="label opacity-70">{projet.statut}</p>
                <h3 className="font-heading mt-5 text-4xl uppercase leading-none sm:text-5xl">
                  {projet.nom}
                </h3>
                <p className="mt-5 text-base opacity-90">{projet.detail}</p>
              </article>
            ))}
          </div>
          <p className="chapeau mt-12 max-w-3xl opacity-90">
            Une part des revenus de nos solutions finance directement la suite.
            Le disponible paie ce qui se construit.
          </p>
          <Link
            to="/pot"
            className="label mt-10 inline-flex w-fit items-center gap-3 border-2 border-bg px-6 py-3 hover:bg-bg hover:text-accent-secondary"
          >
            Voir les projets et leur financement <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      {/* PILLARS */}
      <section className="border-b-2 border-text">
        <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:py-28">
          <p className="label text-accent-primary">La vision d'ensemble</p>
          <h2 className="display-lg mt-6">5 piliers à maîtriser.</h2>
          <p className="chapeau mt-8 max-w-2xl">
            Connaissance, technique, création, financement et communication :
            les cinq capacités nécessaires pour qu'une alternative tienne.
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
            to="/apps"
            className="label mt-10 inline-flex w-fit items-center gap-2 text-accent-primary hover:underline"
          >
            Comprendre les 5 piliers <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      {/* QUOTE / STATEMENT */}
      <section>
        <div className="mx-auto w-full max-w-7xl px-6 py-24 sm:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <p className="label text-text/50">L'idée fixe</p>
            <p className="font-heading mt-8 text-4xl uppercase leading-tight sm:text-6xl">
              Reprendre les moyens, un par un.
              <br />
              Les moyens de construire une{' '}
              <span className="text-accent-primary">alternative</span>.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
