import { Link, createFileRoute } from '@tanstack/react-router'
import { Participation } from '@/components/Participation'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/pot')({
  component: PotPage,
  head: () =>
    seo({
      title: "Le pot commun — L'Alternative Fabrique",
      description:
        "Chaque centime dépensé dans nos outils sert à reforger nos propres moyens numériques. Le pot commun finance saison après saison ce qui nous échappe aujourd'hui.",
      path: '/pot',
    }),
})

/** A season: an audience served, a set of tools shipped, a goal funded. */
type Saison = {
  rang: string
  etat: 'en cours' | 'ensuite' | 'ouverte'
  public: string
  outils: string
  finance: string
  detail: string
  accent: 'primary' | 'secondary' | 'warm' | 'paper'
  /** Deep-dive page, when the season already has one. */
  chantier?: { to: string; label: string }
  /** Shown in place of the link when no deep-dive exists yet. */
  chantierEnAttente?: string
}

const saisons: Saison[] = [
  {
    rang: '01',
    etat: 'en cours',
    public: 'Créateurs de contenu',
    outils: 'Techtuel · Synthiz · Spore',
    finance: 'Le paiement',
    detail:
      "Transcrire, relier, retrouver ce qu'on accumule — et écrire à ses lecteurs depuis sa propre infrastructure. Ces revenus-là financent la brique qui rend toutes les autres possibles : encaisser sans intermédiaire.",
    accent: 'primary',
    chantier: { to: '/paiement', label: 'Le chantier en détail' },
  },
  {
    rang: '02',
    etat: 'ensuite',
    public: 'Développeurs et équipes techniques',
    outils: 'Skalpai · sklp · Vvaves',
    finance: "L'investissement — et l'infrastructure",
    detail:
      "L'outillage de développement, l'observabilité, la gestion d'événements entre services. Le code est déjà largement écrit : ce qui se finance ici, c'est l'infrastructure qui le fait tourner — calcul, serveurs, la facture qui tombe tous les mois.",
    accent: 'secondary',
    chantierEnAttente: 'Chantier à écrire',
  },
  {
    rang: '03',
    etat: 'ouverte',
    public: 'Ouverte aux propositions',
    outils: 'À écrire',
    finance: 'Ce qui manquera encore',
    detail:
      "On ne sait pas encore ce qu'elle contient, et on préfère le dire. Ce qu'on sait, c'est ce qui l'ouvrira : les deux premières saisons payées, et de quoi commencer la suivante.",
    accent: 'paper',
  },
]

const accentClass: Record<Saison['accent'], string> = {
  primary: 'bg-accent-primary text-bg',
  secondary: 'bg-accent-secondary text-bg',
  warm: 'bg-warm text-text',
  paper: 'bg-bg text-text border-y-2 border-text',
}

