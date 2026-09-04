import { Link, createFileRoute } from '@tanstack/react-router'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/en/pot/annule')({
  component: CancelledPage,
  head: () =>
    seo({
      title: "Payment abandoned — L'Alternative Fabrique",
      description: 'The payment stopped before completing. Nothing was charged.',
      path: '/en/pot/annule',
      locale: 'en',
      noindex: true,
    }),
})

function CancelledPage() {
  return (
    <section className="border-y-2 border-text bg-bg text-text">
      <div className="mx-auto w-full max-w-3xl px-6 py-20 sm:py-28">
        <p className="label text-text/60">Payment abandoned</p>
        <h1 tabIndex={-1} className="display-xl mt-6 focus:outline-none">
          Nothing was charged.
        </h1>
        <div className="prose-editorial mt-10 text-text/85">
          <p>
            The payment stopped before completing. No amount was charged, no
            data was kept. The pot stays open if you come back.
          </p>
        </div>
        <div className="mt-12">
          <Link
            to="/en/pot"
            hash="chip-in"
            className="label inline-flex w-fit items-center gap-3 border-2 border-text px-6 py-3 hover:bg-text hover:text-bg"
          >
            Back to the pot <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
