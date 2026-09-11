import { Link, createFileRoute } from '@tanstack/react-router'
import { Participation } from '@/components/Participation'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/en/pot')({
  component: PotPageEn,
  head: () =>
    seo({
      title: "Funding — L'Alternative Fabrique",
      description:
        'See the projects of L\'Alternative Fabrique, their progress and how the solutions already available fund what comes next.',
      path: '/en/pot',
      locale: 'en',
      alternate: { fr: '/pot', en: '/en/pot' },
    }),
})

/** A step: an audience served, a set of solutions shipped, a goal funded. */
type Saison = {
  rang: string
  etat: 'under way' | 'next' | 'open'
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
    etat: 'under way',
    public: 'Content creators',
    outils: 'Techtuel · Synthiz · Spore',
    finance: 'Payment',
    detail:
      'Transcribe, connect, recover what we pile up — and write to your readers from your own infrastructure. This revenue funds the brick that makes every other one possible: taking payment without a middleman.',
    accent: 'primary',
    chantier: { to: '/en/paiement', label: 'The project in detail' },
  },
  {
    rang: '02',
    etat: 'next',
    public: 'Developers and technical teams',
    outils: 'Skalpai · sklp · Vvaves',
    finance: 'Investment — and infrastructure',
    detail:
      'Development tooling, observability, event handling between services. The code is already largely written: what gets funded here is the infrastructure that runs it — compute, servers, the bill that lands every month.',
    accent: 'secondary',
    chantierEnAttente: 'Project to be defined',
  },
  {
    rang: '03',
    etat: 'open',
    public: 'Open to proposals',
    outils: 'To be written',
    finance: 'Whatever is still missing',
    detail:
      "We don't yet know what it holds, and we would rather say so. What we do know is what will open it: the first two seasons paid for, and enough to start the next.",
    accent: 'paper',
  },
]

const accentClass: Record<Saison['accent'], string> = {
  primary: 'bg-accent-primary text-bg',
  secondary: 'bg-accent-secondary text-bg',
  warm: 'bg-warm text-text',
  paper: 'bg-bg text-text border-y-2 border-text',
}

