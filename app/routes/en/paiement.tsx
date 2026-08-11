import { Link, createFileRoute } from '@tanstack/react-router'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/en/paiement')({
  component: PaiementPageEn,
  head: () =>
    seo({
      title: "The payments build — L'Alternative Fabrique",
      description:
        'Taking money requires authorisation. The four regulatory steps that lead to running your own payments, and what each one costs.',
      path: '/en/paiement',
      locale: 'en',
      alternate: { fr: '/paiement', en: '/en/paiement' },
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
    statut: 'Under a third party\'s licence',
    capital: '0 €',
    capitalHint: 'No regulatory capital',
    etat: 'actuel',
    dependance: 100,
    hauteur: 'h-40 sm:h-56 md:h-64',
    rangClass: 'text-6xl sm:text-7xl',
    quoi:
      'Payments run through a payment service provider that already holds a licence. We hold neither the bank details nor the customer identities: everything stays with them.',
    ceQuOnGagne:
      'The product runs, takes money and funds itself right now. Nothing waits on an authorisation.',
    ceQueCaCoute:
      'Total dependence. The provider takes its cut, sets its rules, and can shut off the tap.',
    accent: 'paper',
  },
  {
    rang: '01',
    statut: 'Agent of a payment service provider',
    capital: '0 €',
    capitalHint: 'Registration, not authorisation',
    etat: 'suivant',
    dependance: 60,
    hauteur: 'h-56 sm:h-72 md:h-80',
    rangClass: 'text-7xl sm:text-8xl',
    quoi:
      'A licensed institution mandates us and enters us in the ACPR register. We run the payments ourselves, under its licence and its responsibility.',
    ceQuOnGagne:
      'Genuinely running payments, building volume and compliance expertise in real conditions — without tying up a single penny.',
    ceQueCaCoute:
      'We have to convince an institution to mandate us: it files the application, not us. Good repute, competence and internal control all have to be demonstrated.',
    accent: 'warm',
  },
  {
    rang: '02',
    statut: 'Simplified payment institution authorisation',
    capital: 'Reduced capital',
    capitalHint: 'Up to 3 M€/month in volume',
    etat: 'ensuite',
    dependance: 15,
    hauteur: 'h-72 sm:h-88 md:h-96',
    rangClass: 'text-8xl sm:text-9xl',
    quoi:
      'Our own authorisation, granted by the ACPR. A tailored prudential regime: lower initial capital, and no minimum own funds requirement under article L. 522-11-1 of the French monetary and financial code.',
    ceQuOnGagne:
      'The licence is ours. No principal, no cut taken by a middleman, no rules written by someone else.',
    ceQueCaCoute:
      'A full authorisation dossier, and that is where the legal work concentrates. The regime is capped and gives no access to the European passport.',
    accent: 'secondary',
  },
  {
    rang: '03',
    statut: 'Full payment institution authorisation',
    capital: '125 000 €',
    capitalHint: 'Minimum initial capital',
    etat: 'ensuite',
    dependance: 0,
    hauteur: 'h-88 sm:h-[26rem] md:h-[30rem]',
    rangClass: 'text-8xl sm:text-[10rem]',
    quoi:
      'The full regime, with no volume cap. The capital is not an expense: it sits frozen on the balance sheet, required by the regulator, and there it stays.',
    ceQuOnGagne:
      'No volume limit left, and a complete setup that holds at scale.',
    ceQueCaCoute:
      'Full internal control, permanent compliance functions, continuous reporting to the regulator.',
    accent: 'primary',
  },
]

const etatLabel: Record<Marche['etat'], string> = {
  actuel: 'Where we stand',
  suivant: 'The next step',
  ensuite: 'Later on',
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
    titre: 'Programme of operations',
    detail:
      'A precise description of the services provided, how they work and how they are delivered. It is the piece the regulator reads first.',
  },
  {
    titre: 'Prudential business plan',
    detail:
      'Financial projections showing that the prudential requirements will be met over time, not merely on the day the file is submitted.',
  },
  {
    titre: 'AML-CFT framework',
    detail:
      'Anti-money laundering and counter-terrorist financing: procedures, controls, and a named officer. It is not a document, it is a permanent function.',
  },
  {
    titre: 'Internal control',
    detail:
      'Two levels of control, with the governance that comes with them. The simplified regime lightens it; it does not remove it.',
  },
  {
    titre: 'Security and sensitive data',
    detail:
      'Access procedures for payment data, security arrangements, fraud prevention.',
  },
  {
    titre: 'Business continuity',
    detail:
      'What happens when it falls over. The regulator wants the plan written before the incident.',
  },
  {
    titre: 'Safeguarding of funds',
    detail:
      'How users\' funds are protected and ring-fenced. They are never ours.',
  },
  {
    titre: 'Directors and shareholders',
    detail:
      'Good repute, competence, experience — assessed person by person. The authority can summon them for a hearing.',
  },
]

