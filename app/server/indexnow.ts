import { SITE_URL } from '@/lib/seo'

const ENDPOINT = 'https://api.indexnow.org/indexnow'
export const INDEXNOW_KEY_PATH = '/indexnow-key.txt'

/**
 * Tells Bing and the other IndexNow engines these pages changed, so a new
 * article is crawled within minutes instead of on the next sitemap read.
 * Google does not take part; it reads the sitemap.
 */
export async function announce(paths: string[], fetcher: typeof fetch = fetch): Promise<void> {
  const key = process.env.INDEXNOW_KEY
  if (!key || paths.length === 0) return
  try {
    const res = await fetcher(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: new URL(SITE_URL).host,
        key,
        keyLocation: SITE_URL + INDEXNOW_KEY_PATH,
        urlList: paths.map((p) => SITE_URL + p),
      }),
      signal: AbortSignal.timeout(10_000),
    })
    if (res.status >= 300) console.warn('[indexnow] refused', res.status, paths)
  } catch (err) {
    console.warn('[indexnow] ping failed', paths, err)
  }
}

export function articlePaths(frSlug: string, enSlug?: string): string[] {
  return [`/blog/${frSlug}`, '/blog', ...(enSlug ? [`/en/blog/${enSlug}`, '/en/blog'] : [])]
}