function PotPage() {
  return (
    <div>
      {/* Header */}
      <section className="border-b-2 border-text">
        <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:py-28">
          <p className="label text-text/60">La direction</p>
          <h1 className="display-xl mt-6">
            Le <span className="text-accent-primary">pot</span>
            <br />
            commun
          </h1>
          <p className="chapeau mt-10 max-w-2xl">
            Chaque centime dépensé dans nos outils sert à reforger nos propres
            moyens numériques. Pas une cause à soutenir : un mécanisme, saison
            après saison.
          </p>
        </div>
      </section>

      {/* The thesis — why any of this exists */}
      <section>
        <div className="mx-auto w-full max-w-3xl px-6 py-20 sm:py-28">
          <p className="label text-accent-primary">La thèse</p>
          <h2 className="font-heading mt-6 text-4xl uppercase leading-tight sm:text-5xl">
            Une idée ne se concrétise qu'en la finançant.
          </h2>
          <div className="prose-editorial mt-10 text-text/85">
            <p>
              Il n'y a que deux façons de financer ce qu'on entreprend. Lever
              des fonds — céder une part, rendre des comptes, écrire la suite
              avec quelqu'un d'autre. Ou reprendre la main sur des revenus qui
              nous échappent déjà.
            </p>
            <p>
              Nous avons choisi la seconde. Chaque abonnement à un logiciel,
              chaque service en ligne, chaque paiement du quotidien laisse une
              part à un intermédiaire qui n'a rien produit d'autre que
              l'autorisation d'encaisser. C'est une mine d'or, prélevée tous
              les jours, sur tout le monde. Elle ne peut plus continuer à nous
              échapper.
            </p>
            <p>
              Le pot commun est l'outil de cette reprise. Sa source normale,
              c'est le produit des outils : chaque abonnement payé réinvestit
              une part dans les moyens qui nous manquent encore — et il
              commence par celui qui commande tous les autres, encaisser.
            </p>
            <p>
              Il est aussi ouvert. Qui veut peut y mettre directement, sans
              passer par l'achat d'un outil dont il n'a pas l'usage. Ce n'est
              pas un don à une cause : c'est une avance sur le même mécanisme,
              qui le fait simplement aller plus vite. Le pot ne change pas de
              nature selon d'où vient l'argent — il paie la même liste, dans le
              même ordre.
            </p>
          </div>
        </div>
      </section>

      {/* Seasons */}
      <section className="border-t-2 border-text">
        <div className="mx-auto w-full max-w-7xl px-6 py-16 sm:py-24">
          <p className="label text-accent-primary">Les saisons</p>
          <h2 className="font-heading mt-6 max-w-3xl text-4xl uppercase leading-tight sm:text-5xl">
            Chaque saison paie la suivante.
          </h2>
          <p className="chapeau mt-8 max-w-2xl">
            Une saison sert un public, livre ses outils, et finance un moyen
            qu'on n'avait pas. Elle dure le temps qu'il faut pour financer la
            suivante — et une fois son but atteint, elle ne s'arrête pas : elle
            continue de produire, et préfinance tout ce qui vient après.
          </p>
        </div>
      </section>

      {saisons.map((saison) => (
        <section key={saison.rang} className={accentClass[saison.accent]}>
          <div className="mx-auto w-full max-w-7xl px-6 py-16 sm:py-24">
            <div className="grid gap-10 sm:grid-cols-12">
              <div className="sm:col-span-5">
                <p className="label opacity-70">Saison — {saison.etat}</p>
                <p className="font-heading mt-6 text-7xl leading-none sm:text-8xl">
                  {saison.rang}
                </p>
                <p className="mt-6 text-lg font-medium">{saison.public}</p>
                {saison.chantier ? (
                  <p className="label mt-4 opacity-60">
                    Chantier — № {saison.rang}
                  </p>
                ) : null}
              </div>

              <div className="flex flex-col justify-end sm:col-span-7">
                <p className="chapeau">{saison.detail}</p>
                <dl className="mt-10 space-y-6">
                  <div>
                    <dt className="label opacity-60">Les outils</dt>
                    <dd className="mt-2 text-base opacity-90">
                      {saison.outils}
                    </dd>
                  </div>
                  <div>
                    <dt className="label opacity-60">Ce qu'elle finance</dt>
                    <dd className="mt-2 text-base opacity-90">
                      {saison.finance}
                    </dd>
                  </div>
                </dl>
                {saison.chantier ? (
                  <Link
                    to={saison.chantier.to}
                    className="label mt-10 inline-flex w-fit items-center gap-3 border-2 border-current px-6 py-3 hover:opacity-70"
                  >
                    {saison.chantier.label} <span aria-hidden>→</span>
                  </Link>
                ) : saison.chantierEnAttente ? (
                  <p className="label mt-10 opacity-50">
                    {saison.chantierEnAttente}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* The first chantier — teaser toward /paiement */}
      <section className="border-t-2 border-text">
        <div className="mx-auto w-full max-w-3xl px-6 py-20 sm:py-28">
          <p className="label text-accent-primary">Le premier chantier</p>
          <h2 className="font-heading mt-6 text-4xl uppercase leading-tight sm:text-5xl">
            Encaisser demande une autorisation.
          </h2>
          <div className="prose-editorial mt-10 text-text/85">
            <p>
              Fabriquer un outil ne demande la permission de personne.
              Encaisser de l'argent, si. Le paiement est un métier réglementé,
              et c'est pour cela que tout le monde passe par un intermédiaire :
              il a la licence, il prélève sa part, il écrit les règles. La
              dépendance n'est pas technique — elle est réglementaire, et c'est
              ce qui la rend durable.
            </p>
            <p>
              La même barrière garde la saison suivante. Ouvrir
              l'investissement à des particuliers suppose le statut de
              prestataire de services de financement participatif, agréé par
              l'Autorité des marchés financiers au titre du règlement européen
              2020/1503. Depuis novembre 2023, aucune plateforme non agréée ne
              peut proposer ces services.
            </p>
            <p>
              Chaque moyen qu'on veut reprendre est gardé par une autorisation.
              C'est ce que le pot commun finance.
            </p>
          </div>

        </div>
      </section>

      <section
        id="participer"
        className="border-t-2 border-text bg-accent-secondary text-bg"
      >
        <div className="mx-auto w-full max-w-7xl px-6 py-16 sm:py-24">
          <p className="label opacity-70">Participer</p>
          <h2 className="font-heading mt-6 text-4xl uppercase leading-tight sm:text-5xl">
            Mettre au pot.
          </h2>

          <div className="mt-12">
            <Participation />
          </div>

          <div className="mt-16 flex flex-wrap gap-4 border-t-2 border-current pt-10">
            <Link
              to="/paiement"
              className="label inline-flex w-fit items-center gap-3 border-2 border-current px-6 py-3 hover:bg-bg hover:text-accent-secondary"
            >
              Le chantier du paiement, en détail <span aria-hidden>→</span>
            </Link>
            <Link
              to="/outils"
              className="label inline-flex w-fit items-center gap-2 self-center border-b-2 border-current pb-1 hover:opacity-70"
            >
              Les outils qui financent <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
