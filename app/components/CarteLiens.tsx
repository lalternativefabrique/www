import { useEffect, useState } from 'react'
import type { Application } from '@/content/catalogue'
import { utilise } from '@/content/dependances'
import type { Locale } from '@/lib/i18n'

const TAILLE = 640
const CENTRE = TAILLE / 2
const RAYON = 240
const NOEUD = 30

const textes = {
  fr: {
    bouton: 'Voir les liens entre les applications',
    titre: 'Ce qui relie nos applications',
    aide: 'Survolez une application : en rouge ce qu’elle utilise, en noir celles qui l’utilisent.',
    fermer: 'Fermer',
    utilise: 'Utilise',
    utiliseePar: 'Utilisée par',
    rien: 'aucune',
  },
  en: {
    bouton: 'See how the applications connect',
    titre: 'What connects our applications',
    aide: 'Hover an application: in red what it uses, in black those that use it.',
    fermer: 'Close',
    utilise: 'Uses',
    utiliseePar: 'Used by',
    rien: 'none',
  },
} as const

export function CarteLiens({ applications, locale }: { applications: ReadonlyArray<Application>; locale: Locale }) {
  const t = textes[locale]
  const [ouverte, setOuverte] = useState(false)
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    if (!ouverte) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOuverte(false)
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [ouverte])

  const positions = new Map(
    applications.map((a, i) => {
      const angle = (i / applications.length) * Math.PI * 2 - Math.PI / 2
      return [a.name, { x: CENTRE + RAYON * Math.cos(angle), y: CENTRE + RAYON * Math.sin(angle) }]
    }),
  )
  const liens = applications.flatMap((a) =>
    (utilise[a.name] ?? []).filter((cible) => positions.has(cible)).map((cible) => ({ de: a.name, vers: cible })),
  )
  const utilisees = active ? utilise[active] ?? [] : []
  const utilisatrices = active ? liens.filter((l) => l.vers === active).map((l) => l.de) : []

  return (
    <>
      <button
        type="button"
        onClick={() => setOuverte(true)}
        className="label inline-flex w-fit items-center gap-3 border-2 border-text px-5 py-2.5 hover:bg-text hover:text-bg"
      >
        <svg aria-hidden viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="4" cy="4" r="2.5" />
          <circle cx="16" cy="6" r="2.5" />
          <circle cx="9" cy="16" r="2.5" />
          <path d="M6 5l7.5 1M5 6l3 8M14.5 8l-4 6" />
        </svg>
        {t.bouton}
      </button>
      {ouverte ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t.titre}
          className="fixed inset-0 z-50 flex items-center justify-center bg-text/70 p-4 backdrop-blur-sm"
          onClick={() => setOuverte(false)}
        >
          <div
            className="relative max-h-full w-full max-w-4xl animate-[carte_0.35s_cubic-bezier(0.2,0.7,0.2,1)] overflow-auto border-2 border-text bg-bg p-6 sm:p-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-6">
              <div>
                <h2 className="font-heading text-3xl uppercase sm:text-4xl">{t.titre}</h2>
                <p className="mt-2 text-sm text-text/70">{t.aide}</p>
              </div>
              <button
                type="button"
                onClick={() => setOuverte(false)}
                className="label shrink-0 border border-text px-3 py-1.5 hover:bg-text hover:text-bg"
              >
                {t.fermer} ✕
              </button>
            </div>
            <div className="mt-6 grid gap-8 md:grid-cols-[1fr_14rem]">
              <svg viewBox={`0 0 ${TAILLE} ${TAILLE}`} className="w-full">
                <defs>
                  {['neutre', 'sortant', 'entrant'].map((sorte) => (
                    <marker key={sorte} id={`fleche-${sorte}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                      <path
                        d="M0 0L10 5L0 10z"
                        fill={sorte === 'sortant' ? 'var(--color-accent-primary)' : sorte === 'entrant' ? 'var(--color-text)' : 'rgb(0 0 0 / 0.25)'}
                      />
                    </marker>
                  ))}
                </defs>
                {liens.map((lien) => {
                  const a = positions.get(lien.de)!
                  const b = positions.get(lien.vers)!
                  const dx = b.x - a.x
                  const dy = b.y - a.y
                  const d = Math.hypot(dx, dy)
                  const ux = dx / d
                  const uy = dy / d
                  const sortant = active === lien.de
                  const entrant = active === lien.vers
                  const sorte = sortant ? 'sortant' : entrant ? 'entrant' : 'neutre'
                  return (
                    <line
                      key={`${lien.de}-${lien.vers}`}
                      x1={a.x + ux * NOEUD}
                      y1={a.y + uy * NOEUD}
                      x2={b.x - ux * (NOEUD + 4)}
                      y2={b.y - uy * (NOEUD + 4)}
                      stroke={sortant ? 'var(--color-accent-primary)' : entrant ? 'var(--color-text)' : 'rgb(0 0 0 / 0.15)'}
                      strokeWidth={sortant || entrant ? 3 : 1.5}
                      opacity={active && !sortant && !entrant ? 0.25 : 1}
                      markerEnd={`url(#fleche-${sorte})`}
                      className="transition-all duration-200"
                    />
                  )
                })}
                {applications.map((application) => {
                  const p = positions.get(application.name)!
                  const eteinte =
                    active !== null &&
                    active !== application.name &&
                    !utilisees.includes(application.name) &&
                    !utilisatrices.includes(application.name)
                  return (
                    <g
                      key={application.name}
                      transform={`translate(${p.x} ${p.y})`}
                      onMouseEnter={() => setActive(application.name)}
                      onMouseLeave={() => setActive(null)}
                      onClick={() => setActive(application.name)}
                      opacity={eteinte ? 0.3 : 1}
                      className="cursor-pointer transition-opacity duration-200"
                    >
                      <rect
                        x={-NOEUD}
                        y={-NOEUD}
                        width={NOEUD * 2}
                        height={NOEUD * 2}
                        rx="14"
                        fill="white"
                        stroke={active === application.name ? 'var(--color-accent-primary)' : 'var(--color-text)'}
                        strokeWidth={active === application.name ? 3 : 1.5}
                      />
                      {application.icone ? (
                        <image href={application.icone} x={-20} y={-20} width={40} height={40} />
                      ) : null}
                      <text y={NOEUD + 20} textAnchor="middle" className="font-heading" fontSize="16" fontWeight="700" fill="currentColor">
                        {application.name}
                      </text>
                    </g>
                  )
                })}
              </svg>
              <div className="text-sm">
                {active ? (
                  <>
                    <p className="font-heading text-2xl uppercase">{active}</p>
                    <p className="label mt-5 text-accent-primary">{t.utilise}</p>
                    <p className="mt-1">{utilisees.length ? utilisees.join(', ') : t.rien}</p>
                    <p className="label mt-4">{t.utiliseePar}</p>
                    <p className="mt-1">{utilisatrices.length ? utilisatrices.join(', ') : t.rien}</p>
                  </>
                ) : (
                  <p className="text-text/60">{t.aide}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
