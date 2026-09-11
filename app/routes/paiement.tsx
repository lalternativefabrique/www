import { Link, createFileRoute } from '@tanstack/react-router'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/paiement')({
  component: PaiementPage,
  head: () =>
    seo({
      title: "Le projet du paiement — L'Alternative Fabrique",
      description:
        "Encaisser demande une autorisation. Les quatre marches réglementaires qui mènent à opérer ses propres paiements, et ce que chacune coûte.",
      path: '/paiement',
    }),
})

/** A regulatory step on the way to running payments without a licensed third party. */
type Marche = {
  rang: string
  statut: string
  capital: string
  capitalHint: string
  etat: 'actuel' | 'suivant' | 'ensuite'
  /** Share of the operation still owned by someone else, in percent. */
  dependance: number
  /** Column height in the overview chart. */
  hauteur: string
  /** Rank type scale — grows as the staircase climbs. */
  rangClass: string
  quoi: string
  ceQuOnGagne: string
  ceQueCaCoute: string
  accent: 'primary' | 'secondary' | 'warm' | 'paper'
}

const marches: Marche[] = [
  {
    rang: '00',
    statut: 'Sous licence d\'un tiers',
    capital: '0 €',
    capitalHint: 'Aucun capital réglementaire',
    etat: 'actuel',
    dependance: 100,
    hauteur: 'h-40 sm:h-56 md:h-64',
    rangClass: 'text-6xl sm:text-7xl',
    quoi:
      "L'encaissement passe par un prestataire de paiement déjà agréé. Nous ne détenons ni les coordonnées bancaires, ni l'identité des clients : tout reste chez lui.",
    ceQuOnGagne:
      "Le produit tourne, encaisse et se finance dès maintenant. Rien n'attend une autorisation.",
    ceQueCaCoute:
      "Une dépendance entière. Le prestataire prélève sa part, fixe ses règles et peut fermer le robinet.",
    accent: 'paper',
  },
  {
    rang: '01',
    statut: 'Agent de prestataire de services de paiement',
    capital: '0 €',
    capitalHint: 'Enregistrement, pas agrément',
    etat: 'suivant',
    dependance: 60,
    hauteur: 'h-56 sm:h-72 md:h-80',
    rangClass: 'text-7xl sm:text-8xl',
    quoi:
      "Un établissement agréé nous mandate et nous inscrit au registre de l'ACPR. Nous opérons les paiements nous-mêmes, sous sa licence et sous sa responsabilité.",
    ceQuOnGagne:
      "Opérer réellement des paiements, construire les volumes et l'expertise conformité en conditions réelles — sans immobiliser un centime.",
    ceQueCaCoute:
      "Il faut convaincre un établissement de nous mandater : c'est lui qui dépose le dossier, pas nous. Honorabilité, compétence, contrôle interne à démontrer.",
    accent: 'warm',
  },
  {
    rang: '02',
    statut: 'Agrément simplifié d\'établissement de paiement',
    capital: 'Capital allégé',
    capitalHint: 'Jusqu\'à 3 M€/mois de volume',
    etat: 'ensuite',
    dependance: 15,
    hauteur: 'h-72 sm:h-88 md:h-96',
    rangClass: 'text-8xl sm:text-9xl',
    quoi:
      "Notre propre agrément, délivré par l'ACPR. Régime prudentiel adapté : capital initial réduit, et pas d'exigence de fonds propres minimum au titre de l'article L. 522-11-1 du Code monétaire et financier.",
    ceQuOnGagne:
      "La licence est à nous. Plus de mandant, plus de part prélevée par un intermédiaire, plus de règles écrites par quelqu'un d'autre.",
    ceQueCaCoute:
      "Un dossier d'agrément complet, et c'est là que se concentre le travail juridique. Le régime est plafonné et ne donne pas accès au passeport européen.",
    accent: 'secondary',
  },
  {
    rang: '03',
    statut: 'Agrément d\'établissement de paiement',
    capital: '125 000 €',
    capitalHint: 'Capital initial minimum',
    etat: 'ensuite',
    dependance: 0,
    hauteur: 'h-88 sm:h-[26rem] md:h-[30rem]',
    rangClass: 'text-8xl sm:text-[10rem]',
    quoi:
      "Le régime complet, sans plafond de volume. Le capital n'est pas une dépense : il est immobilisé au bilan, exigé par le régulateur, et il y reste.",
    ceQuOnGagne:
      "Plus aucune limite de volume, et un dispositif complet qui tient à l'échelle.",
    ceQueCaCoute:
      "Contrôle interne complet, fonctions de conformité permanentes, reporting continu au régulateur.",
    accent: 'primary',
  },
]

