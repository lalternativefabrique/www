import { createServerFn } from '@tanstack/react-start'

export type LectureSignee = {
  url: string
  text: string
  scope: string
  id: string
  lang: 'fr' | 'en'
}

const SCOPE = 'www-article'
const CUSTOMER_KEY_PREFIX = 'vvaves_key_'

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

    const url = key.startsWith(CUSTOMER_KEY_PREFIX)
      ? await signerParVvaves(base, key, text, id, data.lang)
      : await signerLocalement(process.env.VVAVES_PUBLIC_URL ?? base, key, text, id)
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
    headers: { 'content-type': 'application/json', 'x-vvaves-key': key },
    body: JSON.stringify({ text, scope: SCOPE, id, lang }),
  })
  if (!res.ok) {
    console.error(`[lecture] vvaves sign failed: ${res.status}`)
    return null
  }
  const body = (await res.json()) as { url?: string }
  return body.url ?? null
}

async function signerLocalement(
  publicUrl: string,
  key: string,
  text: string,
  id: string,
): Promise<string> {
  const { createHash, createHmac } = await import('node:crypto')
  const issuer = process.env.WWW_VVAVES_ISSUER ?? 'www'
  const expires = Math.floor(Date.now() / 1000) + 30 * 60
  const signingKey = createHmac('sha256', key).update('vvaves/sign/v1').digest()
  const fields = [
    `scope=${SCOPE}`,
    `id=${id}`,
    `text=${createHash('sha256').update(text, 'utf8').digest('hex')}`,
    `exp=${expires}`,
  ].sort()
  const sig = createHmac('sha256', signingKey).update(fields.join('\n')).digest('base64url')
  const q = new URLSearchParams({ exp: String(expires), iss: issuer, sig })
  return `${publicUrl.replace(/\/+$/, '')}/speak?${q.toString()}`
}
