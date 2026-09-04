import { Link, createFileRoute } from '@tanstack/react-router'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/pot/annule')({
  component: AnnulePage,
  head: () =>
    seo({
      title: "Paiement abandonné — L'Alternative Fabrique",
      description: "Le paiement s'est arrêté avant d'aboutir. Rien n'a été prélevé.",
      path: '/pot/annule',
      noindex: true,
    }),
})

function AnnulePage() {
  return (
    <section className="border-y-2 border-text bg-bg text-text">
      <div className="mx-auto w-full max-w-3xl px-6 py-20 sm:py-28">
        <p className="label text-text/60">Paiement abandonné</p>
        <h1 tabIndex={-1} className="display-xl mt-6 focus:outline-none">
          Rien n'a été prélevé.
        </h1>
        <div className="prose-editorial mt-10 text-text/85">
          <p>
            Le paiement s'est arrêté avant d'aboutir. Aucun montant n'a été
            débité, aucune donnée n'a été conservée. Le pot reste ouvert si vous
            revenez.
          </p>
        </div>
        <div className="mt-12">
          <Link
            to="/pot"
            hash="participer"
            className="label inline-flex w-fit items-center gap-3 border-2 border-text px-6 py-3 hover:bg-text hover:text-bg"
          >
            Revenir au pot <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
