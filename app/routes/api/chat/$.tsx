import { createFileRoute } from '@tanstack/react-router'

/**
 * Relays the reader's calls to the chat service, under /api/chat/*.
 *
 * Only the rooms surface passes: the tenant surface is the server's, and
 * stays behind the service token in chat-service.ts. A signed-in reader's
 * urbangate token is attached here, so the browser never holds it.
 */
const ALLOWED = /^\/v1\/rooms\/[0-9a-f-]{36}\/posts(\/\d+)?$/

async function relay(request: Request): Promise<Response> {
  const { chatConfigured, chatUrl } = await import('@/server/chat-service')
  if (!chatConfigured) return new Response(null, { status: 404 })

  const incoming = new URL(request.url)
  const path = incoming.pathname.replace(/^\/api\/chat/, '')
  if (!ALLOWED.test(path)) return new Response(null, { status: 404 })

  const { readerAccessToken } = await import('@/server/reader-token')
  const token = await readerAccessToken(request)

  const headers = new Headers()
  const type = request.headers.get('content-type')
  if (type) headers.set('content-type', type)
  if (token) headers.set('authorization', `Bearer ${token}`)

  const upstream = await fetch(`${chatUrl()}${path}${incoming.search}`, {
    method: request.method,
    headers,
    body: request.method === 'GET' ? undefined : await request.text(),
    signal: AbortSignal.timeout(15_000),
  })

  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      'content-type': upstream.headers.get('content-type') ?? 'application/json',
      'cache-control': 'no-store',
    },
  })
}

export const Route = createFileRoute('/api/chat/$')({
  server: {
    handlers: {
      GET: ({ request }) => relay(request),
      POST: ({ request }) => relay(request),
    },
  },
})
