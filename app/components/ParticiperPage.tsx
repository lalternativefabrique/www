import { Link } from '@tanstack/react-router'
import type { Besoin } from '@/lib/couts'

const textes = {
  fr: {
    surtitre: 'Participer',
    titre1: 'Ce qui manque,',
    titre2: 'construisons-le ensemble.',
    intro: [
      "Cinq applications tournent aujourd'hui : Synthiz, Partage, Spore, Messag et Lungor. Leur suivi est outillé. Nakoda recueille vos retours et mesure l'usage de toute la suite. Skalpai transforme chaque bug en ticket, teste, publie et déploie. Un retour envoyé depuis n'importe quelle application arrive au bon endroit, et un correctif atteint la production sans étape manuelle.",
      "Ce système fonctionne pour le code. Il ne fonctionne pour rien d'autre. Tenir les comptes, suivre le droit du paiement et de la consommation, prouver que les données sont protégées comme elles le sont, faire connaître les applications sans publicité : aucune de ces fonctions ne s'automatise. Chacune est un métier, et nous ne les avons pas tous.",
      "Nous avons écarté la levée de fonds. Reste une voie plus lente et plus solide : une organisation partagée, où l'on entre par ce que l'on peut donner.",
    ],
    argent: {
      label: "Donner de l'argent",
      titre: 'Nos besoins financiers',
      texte:
        "Ce que coûtent les applications est publié chaque mois, chiffre par chiffre, depuis Lungor. Une contribution couvre d'abord ces dépenses ; au-delà, elle finance les fonctions ci-dessous, dans l'ordre où elles sont nécessaires. Vous saurez à quoi elle a servi.",
      couts: { to: '/couts', label: 'Ce que coûtent nos applications' },
      action: { to: '/pot', hash: 'participer', label: 'Contribuer' },
    },
    savoir: {
      label: 'Donner ce que vous savez',
      titre: 'Nos besoins en compétences',
      texte:
        "Vous tenez une comptabilité, vous lisez des contrats, vous connaissez le RGPD ou les référentiels de sécurité, vous savez écrire ou expliquer. Une heure de votre métier vaut parfois plus qu'une semaine du nôtre. Nous cherchons des gens qui prennent une fonction, pas des mains de plus sur le code.",
      colonnes: ['Fonction', "Ce qu'elle couvre", 'Ce que nous attendons'],
      action: { to: '/contact', label: 'Rejoindre' },
    },
    limites: {
      titre: 'Ce que nous ne promettons pas',
      texte:
        "Pas de salaire de marché aujourd'hui, pas de levée demain. Ce que nous proposons : un travail utile, des comptes ouverts, et une place dans les décisions pour ceux qui tiennent une fonction. Quand une fonction est couverte, nous l'écrivons ici.",
    },
  },
  en: {
    surtitre: 'Take part',
    titre1: "What's missing,",
    titre2: "let's build it together.",
    intro: [
      'Five applications run today: Synthiz, Partage, Spore, Messag and Lungor. Their upkeep is tooled. Nakoda collects your feedback and measures usage across the suite. Skalpai turns every bug into a ticket, tests, publishes and deploys. A report sent from any application lands in the right place, and a fix reaches production without a manual step.',
      'That system works for code. It works for nothing else. Keeping the books, following payment and consumer law, proving the data is protected the way it is, making the applications known without advertising: none of these functions can be automated. Each is a trade, and we do not have them all.',
      'We ruled out raising funds. What remains is a slower, sturdier path: a shared organisation, which you enter by what you can give.',
    ],
    argent: {
      label: 'Give money',
      titre: 'Our financial needs',
      texte:
        'What the applications cost is published every month, figure by figure, straight from Lungor. A contribution covers those expenses first; beyond that, it funds the functions below, in the order they are needed. You will know what it was used for.',
      couts: { to: '/en/costs', label: 'What our apps cost' },
      action: { to: '/en/pot', hash: 'chip-in', label: 'Contribute' },
    },
    savoir: {
      label: 'Give what you know',
      titre: 'Our need for skills',
      texte:
        'You keep books, you read contracts, you know the GDPR or security frameworks, you can write or explain. An hour of your trade is sometimes worth a week of ours. We are looking for people who take on a function, not more hands on the code.',
      colonnes: ['Function', 'What it covers', 'What we expect'],
      action: { to: '/en/contact', label: 'Join' },
    },
    limites: {
      titre: 'What we do not promise',
      texte:
        'No market salary today, no fundraising tomorrow. What we offer: useful work, open books, and a seat in decisions for those who hold a function. When a function is covered, we write it here.',
    },
  },
} as const

