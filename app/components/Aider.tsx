import { Link } from '@tanstack/react-router'
import type { Locale } from '@/lib/i18n'
import { LienSection } from '@/components/LienSection'

const textes = {
  fr: {
    repere: 'Comment nous aider',
    titre: 'Imaginez ce que nous pouvons construire ensemble.',
    chapeau:
      "Nous sommes peu nombreux, et nous prouvons qu'on peut déjà faire beaucoup. Nous avons posé les premières bases. Pour aller plus loin, il nous faut davantage de forces, de compétences et de visibilité financière.",
    aides: [
      { titre: 'Utiliser', detail: 'Essayez une application. Si elle vous sert, votre abonnement finance toutes les autres.' },
      { titre: 'Partager', detail: "Parlez-en autour de vous. Aujourd'hui, c'est ce qui nous manque le plus : être connus." },
      { titre: 'Soutenir', detail: 'Une contribution financière, même modeste, nous donne la visibilité qui nous manque pour avancer.' },
      { titre: 'Proposer', detail: "Une idée de projet, un besoin que personne ne couvre : la suite s'écrit avec vous." },
      { titre: 'Participer', detail: 'Marketing, communication, administratif, juridique, comptabilité, développement : vos compétences font avancer plus vite que tout le reste.' },
      { titre: 'Encourager', detail: "Un message, un retour, un mot de soutien. Cela compte plus qu'on ne le croit." },
    ],
    aide: { to: '/contact', label: 'Proposer votre aide' },
    argent: { to: '/pot', hash: 'participer', label: 'Contribuer financièrement' },
  },
  en: {
    repere: 'How to help us',
    titre: 'Imagine what we can build together.',
    chapeau:
      'We are few, and we are proving that a lot can already be done. We have laid the first foundations. To go further, we need more hands, more skills and more financial visibility.',
    aides: [
      { titre: 'Use', detail: 'Try an application. If it serves you, your subscription funds all the others.' },
      { titre: 'Share', detail: 'Tell people around you. Today, that is what we lack most: being known.' },
      { titre: 'Support', detail: 'A financial contribution, even a modest one, gives us the visibility we lack to move forward.' },
      { titre: 'Propose', detail: 'An idea for a project, a need nobody covers: what comes next is written with you.' },
      { titre: 'Take part', detail: 'Marketing, communication, administration, legal, accounting, development: your skills move things faster than anything else.' },
      { titre: 'Encourage', detail: 'A message, some feedback, a word of support. It counts more than one would think.' },
    ],
    aide: { to: '/en/contact', label: 'Offer your help' },
    argent: { to: '/en/pot', hash: 'chip-in', label: 'Contribute financially' },
  },
} as const

export function Aider({
  locale,
  repere,
  titre,
  pleineLargeur = false,
}: {
  locale: Locale
  repere?: string
  titre?: string
  pleineLargeur?: boolean
}) {
  const t = textes[locale]
  return (
    <section
      id={locale === 'fr' ? 'aider' : 'help'}
      className={`scroll-mt-6 border-t-2 border-text bg-warm ${pleineLargeur ? 'ml-[calc(50%-50vw)] w-screen border-b-2' : ''}`}
    >
      <div className="mx-auto w-full max-w-7xl px-6 py-16 sm:py-24">
        <p className="label text-text/60">{repere ?? t.repere}</p>
        <h2 className="font-heading mt-6 max-w-3xl text-4xl leading-tight sm:text-5xl">
          {titre ?? t.titre}
        <LienSection ancre={locale === 'fr' ? 'aider' : 'help'} /></h2>
        <p className="chapeau mt-8 max-w-2xl">{t.chapeau}</p>
        <div className="mt-14 grid grid-cols-1 gap-px bg-text sm:grid-cols-2 lg:grid-cols-3">
          {t.aides.map((aide) => (
            <div key={aide.titre} className="bg-bg p-8 sm:p-10">
              <p className="font-heading text-2xl leading-tight">{aide.titre}</p>
              <p className="mt-4 text-base text-text/80">{aide.detail}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap gap-4">
          <Link
            to={t.aide.to}
            className="label inline-flex w-fit items-center gap-3 border-2 border-text bg-text px-6 py-3 text-bg hover:bg-accent-primary"
          >
            {t.aide.label} <span aria-hidden>→</span>
          </Link>
          <Link
            to={t.argent.to}
            hash={t.argent.hash}
            className="label inline-flex w-fit items-center gap-2 self-center border-b-2 border-text pb-1 hover:opacity-70"
          >
            {t.argent.label} <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
