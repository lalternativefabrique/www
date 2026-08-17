import { createFileRoute } from '@tanstack/react-router'

/**
 * The spoken version of an article, served from the bucket.
 *
 * Range requests are answered because iOS Safari makes one before it will play
 * a media file at all, and because a Content-Length is what lets any browser
 * know the duration: without it playback stops at the first frame boundary,
 * partway through, with nothing reported as wrong.
 */
export const Route = createFileRoute('/audio/articles/$dir/$file')({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        // Both become a bucket key: a separator here would reach outside the
        // audio prefix.
        if (!safe(params.dir) || !safe(params.file)) {
          return new Response('Not found', { status: 404 })
        }
        if (!params.file.endsWith('.mp3')) {
          return new Response('Not found', { status: 404 })
        }

        const { getObjectBytes, bucketConfigured } = await import(
          '@/server/bucket'
        )
        if (!bucketConfigured) return new Response('Not found', { status: 404 })

        const bytes = await getObjectBytes(
          `audio/articles/${params.dir}/${params.file}`,
        )
        if (!bytes) return new Response('Not found', { status: 404 })

        const total = bytes.byteLength
        const headers: Record<string, string> = {
          'Content-Type': 'audio/mpeg',
          'Accept-Ranges': 'bytes',
          // The file name carries a hash of what was read, so these bytes never
          // change: a corrected article is served under a different name.
          'Cache-Control': 'public, max-age=31536000, immutable',
        }

        const range = parseRange(request.headers.get('range'), total)
        if (range === 'unsatisfiable') {
          return new Response(null, {
            status: 416,
            headers: { ...headers, 'Content-Range': `bytes */${total}` },
          })
        }

        if (range) {
          const part = bytes.slice(range.start, range.end + 1)
          return new Response(part.slice().buffer as ArrayBuffer, {
            status: 206,
            headers: {
              ...headers,
              'Content-Range': `bytes ${range.start}-${range.end}/${total}`,
              'Content-Length': String(part.byteLength),
            },
          })
        }

        return new Response(bytes.slice().buffer as ArrayBuffer, {
          headers: { ...headers, 'Content-Length': String(total) },
        })
      },
    },
  },
})

function safe(segment: string): boolean {
  return /^[A-Za-z0-9._-]+$/.test(segment) && !segment.includes('..')
}

type Range = { start: number; end: number }

/**
 * A single byte range, which is all a media element asks for. Multipart ranges
 * are legal and unused here; an unparseable header is ignored rather than
 * refused, which serves the whole file — always a valid answer.
 */
function parseRange(
  header: string | null,
  total: number,
): Range | 'unsatisfiable' | undefined {
  if (!header) return undefined

  const match = /^bytes=(\d*)-(\d*)$/.exec(header.trim())
  if (!match) return undefined

  const [, rawStart, rawEnd] = match
  if (rawStart === '' && rawEnd === '') return undefined

  // A suffix range: the last N bytes.
  if (rawStart === '') {
    const length = Number(rawEnd)
    if (length === 0) return 'unsatisfiable'
    return { start: Math.max(0, total - length), end: total - 1 }
  }

  const start = Number(rawStart)
  if (start >= total) return 'unsatisfiable'

  const end = rawEnd === '' ? total - 1 : Math.min(Number(rawEnd), total - 1)
  if (end < start) return 'unsatisfiable'

  return { start, end }
}
