import { Link } from '@tanstack/react-router'
import { useLocale, type Locale } from '@/lib/i18n'

export const convictions: Record<Locale, ReadonlyArray<string>> = {
  fr: [
    "Pas d'investisseurs. Nos clients nous financent.",
    'Le temps long plutôt que la croissance à tout prix.',
    'Reprendre nos outils de travail, un par un.',
    'Reconstruire une industrie numérique en France et en Europe.',
    'Payant, donc indépendant.',
    'Vos données ne sont pas le produit.',
    "Financé par l'usage, les dons et le financement participatif.",
    'Nos produits ne sont pas à vendre.',
  ],
  en: [
    'No investors. Our customers fund us.',
    'The long run over growth at any price.',
    'Taking back our work tools, one by one.',
    'Rebuilding a digital industry in France and Europe.',
    'Paid, therefore independent.',
    'Your data is not the product.',
    'Funded by use, donations and crowdfunding.',
    'Our products are not for sale.',
  ],
}

const lien: Record<Locale, { to: string; label: string }> = {
  fr: { to: '/a-propos', label: 'Ce que nous croyons' },
  en: { to: '/en/a-propos', label: 'What we stand for' },
}

export function Conviction({
  index,
  inverse = false,
}: {
  index: number
  inverse?: boolean
}) {
  const locale = useLocale()
  const phrases = convictions[locale]
  const phrase = phrases[index % phrases.length]
  const { to, label } = lien[locale]
  return (
    <aside
      className={
        inverse
          ? 'border-y-2 border-text bg-text text-bg'
          : 'border-y-2 border-text bg-warm'
      }
    >
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-end justify-between gap-6 px-6 py-12 sm:py-16">
        <p className="display-card max-w-4xl normal-case">{phrase}</p>
        <Link
          to={to}
          hash="culture"
          className="label inline-flex items-center gap-2 border-b border-current pb-1 hover:text-accent-primary"
        >
          {label} <span aria-hidden>→</span>
        </Link>
      </div>
    </aside>
  )
}
