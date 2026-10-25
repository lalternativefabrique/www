import { Link } from '@tanstack/react-router'
import type { Locale } from '@/lib/i18n'

const textes: Record<
  Locale,
  {
    repere: string
    titre: string
    role: string
    bio: ReadonlyArray<string>
    suivant: string
    suivantTitre: string
    suivantTexte: string
    suivantAction: string
    contact: string
  }
> = {
  fr: {
    repere: 'Les participants',
    titre: 'Ceux qui font la Fabrique.',
    role: "À l'origine du projet",
    bio: [
      "Je m'appelle Sylvain Lapart. J'ai initié L'Alternative Fabrique et j'en construis aujourd'hui une partie. Cette initiative reprend, une à une, les capacités numériques que nous avons abandonnées.",
      'Le projet crée des applications indépendantes pour chercher, publier, communiquer, héberger et financer autrement. Chaque application répond à un besoin concret, et ses revenus contribuent à construire la suivante.',
      "J'ai posé les premières bases, mais L'Alternative Fabrique n'a pas vocation à reposer sur une seule personne. Pour aller loin et durer, elle doit rassembler des compétences, des expériences et des volontés différentes.",
      "Mon rôle n'est pas de tout porter. Il est d'initier, de construire et de permettre à d'autres de prendre leur place dans le projet.",
    ],
    suivant: 'Participant suivant',
    suivantTitre: 'Rejoignez-nous.',
    suivantTexte:
      'Développement, design, écriture, juridique, commerce : cette case vous attend. Dites-nous ce que vous voulez apporter.',
    suivantAction: 'Prendre sa place',
    contact: '/contact',
  },
  en: {
    repere: 'The participants',
    titre: 'The people making the Fabrique.',
    role: 'Where the project began',
    bio: [
      "My name is Sylvain Lapart. I started L'Alternative Fabrique and today I build part of it. This initiative takes back, one by one, the digital capabilities we gave up.",
      'The project builds independent applications to search, publish, communicate, host and fund differently. Each one answers a concrete need, and its revenue helps build the next.',
      "I laid the first foundations, but L'Alternative Fabrique is not meant to rest on a single person. To go far and last, it has to bring together different skills, experiences and wills.",
      'My role is not to carry everything. It is to start, to build, and to make room for others to take their place in the project.',
    ],
    suivant: 'Next participant',
    suivantTitre: 'Join us.',
    suivantTexte:
      'Development, design, writing, legal, sales: this seat is waiting for you. Tell us what you want to bring.',
    suivantAction: 'Take your seat',
    contact: '/en/contact',
  },
}

export function Participants({ locale }: { locale: Locale }) {
  const t = textes[locale]
  return (
    <section id="participants" className="scroll-mt-6 border-t-2 border-text">
      <div className="mx-auto w-full max-w-7xl px-6 py-16 sm:py-24">
        <p className="label text-text/60">{t.repere}</p>
        <h2 className="font-heading mt-6 max-w-3xl text-4xl leading-tight sm:text-5xl">
          {t.titre}
        </h2>
        <div className="mt-14 grid gap-6 lg:grid-cols-12">
          <article className="border-2 border-text p-8 sm:p-10 lg:col-span-8">
            <p className="label text-accent-primary">{t.role}</p>
            <div className="mt-6 flex items-center gap-5">
              <span
                aria-hidden
                className="font-heading grid size-16 shrink-0 place-items-center bg-text text-2xl text-bg"
              >
                SL
              </span>
              <p className="font-heading text-3xl leading-tight sm:text-4xl">Sylvain Lapart</p>
            </div>
            <div className="prose-editorial mt-8 space-y-4 text-text/85">
              {t.bio.map((paragraphe) => (
                <p key={paragraphe}>{paragraphe}</p>
              ))}
            </div>
          </article>
          <Link
            to={t.contact}
            className="group flex flex-col justify-between border-2 border-dashed border-text/50 p-8 transition-colors hover:border-solid hover:border-accent-primary hover:bg-accent-primary hover:text-bg sm:p-10 lg:col-span-4"
          >
            <div>
              <p className="label text-text/60 group-hover:text-bg">{t.suivant}</p>
              <span
                aria-hidden
                className="font-heading mt-6 grid size-16 place-items-center border-2 border-dashed border-current text-3xl"
              >
                ?
              </span>
              <p className="font-heading mt-8 text-4xl leading-tight sm:text-5xl">{t.suivantTitre}</p>
              <p className="mt-6 text-base opacity-80">{t.suivantTexte}</p>
            </div>
            <span className="label mt-10 inline-flex items-center gap-2">
              {t.suivantAction} <span aria-hidden>→</span>
            </span>
          </Link>
        </div>
      </div>
    </section>
  )
}
