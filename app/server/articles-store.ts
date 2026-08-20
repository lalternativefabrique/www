import { compile, run } from '@mdx-js/mdx'
import * as runtime from 'react/jsx-runtime'
import remarkGfm from 'remark-gfm'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import type { Article, ArticleEn, MdxCorps } from '@/content/articles'
import { articles as localArticles } from '@/content/articles'
import { bucketConfigured, getObject, listKeys } from './bucket'

/**
 * The article list, read from object storage and compiled on demand.
 *
 * Publishing is a write to the bucket, so nothing here may be resolved at build
 * time: a route that renders an article asks this module, which serves it from
 * memory or fetches and compiles it.
 *
 * See docs/adr/0001-articles-from-bucket-ssr-blog-admin.md.
 */

const PREFIX = 'articles/'

/**
 * Backstop for a missed invalidation. The admin drops the cache when it writes,
 * so this only matters when that call does not land — a restart mid-publish, or
 * a second replica that never heard about it.
 */
const TTL_MS = 60_000

type Cache = { articles: Article[]; at: number }

let cache: Cache | undefined
let inFlight: Promise<Article[]> | undefined

/** Called by the admin after a write, so the next read recompiles. */
export function invalidate() {
  cache = undefined
}

export async function loadArticles(): Promise<Article[]> {
  if (cache && Date.now() - cache.at < TTL_MS) return cache.articles

  // A burst of requests on a cold cache would otherwise each fetch and compile
  // the whole corpus; they share one pass instead.
  inFlight ??= fetchAll().finally(() => {
    inFlight = undefined
  })

  const articles = await inFlight
  cache = { articles, at: Date.now() }
  return articles
}

async function fetchAll(): Promise<Article[]> {
  // No bucket configured: fall back to the sources committed in the repo, so a
  // clone runs and the corpus stays readable offline without credentials.
  if (!bucketConfigured) return localArticles

  const keys = await listKeys(PREFIX)
  const dirs = new Set<string>()
  for (const key of keys) {
    const rest = key.slice(PREFIX.length)
    const slash = rest.indexOf('/')
    if (slash > 0) dirs.add(rest.slice(0, slash))
  }

  const loaded = await Promise.all([...dirs].map(loadOne))
  const articles = loaded.filter((a): a is Article => a !== undefined)

  // A configured bucket holding no article is a bucket that was never seeded,
  // or one whose credentials now point at a fresh one: serving the sources
  // committed here beats serving an empty revue. Anything else is the bucket's
  // word — a partial corpus is a deliberate one, so the repo never adds to it,
  // and an article unpublished from the admin stays unpublished.
  if (articles.length === 0) return localArticles

  return articles.sort((a, b) => b.date.localeCompare(a.date))
}

export async function findBySlug(slug: string) {
  return (await loadArticles()).find((a) => a.slug === slug)
}

/** Only the translated articles. Drives /en/blog. */
export async function loadArticlesEn() {
  return (await loadArticles()).flatMap((a) => (a.en ? [a.en] : []))
}

export async function findEnBySlug(slug: string) {
  return (await loadArticles()).find((a) => a.en?.slug === slug)
}

async function loadOne(dir: string): Promise<Article | undefined> {
  const [fr, en] = await Promise.all([
    getObject(`${PREFIX}${dir}/index.fr.mdx`),
    getObject(`${PREFIX}${dir}/index.en.mdx`),
  ])
  // A directory without a French source is not an article.
  if (!fr) return undefined

  const french = await compileMdx(fr)
  if (!french.meta.slug || !french.meta.date) return undefined

  const english = en ? await compileMdx(en) : undefined

  return {
    ...(french.meta as Article),
    dir,
    corps: french.corps,
    en:
      english?.meta.slug
        ? ({ ...(english.meta as ArticleEn), corps: english.corps } as ArticleEn)
        : undefined,
  }
}

type Compiled = { corps: MdxCorps; meta: Record<string, unknown> }

/**
 * Compiles a source at request time, where the build previously ran the Vite
 * MDX plugin. Same remark chain, so a file behaves identically whether it came
 * from the repo or the bucket.
 */
async function compileMdx(source: string): Promise<Compiled> {
  const code = await compile(source, {
    outputFormat: 'function-body',
    development: false,
    remarkPlugins: [
      remarkGfm,
      remarkFrontmatter,
      [remarkMdxFrontmatter, { name: 'meta' }],
    ],
  })

  const mod = await run(code, {
    ...runtime,
    baseUrl: import.meta.url,
  })

  return {
    corps: mod.default as MdxCorps,
    meta: (mod.meta ?? {}) as Record<string, unknown>,
  }
}
