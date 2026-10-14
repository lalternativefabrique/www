/**
 * The suite's chat service, which holds the comments under every article
 * (messag ADR 0016). This module is server-only: it carries the tenant's app
 * key and calls the tenant surface, which the browser never reaches.
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
  subject?: { kind: string; id: string }
}

const url = process.env.CHAT_URL?.replace(/\/$/, '')
const key = process.env.CHAT_KEY

/** The public reads need only the URL; the tenant surface needs the app key too. */
export const chatConfigured = Boolean(url)
export const chatTenantConfigured = Boolean(url && key)

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

async function tenant<T>(
  method: 'GET' | 'POST' | 'PUT',
  path: string,
  body?: unknown,
): Promise<T> {
  if (!key) throw new Error('CHAT_KEY is not set.')
  const res = await fetch(`${chatUrl()}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${key}`,
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

/**
 * `article/<dir>:<locale>`: one thread per language, since a reader of the
 * English page should not land in a French discussion. Sent raw: the chat
 * stores the path segment as received, and the admin splits it on the colon.
 */
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
      `/v1/tenant/subjects/article/${key}/room`,
      { policy: 'public', moderated: true, mode: 'standard', title, guests: true },
    ).catch((err: unknown) => {
      rooms.delete(key)
      throw err
    })
    rooms.set(key, pending)
  }
  return pending
}

const PENDING_PAGE = 200

/** Newest first; `before` is the created_at of the last post of the previous page. */
export function listPendingPosts(before?: string): Promise<PendingPost[]> {
  const qs = new URLSearchParams({ status: 'pending', limit: String(PENDING_PAGE) })
  if (before) qs.set('before', before)
  return tenant<PendingPost[]>('GET', `/v1/tenant/posts?${qs}`)
}

export const pendingPageFull = (page: PendingPost[]) => page.length === PENDING_PAGE

/** A comment left without an account: the chat holds it pending under the given name. */
export function postGuestComment(
  room: string,
  name: string,
  body: string,
): Promise<ChatPost> {
  return tenant<ChatPost>(
    'POST',
    `/v1/tenant/rooms/${encodeURIComponent(room)}/posts`,
    { author: 'guest', name, body },
  )
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
