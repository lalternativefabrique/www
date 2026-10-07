import { Link, createFileRoute } from '@tanstack/react-router'
import { Participation } from '@/components/Participation'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/pot')({
  component: PotPage,
  head: () =>
    seo({
      title: "Le financement — L'Alternative Fabrique",
      description:
        "Comment les applications de L'Alternative Fabrique financent les projets suivants, et comment y contribuer directement.",
      path: '/pot',
    }),
})

function PotPage() {
  return (
    <div>
      {/* Header */}
      <section className="border-b-2 border-text">
        <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:py-28">
          <p className="label text-text/60">Le financement</p>
          <h1 className="display-xl mt-6">
            Financer <span className="text-accent-primary">la suite</span>
          </h1>
          <p className="chapeau mt-10 max-w-2xl">
            Utiliser une de nos applications finance les projets suivants.
            Vous pouvez aussi y contribuer directement.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#participer"
              className="label inline-flex w-fit items-center gap-3 border-2 border-text bg-text px-6 py-3 text-bg hover:bg-accent-primary"
            >
              Contribuer maintenant <span aria-hidden>↓</span>
            </a>
            <Link
              to="/projets"
              className="label inline-flex w-fit items-center gap-2 border-b-2 border-text pb-1 hover:text-accent-primary"
            >
              Voir les projets <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      <section
        id="participer"
        className="scroll-mt-6 border-b-2 border-text bg-accent-secondary text-bg"
      >
        <div className="mx-auto min-h-[calc(100svh-7rem)] w-full max-w-7xl px-6 py-16 sm:py-24">
          <p className="label opacity-70">Contribution directe</p>
          <h2 className="font-heading mt-6 text-4xl uppercase leading-tight sm:text-5xl">
            Financer la suite.
          </h2>

          <div className="mt-12">
            <Participation />
          </div>

          <div className="mt-16 flex flex-wrap gap-4 border-t-2 border-current pt-10">
            <Link
              to="/projets"
              className="label inline-flex w-fit items-center gap-3 border-2 border-current px-6 py-3 hover:bg-bg hover:text-accent-secondary"
            >
              Les projets financés <span aria-hidden>→</span>
            </Link>
            <Link
              to="/outils"
              className="label inline-flex w-fit items-center gap-2 self-center border-b-2 border-current pb-1 hover:opacity-70"
            >
              Les applications qui financent <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* The thesis — why any of this exists */}
      <section>
        <div className="mx-auto w-full max-w-3xl px-6 py-20 sm:py-28">
          <p className="label text-accent-primary">Le financement</p>
          <h2 className="font-heading mt-6 text-4xl uppercase leading-tight sm:text-5xl">
            Ce qui existe finance ce qui vient.
          </h2>
          <div className="prose-editorial mt-10 text-text/85">
            <p>
              La façon la plus simple de financer la suite est d'utiliser une
              application. Grâce à une organisation commune, un seul
              financement fait vivre toutes les applications : ce que vous
              payez pour l'une finance les autres, celles qui existent,
              celles en bêta, celles qui arrivent et celles qui restent à
              imaginer.
            </p>
            <p>
              Nous avons écarté la levée de fonds. Elle apporte de l'argent
              plus vite, mais elle suppose de céder une part et d'écrire la
              suite avec quelqu'un d'autre. Le réinvestissement est plus lent
              et ne dépend que de l'usage réel des applications.
            </p>
            <p>
              Il est aussi possible de contribuer directement, sans acheter
              une application dont on n'a pas l'usage. Ce n'est pas un don à une
              cause : c'est une contribution au développement, affectée aux
              mêmes projets, dans le même ordre.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t-2 border-text">
        <div className="mx-auto w-full max-w-3xl px-6 py-20 sm:py-28">
          <p className="label text-accent-primary">Où va l'argent</p>
          <h2 className="font-heading mt-6 text-4xl uppercase leading-tight sm:text-5xl">
            Deux projets en cours.
          </h2>
          <div className="prose-editorial mt-10 text-text/85">
            <p>
              Reczi, pour publier vidéos, articles et podcasts sans dépendre de
              YouTube ni de Substack. Et Lungor, pour encaisser sans
              intermédiaire. Leur avancement se lit sur une page à part.
            </p>
          </div>
          <Link
            to="/projets"
            className="label mt-10 inline-flex w-fit items-center gap-3 border-2 border-text px-6 py-3 hover:bg-text hover:text-bg"
          >
            Voir les projets <span aria-hidden>→</span>
          </Link>
        </div>
      </section>
    </div>
  )
}
