import { Link, createFileRoute } from '@tanstack/react-router'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/pot/merci')({
  component: MerciPage,
  head: () =>
    seo({
      title: "Contribution enregistrée — L'Alternative Fabrique",
      description: 'Votre contribution au projet est enregistrée.',
      path: '/pot/merci',
      noindex: true,
    }),
})

function MerciPage() {
  return (
    <section className="bg-accent-secondary text-bg">
      <div className="mx-auto w-full max-w-3xl px-6 py-20 sm:py-28">
        <p className="label opacity-70">C'est fait</p>
        <h1 tabIndex={-1} className="display-xl mt-6 focus:outline-none">
          Merci pour votre contribution.
        </h1>
        <div className="prose-editorial mt-10 opacity-90">
          <p>
            Votre participation est enregistrée. La facture part par email dans
            les minutes qui viennent — si elle n'arrive pas, regardez les
            indésirables, puis écrivez-nous.
          </p>
          <p>
            Elle financera les projets publiés, dans l'ordre annoncé. Ce qui
            est financé, et ce qui ne l'est pas encore, reste écrit sur cette
            page.
          </p>
        </div>
        <div className="mt-12 flex flex-wrap gap-4">
          <Link
            to="/pot"
            className="label inline-flex w-fit items-center gap-3 border-2 border-current px-6 py-3 hover:bg-bg hover:text-accent-secondary"
          >
            Voir les projets <span aria-hidden>→</span>
          </Link>
          <Link
            to="/paiement"
            className="label inline-flex w-fit items-center gap-2 self-center border-b-2 border-current pb-1 hover:opacity-70"
          >
            Le projet du paiement, en détail <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