const sommaire = [
  'The obstacle: an authorisation',
  'Four steps',
  'Eight pieces to write',
  "What we don't know",
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

function PaiementPageEn() {
  return (
    <div>
      {/* Opening */}
      <section className="border-b-2 border-text">
        <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:py-28">
          <div className="grid gap-12 sm:grid-cols-12">
            <div className="sm:col-span-7">
              <p className="label text-text/60">
                Build — № 01 · Season 01
              </p>
              <h1 className="display-xl mt-6">Payments</h1>
              <p className="chapeau mt-10 max-w-2xl">
                Taking money requires authorisation. We don't have it. Here are
                the four steps that lead there, and what each one costs.
              </p>
              <Link
                to="/en/pot"
                className="label mt-10 inline-flex w-fit items-center gap-2 border-b-2 border-text pb-1 hover:opacity-70"
              >
                <span aria-hidden>←</span> The common pot
              </Link>
            </div>

            <div className="flex flex-col justify-end sm:col-span-4 sm:col-start-9">
              <p className="label text-text/50">Contents</p>
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
          <p className="label text-accent-primary">The real obstacle</p>
          <h2 className="font-heading mt-6 text-4xl uppercase leading-tight sm:text-5xl">
            Taking money requires authorisation.
          </h2>
          <div className="prose-editorial mt-10 text-text/85">
            <p>
              Building a tool asks nobody's permission. Taking money does.
              Payment is a regulated trade: to run it yourself you need a
              status granted by the French prudential supervisor, the ACPR —
              and that status cannot be obtained with code.
            </p>
            <p>
              Which is why everyone goes through a middleman. It holds the
              licence, it takes its cut, it writes the rules. The dependence
              isn't technical — it is regulatory, and that is what makes it
              last.
            </p>
            <p>
              Every means we want to reclaim is guarded by an authorisation.
              This one is crossed in four moves.
            </p>
          </div>
        </div>
      </section>

      {/* The staircase, seen from afar */}
      <section className="border-t-2 border-text bg-text text-bg">
        <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:py-28">
          <p className="label opacity-70">Build — payments</p>
          <h2 className="font-heading mt-6 max-w-3xl text-4xl uppercase leading-tight sm:text-5xl">
            Four steps,
            <br />
            climbed one at a time.
          </h2>
          <p className="chapeau mt-8 max-w-2xl opacity-90">
            Each one removes a share of dependence. Each one already earns,
            which pays for the next. None of them requires waiting until all
            the money is there before starting.
          </p>

          <Palier />

          <div className="mt-10 flex flex-wrap items-center justify-between gap-6">
            <p className="label flex items-center gap-3 opacity-70">
              <span
                aria-hidden
                className="inline-block h-3 w-8 bg-accent-primary"
              />
              The share that isn't ours yet
            </p>
            <p className="label bg-accent-primary px-3 py-1 text-bg">
              00 — today
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
                    What isn't ours
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
                    <dt className="label opacity-60">What we gain</dt>
                    <dd className="mt-2 text-base opacity-90">
                      {marche.ceQuOnGagne}
                    </dd>
                  </div>
                  <div>
                    <dt className="label opacity-60">What it costs</dt>
                    <dd className="mt-2 text-base opacity-90">
                      {marche.ceQueCaCoute}
                    </dd>
                  </div>
                </dl>
                {i < marches.length - 1 ? (
                  <p className="label mt-16 opacity-60">
                    Next step — {marches[i + 1].rang}{' '}
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
          <p className="label text-accent-primary">What the pot funds</p>
          <h2 className="font-heading mt-6 text-4xl uppercase leading-tight sm:text-5xl">
            Lawyers, not capital.
          </h2>
          <div className="prose-editorial mt-10 text-text/85">
            <p>
              Regulatory capital — the 125 000 € of the final step — is not an
              expense. It is a sum frozen on the balance sheet, which the
              regulator demands to see and which stays there. You don't spend
              it, you place it.
            </p>
            <p>
              The real spending lies elsewhere, and it is human. An
              authorisation dossier is a body of written procedures, verifiable
              and defensible before an authority that can summon the directors
              and pull the business model apart. It is written with lawyers who
              specialise in banking law, and maintained by a compliance officer
              who doesn't leave once the file is submitted.
            </p>
          </div>
        </div>
      </section>

      {/* The dossier */}
      <section className="border-t-2 border-text bg-warm">
        <div className="mx-auto w-full max-w-7xl px-6 py-16 sm:py-24">
          <p className="label text-text/60">The dossier</p>
          <h2 className="font-heading mt-6 max-w-3xl text-4xl uppercase leading-tight sm:text-5xl">
            What has to be written.
          </h2>
          <p className="chapeau mt-8 max-w-2xl">
            The contents of an authorisation dossier, as the regulator examines
            it. This list is what the common pot pays for.
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
            Reviewing a complete dossier takes three months. The clock only
            starts once the file is judged complete — the preparation itself
            has no regulatory deadline. That is the part we fund.
          </p>
        </div>
      </section>

      {/* What we don't know */}
      <section className="border-t-2 border-text">
        <div className="mx-auto w-full max-w-3xl px-6 py-20 sm:py-28">
          <p className="label text-accent-primary">
            What we don't know yet
          </p>
          <h2 className="font-heading mt-6 text-4xl uppercase leading-tight sm:text-5xl">
            The price isn't public.
          </h2>
          <div className="prose-editorial mt-10 text-text/85">
            <p>
              Neither the authorities nor the specialist firms publish a rate
              card for guiding an authorisation dossier. The figure doesn't
              exist in the open: it comes as a quote, case by case.
            </p>
            <p>
              So we won't put an amount on this page until we have our own. The
              only figures shown here are the regulatory capital thresholds,
              set by the French monetary and financial code. When the quotes
              arrive, they will be published — like everything else.
            </p>
            <p>
              And we may never have to climb all four steps. Step 00 already
              takes money. Each of the following ones gets decided the moment
              it becomes worth more than the dependence it removes.
            </p>
          </div>

          <div className="mt-12 flex flex-wrap gap-4">
            <Link
              to="/en/pot"
              className="label inline-flex w-fit items-center gap-3 border-2 border-text px-6 py-3 hover:bg-text hover:text-bg"
            >
              The common pot <span aria-hidden>→</span>
            </Link>
            <Link
              to="/en/outils"
              className="label inline-flex w-fit items-center gap-2 self-center border-b-2 border-text pb-1 hover:opacity-70"
            >
              The tools that fund it <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
