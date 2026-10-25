import { createServerFn } from '@tanstack/react-start'

export type LectureSignee = {
  url: string
  text: string
  scope: string
  id: string
  lang: 'fr' | 'en'
}

const SCOPE = 'www-article'

export const signerLecture = createServerFn({ method: 'GET' })
  .inputValidator((d: { slug: string; lang: 'fr' | 'en' }) => d)
  .handler(async ({ data }): Promise<LectureSignee | null> => {
    const base = (process.env.VVAVES_URL ?? '').replace(/\/+$/, '')
    const key = (process.env.WWW_VVAVES_APP_KEY ?? '').trim()
    if (!base || !key) return null

    const { loadArticle } = await import('./article-page')
    const article = await loadArticle({ data: { slug: data.slug, lang: data.lang } })
    if (!article) return null

    const { narrationOf } = await import('./narration')
    const { text } = narrationOf(article)
    const id = `${data.lang}-${data.slug}`.slice(0, 256)

    const url = await signerParVvaves(base, key, text, id, data.lang)
    if (!url) return null

    return { url, text, scope: SCOPE, id, lang: data.lang }
  })

async function signerParVvaves(
  base: string,
  key: string,
  text: string,
  id: string,
  lang: string,
): Promise<string | null> {
  const res = await fetch(`${base}/speak/sign`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${key}` },
    body: JSON.stringify({ text, scope: SCOPE, id, lang }),
  })
  if (!res.ok) {
    console.error(`[lecture] vvaves sign failed: ${res.status}`)
    return null
  }
  const body = (await res.json()) as { url?: string }
  return body.url ?? null
}
