/**
 * The suite's chat service, which holds the comments under every article
 * (messag ADR 0016). This module is server-only: it carries the service
 * credentials and calls the tenant surface, which the browser never reaches.
 *
 * Nothing here is on an article's render path. The public page asks for a
 * room id after hydration and the reader's browser reads the posts itself
 * through the proxy under /api/chat.
 */

export type Locale = 'fr' | 'en'

export type ChatPost = {
  room: string
  seq: number
  parent_seq?: number
  sender_sub: string
  sender_uri: string
  sender_handle: string
  body: string
  status: 'published' | 'pending'
  author: 'person' | 'agent' | 'system'
  imported: boolean
  created_at: string
}

export type ChatRoom = {
  id: string
  uri: string
  tenant: string
  subject?: { kind: string; id: string }
  policy: string
  moderated: boolean
  mode: string
  title: string
  last_seq: number
  created_at: string
}

export type PendingPost = ChatPost & {
  room_subject?: { kind: string; id: string }
  room_title?: string
}

export type PendingPage = { posts: PendingPost[]; next?: string }

const url = process.env.CHAT_URL?.replace(/\/$/, '')
const clientId = process.env.CHAT_CLIENT_ID ?? 'www-core'
const clientSecret = process.env.CHAT_CLIENT_SECRET
const issuer = (process.env.OIDC_ISSUER_URL ?? 'https://id.urbangate.dev').replace(
  /\/$/,
  '',
)

/** The public reads need only the URL; the tenant surface needs the secret too. */
export const chatConfigured = Boolean(url)
export const chatTenantConfigured = Boolean(url && clientSecret)

export function chatUrl(): string {
  if (!url) throw new Error('CHAT_URL is not set.')
  return url
}

export class ChatError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message)
    this.name = 'ChatError'
  }
}

let serviceToken: { value: string; expires: number } | undefined

// Renewed this long before it expires, so a request in flight never carries a
// token that lapses on the way.
const RENEW_MARGIN_MS = 30_000

async function token(): Promise<string> {
  if (!clientSecret) throw new Error('CHAT_CLIENT_SECRET is not set.')
  if (serviceToken && Date.now() + RENEW_MARGIN_MS < serviceToken.expires) {
    return serviceToken.value
  }

  const form = new URLSearchParams({
    grant_type: 'client_credentials',
    audience: 'chat',
  })
  const res = await fetch(`${issuer}/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(
        `${encodeURIComponent(clientId)}:${encodeURIComponent(clientSecret)}`,
      ).toString('base64')}`,
    },
    body: form,
    signal: AbortSignal.timeout(10_000),
  })
  if (!res.ok) {
    throw new ChatError(res.status, `token endpoint answered ${res.status}`)
  }
  const body = (await res.json()) as { access_token: string; expires_in: number }
  serviceToken = {
    value: body.access_token,
    expires: Date.now() + body.expires_in * 1000,
  }
  return body.access_token
}

async function tenant<T>(
  method: 'GET' | 'POST' | 'PUT',
  path: string,
  body?: unknown,
): Promise<T> {
  const res = await fetch(`${chatUrl()}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${await token()}`,
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(10_000),
  })
  const text = await res.text()
  if (!res.ok) {
    let message = text
    try {
      message = (JSON.parse(text) as { message?: string }).message ?? text
    } catch {
      // Not JSON: the raw body is the message.
    }
    throw new ChatError(res.status, message || `chat answered ${res.status}`)
  }
  return (text ? JSON.parse(text) : undefined) as T
}

/** `article/<dir>:<locale>`: one thread per language, since a reader of the English page should not land in a French discussion. */
export const subjectId = (dir: string, locale: Locale) => `${dir}:${locale}`

const rooms = new Map<string, Promise<ChatRoom>>()

/**
 * The room under an article, created on first call and idempotent afterwards.
 * Cached for the process' life: a room is never deleted from here, and the id
 * is all the public page needs.
 */
export function ensureArticleRoom(
  dir: string,
  locale: Locale,
  title: string,
): Promise<ChatRoom> {
  const key = subjectId(dir, locale)
  let pending = rooms.get(key)
  if (!pending) {
    pending = tenant<ChatRoom>(
      'PUT',
      `/v1/tenant/subjects/article/${encodeURIComponent(key)}/room`,
      { policy: 'public', moderated: true, mode: 'standard', title },
    ).catch((err: unknown) => {
      rooms.delete(key)
      throw err
    })
    rooms.set(key, pending)
  }
  return pending
}

export function listPendingPosts(cursor?: string): Promise<PendingPage> {
  const qs = new URLSearchParams({ status: 'pending', limit: '100' })
  if (cursor) qs.set('cursor', cursor)
  return tenant<PendingPage>('GET', `/v1/tenant/posts?${qs}`)
}

export function moderatePost(
  room: string,
  seq: number,
  decision: 'approve' | 'reject',
): Promise<void> {
  return tenant<void>(
    'POST',
    `/v1/tenant/rooms/${encodeURIComponent(room)}/posts/${seq}/${decision}`,
  )
}
