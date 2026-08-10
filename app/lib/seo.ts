/**
 * SEO helpers for route `head()` definitions.
 *
 * The site is fully prerendered (see prerender in vite.config.ts), so every tag
 * built here is baked into the HTML at build time — crawlers get it without
 * executing any JS. Nothing in this file may depend on the incoming request.
 */

/** Production origin, no trailing slash. Canonical and og:url are absolute. */
export const SITE_URL = 'https://lalternativefabrique.org'

export const SITE_NAME = "L'Alternative Fabrique"

export const CONTACT_EMAIL = 'contact@lalternativefabrique.org'

/** Default social card. Absolute URL — relative paths break on most crawlers. */
export const OG_IMAGE = `${SITE_URL}/og-default.png`

/** Join the origin with a route path, collapsing the double slash on '/'. */
export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path === '/' ? '' : path}`
}

type SeoInput = {
  title: string
  description: string
  /** Route path, e.g. '/pot'. Drives both canonical and og:url. */
  path: string
  /** Absolute image URL. Defaults to the site-wide card. */
  image?: string
  /** 'article' switches the OG type and enables the fields below. */
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
  section?: string
}

/**
 * Build the meta + links for a route head().
 *
 * og:title and og:description are emitted explicitly rather than letting
 * scrapers fall back to <title>: the fallback is inconsistent across networks
 * and silently truncates differently on each.
 */
export function seo({
  title,
  description,
  path,
  image = OG_IMAGE,
  type = 'website',
  publishedTime,
  modifiedTime,
  section,
}: SeoInput) {
  const url = absoluteUrl(path)

  const meta: Array<Record<string, string>> = [
    { title },
    { name: 'description', content: description },

    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: url },
    { property: 'og:type', content: type },
    { property: 'og:image', content: image },

    // twitter:card is set to summary_large_image in __root; that promises an
    // image, so one is always emitted here.
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: image },
  ]

  if (type === 'article') {
    if (publishedTime) {
      meta.push({ property: 'article:published_time', content: publishedTime })
    }
    if (modifiedTime) {
      meta.push({ property: 'article:modified_time', content: modifiedTime })
    }
    if (section) {
      meta.push({ property: 'article:section', content: section })
    }
  }

  return {
    meta,
    // Canonical resolves the /pot vs /pot/ duplicate: the static host serves
    // both, and without this they read as two pages with identical content.
    links: [{ rel: 'canonical', href: url }],
  }
}

/**
 * Wrap a JSON-LD object as a head() meta entry.
 *
 * The router turns the `script:ld+json` key into a real
 * <script type="application/ld+json"> tag (see buildTagsFromMatches in
 * @tanstack/react-router) — it is NOT a head `scripts` entry.
 */
export function jsonLd(data: unknown) {
  return { 'script:ld+json': data } as unknown as Record<string, string>
}

/**
 * Every product domain the fabrique publishes under.
 *
 * Each tool ships on its own name, so nothing in the URLs themselves ties them
 * back here. sameAs is what states the link: answer engines resolve an entity
 * from consistent co-occurrence, and without it Spore and the fabrique read as
 * two unrelated things.
 */
export const PRODUCT_URLS = [
  'https://synthiz.com',
  'https://techtuel.com',
  'https://sporee.fr',
  'https://lungor.fr',
  'https://skalpai.dev',
] as const

/** Publisher identity, reused as the Article publisher. */
export const ORGANIZATION = {
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  email: CONTACT_EMAIL,
  logo: `${SITE_URL}/apple-touch-icon.png`,
  sameAs: PRODUCT_URLS,
  description:
    "Des outils sobres pour construire une alternative : connaissance, technique, création, financement, communication.",
} as const