function PotPageEn() {
  return (
    <div>
      {/* Header */}
      <section className="border-b-2 border-text">
        <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:py-28">
          <p className="label text-text/60">Funding</p>
          <h1 className="display-xl mt-6">
            Fund <span className="text-accent-primary">what comes next</span>
          </h1>
          <p className="chapeau mt-10 max-w-2xl">
            A share of the revenue from our solutions funds the projects that
            follow. You can also contribute directly.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#chip-in"
              className="label inline-flex w-fit items-center gap-3 border-2 border-text bg-text px-6 py-3 text-bg hover:bg-accent-primary"
            >
              Contribute now <span aria-hidden>↓</span>
            </a>
            <a
              href="#projects"
              className="label inline-flex w-fit items-center gap-2 border-b-2 border-text pb-1 hover:text-accent-primary"
            >
              See the projects <span aria-hidden>↓</span>
            </a>
          </div>
        </div>
      </section>

      <section
        id="chip-in"
        className="scroll-mt-6 border-b-2 border-text bg-accent-secondary text-bg"
      >
        <div className="mx-auto min-h-[calc(100svh-7rem)] w-full max-w-7xl px-6 py-16 sm:py-24">
          <p className="label opacity-70">Direct contribution</p>
          <h2 className="font-heading mt-6 text-4xl uppercase leading-tight sm:text-5xl">
            Fund what comes next.
          </h2>

          <div className="mt-12">
            <Participation />
          </div>

          <div className="mt-16 flex flex-wrap gap-4 border-t-2 border-current pt-10">
            <Link
              to="/en/paiement"
              className="label inline-flex w-fit items-center gap-3 border-2 border-current px-6 py-3 hover:bg-bg hover:text-accent-secondary"
            >
              The payment project, in detail <span aria-hidden>→</span>
            </Link>
            <Link
              to="/en/outils"
              className="label inline-flex w-fit items-center gap-2 self-center border-b-2 border-current pb-1 hover:opacity-70"
            >
              What we have built <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* The thesis — why any of this exists */}
      <section>
        <div className="mx-auto w-full max-w-3xl px-6 py-20 sm:py-28">
          <p className="label text-accent-primary">Funding</p>
          <h2 className="font-heading mt-6 text-4xl uppercase leading-tight sm:text-5xl">
            What exists funds what comes next.
          </h2>
          <div className="prose-editorial mt-10 text-text/85">
            <p>
              There are only two ways to fund what you set out to build. Raise
              money — give up a share, answer to someone, write the rest of the
              story with them. Or take back revenue that already slips away
              from you.
            </p>
            <p>
              We chose the second. Every software subscription, every online
              service, every everyday payment leaves a cut to a middleman who
              produced nothing but the permission to take payment. It is a gold
              mine, tapped daily, on everyone. It cannot keep escaping us.
            </p>
            <p>
              We reinvest a share of each solution's revenue in the projects
              that follow. The first concerns the means that governs all the
              others: taking payments.
            </p>
            <p>
              You can also contribute directly without buying a solution you
              do not need. This is not a donation to a cause: it is a
              contribution to development, assigned to the same projects in
              the same order.
            </p>
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section id="projects" className="scroll-mt-6 border-t-2 border-text">
        <div className="mx-auto w-full max-w-7xl px-6 py-16 sm:py-24">
          <p className="label text-accent-primary">The roadmap</p>
          <h2 className="font-heading mt-6 max-w-3xl text-4xl uppercase leading-tight sm:text-5xl">
            Now. Next. Later.
          </h2>
          <p className="chapeau mt-8 max-w-2xl">
            Each step ships useful solutions for an audience and funds the next
            project. Once available, it keeps producing and funding what comes
            after it.
          </p>
        </div>
      </section>

      {saisons.map((saison) => (
        <section key={saison.rang} className={accentClass[saison.accent]}>
          <div className="mx-auto w-full max-w-7xl px-6 py-16 sm:py-24">
            <div className="grid gap-10 sm:grid-cols-12">
              <div className="sm:col-span-5">
                <p className="label opacity-70">Project — {saison.etat}</p>
                <p className="font-heading mt-6 text-7xl leading-none sm:text-8xl">
                  {saison.rang}
                </p>
                <p className="mt-6 text-lg font-medium">{saison.public}</p>
                {saison.chantier ? (
                  <p className="label mt-4 opacity-60">
                    Project — № {saison.rang}
                  </p>
                ) : null}
              </div>

              <div className="flex flex-col justify-end sm:col-span-7">
                <p className="chapeau">{saison.detail}</p>
                <dl className="mt-10 space-y-6">
                  <div>
                    <dt className="label opacity-60">Available solutions</dt>
                    <dd className="mt-2 text-base opacity-90">
                      {saison.outils}
                    </dd>
                  </div>
                  <div>
                    <dt className="label opacity-60">What it funds</dt>
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

      {/* The first project — teaser toward /paiement */}
      <section className="border-t-2 border-text">
        <div className="mx-auto w-full max-w-3xl px-6 py-20 sm:py-28">
          <p className="label text-accent-primary">The first project</p>
          <h2 className="font-heading mt-6 text-4xl uppercase leading-tight sm:text-5xl">
            Taking payment requires permission.
          </h2>
          <div className="prose-editorial mt-10 text-text/85">
            <p>
              Building a tool asks no one's permission. Taking money does.
              Payment is a regulated trade, which is why everyone goes through
              a middleman: he holds the licence, he takes his cut, he writes
              the rules. The dependency is not technical — it is regulatory,
              and that is what makes it last.
            </p>
            <p>
              The same barrier guards the next season. Opening investment to
              private individuals requires the status of crowdfunding service
              provider, authorised by the Autorité des marchés financiers under
              European regulation 2020/1503. Since November 2023, no
              unauthorised platform may offer these services.
            </p>
            <p>
              Every means we want to take back is guarded by a permission. That
              is what our reinvestment funds.
            </p>
          </div>

        </div>
      </section>

    </div>
  )
}
