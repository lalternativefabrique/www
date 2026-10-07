import { Link, createFileRoute } from '@tanstack/react-router'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/en/paiement')({
  component: PaiementPageEn,
  head: () =>
    seo({
      title: "Collecting payments without a middleman — L'Alternative Fabrique",
      description:
        'Taking payment requires permission. The four regulatory steps that lead to running your own payments, and what each one costs.',
      path: '/en/paiement',
      locale: 'en',
      alternate: { fr: '/paiement', en: '/en/paiement' },
    }),
})

type Marche = {
  rang: string
  statut: string
  capital: string
  capitalHint: string
  etat: 'actuel' | 'suivant' | 'ensuite'
  dependance: number
  hauteur: string
  rangClass: string
  quoi: string
  ceQuOnGagne: string
  ceQueCaCoute: string
  accent: 'primary' | 'secondary' | 'warm' | 'paper'
}

const marches: Marche[] = [
  {
    rang: '00',
    statut: "Under a third party's licence",
    capital: '€0',
    capitalHint: 'No regulatory capital',
    etat: 'actuel',
    dependance: 100,
    hauteur: 'h-40 sm:h-56 md:h-64',
    rangClass: 'text-6xl sm:text-7xl',
    quoi:
      'This is Lungor today. Payments go through an already licensed payment provider: we hold neither bank details nor customer identities, everything stays with it.',
    ceQuOnGagne:
      'The product runs, collects and funds itself right now. Nothing waits for an authorisation.',
    ceQueCaCoute:
      'Complete dependency. The provider takes its cut, sets its rules and can turn off the tap.',
    accent: 'paper',
  },
  {
    rang: '01',
    statut: 'Agent of a payment service provider',
    capital: '€0',
    capitalHint: 'Registration, not authorisation',
    etat: 'suivant',
    dependance: 60,
    hauteur: 'h-56 sm:h-72 md:h-80',
    rangClass: 'text-7xl sm:text-8xl',
    quoi:
      'A licensed institution appoints us and registers us with the ACPR. We operate payments ourselves, under its licence and its responsibility.',
    ceQuOnGagne:
      'Actually operate payments, build volume and compliance expertise in real conditions, without tying up a cent.',
    ceQueCaCoute:
      'An institution has to be convinced to appoint us: it files the application, not us. Good repute, competence and internal controls to demonstrate.',
    accent: 'warm',
  },
  {
    rang: '02',
    statut: 'Simplified payment institution authorisation',
    capital: 'Reduced capital',
    capitalHint: 'Up to €3M/month in volume',
    etat: 'ensuite',
    dependance: 15,
    hauteur: 'h-72 sm:h-88 md:h-96',
    rangClass: 'text-8xl sm:text-9xl',
    quoi:
      'Our own authorisation, granted by the ACPR. A lighter prudential regime: reduced initial capital, and no minimum own-funds requirement under article L. 522-11-1 of the French Monetary and Financial Code.',
    ceQuOnGagne:
      'The licence is ours. No more principal, no more cut taken by a middleman, no more rules written by someone else.',
    ceQueCaCoute:
      'A complete authorisation file, and that is where the legal work concentrates. The regime is capped and gives no access to the European passport.',
    accent: 'secondary',
  },
  {
    rang: '03',
    statut: 'Payment institution authorisation',
    capital: '€125,000',
    capitalHint: 'Minimum initial capital',
    etat: 'ensuite',
    dependance: 5,
    hauteur: 'h-88 sm:h-[26rem] md:h-[30rem]',
    rangClass: 'text-8xl sm:text-[10rem]',
    quoi:
      'The full regime, with no volume cap. The capital is not an expense: it sits on the balance sheet, required by the regulator, and stays there.',
    ceQuOnGagne:
      "No volume limit at all, and the possibility of applying for direct access to the European Central Bank's transfer network, without an intermediary bank.",
    ceQueCaCoute:
      'Full internal controls, permanent compliance functions, continuous reporting to the regulator. And a banking link that does not go away: a payment institution is not a bank, so customer funds must stay in a separate account at a credit institution.',
    accent: 'primary',
  },
]

const etatLabel: Record<Marche['etat'], string> = {
  actuel: 'Where we stand',
  suivant: 'The next step',
  ensuite: 'Later',
}

