import { Link, createFileRoute } from '@tanstack/react-router'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/en/a-propos')({
  component: AProposPageEn,
  head: () =>
    seo({
      title: "About — L'Alternative Fabrique",
      description:
        "L'Alternative Fabrique builds the technical, economic and governance means of an alternative, one organ at a time.",
      path: '/en/a-propos',
      locale: 'en',
      alternate: { fr: '/a-propos', en: '/en/a-propos' },
    }),
})

function AProposPageEn() {
  return (
    <div>
      <section className="border-b-2 border-text">
        <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:py-28">
          <p className="label text-text/60">The collective</p>
          <h1 className="display-xl mt-6">About</h1>
          <p className="chapeau mt-10 max-w-2xl">
            L'Alternative Fabrique builds the means of an alternative —
            technical, economic, governmental — and pools part of the revenue
            of every tool into a common pot, to fund the organs that are still
            missing.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto w-full max-w-3xl px-6 py-20 sm:py-28">
          <p className="label text-accent-primary">Our reading</p>
          <h2 className="font-heading mt-6 text-4xl uppercase leading-tight sm:text-5xl">
            An idea is not enough.
          </h2>
          <div className="prose-editorial mt-10 text-text/85">
            <p>
              An opening exists today: the chance to build an alternative. Not
              a copy of what already stands, but a system conceived otherwise.
            </p>
            <p>
              An idea, however, does not hold on its own. It needs means —
              technical, economic, cultural, and of governance.
            </p>
            <p>
              L'Alternative Fabrique builds those means, one organ at a time.
            </p>
            <p>
              Every published tool holds a precise place. Some answer an
              immediate need. Others produce the resources the next organs
              require.
            </p>
            <p>This order owes nothing to chance. It is an architecture.</p>
            <p>
              We are not asking you to subscribe to a promise. We intend to
              prove it, step after step, through what we build.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-text text-bg">
        <div className="mx-auto w-full max-w-7xl px-6 py-24 sm:py-32">
          <div className="grid gap-10 sm:grid-cols-12">
            <div className="sm:col-span-5">
              <p className="label opacity-70">Contact</p>
              <p className="font-heading mt-6 text-5xl uppercase leading-none sm:text-7xl">
                Write to us.
              </p>
            </div>
            <div className="flex flex-col justify-end sm:col-span-7">
              <p className="chapeau opacity-90">
                Does this way of working speak to you, or do you just want to
                talk? We read everything.
              </p>
              <Link
                to="/en/contact"
                className="label mt-8 inline-flex w-fit items-center gap-3 border-2 border-bg px-6 py-3 hover:bg-bg hover:text-text"
              >
                Get in touch <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
