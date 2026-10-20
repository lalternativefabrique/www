import { Link, createFileRoute } from '@tanstack/react-router'
import { applications, projetsEnCours } from '@/content/catalogue'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/a-propos')({
  component: AProposPage,
  head: () =>
    seo({
      title: "À propos — L'Alternative Fabrique",
      description:
        "Pourquoi L'Alternative Fabrique existe, ce qu'elle a déjà construit, pourquoi ses applications allègent les tâches numériques au lieu de retenir l'attention, et comment l'aider.",
      path: '/a-propos',
    }),
})

const aides = [
  {
    titre: 'Utiliser',
    detail:
      "Essayez une application. Si elle vous sert, votre abonnement finance toutes les autres.",
  },
  {
    titre: 'Partager',
    detail:
      "Parlez-en autour de vous. Aujourd'hui, c'est ce qui nous manque le plus : être connus.",
  },
  {
    titre: 'Soutenir',
    detail:
      "Une contribution financière, même modeste, nous donne la visibilité qui nous manque pour avancer.",
  },
  {
    titre: 'Proposer',
    detail:
      "Une idée de projet, un besoin que personne ne couvre : la suite s'écrit avec vous.",
  },
  {
    titre: 'Participer',
    detail:
      "Marketing, communication, administratif, juridique, comptabilité, développement : vos compétences font avancer plus vite que tout le reste.",
  },
  {
    titre: 'Encourager',
    detail:
      "Un message, un retour, un mot de soutien. Cela compte plus qu'on ne le croit.",
  },
]