const etatLabel: Record<Marche['etat'], string> = {
  actuel: 'Où nous en sommes',
  suivant: 'La marche suivante',
  ensuite: 'Plus tard',
}

const accentClass: Record<Marche['accent'], string> = {
  primary: 'bg-accent-primary text-bg',
  secondary: 'bg-accent-secondary text-bg',
  warm: 'bg-warm text-text',
  paper: 'bg-bg text-text border-y-2 border-text',
}

/** What the money actually buys: the paperwork the regulator requires. */
const livrables: { titre: string; detail: string }[] = [
  {
    titre: 'Programme d\'activité',
    detail:
      "La description précise des services fournis, de leur fonctionnement et de leur mise en œuvre. C'est la pièce que le régulateur lit en premier.",
  },
  {
    titre: 'Plan d\'affaires prudentiel',
    detail:
      "Des projections financières qui démontrent que les exigences prudentielles seront tenues dans la durée, pas seulement au moment du dépôt.",
  },
  {
    titre: 'Dispositif LCB-FT',
    detail:
      "Lutte contre le blanchiment et le financement du terrorisme : procédures, contrôles, et un responsable désigné. Ce n'est pas un document, c'est une fonction permanente.",
  },
  {
    titre: 'Contrôle interne',
    detail:
      "Deux niveaux de contrôle, avec la gouvernance qui va avec. Le régime simplifié l'allège, il ne le supprime pas.",
  },
  {
    titre: 'Sécurité et données sensibles',
    detail:
      "Procédures d'accès aux données de paiement, dispositifs de sécurité, prévention de la fraude.",
  },
  {
    titre: 'Continuité d\'activité',
    detail:
      "Ce qui se passe quand ça tombe. Le régulateur veut le plan écrit avant l'incident.",
  },
  {
    titre: 'Protection des fonds',
    detail:
      "Comment les fonds des utilisateurs sont protégés et cantonnés. Ils ne nous appartiennent jamais.",
  },
  {
    titre: 'Dirigeants et actionnaires',
    detail:
      "Honorabilité, compétence, expérience — évaluées personne par personne. L'autorité peut auditionner.",
  },
]

const sommaire = [
  "L'obstacle : une autorisation",
  'Quatre marches',
  'Huit pièces à écrire',
  "Ce qu'on ne sait pas",
]

/**
 * Overview chart: four rising columns, each filled from the bottom with the
 * share of the operation that still belongs to someone else. Decorative —
 * the detailed sections below carry the same information as text.
 */
