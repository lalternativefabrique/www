import { createFileRoute } from '@tanstack/react-router'
import { ParticiperPage } from '@/components/ParticiperPage'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/participer')({
  component: () => <ParticiperPage lang="fr" />,
  head: () =>
    seo({
      title: "Participer — L'Alternative Fabrique",
      description:
        "Une organisation partagée, où l'on entre par ce que l'on peut donner : de l'argent pour couvrir nos besoins financiers, ou son métier pour tenir une fonction.",
      path: '/participer',
      alternate: { fr: '/participer', en: '/en/take-part' },
    }),
})
