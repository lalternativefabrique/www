import { Link } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { useLocale, type Locale } from '@/lib/i18n'

export const convictions: Record<Locale, ReadonlyArray<string>> = {
  fr: [
    "Pas d'investisseurs. Nos clients nous financent.",
    'Tous nos outils se branchent entre eux.',
    'Reconstruire une industrie numérique en France et en Europe.',
    'Vous payez pour garder notre indépendance.',
    'Vos données ne sont pas le produit.',
    "Financé par l'usage, les dons et le financement participatif.",
    'Nos produits restent les nôtres.',
  ],
  en: [
    'No investors. Our customers fund us.',
    'All our tools plug into each other.',
    'Rebuilding a digital industry in France and Europe.',
    'You pay to keep us independent.',
    'Your data is not the product.',
    'Funded by use, donations and crowdfunding.',
    'Our products stay ours.',
  ],
}

const liensPhrase: Record<Locale, Partial<Record<number, string>>> = {
  fr: { 0: '/pot' },
  en: { 0: '/en/pot' },
}

const lien: Record<Locale, { to: string; label: string }> = {
  fr: { to: '/a-propos', label: 'Ce que nous croyons' },
  en: { to: '/en/a-propos', label: 'What we stand for' },
}

const PARCOURS_ECRANS = 2.5

function useProgression() {
  const scene = useRef<HTMLDivElement>(null)
  const [progression, setProgression] = useState(0)
  const [enMouvement, setEnMouvement] = useState(false)
  useEffect(() => {
    const el = scene.current
    if (!el) return
    let frame = 0
    let repos: ReturnType<typeof setTimeout> | undefined
    const update = () => {
      frame = 0
      const parcours = window.innerHeight * PARCOURS_ECRANS
      const avance = window.innerHeight * 1.8 - el.getBoundingClientRect().top
      setProgression(avance / parcours)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
      setEnMouvement(true)
      clearTimeout(repos)
      repos = setTimeout(() => setEnMouvement(false), 1800)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(repos)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])
  return { scene, progression, enMouvement }
}

export function Conviction({ inverse = false }: { inverse?: boolean }) {
  const locale = useLocale()
  const phrases = convictions[locale]
  const { to, label } = lien[locale]
  const { scene, progression, enMouvement } = useProgression()
  const [survolee, setSurvolee] = useState(false)
  const dansLaZone = progression > 0 && progression < 1
  const actif = dansLaZone && (enMouvement || survolee)
  const courante = Math.min(phrases.length - 1, Math.max(0, Math.floor(progression * phrases.length)))
  return (
    <div ref={scene} className="h-0 motion-reduce:hidden">
      <div
        onMouseEnter={() => setSurvolee(true)}
        onMouseLeave={() => setSurvolee(false)}
        className={`fixed inset-x-4 bottom-6 z-40 transition-all duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)] sm:inset-x-auto sm:right-8 sm:bottom-8 sm:w-[26rem] ${
          actif ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-8 scale-95 opacity-0'
        }`}
      >
        <div
          className={`relative overflow-hidden rounded-2xl p-6 shadow-[0_24px_60px_-20px_rgb(0_0_0/0.45)] ring-1 sm:p-7 ${
            inverse ? 'bg-bg text-text ring-text/10' : 'bg-text text-bg ring-white/10'
          }`}
        >
          <span aria-hidden className="absolute inset-y-0 left-0 w-1.5 bg-accent-primary" />
          <div className="flex items-center justify-between">
            <p className="label flex items-center gap-2 text-accent-primary">
              <span aria-hidden className="size-2 bg-accent-primary" />
              {label}
            </p>
            <p className="label opacity-50">
              {String(courante + 1).padStart(2, '0')}/{String(phrases.length).padStart(2, '0')}
            </p>
          </div>
          <p
            key={courante}
            className="mt-4 animate-[carte_0.45s_cubic-bezier(0.2,0.7,0.2,1)] font-heading text-2xl font-extrabold uppercase leading-[1.05] tracking-tight sm:text-[1.9rem]"
          >
            {liensPhrase[locale][courante] ? (
              <Link
                to={liensPhrase[locale][courante]}
                tabIndex={actif ? 0 : -1}
                className="underline decoration-accent-primary decoration-4 underline-offset-[6px] hover:text-accent-primary"
              >
                {phrases[courante]}
              </Link>
            ) : (
              phrases[courante]
            )}
          </p>
          <div className="mt-6 flex items-center gap-4">
            <div className="h-0.5 flex-1 bg-current/15">
              <div
                className="h-full bg-accent-primary transition-[width] duration-300"
                style={{ width: `${((courante + 1) / phrases.length) * 100}%` }}
              />
            </div>
            <Link
              to={to}
              hash="culture"
              tabIndex={actif ? 0 : -1}
              aria-label={label}
              className="label shrink-0 hover:text-accent-primary"
            >
              {locale === 'fr' ? 'Lire' : 'Read'} <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