function Palier() {
  return (
    <div aria-hidden="true">
      {/* Desktop: rising columns sitting on a shared floor */}
      <div className="mt-20 hidden items-end gap-px border-b-2 border-bg sm:flex">
        {marches.map((marche) => (
          <div
            key={marche.rang}
            className={`relative flex-1 border-2 border-b-0 border-bg ${marche.hauteur}`}
          >
            <div
              className="absolute inset-x-0 bottom-0 bg-accent-primary"
              style={{ height: `${marche.dependance}%` }}
            />
            <div className="relative flex h-full flex-col justify-between p-4 sm:p-6">
              <p className="font-heading text-5xl leading-none sm:text-7xl">
                {marche.rang}
              </p>
              <div>
                <p className="font-heading text-2xl leading-none sm:text-3xl">
                  {marche.capital}
                </p>
                <p className="label mt-2 opacity-70">{marche.capitalHint}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile: the same climb, read as growing indentation */}
      <div className="mt-16 sm:hidden">
        {marches.map((marche, i) => (
          <div
            key={marche.rang}
            className={`flex border-2 border-bg ${i > 0 ? 'border-t-0' : ''}`}
            style={{ marginLeft: `${i * 1.5}rem` }}
          >
            <div
              className="shrink-0 bg-accent-primary"
              style={{ width: `${Math.max(marche.dependance / 100, 0.02) * 3}rem` }}
            />
            <div className="flex-1 p-5">
              <p className="font-heading text-4xl leading-none">
                {marche.rang}
              </p>
              <p className="font-heading mt-3 text-xl leading-none">
                {marche.capital}
              </p>
              <p className="label mt-2 opacity-70">{marche.capitalHint}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function PaiementPage() {
  return (
    <div>
      {/* Opening */}
      <section className="border-b-2 border-text">
        <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:py-28">
          <div className="grid gap-12 sm:grid-cols-12">
            <div className="sm:col-span-7">
              <p className="label text-text/60">
                Projet — № 01
              </p>
              <h1 className="display-xl mt-6">Le paiement</h1>
              <p className="chapeau mt-10 max-w-2xl">
                Encaisser demande une autorisation. On ne l'a pas. Voici les
                quatre marches qui y mènent, et ce que chacune coûte.
              </p>
              <Link
                to="/pot"
                className="label mt-10 inline-flex w-fit items-center gap-2 border-b-2 border-text pb-1 hover:opacity-70"
              >
                <span aria-hidden>←</span> Les projets
              </Link>
            </div>

            <div className="flex flex-col justify-end sm:col-span-4 sm:col-start-9">
              <p className="label text-text/50">Au sommaire</p>
              <ul className="mt-4 space-y-3">
                {sommaire.map((item) => (
                  <li key={item} className="flex gap-3 text-base text-text/85">
                    <span aria-hidden className="text-accent-primary">
                      —
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* The obstacle */}
      <section>
        <div className="mx-auto w-full max-w-3xl px-6 py-20 sm:py-28">
          <p className="label text-accent-primary">L'obstacle réel</p>
          <h2 className="font-heading mt-6 text-4xl uppercase leading-tight sm:text-5xl">
            Encaisser demande une autorisation.
          </h2>
          <div className="prose-editorial mt-10 text-text/85">
            <p>
              Fabriquer un outil ne demande la permission de personne.
              Encaisser de l'argent, si. Le paiement est un métier réglementé :
              pour opérer soi-même, il faut un statut délivré par l'Autorité de
              contrôle prudentiel et de résolution — et ce statut ne s'obtient
              pas avec du code.
            </p>
            <p>
              C'est pour cela que tout le monde passe par un intermédiaire. Il
              a la licence, il prélève sa part, il écrit les règles. La
              dépendance n'est pas technique — elle est réglementaire, et c'est
              ce qui la rend durable.
            </p>
            <p>
              Chaque moyen qu'on veut reprendre est gardé par une autorisation.
              Celle-ci se franchit en quatre fois.
            </p>
          </div>
        </div>
      </section>

      {/* The staircase, seen from afar */}
      <section className="border-t-2 border-text bg-text text-bg">
        <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:py-28">
          <p className="label opacity-70">Projet — le paiement</p>
          <h2 className="font-heading mt-6 max-w-3xl text-4xl uppercase leading-tight sm:text-5xl">
            Quatre marches,
            <br />
            franchies une à une.
          </h2>
          <p className="chapeau mt-8 max-w-2xl opacity-90">
            Chacune supprime une part de dépendance. Chacune rapporte déjà, ce
            qui paie la suivante. Aucune ne demande d'attendre d'avoir tout
            l'argent avant de commencer.
          </p>

          <Palier />

          <div className="mt-10 flex flex-wrap items-center justify-between gap-6">
            <p className="label flex items-center gap-3 opacity-70">
              <span
                aria-hidden
                className="inline-block h-3 w-8 bg-accent-primary"
              />
              La part qui ne nous appartient pas encore
            </p>
            <p className="label bg-accent-primary px-3 py-1 text-bg">
              00 — aujourd'hui
            </p>
          </div>
        </div>
      </section>

      {/* The staircase, step by step */}
      {marches.map((marche, i) => (
        <section key={marche.rang} className={accentClass[marche.accent]}>
          <div className="mx-auto w-full max-w-7xl px-6 py-16 sm:py-24">
            <div className="grid gap-10 sm:grid-cols-12">
              <div className="sm:col-span-5">
                <p className="label opacity-70">{etatLabel[marche.etat]}</p>
                <p
                  className={`font-heading mt-6 leading-none ${marche.rangClass}`}
                >
                  {marche.rang}
                </p>
                <p className="mt-6 text-lg font-medium">{marche.statut}</p>
                <div className="mt-8 border-t-2 border-current pt-6">
                  <p className="font-heading text-4xl leading-none sm:text-5xl">
                    {marche.capital}
                  </p>
                  <p className="mt-2 text-sm opacity-75">
                    {marche.capitalHint}
                  </p>
                </div>
                <div className="mt-8">
                  <p className="label opacity-60">
                    Ce qui ne nous appartient pas
                  </p>
                  <div
                    className="mt-3 h-3 w-full border-2 border-current"
                    aria-hidden
                  >
                    <div
                      className="h-full bg-current"
                      style={{ width: `${marche.dependance}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-end sm:col-span-7">
                <p className="chapeau">{marche.quoi}</p>
                <dl className="mt-10 space-y-6">
                  <div>
                    <dt className="label opacity-60">Ce qu'on gagne</dt>
                    <dd className="mt-2 text-base opacity-90">
                      {marche.ceQuOnGagne}
                    </dd>
                  </div>
                  <div>
                    <dt className="label opacity-60">Ce que ça coûte</dt>
                    <dd className="mt-2 text-base opacity-90">
                      {marche.ceQueCaCoute}
                    </dd>
                  </div>
                </dl>
                {i < marches.length - 1 ? (
                  <p className="label mt-16 opacity-60">
                    Marche suivante — {marches[i + 1].rang}{' '}
                    <span aria-hidden>↓</span>
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Lawyers, not capital */}
      <section className="border-t-2 border-text">
        <div className="mx-auto w-full max-w-3xl px-6 py-20 sm:py-28">
          <p className="label text-accent-primary">Ce que finance le réinvestissement</p>
          <h2 className="font-heading mt-6 text-4xl uppercase leading-tight sm:text-5xl">
            Des juristes, pas du capital.
          </h2>
          <div className="prose-editorial mt-10 text-text/85">
            <p>
              Le capital réglementaire — les 125 000 € de la dernière marche —
              n'est pas une dépense. C'est une somme immobilisée au bilan, que
              le régulateur exige de voir et qui y reste. On ne la consomme
              pas, on la pose.
            </p>
            <p>
              La vraie dépense est ailleurs, et elle est humaine. Un dossier
              d'agrément est un ensemble de procédures écrites, vérifiables et
              défendables devant une autorité qui peut auditionner les
              dirigeants et analyser le modèle économique en détail. Ça s'écrit
              avec des juristes spécialisés en droit bancaire, et ça
              s'entretient avec un responsable conformité qui ne part pas une
              fois le dossier déposé.
            </p>
          </div>
        </div>
      </section>

      {/* The dossier */}
      <section className="border-t-2 border-text bg-warm">
        <div className="mx-auto w-full max-w-7xl px-6 py-16 sm:py-24">
          <p className="label text-text/60">Le dossier</p>
          <h2 className="font-heading mt-6 max-w-3xl text-4xl uppercase leading-tight sm:text-5xl">
            Ce qu'il faut écrire.
          </h2>
          <p className="chapeau mt-8 max-w-2xl">
            Le détail d'un dossier d'agrément, tel que le régulateur l'examine.
            C'est cette liste que notre réinvestissement paie.
          </p>

          <div className="mt-16 grid grid-cols-1 gap-px bg-text sm:grid-cols-2">
            {livrables.map((item, i) => (
              <div key={item.titre} className="bg-bg p-8 sm:p-10">
                <p className="label text-text/50">
                  № {String(i + 1).padStart(2, '0')}
                </p>
                <p className="font-heading mt-3 text-2xl uppercase leading-tight">
                  {item.titre}
                </p>
                <p className="mt-4 text-base text-text/80">{item.detail}</p>
              </div>
            ))}
          </div>

          <p className="mt-16 max-w-2xl text-base text-text/75">
            L'instruction d'un dossier complet prend trois mois. Le compteur ne
            démarre qu'une fois le dossier jugé complet — la préparation, elle,
            n'a pas de délai réglementaire. C'est la partie qu'on finance.
          </p>
        </div>
      </section>

      {/* What we don't know */}
      <section className="border-t-2 border-text">
        <div className="mx-auto w-full max-w-3xl px-6 py-20 sm:py-28">
          <p className="label text-accent-primary">
            Ce qu'on ne sait pas encore
          </p>
          <h2 className="font-heading mt-6 text-4xl uppercase leading-tight sm:text-5xl">
            Le prix n'est pas public.
          </h2>
          <div className="prose-editorial mt-10 text-text/85">
            <p>
              Ni les autorités ni les cabinets spécialisés ne publient de
              grille tarifaire pour l'accompagnement d'un dossier d'agrément.
              Le chiffre n'existe pas en accès libre : il s'obtient sur devis,
              au cas par cas.
            </p>
            <p>
              Nous ne mettrons donc pas de montant sur cette page tant que nous
              n'aurons pas les nôtres. Les seuls chiffres affichés ici sont les
              capitaux réglementaires, fixés par le Code monétaire et
              financier. Quand les devis seront là, ils seront publiés — comme
              le reste.
            </p>
            <p>
              Et il est possible que nous n'ayons jamais à monter les quatre
              marches. La marche 00 encaisse déjà. Chacune des suivantes se
              décide au moment où elle devient plus rentable que la dépendance
              qu'elle supprime.
            </p>
          </div>

          <div className="mt-12 flex flex-wrap gap-4">
            <Link
              to="/pot"
              className="label inline-flex w-fit items-center gap-3 border-2 border-text px-6 py-3 hover:bg-text hover:text-bg"
            >
              Les projets <span aria-hidden>→</span>
            </Link>
            <Link
              to="/outils"
              className="label inline-flex w-fit items-center gap-2 self-center border-b-2 border-text pb-1 hover:opacity-70"
            >
              Les réalisations qui financent <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
