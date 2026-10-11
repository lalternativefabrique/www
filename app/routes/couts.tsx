import { createFileRoute } from '@tanstack/react-router'
import { CoutsPage } from '@/components/CoutsPage'
import { moisValide } from '@/lib/couts'
import { seo } from '@/lib/seo'
import { lireCouts } from '@/server/couts'

export const Route = createFileRoute('/couts')({
  validateSearch: (search: Record<string, unknown>): { mois?: string } => ({
    mois: moisValide(search.mois),
  }),
  loaderDeps: ({ search }) => ({ mois: search.mois }),
  loader: ({ deps }) => lireCouts({ data: { mois: deps.mois } }),
  component: Page,
  head: () =>
    seo({
      title: "Ce que coûtent nos applications — L'Alternative Fabrique",
      description:
        "Chaque mois, ce que la Fabrique dépense pour faire tourner ses applications : catalogue, modèles de langage, total par application.",
      path: '/couts',
      alternate: { fr: '/couts', en: '/en/costs' },
    }),
})

function Page() {
  return <CoutsPage couts={Route.useLoaderData()} lang="fr" />
}
