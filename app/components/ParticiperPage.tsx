import { Link } from '@tanstack/react-router'
import type { Besoin } from '@/lib/couts'
import { LienSection } from '@/components/LienSection'

const textes = {
  fr: {
    surtitre: 'Participer',
    titre1: 'Ce qui manque,',
    titre2: 'construisons-le ensemble.',
    intro: [
      'Plusieurs applications fonctionnent déjà. Elles reposent sur une base technique commune qui nous permet de recueillir les retours, de corriger les problèmes et de publier rapidement les améliorations.',
      "Mais une entreprise ne se construit pas seulement avec du code. Comptabilité, droit, sécurité, communication : ce sont des métiers que nous ne voulons pas improviser. Nous avons besoin de celles et ceux qui les connaissent.",
      "Nous avons choisi de ne pas lever de fonds. Nous avançons autrement : grâce aux revenus des applications, aux contributions financières et aux compétences que chacun peut ponctuellement apporter.",
    ],
    argent: {
      ancre: 'financer',
      label: 'Contribuer financièrement',
      titre: 'Nos besoins financiers',
      texte:
        "Les dépenses liées aux applications sont publiées chaque mois, chiffre par chiffre, dans Lungor. Les contributions servent d'abord à couvrir ces coûts. Au-delà, elles nous permettent de faire appel aux compétences dont le projet a besoin. Leur utilisation reste visible.",
      couts: { to: '/couts', label: 'Ce que coûtent nos applications' },
      action: { to: '/pot', hash: 'participer', label: 'Contribuer' },
    },
    savoir: {
      ancre: 'competences',
      label: 'Donner ce que vous savez',
      titre: 'Nos besoins en compétences',
      texte:
        "Vous savez tenir une comptabilité, lire un contrat, appliquer le RGPD, documenter une démarche de sécurité, écrire ou expliquer. Une heure d'expertise peut nous éviter des semaines d'erreurs. Nous cherchons des personnes capables d'éclairer un domaine et d'en prendre progressivement la responsabilité — pas simplement des mains supplémentaires pour écrire du code.",
      colonnes: ['Fonction', "Ce qu'elle couvre", 'Ce que nous attendons'],
      action: { to: '/contact', label: 'Proposer ma contribution' },
    },
    limites: {
      ancre: 'ou-nous-allons',
      titre: 'Où nous allons',
      texte: [
        'Nous ne pouvons pas encore créer ces postes. Pour le moment, nous recherchons des conseils, des regards extérieurs et des contributions ponctuelles, librement choisies.',
        'Notre objectif est que les revenus des applications nous permettent progressivement de transformer ces besoins en emplois rémunérés. Une entreprise durable doit pouvoir payer celles et ceux qui la font vivre.',
      ],
    },
  },
  en: {
    surtitre: 'Take part',
    titre1: "What's missing,",
    titre2: "let's build it together.",
    intro: [
      'Several applications already run. They rest on a shared technical base that lets us collect feedback, fix problems and ship improvements quickly.',
      'But a company is not built with code alone. Accounting, law, security, communication: these are trades we do not want to improvise. We need the people who know them.',
      'We chose not to raise funds. We move forward another way: through the revenue of the applications, financial contributions and the skills anyone can bring from time to time.',
    ],
    argent: {
      ancre: 'money',
      label: 'Contribute financially',
      titre: 'Our financial needs',
      texte:
        'The costs of the applications are published every month, figure by figure, in Lungor. Contributions first cover those costs. Beyond that, they let us call on the skills the project needs. How they are used stays visible.',
      couts: { to: '/en/costs', label: 'What our apps cost' },
      action: { to: '/en/pot', hash: 'chip-in', label: 'Contribute' },
    },
    savoir: {
      ancre: 'skills',
      label: 'Give what you know',
      titre: 'Our need for skills',
      texte:
        'You can keep books, read a contract, apply the GDPR, document a security approach, write or explain. An hour of expertise can save us weeks of mistakes. We are looking for people able to shed light on a field and gradually take responsibility for it — not just extra hands to write code.',
      colonnes: ['Function', 'What it covers', 'What we expect'],
      action: { to: '/en/contact', label: 'Offer my contribution' },
    },
    limites: {
      ancre: 'where-we-are-going',
      titre: 'Where we are going',
      texte: [
        'We cannot create these positions yet. For now, we are looking for advice, outside perspectives and occasional contributions, freely chosen.',
        'Our goal is for the revenue of the applications to gradually let us turn these needs into paid jobs. A lasting company must be able to pay the people who keep it alive.',
      ],
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

      <section id={t.argent.ancre} className="scroll-mt-6 border-y-2 border-text bg-accent-secondary text-bg">
        <div className="mx-auto w-full max-w-7xl px-6 py-16 sm:py-24">
          <p className="label opacity-70">{t.argent.label}</p>
          <h2 className="font-heading mt-6 text-4xl leading-tight sm:text-5xl">{t.argent.titre}<LienSection ancre={t.argent.ancre} /></h2>
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

      <section id={t.savoir.ancre} className="scroll-mt-6">
        <div className="mx-auto w-full max-w-7xl px-6 py-16 sm:py-24">
          <p className="label text-text/60">{t.savoir.label}</p>
          <h2 className="font-heading mt-6 text-4xl leading-tight sm:text-5xl">{t.savoir.titre}<LienSection ancre={t.savoir.ancre} /></h2>
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

      <section id={t.limites.ancre} className="scroll-mt-6 border-t-2 border-text">
        <div className="mx-auto w-full max-w-3xl px-6 py-20 sm:py-28">
          <h2 className="font-heading text-3xl leading-tight">{t.limites.titre}<LienSection ancre={t.limites.ancre} /></h2>
          {t.limites.texte.map((p) => (
            <p key={p} className="chapeau mt-6 text-text/80">
              {p}
            </p>
          ))}
        </div>
      </section>
    </div>
  )
}