export function ParticiperPage({ besoins, lang }: { besoins: Besoin[] | null; lang: 'fr' | 'en' }) {
  const t = textes[lang]

  return (
    <div>
      <section className="border-b-2 border-text">
        <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:py-28">
          <p className="label text-text/60">{t.surtitre}</p>
          <h1 className="display-xl mt-6">
            {t.titre1}
            <br />
            <span className="text-accent-primary">{t.titre2}</span>
          </h1>
        </div>
      </section>

      <section>
        <div className="mx-auto w-full max-w-3xl px-6 py-20 sm:py-28">
          <div className="prose-editorial text-text/85">
            {t.intro.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y-2 border-text bg-accent-secondary text-bg">
        <div className="mx-auto w-full max-w-7xl px-6 py-16 sm:py-24">
          <p className="label opacity-70">{t.argent.label}</p>
          <h2 className="font-heading mt-6 text-4xl leading-tight sm:text-5xl">{t.argent.titre}</h2>
          <p className="chapeau mt-10 max-w-2xl">{t.argent.texte}</p>
          <div className="mt-12 flex flex-wrap gap-4">
            <Link
              to={t.argent.action.to}
              hash={t.argent.action.hash}
              className="label inline-flex w-fit items-center gap-3 border-2 border-current px-6 py-3 hover:bg-bg hover:text-accent-secondary"
            >
              {t.argent.action.label} <span aria-hidden>→</span>
            </Link>
            <Link
              to={t.argent.couts.to}
              className="label inline-flex w-fit items-center gap-2 self-center border-b-2 border-current pb-1 hover:opacity-70"
            >
              {t.argent.couts.label} <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto w-full max-w-7xl px-6 py-16 sm:py-24">
          <p className="label text-text/60">{t.savoir.label}</p>
          <h2 className="font-heading mt-6 text-4xl leading-tight sm:text-5xl">{t.savoir.titre}</h2>
          <p className="chapeau mt-10 max-w-2xl">{t.savoir.texte}</p>

          {besoins?.length ? (
          <div className="mt-14 overflow-x-auto">
            <table className="w-full border-t-[3px] border-text text-left">
              <thead>
                <tr className="border-b border-text">
                  {t.savoir.colonnes.map((c) => (
                    <th key={c} className="label p-4 first:pl-0 last:pr-0">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {besoins.map((b) => (
                  <tr key={b.function} className="border-t border-text/20 align-top">
                    <td className="p-4 pl-0 font-medium">{b.function}</td>
                    <td className="p-4 text-text/80">{b.covers}</td>
                    <td className="p-4 pr-0 text-text/80">{b.expects}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          ) : null}

          <Link
            to={t.savoir.action.to}
            className="label mt-12 inline-flex w-fit items-center gap-3 border-2 border-text px-6 py-3 hover:bg-text hover:text-bg"
          >
            {t.savoir.action.label} <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      <section className="border-t-2 border-text">
        <div className="mx-auto w-full max-w-3xl px-6 py-20 sm:py-28">
          <h2 className="font-heading text-3xl leading-tight">{t.limites.titre}</h2>
          <p className="chapeau mt-6 text-text/80">{t.limites.texte}</p>
        </div>
      </section>
    </div>
  )
}
