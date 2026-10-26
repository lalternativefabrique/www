import { NomRemplacant } from '@/components/NomRemplacant'
import { remplacements } from '@/content/remplacements'

const textes = {
  fr: {
    badge: '100 % hébergé en Europe',
    hebergeurs: 'OVH · Scaleway',
    alternatives: 'Les alternatives',
    exemples: 'à Gmail, ChatGPT, Notion…',
    titre: 'Ce que nous remplaçons',
  },
  en: {
    badge: '100% hosted in Europe',
    hebergeurs: 'OVH · Scaleway',
    alternatives: 'The alternatives',
    exemples: 'to Gmail, ChatGPT, Notion…',
    titre: 'What we replace',
  },
} as const

export function BadgeEurope({ locale }: { locale: 'fr' | 'en' }) {
  const t = textes[locale]
  return (
    <div className="mt-8 flex flex-wrap gap-3">
      <p className="inline-flex w-fit items-stretch border-2 border-text">
        <span className="label flex items-center gap-2 bg-text px-3 py-2 text-bg">
          <span aria-hidden className="size-2 rounded-full bg-accent-primary" />
          {t.badge}
        </span>
        <span className="flex items-center px-3 py-2 font-mono text-xs text-text/70">
          {t.hebergeurs}
        </span>
      </p>

      <div className="group relative w-fit">
        <button
          type="button"
          aria-describedby="badge-alternatives-liste"
          className="inline-flex items-stretch border-2 border-text group-hover:border-accent-primary"
        >
          <span className="label flex items-center gap-2 bg-accent-primary px-3 py-2 text-bg">
            <span aria-hidden>⇄</span>
            {t.alternatives}
          </span>
          <span className="flex items-center px-3 py-2 font-mono text-xs text-text/70">
            {t.exemples}
          </span>
        </button>
        <div
          id="badge-alternatives-liste"
          role="tooltip"
          className="invisible absolute left-0 top-full z-20 w-full min-w-72 pt-2 opacity-0 transition-opacity group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100"
        >
          <div className="border-2 border-text bg-bg p-4 shadow-[6px_6px_0_0] shadow-text">
            <p className="label text-accent-primary">{t.titre}</p>
            <dl className="mt-3 grid grid-cols-[1fr_auto_auto] gap-x-3 gap-y-1.5 font-mono text-sm">
              {remplacements.map((remplacement) => (
                <div key={remplacement.avant} className="contents">
                  <dt className="text-text/50 line-through decoration-text/30">{remplacement.avant}</dt>
                  <span aria-hidden className="text-accent-primary">→</span>
                  <dd className="font-semibold">
                    <NomRemplacant remplacement={remplacement} />
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}
