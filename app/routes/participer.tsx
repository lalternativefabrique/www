import { createFileRoute } from '@tanstack/react-router'
import { ParticiperPage } from '@/components/ParticiperPage'
import { seo } from '@/lib/seo'
import { lireBesoins } from '@/server/couts'

export const Route = createFileRoute('/participer')({
  loader: () => lireBesoins({ data: { lang: 'fr' } }),
  component: Page,
  head: () =>
    seo({
      title: "Participer — L'Alternative Fabrique",
      description:
        "Contribuer à L'Alternative Fabrique : financièrement, pour couvrir les coûts publiés des applications, ou par un conseil et une expertise ponctuels, librement choisis.",
      path: '/participer',
      alternate: { fr: '/participer', en: '/en/take-part' },
    }),
})

function Page() {
  return <ParticiperPage besoins={Route.useLoaderData()} lang="fr" />
}
