import { createFileRoute } from '@tanstack/react-router'

/**
 * Illustrations uploaded through the admin.
 *
 * The ones committed to the repo are served straight off disk by server.js,
 * which never reaches this route. Anything published later lives only in the
 * bucket — without this it would 404 in the article that references it.
 */
export const Route = createFileRoute('/images/articles/$file')({
  server: {
    handlers: {
      GET: async ({ params }) => {
        // The name becomes a bucket key: a path separator here would reach
        // outside the images prefix.
        if (!/^[A-Za-z0-9._-]+$/.test(params.file) || params.file.includes('..')) {
          return new Response('Not found', { status: 404 })
        }

        const { getObjectBytes, bucketConfigured } = await import(
          '@/server/bucket'
        )
        // No bucket means no uploaded image can exist, and the ones in the repo
        // were already served from disk before this route was reached.
        if (!bucketConfigured) return new Response('Not found', { status: 404 })

        const bytes = await getObjectBytes(`images/articles/${params.file}`)
        if (!bytes) return new Response('Not found', { status: 404 })

        return new Response(bytes.slice().buffer as ArrayBuffer, {
          headers: {
            'Content-Type': mimeOf(params.file),
            // Published images are replaced by uploading a new name, so the
            // bytes behind one never change.
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        })
      },
    },
  },
})

function mimeOf(name: string): string {
  if (name.endsWith('.png')) return 'image/png'
  if (name.endsWith('.webp')) return 'image/webp'
  if (name.endsWith('.avif')) return 'image/avif'
  if (name.endsWith('.svg')) return 'image/svg+xml'
  return 'image/jpeg'
}
