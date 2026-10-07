import { Link, createFileRoute } from '@tanstack/react-router'
import { applications } from '@/content/catalogue'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/projets')({
  component: ProjetsPage,
  head: () =>
    seo({
      title: "Les projets — L'Alternative Fabrique",
      description:
        "Ce que les revenus des applications construisent : Reczi, pour publier sans YouTube ni Substack, et l'encaissement sans intermédiaire. Et les idées ouvertes aux propositions.",
      path: '/projets',
    }),
})

function ProjetsPage() {
  return (
    <div>
      <section className="border-b-2 border-text">
        <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:py-28">
          <p className="label text-text/60">Ce qui se construit</p>
          <h1 className="display-xl mt-6">Les projets</h1>
          <p className="chapeau mt-8 max-w-2xl">
            Deux projets sont en cours. Aucun n'est encore utilisable : ils
            sont financés par les applications qui le sont.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#realises"
              className="label inline-flex w-fit items-center gap-2 border-b-2 border-accent-primary pb-1 text-accent-primary hover:opacity-70"
            >
              Déjà réalisés <span aria-hidden>↓</span>
            </a>
            <a
              href="#reczi"
              className="label inline-flex w-fit items-center gap-2 border-b-2 border-text pb-1 hover:text-accent-primary"
            >
              Reczi <span aria-hidden>↓</span>
            </a>
            <a
              href="#paiement"
              className="label inline-flex w-fit items-center gap-2 border-b-2 border-text pb-1 hover:text-accent-primary"
            >
              Encaisser sans intermédiaire <span aria-hidden>↓</span>
            </a>
            <a
              href="#idees"
              className="label inline-flex w-fit items-center gap-2 border-b-2 border-text pb-1 hover:text-accent-primary"
            >
              Les idées <span aria-hidden>↓</span>
            </a>
          </div>
        </div>
      </section>

      <section id="realises" className="scroll-mt-6 border-b-2 border-text">
        <div className="mx-auto w-full max-w-7xl px-6 py-12 sm:py-16">
          <div className="grid gap-8 sm:grid-cols-12">
            <div className="sm:col-span-4">
              <p className="label text-accent-primary">Déjà réalisés</p>
              <p className="font-heading mt-4 text-3xl uppercase leading-tight sm:text-4xl">
                {applications.length} applications tournent.
              </p>
              <Link
                to="/outils"
                className="label mt-6 inline-flex w-fit items-center gap-2 border-b-2 border-text pb-1 hover:text-accent-primary"
              >
                Les voir en détail <span aria-hidden>→</span>
              </Link>
            </div>
            <ul className="flex flex-wrap content-start gap-3 sm:col-span-8">
              {applications.map((application) => {
                const contenu = (
                  <>
                    <span className="font-heading text-xl uppercase leading-none">
                      {application.name}
                    </span>
                    <span className="label opacity-60">{application.statut}</span>
                  </>
                )
                const classes =
                  'flex items-baseline gap-3 border-2 border-text px-4 py-3'
                return (
                  <li key={application.name}>
                    {application.url ? (
                      <a
                        href={application.url}
                        className={`${classes} hover:bg-text hover:text-bg`}
                      >
                        {contenu}
                      </a>
                    ) : (
                      <span className={`${classes} opacity-70`}>{contenu}</span>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </section>

      <section id="reczi" className="scroll-mt-6 bg-accent-primary text-bg">
        <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:py-28">
          <div className="grid gap-10 sm:grid-cols-12">
            <div className="sm:col-span-5">
              <p className="label opacity-70">Projet — en cours</p>
              <h2 className="display-card mt-6 sm:text-8xl">Reczi</h2>
              <p className="mt-6 text-lg font-medium">
                Journalistes et créateurs indépendants
              </p>
            </div>
            <div className="flex flex-col justify-end sm:col-span-7">
              <p className="chapeau">
                Publier vidéos, articles et podcasts sur son propre journal,
                sans dépendre de YouTube ni de Substack.
              </p>
              <dl className="mt-10 space-y-6">
                <div>
                  <dt className="label opacity-60">Le problème</dt>
                  <dd className="mt-2 text-base opacity-90">
                    YouTube et Substack font très bien deux choses : héberger
                    sans frais et amener un public. La difficulté commence
                    quand on veut en vivre. La recommandation, la part
                    prélevée et les conditions de publication se décident
                    sans vous, et peuvent changer du jour au lendemain.
                  </dd>
                </div>
                <div>
                  <dt className="label opacity-60">Ce que fera Reczi</dt>
                  <dd className="mt-2 text-base opacity-90">
                    Vous déposez vos rushs, vos audios, vos scripts et vos
                    notes. Tout est transcrit, indexé, et chaque passage se
                    retrouve à la seconde près. Vous publiez ensuite sur un
                    journal qui est le vôtre.
                  </dd>
                </div>
                <div>
                  <dt className="label opacity-60">Ce qu'il ne fera pas</dt>
                  <dd className="mt-2 text-base opacity-90">
                    Vous apporter un public tout fait. Reczi remplace l'outil
                    et l'hébergement, pas l'algorithme de recommandation. Si
                    la découverte par la plateforme est votre premier besoin,
                    YouTube reste le bon choix.
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      <section
        id="paiement"
        className="scroll-mt-6 bg-accent-secondary text-bg"
      >
        <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:py-28">
          <div className="grid gap-10 sm:grid-cols-12">
            <div className="sm:col-span-5">
              <p className="label opacity-70">Projet — en cours</p>
              <h2 className="display-card mt-6 sm:text-6xl">
                Encaisser sans intermédiaire
              </h2>
              <p className="mt-6 text-lg font-medium">
                Tous ceux qui vendent en ligne
              </p>
            </div>
            <div className="flex flex-col justify-end sm:col-span-7">
              <p className="chapeau">
                Faire de Lungor un établissement de paiement autorisé,
                au lieu de dépendre de la licence d'un autre.
              </p>
              <dl className="mt-10 space-y-6">
                <div>
                  <dt className="label opacity-60">Le problème</dt>
                  <dd className="mt-2 text-base opacity-90">
                    Encaisser est un métier réglementé. Tout le monde passe
                    donc par un prestataire agréé, qui prélève sa part et fixe
                    ses conditions. La dépendance est réglementaire, pas
                    technique.
                  </dd>
                </div>
                <div>
                  <dt className="label opacity-60">Où nous en sommes</dt>
                  <dd className="mt-2 text-base opacity-90">
                    Lungor encaisse aujourd'hui sous la licence d'un
                    prestataire agréé. Le projet est d'en faire ce
                    prestataire, ou à défaut la seule façade devant lui.
                    Quatre marches réglementaires y mènent ; nous sommes sur
                    la première.
                  </dd>
                </div>
              </dl>
              <Link
                to="/paiement"
                className="label mt-10 inline-flex w-fit items-center gap-3 border-2 border-current px-6 py-3 hover:bg-bg hover:text-accent-secondary"
              >
                Les quatre marches, en détail <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="idees" className="scroll-mt-6 border-b-2 border-text bg-warm">
        <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:py-28">
          <div className="grid gap-10 sm:grid-cols-12">
            <div className="sm:col-span-5">
              <p className="label text-text/60">Ouvert aux propositions</p>
              <h2 className="display-card mt-6 sm:text-7xl">Les idées</h2>
            </div>
            <div className="flex flex-col justify-end sm:col-span-7">
              <p className="chapeau">
                La suite n'est pas écrite, et nous préférons le dire.
              </p>
              <p className="mt-6 text-base text-text/85">
                Un service dont vous dépendez et qui vous coûte trop cher, un
                outil qui manque aux indépendants, un moyen que personne ne
                propose hors des grandes plateformes : décrivez-le. Nous
                lisons tout, nous répondons, et une idée retenue est publiée
                ici avec son auteur s'il le souhaite.
              </p>
              <Link
                to="/contact"
                className="label mt-10 inline-flex w-fit items-center gap-3 border-2 border-text bg-text px-6 py-3 text-bg hover:bg-accent-primary"
              >
                Proposer une idée <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto w-full max-w-3xl px-6 py-20 sm:py-28">
          <p className="label text-accent-primary">Qui paie</p>
          <h2 className="font-heading mt-6 text-4xl uppercase leading-tight sm:text-5xl">
            Les applications financent les projets.
          </h2>
          <div className="prose-editorial mt-10 text-text/85">
            <p>
              Grâce à une organisation commune, un seul financement fait
              vivre toutes les applications, y compris celles qui arrivent.
              Utiliser une application est la façon la plus directe de faire
              avancer ces projets.
            </p>
          </div>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/outils"
              className="label inline-flex w-fit items-center gap-3 border-2 border-text px-6 py-3 hover:bg-text hover:text-bg"
            >
              Voir les applications <span aria-hidden>→</span>
            </Link>
            <Link
              to="/pot"
              className="label inline-flex w-fit items-center gap-2 self-center border-b-2 border-text pb-1 hover:opacity-70"
            >
              Le financement <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
