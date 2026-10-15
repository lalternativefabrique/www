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
        "Une organisation partagée, où l'on entre par ce que l'on peut donner : de l'argent pour couvrir nos besoins financiers, ou son métier pour tenir une fonction.",
      path: '/participer',
      alternate: { fr: '/participer', en: '/en/take-part' },
    }),
})

function Page() {
  return <ParticiperPage besoins={Route.useLoaderData()} lang="fr" />
}
