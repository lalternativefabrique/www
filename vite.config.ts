import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
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

/**
 * The English revue. Only translated articles are listed, so an untranslated
 * one is never prerendered into a page that would 404 on the static host.
 */
const EN_PATHS = [
  '/en/blog',
  ...articles.flatMap((a) => (a.en ? [`/en/blog/${a.en.slug}`] : [])),
]

const ALL_PATHS = [...STATIC_PATHS, ...ARTICLE_PATHS, ...EN_PATHS]

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
        // An English article carries its French counterpart's dates: they are
        // the same piece, and only the prose is translated.
        const article =
          articles.find((a) => `/blog/${a.slug}` === path) ??
          articles.find((a) => a.en && `/en/blog/${a.en.slug}` === path)
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

${
        articles.some((a) => a.en)
          ? `## Articles (English)

${articles
  .filter((a) => a.en)
  .sort((a, b) => b.date.localeCompare(a.date))
  .map(
    (a) =>
      `- [${a.en!.titre}](${SITE_URL}/en/blog/${a.en!.slug}) — ${a.en!.chapeau} (${a.en!.organe}, ${a.date})`,
  )
  .join('\n')}

`
          : ''
      }## Pages

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

/**
 * Fail the build when a prerendered page links a stylesheet that was not
 * emitted.
 *
 * The build runs twice — a client pass and the prerender pass — and Tailwind
 * can emit slightly different CSS between them, producing two different content
 * hashes. The prerender pass bakes its hash into every page, then the client
 * pass writes the file under its own: every page links a stylesheet that does
 * not exist and the site is served as raw HTML.
 *
 * It reached production once (15 pages pointing at app-ThVqMHFt.css while only
 * app-vxgttWyx.css shipped) and never reproduced locally, because it depends on
 * what each pass scans inside the build container. Nothing failed — the build
 * was green and the site was unstyled. Hence this check: a mismatch must break
 * the build, not the site.
 */
function assetIntegrityPlugin(): Plugin {
  // The prerender pass runs after every closeBundle, so checking there would
  // inspect a directory that has no prerendered page in it yet. Arming an exit
  // hook is what gets the check to run once the pages actually exist.
  const check = () => {
      const outDir = resolve(process.cwd(), 'dist/client')
      if (!existsSync(outDir)) return

      const pages: string[] = []
      const walk = (dir: string) => {
        for (const entry of readdirSync(dir, { withFileTypes: true })) {
          const full = resolve(dir, entry.name)
          if (entry.isDirectory()) walk(full)
          else if (entry.name.endsWith('.html')) pages.push(full)
        }
      }
      walk(outDir)

      const missing = new Set<string>()
      for (const page of pages) {
        const html = readFileSync(page, 'utf8')
        for (const [, href] of html.matchAll(
          /<link[^>]+rel="stylesheet"[^>]+href="(\/[^"]+)"/g,
        )) {
          if (!existsSync(resolve(outDir, href.slice(1)))) missing.add(href)
        }
      }

      if (missing.size === 0) return

      // The prerender pass and the client pass emit their own stylesheet, and
      // inside the build container the two differ: the pages carry one hash
      // while the file that ships carries another, so every page links a 404
      // and the site is served unstyled. Repointing the pages at the file that
      // actually shipped is what makes the output self-consistent.
      const emitted = readdirSync(resolve(outDir, 'assets')).filter((name) =>
        name.endsWith('.css'),
      )
      if (emitted.length !== 1) {
        console.error(
          `\n[asset-integrity] pages link ${[...missing].join(', ')}, and the build emitted ${emitted.length} stylesheets — cannot repoint unambiguously\n`,
        )
        process.exitCode = 1
        return
      }

      const target = `/assets/${emitted[0]}`
      for (const page of pages) {
        const html = readFileSync(page, 'utf8')
        let patched = html
        for (const href of missing) patched = patched.split(href).join(target)
        if (patched !== html) writeFileSync(page, patched, 'utf8')
      }
      console.log(
        `[asset-integrity] repointed ${[...missing].join(', ')} to ${target}`,
      )
  }

  return {
    name: 'lalter-asset-integrity',
    apply: 'build',
    closeBundle() {
      process.removeListener('exit', check)
      process.once('exit', check)
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
    assetIntegrityPlugin(),
  ],
})
