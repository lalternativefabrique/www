import { Link } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'
import { useLocale, type Locale } from '@/lib/i18n'

export const convictions: Record<Locale, ReadonlyArray<string>> = {
  fr: [
    "Pas d'investisseurs. Nos clients nous financent.",
    'Tous nos outils se branchent entre eux.',
    'Des briques compatibles, conçues pour se brancher partout.',
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
    'All our tools plug into each other.',
    'Compatible building blocks, designed to plug in anywhere.',
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

function Ligne({ phrases, cachee }: { phrases: ReadonlyArray<string>; cachee?: boolean }) {
  return (
    <ul
      aria-hidden={cachee || undefined}
      className="flex shrink-0 items-center gap-10 pr-10 motion-reduce:flex-wrap"
    >
      {phrases.map((phrase) => (
        <li key={phrase} className="flex items-center gap-10 whitespace-nowrap">
          <span className="font-heading text-3xl uppercase sm:text-5xl">{phrase}</span>
          <span aria-hidden className="size-3 shrink-0 bg-accent-primary" />
        </li>
      ))}
    </ul>
  )
}

function useScrollDrift() {
  const piste = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = piste.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let frame = 0
    const update = () => {
      frame = 0
      const moitie = el.scrollWidth / 2
      const decalage = (el.getBoundingClientRect().top * 0.8) % moitie
      el.style.transform = `translateX(${decalage - moitie}px)`
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])
  return piste
}

export function Conviction({ inverse = false }: { inverse?: boolean }) {
  const locale = useLocale()
  const phrases = convictions[locale]
  const { to, label } = lien[locale]
  const piste = useScrollDrift()
  return (
    <aside
      className={`ml-[calc(50%-50vw)] w-screen overflow-hidden border-y-2 border-text py-8 sm:py-10 ${
        inverse ? 'bg-text text-bg' : 'bg-warm'
      }`}
    >
      <div
        ref={piste}
        className="flex w-max will-change-transform motion-reduce:w-full"
      >
        <Ligne phrases={phrases} />
        <span className="contents motion-reduce:hidden">
          <Ligne phrases={phrases} cachee />
        </span>
      </div>
      <div className="mx-auto mt-6 w-full max-w-7xl px-6">
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
