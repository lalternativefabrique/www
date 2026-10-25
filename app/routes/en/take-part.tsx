import { createFileRoute } from '@tanstack/react-router'
import { ParticiperPage } from '@/components/ParticiperPage'
import { seo } from '@/lib/seo'
import { lireBesoins } from '@/server/couts'

export const Route = createFileRoute('/en/take-part')({
  loader: () => lireBesoins({ data: { lang: 'en' } }),
  component: Page,
  head: () =>
    seo({
      title: "Take part — L'Alternative Fabrique",
      description:
        "Contribute to L'Alternative Fabrique: financially, to cover the published costs of the applications, or through occasional advice and expertise, freely chosen.",
      path: '/en/take-part',
      alternate: { fr: '/participer', en: '/en/take-part' },
    }),
})

function Page() {
  return <ParticiperPage besoins={Route.useLoaderData()} lang="en" />
}
