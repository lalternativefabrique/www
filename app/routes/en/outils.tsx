import { useEffect, useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { ORGANIZATION, SITE_URL, jsonLd, seo } from '@/lib/seo'

const outilsSeo = seo({
  title: "The tools — L'Alternative Fabrique",
  description:
    "The tools of L'Alternative Fabrique running today: Synthiz, Techtuel, Spore, Lungor, Skalpai. To each organ its tool.",
  path: '/en/outils',
  locale: 'en',
  alternate: { fr: '/outils', en: '/en/outils' },
})

export const Route = createFileRoute('/en/outils')({
  component: OutilsPageEn,
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
    organe: 'Knowledge',
    url: 'https://synthiz.com',
    tagline: 'Your working memory, fed by your own sources.',
    detail:
      'Transcribe videos, podcasts and documents, then find, connect and synthesise what you have gathered. Your notes and your sources stay yours.',
    pour: 'Creators, researchers, consultants, analysts',
    prix: 'Free · Pro €5/month · Max €12/month',
    accent: 'primary',
    fabrique: {
      role: 'The product that makes knowledge usable day to day.',
      amont: 'Relies on Techtuel to turn videos and podcasts into text.',
      aval:
        'Feeds everything else: nothing is decided, created or funded without knowing.',
      permet: [
        'Keeping your sources away from the platforms that index them for themselves',
        'Finding and quoting precisely instead of paraphrasing from memory',
        'Building a body of work that will still be there in ten years',
      ],
    },
  },
  {
    name: 'Techtuel',
    organe: 'Knowledge',
    url: 'https://techtuel.com',
    tagline: 'The API that turns any source into text.',
    detail:
      'Extraction and transcription of video, podcast and audio, served through an API. The engine behind Synthiz, available directly for your own products.',
    pour: 'Developers and software publishers',
    accent: 'paper',
    fabrique: {
      role: 'The raw material intake. Nothing starts without it.',
      amont:
        'Runs on French compute infrastructure — cost known to the cent.',
      aval:
        'Powers Synthiz, and opens up to anyone who wants to build their own fabrique.',
      permet: [
        'Publishing stable prices, because no link in the chain is billed by an unpredictable third party',
        'Processing multilingual content without the bill changing with the language',
        'Building a product on a component whose real cost is known',
      ],
    },
  },
  {
    name: 'Spore',
    organe: 'Communication',
    url: 'https://sporee.fr',
    tagline: 'Your emails leave from your own infrastructure.',
    detail:
      'Attach your domains, generate your DKIM identities, publish your DNS records and send. The SMTP infrastructure is ours — you are not renting a layer laid on top of someone else’s.',
    pour: 'Technical teams sending transactional email',
    accent: 'secondary',
    fabrique: {
      role: 'The voice of the fabrique. What leaves here leaves from our own.',
      amont: 'SMTP infrastructure of our own — server, IP address, DKIM signature.',
      aval: 'Carries the messages of every other tool, with no middleman.',
      permet: [
        'Writing to your customers without a third party being able to suspend the channel',
        'Attaching your own domains rather than borrowing a provider’s',
        'Not watching your sending capacity become a commercial variable',
      ],
    },
  },
  {
    name: 'Lungor',
    organe: 'Funding',
    url: 'https://lungor.fr',
    tagline: 'Your SaaS revenue, finally legible.',
    detail:
      'Revenue, subscriptions, dunning and compliant invoices, on a single dashboard. Enough to stop tracking your income in a spreadsheet.',
    pour: 'Solo developers and small teams running a SaaS',
    invitation: true,
    accent: 'warm',
    fabrique: {
      role: 'What keeps the fabrique standing: collecting what it produces.',
      amont:
        'Built on licensed payment providers — we never touch your bank details or your customers’ identities.',
      aval: 'Will collect for our own tools first, before opening to others.',
      permet: [
        'Seeing what you earn without rebuilding a spreadsheet every month',
        'Issuing compliant invoices without spending your evenings on them',
        'Not handing the lifeblood of your business to an intermediary that takes a cut',
      ],
    },
  },
  {
    name: 'Skalpai',
    organe: 'Technique',
    url: 'https://skalpai.dev',
    tagline: 'See what your applications are doing, without a budget for it.',
    detail:
      'Observability and telemetry for your services, with the sklp CLI and the skt toolchain manager. It is the ground every tool on this page runs on.',
    pour: 'Developers and small teams',
    accent: 'paper',
    fabrique: {
      role: 'The ground everything else rests on.',
      amont: 'Depends on no outside platform to exist.',
      aval: 'Tools the making and the watching of every other tool.',
      permet: [
        'Seeing what your services do without an enterprise budget for it',
        'Keeping your telemetry at home rather than with a third-party observer',
        'Building and shipping with the same chain, from one project to the next',
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
        aria-label={`${outil.name} in the fabrique`}
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto border-2 border-text bg-bg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-6 border-b-2 border-text p-6 sm:p-8">
          <div>
            <p className="label text-accent-primary">In the fabrique</p>
            <p className="font-heading mt-3 text-4xl uppercase leading-none sm:text-5xl">
              {outil.name}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="label shrink-0 border-2 border-text px-3 py-2 hover:bg-text hover:text-bg"
          >
            Close
          </button>
        </div>

        <div className="p-6 sm:p-8">
          <p className="chapeau">{outil.fabrique.role}</p>

          <dl className="mt-8 space-y-6">
            <div>
              <dt className="label text-text/50">What it rests on</dt>
              <dd className="mt-2 text-base text-text/85">
                {outil.fabrique.amont}
              </dd>
            </div>
            <div>
              <dt className="label text-text/50">What it carries</dt>
              <dd className="mt-2 text-base text-text/85">
                {outil.fabrique.aval}
              </dd>
            </div>
          </dl>

          <div className="mt-10 border-t-2 border-text pt-6">
            <p className="label text-text/50">What it makes possible</p>
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
              ? `Request an invitation`
              : `Open ${outil.name}`}{' '}
            <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </div>
  )
}

function OutilsPageEn() {
  const [ouvert, setOuvert] = useState<Outil | null>(null)

  return (
    <div>
      {/* Title block */}
      <section className="border-b-2 border-text">
        <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:py-28">
          <p className="label text-text/60">The tools — № 01</p>
          <h1 className="display-xl mt-6">The tools</h1>
          <p className="chapeau mt-8 max-w-2xl">
            To each organ its tool. These are running today — you can use them
            now. The other organs are still waiting for theirs.
          </p>
          <Link
            to="/en/apps"
            className="label mt-8 inline-flex w-fit items-center gap-2 text-accent-primary hover:underline"
          >
            See the organs <span aria-hidden>→</span>
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
                  {String(i + 1).padStart(2, '0')} — {outil.organe} organ
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
                    <dt className="label shrink-0 opacity-60">For</dt>
                    <dd className="opacity-90">{outil.pour}</dd>
                  </div>
                  {outil.invitation ? (
                    <div className="flex gap-3">
                      <dt className="label shrink-0 opacity-60">Access</dt>
                      <dd className="opacity-90">Invite-only beta</dd>
                    </div>
                  ) : null}
                  {outil.prix ? (
                    <div className="flex gap-3">
                      <dt className="label shrink-0 opacity-60">Price</dt>
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
                      ? `Request an invitation`
                      : `Open ${outil.name}`}{' '}
                    <span aria-hidden>→</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setOuvert(outil)}
                    className="label inline-flex w-fit items-center gap-2 border-b-2 border-current pb-1 hover:opacity-70"
                  >
                    Its place in the fabrique <span aria-hidden>↗</span>
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
          <p className="label text-accent-primary">What binds them</p>
          <h2 className="font-heading mt-6 text-4xl uppercase leading-tight sm:text-5xl">
            A share goes back to the common pot.
          </h2>
          <div className="prose-editorial mt-10 text-text/85">
            <p>
              Each of these tools pays a fraction of its revenue into a common
              pot, which serves to forge our own means anew — starting with the
              one that governs all the others: getting paid without an
              intermediary.
            </p>
          </div>
          <Link
            to="/en/pot"
            className="label mt-10 inline-flex w-fit items-center gap-3 border-2 border-text px-6 py-3 hover:bg-text hover:text-bg"
          >
            See the pot <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      {ouvert ? (
        <FabriqueModal outil={ouvert} onClose={() => setOuvert(null)} />
      ) : null}
    </div>
  )
}
