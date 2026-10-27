import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/webhooks/lungor')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { verifierLivraison, emailDuDonateur, envoyerMerci } =
          await import('@/server/don-webhook')

        const body = await request.text()
        const delivery = verifierLivraison(
          process.env.LUNGOR_WEBHOOK_SECRET ?? '',
          request.headers,
          body,
        )
        if (!delivery) return new Response('invalid signature', { status: 401 })

        const email = emailDuDonateur(delivery)
        if (!email) return new Response(null, { status: 204 })

        try {
          await envoyerMerci(email, delivery.sourceEventID)
        } catch (err) {
          console.error('don thank-you mail failed', err)
          // A non-2xx makes Lungor retry the delivery.
          return new Response('mail failed', { status: 502 })
        }
        return new Response(null, { status: 204 })
      },
    },
  },
})
