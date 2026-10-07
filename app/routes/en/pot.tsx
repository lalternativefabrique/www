import { Link, createFileRoute } from '@tanstack/react-router'
import { Participation } from '@/components/Participation'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/en/pot')({
  component: PotPageEn,
  head: () =>
    seo({
      title: "Funding — L'Alternative Fabrique",
      description:
        "How the applications of L'Alternative Fabrique fund the projects that follow, and how to contribute directly.",
      path: '/en/pot',
      locale: 'en',
      alternate: { fr: '/pot', en: '/en/pot' },
    }),
})

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
            Using one of our applications funds the projects that follow. You
            can also contribute directly.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#chip-in"
              className="label inline-flex w-fit items-center gap-3 border-2 border-text bg-text px-6 py-3 text-bg hover:bg-accent-primary"
            >
              Contribute now <span aria-hidden>↓</span>
            </a>
            <Link
              to="/en/projets"
              className="label inline-flex w-fit items-center gap-2 border-b-2 border-text pb-1 hover:text-accent-primary"
            >
              See the projects <span aria-hidden>→</span>
            </Link>
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
              to="/en/projets"
              className="label inline-flex w-fit items-center gap-3 border-2 border-current px-6 py-3 hover:bg-bg hover:text-accent-secondary"
            >
              The projects being funded <span aria-hidden>→</span>
            </Link>
            <Link
              to="/en/outils"
              className="label inline-flex w-fit items-center gap-2 self-center border-b-2 border-current pb-1 hover:opacity-70"
            >
              The applications that fund them <span aria-hidden>→</span>
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
              The simplest way to fund what comes next is to use an
              application. Thanks to a shared organisation, a single stream of
              funding keeps every application alive: what you pay for one
              funds the others, those that exist, those in beta, those on
              their way and those still to be imagined.
            </p>
            <p>
              We set fundraising aside. It brings money faster, but it means
              giving up a share and writing the rest with someone else.
              Reinvestment is slower, and depends only on the real use of the
              applications.
            </p>
            <p>
              You can also contribute directly without buying an application you
              do not need. This is not a donation to a cause: it is a
              contribution to development, assigned to the same projects in
              the same order.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t-2 border-text">
        <div className="mx-auto w-full max-w-3xl px-6 py-20 sm:py-28">
          <p className="label text-accent-primary">Where the money goes</p>
          <h2 className="font-heading mt-6 text-4xl uppercase leading-tight sm:text-5xl">
            Two projects under way.
          </h2>
          <div className="prose-editorial mt-10 text-text/85">
            <p>
              Reczi, to publish videos, articles and podcasts without depending
              on YouTube or Substack. And Lungor, to collect payments without a
              middleman. Their progress is on a page of its own.
            </p>
          </div>
          <Link
            to="/en/projets"
            className="label mt-10 inline-flex w-fit items-center gap-3 border-2 border-text px-6 py-3 hover:bg-text hover:text-bg"
          >
            See the projects <span aria-hidden>→</span>
          </Link>
        </div>
      </section>
    </div>
  )
}
