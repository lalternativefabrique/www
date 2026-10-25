import { litterature } from '@/content/litterature'
import type { Locale } from '@/lib/i18n'

const textes: Record<Locale, { repere: string; titre: string; intro: string }> = {
  fr: {
    repere: 'Littérature technique',
    titre: 'Des standards éprouvés.',
    intro: 'Nous puisons dans des décennies de standards et de savoir-faire éprouvés. Voici les sources que nous lisons, suivons et appliquons pour construire nos briques.',
  },
  en: {
    repere: 'Technical literature',
    titre: 'Proven standards.',
    intro: 'We draw on decades of proven standards and know-how. These are the sources we read, follow and apply to build our blocks.',
  },
}

export function LitteraturePage({ locale }: { locale: Locale }) {
  const { repere, titre, intro } = textes[locale]
  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-24 pt-16 sm:px-6 sm:pt-20">
      <p className="label text-accent-primary">{repere}</p>
      <h1 className="display-xl mt-6">{titre}</h1>
      <p className="chapeau mt-8 max-w-2xl">{intro}</p>
      <div className="mt-16 grid gap-x-12 gap-y-10 md:grid-cols-2">
        {litterature.map((rayon) => (
          <div key={rayon.titre.fr}>
            <h3 className="label text-accent-primary">{rayon.titre[locale]}</h3>
            <ul className="mt-4 border-t border-text">
              {rayon.references.map((reference) => (
                <li key={reference.nom} className="border-b border-text/20">
                  <a
                    href={reference.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-baseline justify-between gap-4 py-3 hover:text-accent-primary"
                  >
                    <span className="font-heading text-lg font-bold">{reference.nom}</span>
                    <span className="text-right text-sm text-text/70 group-hover:text-accent-primary">
                      {reference.role[locale]} <span aria-hidden>↗</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
