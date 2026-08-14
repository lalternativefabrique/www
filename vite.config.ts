import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import type { Plugin } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'
import remarkGfm from 'remark-gfm'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import tailwindcss from '@tailwindcss/vite'

/**
 * The routes prerendered into static HTML.
 *
 * Articles are absent on purpose: they are published to the bucket and rendered
 * on demand, so baking them into the image would freeze the corpus at build
 * time — see docs/adr/0001-articles-from-bucket-ssr-blog-admin.md. The two blog
 * indexes are excluded for the same reason: they list what the bucket holds.
 *
 * sitemap.xml and llms.txt are server routes now, for the same reason again.
 */
const STATIC_PATHS = [
  '/',
  '/apps',
  '/outils',
  '/pot',
  '/paiement',
  '/a-propos',
  '/contact',
]

const EN_PATHS = [
  '/en',
  '/en/apps',
  '/en/outils',
  '/en/pot',
  '/en/a-propos',
  '/en/contact',
]

const ALL_PATHS = [...STATIC_PATHS, ...EN_PATHS]

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
      // Hybrid output: the pages listed below are prerendered, everything else
      // is rendered on demand.
      prerender: {
        enabled: true,
        // Off deliberately. The crawler would follow the links on /blog and
        // bake every article into the image, which is exactly what publishing
        // to a bucket is meant to avoid.
        crawlLinks: false,
        // Same reason: discovery picks up the blog indexes and freezes the
        // article list they render into the build.
        autoStaticPathsDiscovery: false,
        retryCount: 2,
      },
      pages: ALL_PATHS.map((path) => ({ path })),
    }),
    // Must precede viteReact: it hands the JSX it compiles to the React plugin.
    {
      enforce: 'pre',
      ...mdx({
        remarkPlugins: [
          remarkGfm,
          remarkFrontmatter,
          [remarkMdxFrontmatter, { name: 'meta' }],
        ],
      }),
    },
    viteReact(),
    assetIntegrityPlugin(),
  ],
})
