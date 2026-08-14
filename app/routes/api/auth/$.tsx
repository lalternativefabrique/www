import { createFileRoute } from '@tanstack/react-router'

/**
 * Better Auth's own endpoints, mounted under /api/auth/*.
 *
 * The splat matters: sign-in, sign-out, session, verification and the admin
 * plugin each answer on their own path below this one.
 */
export const Route = createFileRoute('/api/auth/$')({
  server: {
    handlers: {
      ANY: async ({ request }) => {
        const { auth } = await import('@/server/auth')
        return auth().handler(request)
      },
    },
  },
})
