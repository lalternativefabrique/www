import { Link, createFileRoute } from '@tanstack/react-router'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/en/pot/merci')({
  component: ThanksPage,
  head: () =>
    seo({
      title: "It is in the pot — L'Alternative Fabrique",
      description: 'Your contribution to the common pot is recorded.',
      path: '/en/pot/merci',
      locale: 'en',
      noindex: true,
    }),
})

function ThanksPage() {
  return (
    <section className="bg-accent-secondary text-bg">
      <div className="mx-auto w-full max-w-3xl px-6 py-20 sm:py-28">
        <p className="label opacity-70">Done</p>
        <h1 tabIndex={-1} className="display-xl mt-6 focus:outline-none">
          It is in the pot.
        </h1>
        <div className="prose-editorial mt-10 opacity-90">
          <p>
            Your contribution is recorded. The invoice goes out by email within
            minutes — if it does not arrive, check your spam folder, then write
            to us.
          </p>
          <p>
            It joins the same list as the rest of the pot, in the same order.
            What is funded, and what is not yet, stays written on this page.
          </p>
        </div>
        <div className="mt-12 flex flex-wrap gap-4">
          <Link
            to="/en/pot"
            className="label inline-flex w-fit items-center gap-3 border-2 border-current px-6 py-3 hover:bg-bg hover:text-accent-secondary"
          >
            The common pot <span aria-hidden>→</span>
          </Link>
          <Link
            to="/en/paiement"
            className="label inline-flex w-fit items-center gap-2 self-center border-b-2 border-current pb-1 hover:opacity-70"
          >
            The payment work, in detail <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
