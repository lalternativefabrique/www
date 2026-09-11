import { Link, createFileRoute } from '@tanstack/react-router'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/a-propos')({
  component: AProposPage,
  head: () =>
    seo({
      title: "À propos — L'Alternative Fabrique",
      description:
        "L'Alternative Fabrique prouve qu'une alternative est possible avec des solutions disponibles, des projets concrets et cinq piliers.",
      path: '/a-propos',
    }),
})

function AProposPage() {
  return (
    <div>
      <section className="border-b-2 border-text">
        <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:py-28">
          <p className="label text-text/60">Le collectif</p>
          <h1 className="display-xl mt-6">À propos</h1>
          <p className="chapeau mt-10 max-w-2xl">
            L'Alternative Fabrique montre qu'une alternative est possible en
            construisant ses propres solutions. Une part de leurs revenus est
            réinvestie dans les projets suivants.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto w-full max-w-3xl px-6 py-20 sm:py-28">
          <p className="label text-accent-primary">Notre lecture</p>
          <h2 className="font-heading mt-6 text-4xl uppercase leading-tight sm:text-5xl">
            Une idée ne suffit pas.
          </h2>
          <div className="prose-editorial mt-10 text-text/85">
            <p>
              Aujourd'hui, une opportunité se présente : celle de construire
              une alternative. Pas une copie de ce qui existe déjà, mais un
              système pensé autrement.
            </p>
            <p>
              Une idée, pourtant, ne tient pas seule. Elle a besoin de moyens
              techniques, économiques, culturels et de gouvernance.
            </p>
            <p>
              L'Alternative Fabrique construit ces moyens, pilier après pilier.
            </p>
            <p>
              Chaque solution publiée occupe une place précise. Certaines répondent
              à un besoin immédiat. D'autres produisent les ressources
              nécessaires aux projets suivants.
            </p>
            <p>
              Cet ordre n'est pas le fruit du hasard. C'est une architecture.
            </p>
            <p>
              Nous ne vous demandons pas d'adhérer à une promesse. Nous
              comptons la démontrer, étape après étape, par ce que nous
              construisons.
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
                Écrivez-nous.
              </p>
            </div>
            <div className="flex flex-col justify-end sm:col-span-7">
              <p className="chapeau opacity-90">
                Vous vous reconnaissez dans cette démarche, ou vous voulez
                juste discuter ? On lit tout.
              </p>
              <Link
                to="/contact"
                className="label mt-8 inline-flex w-fit items-center gap-3 border-2 border-bg px-6 py-3 hover:bg-bg hover:text-text"
              >
                Nous écrire <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
