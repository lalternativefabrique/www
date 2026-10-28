import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/indexnow-key.txt')({
  server: {
    handlers: {
      GET: () => {
        const key = process.env.INDEXNOW_KEY
        if (!key) return new Response('Not Found', { status: 404 })
        return new Response(key, {
          headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        })
      },
    },
  },
})
