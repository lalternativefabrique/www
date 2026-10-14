import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'

/**
 * The comment room under an article, and the guest form.
 *
 * Both are called from the browser after hydration, never from the route
 * loader: the article renders whether or not the chat service answers, which
 * is the rule docs/adr/0001-articles-from-bucket-ssr-blog-admin.md set for
 * the database. Resolving the slug here keeps the bucket directory out of the
 * client, and the guest post goes through this server because only it holds
 * the tenant key.
 */

type Lang = 'fr' | 'en'

async function roomFor(slug: string, lang: Lang) {
  const { chatTenantConfigured, ensureArticleRoom } = await import('./chat-service')
  if (!chatTenantConfigured) return undefined

  const { findBySlug, findEnBySlug } = await import('./articles-store')
  const fr = lang === 'en' ? await findEnBySlug(slug) : await findBySlug(slug)
  if (!fr || fr.commentaires === false) return undefined
  if (lang === 'en' && !fr.en) return undefined

  try {
    return await ensureArticleRoom(
      fr.dir,
      lang,
      lang === 'en' ? fr.en!.titre : fr.titre,
    )
  } catch (err) {
    console.error('[comments] room for', fr.dir, lang, err)
    return undefined
  }
}

/** Where a commenter is invited to open a Messag account, the suite's mail. */
const SIGNUP_URL = process.env.MESSAG_SIGNUP_URL ?? 'https://messag.eco/register'

export const commentsRoom = createServerFn({ method: 'GET' })
  .inputValidator((d: { slug: string; lang: Lang }) => d)
  .handler(
    async ({ data }): Promise<{ room: string; signup: string } | undefined> => {
      const room = await roomFor(data.slug, data.lang)
      return room ? { room: room.id, signup: SIGNUP_URL } : undefined
    },
  )

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function normalizeEmail(raw: string): string {
  const email = raw.trim().toLowerCase()
  // 254 is the maximum length of an address per RFC 5321.
  if (email.length > 254 || !EMAIL.test(email)) return ''
  return email
}

const MAX_NAME = 120

const ANONYMOUS: Record<Lang, string> = { fr: 'Anonyme', en: 'Anonymous' }
const MAX_BODY = 8000

// A form filled faster than this was not filled by a person.
const MIN_FILL_MS = 3_000

// Per address, over a sliding window: enough for a conversation, not for a
// script. The window lives in this process, which is one replica.
const WINDOW_MS = 10 * 60_000
const MAX_PER_WINDOW = 5

const recent = new Map<string, number[]>()

function tooMany(ip: string): boolean {
  const now = Date.now()
  const stamps = (recent.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  if (stamps.length >= MAX_PER_WINDOW) return true
  stamps.push(now)
  recent.set(ip, stamps)
  if (recent.size > 10_000) recent.clear()
  return false
}

function clientIp(): string {
  try {
    const h = getRequest().headers
    return (
      h.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      h.get('x-real-ip') ||
      'unknown'
    )
  } catch {
    return 'unknown'
  }
}

export type GuestPostInput = {
  slug: string
  lang: Lang
  /** Shown beside the comment; empty means the person chose not to sign. */
  name?: string
  /** Required: the collective must be able to answer the person. Never shown. */
  email: string
  body: string
  /** Honeypot: a person never sees the field, a bot fills it. */
  website?: string
  /** When the form was shown, from Date.now() in the browser. */
  startedAt?: number
}

export type GuestPostResult =
  | { ok: true; seq: number; name: string; body: string; createdAt: string }
  | {
      ok: false
      reason: 'invalid-email' | 'missing-body' | 'unavailable' | 'rejected'
    }

export const postGuestComment = createServerFn({ method: 'POST' })
  .inputValidator((d: GuestPostInput) => d)
  .handler(async ({ data }): Promise<GuestPostResult> => {
    const name = (data.name ?? '').trim().slice(0, MAX_NAME) || ANONYMOUS[data.lang]
    const body = data.body.trim().slice(0, MAX_BODY)
    const email = normalizeEmail(data.email)
    if (!email) return { ok: false, reason: 'invalid-email' }
    if (!body) return { ok: false, reason: 'missing-body' }

    // A bot gets the same answer as a person, and nothing is stored: refusing
    // out loud would only tell it which check to pass next time.
    const bot =
      Boolean(data.website) ||
      (data.startedAt !== undefined && Date.now() - data.startedAt < MIN_FILL_MS) ||
      tooMany(clientIp())
    if (bot) {
      return { ok: true, seq: 0, name, body, createdAt: new Date().toISOString() }
    }

    const room = await roomFor(data.slug, data.lang)
    if (!room) return { ok: false, reason: 'unavailable' }

    try {
      const { postGuestComment: post } = await import('./chat-service')
      const created = await post(room.id, name, email, body)
      return {
        ok: true,
        seq: created.seq,
        name: created.sender_handle,
        body: created.body,
        createdAt: created.created_at,
      }
    } catch (err) {
      console.error('[comments] guest post on', room.id, err)
      return { ok: false, reason: 'rejected' }
    }
  })
