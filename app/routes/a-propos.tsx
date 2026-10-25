import { Link, createFileRoute } from '@tanstack/react-router'
import { Aider } from '@/components/Aider'
import { Participants } from '@/components/Participants'
import { applications, projetsEnCours } from '@/content/catalogue'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/a-propos')({
  component: AProposPage,
  head: () =>
    seo({
      title: "À propos — L'Alternative Fabrique",
      description:
        "Pourquoi L'Alternative Fabrique existe, ce qu'elle a déjà construit, pourquoi ses produits sont payants et sans investisseurs, et comment l'aider.",
      path: '/a-propos',
    }),
})


function AProposPage() {
  const disponibles = applications.filter((a) => a.statut === 'Disponible').length
  const betas = applications.filter((a) => a.statut === 'Bêta').length

  return (
    <div>
      <section className="border-b-2 border-text">
        <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:py-28">
          <p className="label text-text/60">La démarche</p>
          <h1 className="display-xl mt-6">À propos</h1>
          <p className="chapeau mt-10 max-w-2xl">
            Une organisation encore petite, qui pose les premières bases
            d'une indépendance numérique et cherche celles et ceux qui
            construiront la suite.
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
            Brique par brique.
          </h2>
          <div className="prose-editorial mt-10 text-text/85">
            <p>
              Nous construisons des applications qui remplacent ces
              services. {disponibles + betas} sont utilisables aujourd'hui —{' '}
              {disponibles} disponibles et {betas} en bêta — et{' '}
              {projetsEnCours.length} projets sont en cours.
            </p>
            <p>
              Une organisation commune relie toutes les applications. Les
              revenus de celles qui existent contribuent à financer celles en
              bêta, celles à venir et celles qui restent à imaginer.
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
            Alléger votre quotidien numérique.
          </h2>
          <div className="prose-editorial mt-10 text-text/85">
            <p>
              Beaucoup d'applications sont conçues pour qu'on y reste : un fil
              sans fin, des notifications, des compteurs. Nous faisons
              l'inverse.
            </p>
            <p>
              Nos applications sont conçues pour accomplir une tâche,
              personnelle ou professionnelle, puis vous laisser partir.
              Publier un texte, lire son courrier, retrouver une source ou
              encaisser un paiement : vous faites ce que vous avez à faire,
              puis vous passez à autre chose.
            </p>
            <p>
              Ce que nous voulons vous rendre, c'est du temps. Pour votre
              travail, et pour les gens autour de vous.
            </p>
          </div>
        </div>
      </section>

      <section id="culture" className="scroll-mt-6 border-t-2 border-text">
        <div className="mx-auto w-full max-w-3xl px-6 py-20 sm:py-28">
          <p className="label text-accent-primary">Ce que nous croyons</p>
          <h2 className="font-heading mt-6 text-4xl leading-tight sm:text-5xl">
            Indépendants, et payants pour le rester.
          </h2>
          <div className="prose-editorial mt-10 text-text/85">
            <h3 className="font-heading mt-12 text-2xl">Pourquoi nous faisons ça</h3>
            <p>
              Nous construisons des outils numériques utiles, vendus à un prix
              juste, qui respectent les données et l'indépendance de ceux qui
              les utilisent.
            </p>
            <p>
              Nous les hébergeons sur des infrastructures que nous contrôlons,
              dans des lieux que nous choisissons, avec des technologies dont
              nous garantissons le fonctionnement dans la durée.
            </p>
            <p>
              Concevoir nos logiciels et nos infrastructures, développer nos
              compétences, maîtriser nos technologies : cela crée de l'activité
              en France et en Europe, garde des savoir-faire ici et réduit nos
              dépendances.
            </p>

            <h3 className="font-heading mt-12 text-2xl">Pourquoi c'est payant</h3>
            <p>
              Nos produits sont payants parce que nous voulons financer notre
              activité par les services que nous vendons, pas par l'entrée
              d'investisseurs au capital.
            </p>
            <p>
              Faire entrer des investisseurs peut imposer un rythme et des
              objectifs éloignés de l'utilité du produit. Nous faisons un autre
              choix : grandir au rythme de nos revenus et décider en fonction
              du temps long.
            </p>
            <p>
              Les abonnements, l'usage de nos API, les contributions et le
              financement participatif soutiennent directement cette démarche.
            </p>
            <p>
              Un service numérique coûte : infrastructures, calcul, stockage,
              maintenance, développement, travail humain. Nous couvrons ces
              coûts sans vendre de données personnelles ni exploiter
              l'attention. Le prix tient compte du coût réel, de l'usage et des
              moyens de chacun.
            </p>

            <h3 className="font-heading mt-12 text-2xl">Pourquoi la rentabilité</h3>
            <p>
              Les bénéfices servent à rémunérer le travail, renforcer
              l'entreprise et financer de nouvelles applications. Ils nous
              donnent les moyens de construire dans la durée sans devoir céder
              nos produits pour grandir.
            </p>

            <h3 className="font-heading mt-12 text-2xl">Nos engagements</h3>
            <p>
              Une entreprise durable, capable de financer son développement et
              de maîtriser ses technologies, qui participe au renforcement des
              capacités numériques et industrielles en France et en Europe.
            </p>
            <p>
              Notre réussite économique doit nous permettre de continuer à
              créer, à investir et à améliorer nos outils, en contribuant au
              bien commun.
            </p>
            <p>
              <strong>
                Notre priorité est le temps long et la maîtrise de nos moyens
                de production, pour que les outils que nous construisons
                restent au service de ceux qui les utilisent.
              </strong>
            </p>
          </div>
        </div>
      </section>

      <Participants locale="fr" />

      <Aider locale="fr" />

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
