import { useEffect, useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { ORGANIZATION, SITE_URL, jsonLd, seo } from '@/lib/seo'

const outilsSeo = seo({
  title: "Les outils — L'Alternative Fabrique",
  description:
    "Les outils de L'Alternative Fabrique qui tournent aujourd'hui : Synthiz, Techtuel, Spore, Lungor, Skalpai. À chaque organe son outil.",
  path: '/outils',
})

export const Route = createFileRoute('/outils')({
  component: OutilsPage,
  head: () => ({
    ...outilsSeo,
    meta: [
      ...outilsSeo.meta,
      // This page is the only place the product domains and the fabrique are
      // named together. Declaring each tool as published by the organization
      // is what lets an answer engine attribute Spore or Synthiz to it.
      jsonLd({
        '@context': 'https://schema.org',
        '@graph': [
          // sameAs is rebuilt from the tools listed below rather than reusing
          // the constant, so this page can never advertise a domain list that
          // disagrees with what it actually renders.
          { ...ORGANIZATION, sameAs: outils.map((outil) => outil.url) },
          ...outils.map((outil) => ({
            '@type': 'SoftwareApplication',
            '@id': `${outil.url}/#software`,
            name: outil.name,
            url: outil.url,
            applicationCategory: 'BusinessApplication',
            description: outil.detail,
            audience: { '@type': 'Audience', audienceType: outil.pour },
            publisher: { '@id': `${SITE_URL}/#organization` },
          })),
        ],
      }),
    ],
  }),
})

type Outil = {
  name: string
  organe: string
  url: string
  tagline: string
  detail: string
  pour: string
  prix?: string
  /** Invite-only: no open sign-up yet. */
  invitation?: boolean
  accent: 'primary' | 'secondary' | 'warm' | 'paper'
  /** Where the tool sits in the fabrique — shown in the detail modal. */
  fabrique: {
    role: string
    amont: string
    aval: string
    permet: string[]
  }
}

const outils: Outil[] = [
  {
    name: 'Synthiz',
    organe: 'Connaissance',
    url: 'https://synthiz.com',
    tagline: 'Votre mémoire de travail, alimentée par vos sources.',
    detail:
      "Transcrivez vidéos, podcasts et documents, puis retrouvez, reliez et synthétisez ce que vous avez accumulé. Vos notes et vos sources restent les vôtres.",
    pour: 'Créateurs, chercheurs, consultants, veilleurs',
    prix: 'Gratuit · Pro 5 €/mois · Max 12 €/mois',
    accent: 'primary',
    fabrique: {
      role: "Le produit qui rend la connaissance utilisable au quotidien.",
      amont: "Repose sur Techtuel pour transformer vidéos et podcasts en texte.",
      aval: "Alimente tout le reste : on ne décide, ne crée et ne finance rien sans savoir.",
      permet: [
        "Garder ses sources hors des plateformes qui les indexent pour elles",
        "Retrouver et citer précisément au lieu de paraphraser de mémoire",
        "Constituer une matière de travail qui reste disponible dans dix ans",
      ],
    },
  },
  {
    name: 'Techtuel',
    organe: 'Connaissance',
    url: 'https://techtuel.com',
    tagline: "L'API qui transforme n'importe quelle source en texte.",
    detail:
      "Extraction et transcription de vidéos, podcasts et audio, servies par une API. Le moteur qui fait tourner Synthiz, disponible directement pour vos propres produits.",
    pour: 'Développeurs et éditeurs de logiciels',
    accent: 'paper',
    fabrique: {
      role: "L'entrée de matière première. Rien ne commence sans lui.",
      amont: "Tourne sur une infrastructure de calcul française — coût connu au centime.",
      aval: "Fait tourner Synthiz, et s'ouvre à qui veut bâtir sa propre fabrique.",
      permet: [
        "Publier des tarifs stables, parce qu'aucun maillon n'est facturé par un tiers imprévisible",
        "Traiter du contenu multilingue sans que la facture change avec la langue",
        "Construire un produit sur une brique dont on connaît le coût réel",
      ],
    },
  },
  {
    name: 'Spore',
    organe: 'Communication',
    url: 'https://sporee.fr',
    tagline: 'Vos emails partent de votre infrastructure.',
    detail:
      "Rattachez vos domaines, générez vos identités DKIM, publiez vos enregistrements DNS et envoyez. L'infrastructure SMTP nous appartient — vous ne louez pas une couche posée sur celle d'un autre.",
    pour: 'Équipes techniques qui envoient des emails transactionnels',
    accent: 'secondary',
    fabrique: {
      role: "La voix de la fabrique. Ce qui sort d'ici part de chez nous.",
      amont: "Infrastructure SMTP en propre — serveur, adresse IP, signature DKIM.",
      aval: "Porte les messages de tous les autres outils, sans intermédiaire.",
      permet: [
        "Écrire à ses clients sans qu'un tiers puisse suspendre le canal",
        "Rattacher ses propres domaines plutôt que d'emprunter ceux d'un fournisseur",
        "Ne pas voir sa capacité d'envoi devenir une variable commerciale",
      ],
    },
  },
  {
    name: 'Lungor',
    organe: 'Financement',
    url: 'https://lungor.fr',
    tagline: 'Les revenus de votre SaaS, enfin lisibles.',
    detail:
      "Chiffre d'affaires, abonnements, relances et factures conformes, sur un seul tableau de bord. De quoi arrêter de suivre ses revenus dans un tableur.",
    pour: 'Développeurs solos et petites équipes qui éditent un SaaS',
    invitation: true,
    accent: 'warm',
    fabrique: {
      role: "Ce qui permet à la fabrique de tenir : encaisser ce qu'elle produit.",
      amont: "S'appuie sur des prestataires de paiement agréés — nous ne touchons ni vos coordonnées bancaires ni votre identité client.",
      aval: "Encaissera d'abord nos propres outils, avant d'être ouvert à d'autres.",
      permet: [
        "Voir ce qu'on gagne sans reconstruire un tableur chaque mois",
        "Émettre des factures conformes sans y passer ses soirées",
        "Ne pas confier le nerf de son activité à un intermédiaire qui prélève",
      ],
    },
  },
  {
    name: 'Skalpai',
    organe: 'Technique',
    url: 'https://skalpai.dev',
    tagline: 'Voir ce que font vos applications, sans y passer un budget.',
    detail:
      "Observabilité et télémétrie pour vos services, avec le CLI sklp et le gestionnaire de toolchain skt. C'est le socle sur lequel tournent tous les outils de cette page.",
    pour: 'Développeurs et petites équipes',
    accent: 'paper',
    fabrique: {
      role: "Le sol sur lequel tout le reste est posé.",
      amont: "Ne dépend d'aucune plateforme extérieure pour exister.",
      aval: "Outille la fabrication et la surveillance de tous les autres outils.",
      permet: [
        "Voir ce que font ses services sans y consacrer un budget d'entreprise",
        "Garder sa télémétrie chez soi plutôt que chez un observateur tiers",
        "Fabriquer et livrer avec la même chaîne, d'un projet à l'autre",
      ],
    },
  },
]

const accentClass: Record<Outil['accent'], string> = {
  primary: 'bg-accent-primary text-bg',
  secondary: 'bg-accent-secondary text-bg',
  warm: 'bg-warm text-text',
  paper: 'bg-bg text-text border-y-2 border-text',
}

/** Detail modal: where this tool sits in the fabrique. */
function FabriqueModal({
  outil,
  onClose,
}: {
  outil: Outil
  onClose: () => void
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-text/70 p-0 sm:items-center sm:p-6"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${outil.name} dans la fabrique`}
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto border-2 border-text bg-bg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-6 border-b-2 border-text p-6 sm:p-8">
          <div>
            <p className="label text-accent-primary">Dans la fabrique</p>
            <p className="font-heading mt-3 text-4xl uppercase leading-none sm:text-5xl">
              {outil.name}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="label shrink-0 border-2 border-text px-3 py-2 hover:bg-text hover:text-bg"
          >
            Fermer
          </button>
        </div>

        <div className="p-6 sm:p-8">
          <p className="chapeau">{outil.fabrique.role}</p>

          <dl className="mt-8 space-y-6">
            <div>
              <dt className="label text-text/50">Ce sur quoi il repose</dt>
              <dd className="mt-2 text-base text-text/85">
                {outil.fabrique.amont}
              </dd>
            </div>
            <div>
              <dt className="label text-text/50">Ce qu'il porte</dt>
              <dd className="mt-2 text-base text-text/85">
                {outil.fabrique.aval}
              </dd>
            </div>
          </dl>

          <div className="mt-10 border-t-2 border-text pt-6">
            <p className="label text-text/50">Ce que ça rend possible</p>
            <ul className="mt-4 space-y-3">
              {outil.fabrique.permet.map((item) => (
                <li key={item} className="flex gap-3 text-base text-text/85">
                  <span aria-hidden className="text-accent-primary">
                    —
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <a
            href={outil.url}
            className="label mt-10 inline-flex w-fit items-center gap-3 border-2 border-text px-6 py-3 hover:bg-text hover:text-bg"
          >
            {outil.invitation
              ? `Demander une invitation`
              : `Ouvrir ${outil.name}`}{' '}
            <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </div>
  )
}

function OutilsPage() {
  const [ouvert, setOuvert] = useState<Outil | null>(null)

  return (
    <div>
      {/* Title block */}
      <section className="border-b-2 border-text">
        <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:py-28">
          <p className="label text-text/60">Les outils — № 01</p>
          <h1 className="display-xl mt-6">Les outils</h1>
          <p className="chapeau mt-8 max-w-2xl">
            À chaque organe son outil. Ceux-ci tournent aujourd'hui — vous
            pouvez les utiliser maintenant. Les autres organes attendent encore
            le leur.
          </p>
          <Link
            to="/apps"
            className="label mt-8 inline-flex w-fit items-center gap-2 text-accent-primary hover:underline"
          >
            Voir les organes <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      {/* Tool entries */}
      {outils.map((outil, i) => (
        <section key={outil.name} className={accentClass[outil.accent]}>
          <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:py-28">
            <div className="grid gap-10 sm:grid-cols-12">
              <div className="sm:col-span-5">
                <p className="label opacity-70">
                  {String(i + 1).padStart(2, '0')} — Organe {outil.organe}
                </p>
                <h2 className="display-card mt-6 sm:text-8xl">
                  {outil.name}
                </h2>
              </div>

              <div className="flex flex-col justify-end sm:col-span-7">
                <p className="chapeau">{outil.tagline}</p>
                <p className="mt-6 text-base opacity-80">{outil.detail}</p>

                <dl className="mt-8 space-y-2 text-sm">
                  <div className="flex gap-3">
                    <dt className="label shrink-0 opacity-60">Pour</dt>
                    <dd className="opacity-90">{outil.pour}</dd>
                  </div>
                  {outil.invitation ? (
                    <div className="flex gap-3">
                      <dt className="label shrink-0 opacity-60">Accès</dt>
                      <dd className="opacity-90">Bêta sur invitation</dd>
                    </div>
                  ) : null}
                  {outil.prix ? (
                    <div className="flex gap-3">
                      <dt className="label shrink-0 opacity-60">Prix</dt>
                      <dd className="opacity-90">{outil.prix}</dd>
                    </div>
                  ) : null}
                </dl>

                <div className="mt-10 flex flex-wrap items-center gap-4">
                  <a
                    href={outil.url}
                    className="label inline-flex w-fit items-center gap-3 border-2 border-current px-6 py-3 hover:opacity-70"
                  >
                    {outil.invitation
                      ? `Demander une invitation`
                      : `Ouvrir ${outil.name}`}{' '}
                    <span aria-hidden>→</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setOuvert(outil)}
                    className="label inline-flex w-fit items-center gap-2 border-b-2 border-current pb-1 hover:opacity-70"
                  >
                    Sa place dans la fabrique <span aria-hidden>↗</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Pot commun tie-back */}
      <section className="border-t-2 border-text">
        <div className="mx-auto w-full max-w-3xl px-6 py-20 sm:py-28">
          <p className="label text-accent-primary">Ce qui les relie</p>
          <h2 className="font-heading mt-6 text-4xl uppercase leading-tight sm:text-5xl">
            Une part revient au pot commun.
          </h2>
          <div className="prose-editorial mt-10 text-text/85">
            <p>
              Chacun de ces outils reverse une fraction de ses revenus dans un
              pot commun, qui sert à reforger nos propres moyens — en
              commençant par celui qui commande tous les autres : encaisser
              sans intermédiaire.
            </p>
          </div>
          <Link
            to="/pot"
            className="label mt-10 inline-flex w-fit items-center gap-3 border-2 border-text px-6 py-3 hover:bg-text hover:text-bg"
          >
            Voir le pot <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      {ouvert ? (
        <FabriqueModal outil={ouvert} onClose={() => setOuvert(null)} />
      ) : null}
    </div>
  )
}
