import { litterature, type Rayon } from '@/content/litterature'
import type { Locale } from '@/lib/i18n'

function ancreDe(nom: string) {
  return nom
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
}

function sousTitre(titre: string) {
  return titre.includes(' — ') ? titre.split(' — ')[1] : titre
}

const textes: Record<Locale, { repere: string; titre: string; intro: string; agents: string }> = {
  fr: {
    repere: 'Littérature technique',
    agents: 'Agents',
    titre: 'Des standards éprouvés.',
    intro: 'Nous puisons dans des décennies de standards et de savoir-faire éprouvés. Voici les sources que nous lisons, suivons et appliquons pour construire nos briques.',
  },
  en: {
    repere: 'Technical literature',
    agents: 'Agents',
    titre: 'Proven standards.',
    intro: 'We draw on decades of proven standards and know-how. These are the sources we read, follow and apply to build our blocks.',
  },
}

export function LitteraturePage({ locale }: { locale: Locale }) {
  const { repere, titre, intro, agents } = textes[locale]
  const domaines: Array<{ nom: string; ancre: string; total: number; rayons: Rayon[] }> = []
  for (const rayon of litterature) {
    const nom = rayon.titre[locale].includes(' — ') ? rayon.titre[locale].split(' — ')[0] : agents
    let domaine = domaines.find((d) => d.nom === nom)
    if (!domaine) {
      domaine = { nom, ancre: ancreDe(nom), total: 0, rayons: [] }
      domaines.push(domaine)
    }
    domaine.rayons.push(rayon)
    domaine.total += rayon.references.length
  }
  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-24 pt-16 sm:px-6 sm:pt-20">
      <p className="label text-accent-primary">{repere}</p>
      <h1 className="display-xl mt-6">{titre}</h1>
      <p className="chapeau mt-8 max-w-2xl">{intro}</p>
      <nav className="sticky top-0 z-10 -mx-4 mt-12 flex gap-2 overflow-x-auto border-y border-text bg-bg px-4 py-3 sm:mx-0 sm:px-0">
        {domaines.map((domaine) => (
          <a
            key={domaine.nom}
            href={`#${domaine.ancre}`}
            className="label shrink-0 rounded-full border border-text/30 px-3 py-1 hover:border-accent-primary hover:text-accent-primary"
          >
            {domaine.nom} <span className="text-text/50">{domaine.total}</span>
          </a>
        ))}
      </nav>
      {domaines.map((domaine) => (
        <section key={domaine.nom} id={domaine.ancre} className="scroll-mt-20 pt-16">
          <h2 className="font-heading border-b-[3px] border-text pb-3 text-3xl uppercase sm:text-4xl">
            {domaine.nom}
          </h2>
          <div className="mt-10 grid gap-x-12 gap-y-10 md:grid-cols-2">
            {domaine.rayons.map((rayon) => (
              <div key={rayon.titre.fr}>
                <h3 className="label text-accent-primary">{sousTitre(rayon.titre[locale])}</h3>
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
        </section>
      ))}
    </div>
  )
}
