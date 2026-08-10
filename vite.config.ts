import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import type { Plugin } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { articles } from './app/content/articles'

// Kept in sync with SITE_URL in app/lib/seo.ts. Not imported from there: this
// file is loaded by Node before the '@/' alias exists.
//
// Nothing enforces that sync, and it has already drifted once: the domain was
// updated everywhere else while this copy still emitted the old one into
// sitemap.xml, advertising URLs on a domain that did not resolve. When you
// change it, change it in both files — and check the built sitemap, not just
// the rendered canonical tag, since they come from different sources.
const SITE_URL = 'https://lalternativefabrique.org'

/**
 * Every route to prerender. This is the single source of truth: the same list
 * drives the prerender pass and the sitemap, so the two cannot drift.
 *
 * Articles are listed explicitly rather than left to crawlLinks. Relying on the
 * crawler means an article that is not linked from /blog silently never gets
 * built — and on a static host an unbuilt route is a 404.
 */
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

const ARTICLE_PATHS = articles.map((a) => `/blog/${a.slug}`)

const ALL_PATHS = [...STATIC_PATHS, ...ARTICLE_PATHS]

/** Most recent article date, used as lastmod for the blog index. */
const latestArticleDate = articles
  .map((a) => a.date)
  .sort()
  .at(-1)

/**
 * Emit sitemap.xml and llms.txt into the client build.
 *
 * Written in closeBundle rather than as an emitted asset: the prerender pass
 * runs its own build, and emitting from there would produce the file twice.
 *
 * Both files derive from the same article list as the prerender pass, so a new
 * article cannot be live and missing from either.
 */
function sitemapPlugin(): Plugin {
  return {
    name: 'lalter-sitemap',
    apply: 'build',
    closeBundle() {
      // The prerender pass reuses this config; only write from the client
      // build, whose outDir is dist/client.
      const outDir = resolve(process.cwd(), 'dist/client')

      const urls = ALL_PATHS.map((path) => {
        const article = articles.find((a) => `/blog/${a.slug}` === path)
        const lastmod =
          article?.dateRevision ??
          article?.date ??
          (path === '/blog' ? latestArticleDate : undefined)
        // Home first, then editorial content, then the rest.
        const priority = path === '/' ? '1.0' : article ? '0.8' : '0.6'

        return [
          '  <url>',
          `    <loc>${SITE_URL}${path === '/' ? '/' : path}</loc>`,
          lastmod ? `    <lastmod>${lastmod}</lastmod>` : null,
          `    <priority>${priority}</priority>`,
          '  </url>',
        ]
          .filter(Boolean)
          .join('\n')
      }).join('\n')

      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`

      const articleLines = [...articles]
        .sort((a, b) => b.date.localeCompare(a.date))
        .map(
          (a) =>
            `- [${a.titre}](${SITE_URL}/blog/${a.slug}) — ${a.chapeau} (${a.organe}, ${a.date})`,
        )
        .join('\n')

      const llms = `# L'Alternative Fabrique

> Une revue et un ensemble d'outils sobres pour construire une alternative :
> connaissance, technique, création, financement, communication. Chaque outil
> est un organe, chaque article défend une position argumentée et vérifiable.

## Articles

${articleLines}

## Pages

- [Accueil](${SITE_URL}/)
- [Les organes](${SITE_URL}/outils) — les outils et ce que chacun prend en charge
- [Le pot commun](${SITE_URL}/pot) — le modèle de financement
- [À propos](${SITE_URL}/a-propos)
- [Contact](${SITE_URL}/contact)
`

      try {
        writeFileSync(resolve(outDir, 'sitemap.xml'), xml, 'utf8')
        writeFileSync(resolve(outDir, 'llms.txt'), llms, 'utf8')
      } catch {
        // dist/client does not exist during the server/prerender build.
      }
    },
  }
}

export default defineConfig({
  server: {
    watch: {
      // pnpm falls back to a repo-local store when $HOME is confined (sklp
      // space). Its symlink farm makes the watcher crash with ELOOP.
      ignored: ['**/.pnpm-store/**'],
    },
  },
  plugins: [
    tsconfigPaths({ projects: ['./tsconfig.json'] }),
    tailwindcss(),
    tanstackStart({
      srcDirectory: 'app',
      // Static output: prerender all known routes.
      prerender: {
        enabled: true,
        // Kept as a safety net for links added without updating ALL_PATHS.
        crawlLinks: true,
        retryCount: 2,
      },
      pages: ALL_PATHS.map((path) => ({ path })),
    }),
    viteReact(),
    sitemapPlugin(),
  ],
})
