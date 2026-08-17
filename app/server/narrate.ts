import { createServerFn } from '@tanstack/react-start'

/**
 * Narrating an article from the admin.
 *
 * Reading a piece aloud takes minutes, which is longer than a request should
 * hold. The call starts the reading and returns; the screen asks for the state
 * again to find out how it went. Publishing never waits on any of this — an
 * article is live the moment its sources are in the bucket, narrated or not.
 *
 * The same work is available offline as tools/narrate, which is what a bulk or
 * scheduled run should use. This exists so a single piece can be narrated and
 * listened to from the screen that publishes it.
 */

export type NarrationState = {
  lang: 'fr' | 'en'
  /** Absent when the article has no source in this language. */
  exists: boolean
  /** The audio in the bucket is the reading of the text as it stands. */
  current: boolean
  /** Playable now, whether or not it is current. */
  src?: string
  running: boolean
  error?: string
}

type Running = { startedAt: number; error?: string }

/**
 * In-flight readings, keyed by article and language.
 *
 * Process-local, which is what the admin needs and no more: a second replica
 * would not see this one's work, and the worst that follows is a reading done
 * twice — the key is the text's hash, so both write the same bytes to the same
 * place. An entry is kept after it fails, so the screen can report why.
 */
const running = new Map<string, Running>()

/** Readings older than this are treated as dead, not in flight. */
const STALE_MS = 15 * 60_000

export const articleNarration = createServerFn({ method: 'GET' })
  .inputValidator((d: { dir: string }) => d)
  .handler(async ({ data }): Promise<NarrationState[]> => {
    const { requireAdmin } = await import('./admin-guard')
    if (!(await requireAdmin())) return []

    return Promise.all(
      (['fr', 'en'] as const).map((lang) => stateOf(data.dir, lang)),
    )
  })

export const narrateArticle = createServerFn({ method: 'POST' })
  .inputValidator((d: { dir: string; lang: 'fr' | 'en' }) => d)
  .handler(async ({ data }): Promise<{ ok: boolean; reason?: string }> => {
    const { requireAdmin } = await import('./admin-guard')
    if (!(await requireAdmin())) return { ok: false, reason: 'forbidden' }

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.dir)) {
      return { ok: false, reason: 'invalid-dir' }
    }

    const { ttsConfigured } = await import('./tts')
    if (!ttsConfigured) return { ok: false, reason: 'tts-not-configured' }

    const key = `${data.dir}:${data.lang}`
    const active = running.get(key)
    if (active && !active.error && Date.now() - active.startedAt < STALE_MS) {
      return { ok: false, reason: 'already-running' }
    }

    const text = await narrationText(data.dir, data.lang)
    if (!text) return { ok: false, reason: 'no-source' }

    running.set(key, { startedAt: Date.now() })

    // Deliberately not awaited: the reading outlives this request, and the
    // screen polls for the outcome. A rejection is recorded rather than thrown,
    // since nothing is left to catch it.
    void read(data.dir, data.lang, text, key)

    return { ok: true }
  })

async function read(
  dir: string,
  lang: 'fr' | 'en',
  text: string,
  key: string,
): Promise<void> {
  try {
    const { speak } = await import('./tts')
    const { audioKey } = await import('./article-audio')
    const { putObject, deleteObject, listKeys } = await import('./bucket')

    const target = audioKey(dir, lang, text)
    const before = await listKeys(`audio/articles/${dir}/${lang}-`)

    const audio = await speak(text, lang)
    await putObject(target, audio, 'audio/mpeg')

    // The earlier readings are what a listener would still be served from a
    // page rendered before this one landed.
    for (const old of before) {
      if (old !== target) await deleteObject(old).catch(() => {})
    }

    running.delete(key)
  } catch (err) {
    running.set(key, {
      startedAt: running.get(key)?.startedAt ?? Date.now(),
      error: err instanceof Error ? err.message : String(err),
    })
  }
}

async function stateOf(
  dir: string,
  lang: 'fr' | 'en',
): Promise<NarrationState> {
  const active = running.get(`${dir}:${lang}`)
  const text = await narrationText(dir, lang)
  if (!text) {
    return { lang, exists: false, current: false, running: false }
  }

  const { findAudio, audioKey, audioUrl } = await import('./article-audio')
  const found = await findAudio(dir, lang)

  return {
    lang,
    exists: true,
    current: found === audioKey(dir, lang, text),
    src: found ? audioUrl(found) : undefined,
    running: Boolean(active && !active.error),
    error: active?.error,
  }
}

/**
 * What the voice would read for this article, or undefined when there is no
 * source in that language.
 *
 * Rendering the body the way the page does, so the audio matches what a reader
 * sees rather than a second interpretation of the same MDX.
 */
async function narrationText(
  dir: string,
  lang: 'fr' | 'en',
): Promise<string | undefined> {
  const { loadArticles } = await import('./articles-store')
  const article = (await loadArticles()).find((a) => a.dir === dir)
  if (!article) return undefined

  const translated = lang === 'en' ? article.en : undefined
  if (lang === 'en' && !translated) return undefined

  const { createElement } = await import('react')
  const { renderToStaticMarkup } = await import('react-dom/server')
  const { MdxProse } = await import('@/components/MdxProse')
  const { narrationOf } = await import('./narration')

  const html = renderToStaticMarkup(
    createElement(MdxProse, {
      corps: translated?.corps ?? article.corps,
      lang,
    }),
  )

  return narrationOf({
    titre: translated?.titre ?? article.titre,
    chapeau: translated?.chapeau ?? article.chapeau,
    html,
  }).text
}