function AProposPage() {
  const ouvertes = applications.filter(
    (application) => application.statut !== 'Bientôt',
  ).length

  return (
    <div>
      <section className="border-b-2 border-text">
        <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:py-28">
          <p className="label text-text/60">La démarche</p>
          <h1 className="display-xl mt-6">À propos</h1>
          <p className="chapeau mt-10 max-w-2xl">
            Une organisation encore petite, qui prouve qu'on peut reprendre
            ses moyens de produire en ligne, et qui ne demande qu'à être
            aidée.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto w-full max-w-3xl px-6 py-20 sm:py-28">
          <p className="label text-accent-primary">La vision</p>
          <h2 className="font-heading mt-6 text-4xl leading-tight sm:text-5xl">
            Reprendre la maîtrise de nos outils.
          </h2>
          <div className="prose-editorial mt-10 text-text/85">
            <p>
              Nous communiquons, travaillons, apprenons et créons à travers des
              outils numériques devenus indispensables à notre quotidien.
            </p>
            <p>
              Ces outils ne sont pas de simples services. Ils constituent une
              partie des infrastructures sur lesquelles reposent nos activités,
              nos entreprises et nos échanges.
            </p>
            <p>
              Pourtant, nous participons peu à leur conception et aux
              décisions qui déterminent leur évolution.
            </p>
            <p>
              L'enjeu n'est pas de tout reconstruire, ni de se passer de ce qui
              existe. Il est de retrouver la capacité de concevoir, de produire
              et de faire évoluer nos propres solutions.
            </p>
            <p>
              <strong>
                Reconstruire une industrie numérique, c'est se donner les
                moyens d'aller plus loin.
              </strong>{' '}
              Créer une base technique et industrielle sur laquelle pourront
              naître de nouveaux projets, de nouveaux usages et de nouvelles
              idées.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t-2 border-text">
        <div className="mx-auto w-full max-w-3xl px-6 py-20 sm:py-28">
          <p className="label text-accent-primary">Ce que nous faisons</p>
          <h2 className="font-heading mt-6 text-4xl leading-tight sm:text-5xl">
            Reprendre ces moyens, un par un.
          </h2>
          <div className="prose-editorial mt-10 text-text/85">
            <p>
              Nous construisons les applications qui remplacent ces
              services. {ouvertes} sont utilisables aujourd'hui, en accès
              libre ou en bêta, et {projetsEnCours.length} projets sont en cours.
            </p>
            <p>
              Grâce à une organisation commune, un seul financement fait
              vivre toutes les applications. Le revenu de l'une finance les
              autres : celles qui existent, les bêtas, celles qui sont
              prévues et celles qui restent à imaginer.
            </p>
            <p>
              Nous ne vous demandons pas d'adhérer à une promesse. Essayez
              une application : si elle vous sert, vous financez la suite.
            </p>
          </div>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/outils"
              className="label inline-flex w-fit items-center gap-3 border-2 border-text bg-text px-6 py-3 text-bg hover:bg-accent-primary"
            >
              Voir les applications <span aria-hidden>→</span>
            </Link>
            <Link
              to="/projets"
              className="label inline-flex w-fit items-center gap-2 self-center border-b-2 border-text pb-1 hover:opacity-70"
            >
              Voir les projets <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t-2 border-text">
        <div className="mx-auto w-full max-w-3xl px-6 py-20 sm:py-28">
          <p className="label text-accent-primary">Notre ambition</p>
          <h2 className="font-heading mt-6 text-4xl leading-tight sm:text-5xl">
            Vous alléger les tâches numériques du quotidien.
          </h2>
          <div className="prose-editorial mt-10 text-text/85">
            <p>
              Beaucoup d'applications sont conçues pour qu'on y reste : un fil
              sans fin, des notifications, des compteurs. Nous faisons
              l'inverse.
            </p>
            <p>
              Nos applications sont faites pour accomplir une tâche, personnelle
              ou professionnelle, puis vous laisser partir. Publier un post,
              lire son courrier, retrouver une source, encaisser un paiement :
              vite fait, et vous passez à autre chose.
            </p>
            <p>
              Ce que nous voulons vous rendre, c'est du temps. Pour votre
              travail, et pour les gens autour de vous.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t-2 border-text bg-warm">
        <div className="mx-auto w-full max-w-7xl px-6 py-16 sm:py-24">
          <p className="label text-text/60">Comment nous aider</p>
          <h2 className="font-heading mt-6 max-w-3xl text-4xl leading-tight sm:text-5xl">
            Imaginez avec votre aide.
          </h2>
          <p className="chapeau mt-8 max-w-2xl">
            Nous sommes peu nombreux, et nous prouvons qu'on peut déjà faire
            beaucoup. Notre seule fragilité est le manque de visibilité
            financière : nous venons de poser la base. Aidez-nous à la
            dépasser.
          </p>
          <div className="mt-14 grid grid-cols-1 gap-px bg-text sm:grid-cols-2 lg:grid-cols-3">
            {aides.map((aide) => (
              <div key={aide.titre} className="bg-bg p-8 sm:p-10">
                <p className="font-heading text-2xl leading-tight">
                  {aide.titre}
                </p>
                <p className="mt-4 text-base text-text/80">{aide.detail}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 flex flex-wrap gap-4">
            <Link
              to="/contact"
              className="label inline-flex w-fit items-center gap-3 border-2 border-text bg-text px-6 py-3 text-bg hover:bg-accent-primary"
            >
              Proposer votre aide <span aria-hidden>→</span>
            </Link>
            <Link
              to="/pot"
              hash="participer"
              className="label inline-flex w-fit items-center gap-2 self-center border-b-2 border-text pb-1 hover:opacity-70"
            >
              Contribuer financièrement <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-text text-bg">
        <div className="mx-auto w-full max-w-7xl px-6 py-24 sm:py-32">
          <div className="grid gap-10 sm:grid-cols-12">
            <div className="sm:col-span-5">
              <p className="label opacity-70">Contact</p>
              <p className="font-heading mt-6 text-5xl leading-none sm:text-7xl">
                Écrivez-nous.
              </p>
            </div>
            <div className="flex flex-col justify-end sm:col-span-7">
              <p className="chapeau opacity-90">
                Une question, une idée, une compétence à apporter : nous
                lisons tout et nous répondons.
              </p>
              <Link
                to="/contact"
                className="label mt-8 inline-flex w-fit items-center gap-3 border-2 border-bg px-6 py-3 hover:bg-bg hover:text-text"
              >
                Écrire <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