const accentClass: Record<Marche['accent'], string> = {
  primary: 'bg-accent-primary text-bg',
  secondary: 'bg-accent-secondary text-bg',
  warm: 'bg-warm text-text',
  paper: 'bg-bg text-text border-y-2 border-text',
}

const livrables: { titre: string; detail: string }[] = [
  {
    titre: 'Programme of operations',
    detail:
      'The precise description of the services provided, how they work and how they are delivered. It is the piece the regulator reads first.',
  },
  {
    titre: 'Prudential business plan',
    detail:
      'Financial projections showing that prudential requirements will be met over time, not only at filing.',
  },
  {
    titre: 'AML/CFT framework',
    detail:
      'Anti-money laundering and counter-terrorist financing: procedures, controls, and a designated officer. Not a document, a permanent function.',
  },
  {
    titre: 'Internal controls',
    detail:
      'Two levels of control, with the governance that goes with them. The simplified regime lightens it, it does not remove it.',
  },
  {
    titre: 'Security and sensitive data',
    detail:
      'Procedures for access to payment data, security measures, fraud prevention.',
  },
  {
    titre: 'Business continuity',
    detail:
      'What happens when it goes down. The regulator wants the plan written before the incident.',
  },
  {
    titre: 'Safeguarding of funds',
    detail:
      'How user funds are protected and ring-fenced. They never belong to us.',
  },
  {
    titre: 'Directors and shareholders',
    detail:
      'Good repute, competence, experience, assessed person by person. The authority may hold hearings.',
  },
]

type Prelevement = {
  qui: string
  moyen: string
  tarif: string
  pourcentage: number
  fixeCents: number
}

const prelevements: Prelevement[] = [
  {
    qui: 'Stripe',
    moyen: 'Standard European card',
    tarif: '1.5% + €0.25',
    pourcentage: 1.5,
    fixeCents: 25,
  },
  {
    qui: 'Stripe',
    moyen: 'Premium European card',
    tarif: '2.8% + €0.25',
    pourcentage: 2.8,
    fixeCents: 25,
  },
  {
    qui: 'Stripe',
    moyen: 'International card',
    tarif: '3.15% + €0.25',
    pourcentage: 3.15,
    fixeCents: 25,
  },
  {
    qui: 'Wero',
    moyen: 'Account to account, via Mollie',
    tarif: '0.90% + €0.25',
    pourcentage: 0.9,
    fixeCents: 25,
  },
  {
    qui: 'SEPA transfer',
    moyen: 'Bank to bank, via Mollie',
    tarif: '€0.25',
    pourcentage: 0,
    fixeCents: 25,
  },
]

const PANIER_CENTS = 2000

const euros = new Intl.NumberFormat('en-IE', {
  style: 'currency',
  currency: 'EUR',
})

function surPanier({ pourcentage, fixeCents }: Prelevement) {
  return Math.round((PANIER_CENTS * pourcentage) / 100) + fixeCents
}

const sommaire = [
  'The obstacle: a permission',
  'What each one takes',
  'Four steps',
  'Eight documents to write',
  'What we do not know',
]

