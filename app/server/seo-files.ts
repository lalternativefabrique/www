import { SITE_URL } from '@/lib/seo'
import type { ArticleCard } from './article-list'

/**
 * sitemap.xml and llms.txt, built from the live article list.
 *
 * They used to be generated at build time from the sources in the repo. With
 * publishing being a write to the bucket, that would leave every article
 * published since the last deployment out of both files — and llms.txt is what
 * answer engines read to find the corpus at all.
 *
 * Pure functions over the list: the route handlers fetch, these format.
 */

/** Routes that exist regardless of what has been published. */
const STATIC_PATHS = [
  '/',
  '/apps',
  '/outils',
  '/pot',
  '/paiement',
  '/blog',
  '/a-propos',
  '/contact',
]

const EN_STATIC_PATHS = [
  '/en',
  '/en/apps',
  '/en/outils',
  '/en/pot',
  '/en/a-propos',
  '/en/contact',
  '/en/blog',
]

export function buildSitemap(fr: ArticleCard[], en: ArticleCard[]): string {
  const latest = fr.map((a) => a.date).sort().at(-1)

  const entries = [
    ...STATIC_PATHS.map((path) => ({
      path,
      lastmod: path === '/blog' ? latest : undefined,
      priority: path === '/' ? '1.0' : '0.6',
    })),
    ...fr.map((a) => ({
      path: `/blog/${a.slug}`,
      lastmod: a.dateRevision ?? a.date,
      priority: '0.8',
    })),
    ...EN_STATIC_PATHS.map((path) => ({
      path,
      lastmod: path === '/en/blog' ? latest : undefined,
      priority: '0.6',
    })),
    ...en.map((a) => ({
      // An English article carries its French counterpart's dates: they are the
      // same piece, and only the prose is translated.
      path: `/en/blog/${a.slug}`,
      lastmod: a.dateRevision ?? a.date,
      priority: '0.8',
    })),
  ]

  const urls = entries
    .map(({ path, lastmod, priority }) =>
      [
        '  <url>',
        `    <loc>${SITE_URL}${path === '/' ? '/' : path}</loc>`,
        lastmod ? `    <lastmod>${lastmod}</lastmod>` : null,
        `    <priority>${priority}</priority>`,
        '  </url>',
      ]
        .filter(Boolean)
        .join('\n'),
    )
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`
}

export function buildLlmsTxt(fr: ArticleCard[], en: ArticleCard[]): string {
  const line = (a: ArticleCard, prefix: string) =>
    `- [${a.titre}](${SITE_URL}${prefix}/${a.slug}) — ${a.chapeau} (${a.organe}, ${a.date})`

  const frLines = [...fr]
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((a) => line(a, '/blog'))
    .join('\n')

  const enSection = en.length
    ? `## Articles (English)

${[...en]
  .sort((a, b) => b.date.localeCompare(a.date))
  .map((a) => line(a, '/en/blog'))
  .join('\n')}

`
    : ''

  return `# L'Alternative Fabrique

> Une revue et un ensemble d'outils sobres pour construire une alternative :
> connaissance, technique, création, financement, communication. Chaque outil
> est un organe, chaque article défend une position argumentée et vérifiable.

## Articles

${frLines}

${enSection}## Pages

- [Accueil](${SITE_URL}/)
- [Les organes](${SITE_URL}/outils) — les outils et ce que chacun prend en charge
- [Le pot commun](${SITE_URL}/pot) — le modèle de financement
- [À propos](${SITE_URL}/a-propos)
- [Contact](${SITE_URL}/contact)
`
}