function Palier() {
  return (
    <div aria-hidden="true">
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
      <section className="border-b-2 border-text">
        <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:py-28">
          <div className="grid gap-12 sm:grid-cols-12">
            <div className="sm:col-span-7">
              <p className="label text-text/60">Project — № 01</p>
              <h1 className="display-xl mt-6">
                Collecting payments without a middleman
              </h1>
              <p className="chapeau mt-10 max-w-2xl">
                Today, a payment made with Lungor goes through Mollie: Mollie
                holds the authorisation to collect, and takes its commission.
                The project is for Lungor to obtain its own authorisation and
                collect directly. Here are the four steps that lead there, and
                what each one costs.
              </p>
              <div className="mt-10 flex flex-wrap gap-6">
                <Link
                  to="/en/projets"
                  className="label inline-flex w-fit items-center gap-2 border-b-2 border-text pb-1 hover:opacity-70"
                >
                  <span aria-hidden>←</span> The projects
                </Link>
                <a
                  href="https://lungor.fr"
                  className="label inline-flex w-fit items-center gap-2 border-b-2 border-text pb-1 hover:opacity-70"
                >
                  Lungor today <span aria-hidden>→</span>
                </a>
              </div>
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

      <section>
        <div className="mx-auto w-full max-w-3xl px-6 py-20 sm:py-28">
          <p className="label text-accent-primary">The real obstacle</p>
          <h2 className="font-heading mt-6 text-4xl uppercase leading-tight sm:text-5xl">
            Taking payment requires permission.
          </h2>
          <div className="prose-editorial mt-10 text-text/85">
            <p>
              Building a tool asks no one's permission. Taking money does.
              Payment is a regulated trade: to operate yourself, you need a
              status granted by the Autorité de contrôle prudentiel et de
              résolution, and that status is not obtained with code.
            </p>
            <p>
              That is why everyone goes through a middleman. It holds the
              licence, takes its cut, writes the rules. The dependency is not
              technical, it is regulatory, and that is what makes it last.
            </p>
            <p>
              Every means we want to take back is guarded by a permission. This
              one is crossed in four steps.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t-2 border-text bg-warm">
        <div className="mx-auto w-full max-w-7xl px-6 py-16 sm:py-24">
          <p className="label text-text/60">The price of dependency</p>
          <h2 className="font-heading mt-6 max-w-3xl text-4xl uppercase leading-tight sm:text-5xl">
            What each one takes.
          </h2>
          <p className="chapeau mt-8 max-w-2xl">
            Stripe is the default choice, and for good reasons: it integrates
            quickly and accepts almost every payment method. Here is what each
            payment costs, according to public pricing.
          </p>

          <div className="mt-14 grid grid-cols-1 gap-px bg-text sm:grid-cols-2 lg:grid-cols-5">
            {prelevements.map((prelevement) => (
              <div
                key={`${prelevement.qui}-${prelevement.moyen}`}
                className="bg-bg p-6 sm:p-8"
              >
                <p className="label text-accent-primary">{prelevement.qui}</p>
                <p className="mt-2 text-sm text-text/70">{prelevement.moyen}</p>
                <p className="font-heading mt-6 whitespace-nowrap text-2xl leading-none">
                  {prelevement.tarif}
                </p>
                <p className="mt-6 text-sm text-text/80">
                  On {euros.format(PANIER_CENTS / 100)}:{' '}
                  <strong>
                    {euros.format(surPanier(prelevement) / 100)}
                  </strong>
                </p>
              </div>
            ))}
          </div>

          <p className="font-heading mt-16 max-w-4xl text-4xl uppercase leading-tight sm:text-6xl">
            Imagine those commissions recovered to fund{' '}
            <span className="text-bg">tomorrow's applications</span>.
          </p>
          <p className="chapeau mt-8 max-w-2xl">
            Every payment leaves a few tens of cents to a middleman today.
            Collected by Lungor, they would stay in the organisation and fund
            what comes next.
          </p>

          <div className="prose-editorial mt-12 max-w-3xl text-text/85">
            <p>
              Wero is the European account-to-account payment initiative: money
              goes from the customer's bank to the merchant's, without passing
              through Visa or Mastercard. It belongs to EPI, a company owned by
              sixteen European banks and providers, including BNP Paribas,
              Crédit Agricole, Société Générale, Deutsche Bank and ING. The
              percentage drops. But a merchant still reaches it through a
              provider, which adds its commission and its fixed fee per
              transaction.
            </p>
            <p>
              The fixed fee is what weighs on small amounts, and it is the same
              everywhere. Removing it means being the payment institution
              yourself: that is the point of this project.
            </p>
          </div>

          <p className="mt-10 max-w-3xl text-sm text-text/60">
            Public pricing for France, recorded on 6 October 2026 from{' '}
            <a href="https://stripe.com/fr/pricing" className="underline">
              stripe.com/fr/pricing
            </a>{' '}
            and{' '}
            <a href="https://www.mollie.com/fr/pricing" className="underline">
              mollie.com/fr/pricing
            </a>
            . Excludes volume-negotiated pricing. The group that runs Wero
            publishes no price list: the rate shown is Mollie's, our current
            provider. EPI shareholders according to{' '}
            <a href="https://www.epicompany.eu" className="underline">
              epicompany.eu
            </a>
            .
          </p>
        </div>
      </section>

      <section className="border-t-2 border-text bg-text text-bg">
        <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:py-28">
          <p className="label opacity-70">
            Project — collecting payments without a middleman
          </p>
          <h2 className="font-heading mt-6 max-w-3xl text-4xl uppercase leading-tight sm:text-5xl">
            Four steps,
            <br />
            climbed one at a time.
          </h2>
          <p className="chapeau mt-8 max-w-2xl opacity-90">
            Each removes a share of dependency. Each already earns, which pays
            for the next. None requires waiting to have all the money before
            starting.
          </p>

          <Palier />

          <div className="mt-10 flex flex-wrap items-center justify-between gap-6">
            <p className="label flex items-center gap-3 opacity-70">
              <span
                aria-hidden
                className="inline-block h-3 w-8 bg-accent-primary"
              />
              The share that is not yet ours
            </p>
            <p className="label bg-accent-primary px-3 py-1 text-bg">
              00 — today
            </p>
          </div>
        </div>
      </section>

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
                  <p className="label opacity-60">What is not ours</p>
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

      <section className="border-t-2 border-text">
        <div className="mx-auto w-full max-w-3xl px-6 py-20 sm:py-28">
          <p className="label text-accent-primary">What the reinvestment funds</p>
          <h2 className="font-heading mt-6 text-4xl uppercase leading-tight sm:text-5xl">
            Lawyers, not capital.
          </h2>
          <div className="prose-editorial mt-10 text-text/85">
            <p>
              The regulatory capital, the €125,000 of the last step, is not an
              expense. It is a sum held on the balance sheet, which the
              regulator requires to see and which stays there. It is not
              consumed, it is set down.
            </p>
            <p>
              The real expense is elsewhere, and it is human. An authorisation
              file is a set of written procedures, verifiable and defensible
              before an authority that can question the directors and analyse
              the business model in detail. It is written with lawyers
              specialised in banking law, and maintained by a compliance
              officer who does not leave once the file is submitted.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t-2 border-text bg-warm">
        <div className="mx-auto w-full max-w-7xl px-6 py-16 sm:py-24">
          <p className="label text-text/60">The file</p>
          <h2 className="font-heading mt-6 max-w-3xl text-4xl uppercase leading-tight sm:text-5xl">
            What has to be written.
          </h2>
          <p className="chapeau mt-8 max-w-2xl">
            The detail of an authorisation file, as the regulator examines it.
            This list is what our reinvestment pays for.
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
            Reviewing a complete file takes three months. The clock only starts
            once the file is deemed complete; the preparation has no regulatory
            deadline. That is the part we fund.
          </p>
        </div>
      </section>

      <section className="border-t-2 border-text">
        <div className="mx-auto w-full max-w-3xl px-6 py-20 sm:py-28">
          <p className="label text-accent-primary">What we do not know yet</p>
          <h2 className="font-heading mt-6 text-4xl uppercase leading-tight sm:text-5xl">
            The price is not public.
          </h2>
          <div className="prose-editorial mt-10 text-text/85">
            <p>
              Neither the authorities nor the specialised firms publish a price
              list for assisting with an authorisation file. The figure does not
              exist in the open: it comes by quote, case by case.
            </p>
            <p>
              So we will not put an amount on this page until we have our own.
              The only figures shown here are the regulatory capital amounts,
              set by the Monetary and Financial Code. When the quotes come in,
              they will be published, like the rest.
            </p>
            <p>
              And we may never have to climb all four steps. Step 00 already
              collects. Each of the next ones is decided when it becomes more
              profitable than the dependency it removes.
            </p>
          </div>

          <div className="mt-12 flex flex-wrap gap-4">
            <Link
              to="/en/projets"
              className="label inline-flex w-fit items-center gap-3 border-2 border-text px-6 py-3 hover:bg-text hover:text-bg"
            >
              The projects <span aria-hidden>→</span>
            </Link>
            <Link
              to="/en/outils"
              className="label inline-flex w-fit items-center gap-2 self-center border-b-2 border-text pb-1 hover:opacity-70"
            >
              The applications that fund it <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
