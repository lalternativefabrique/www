import { createFileRoute } from '@tanstack/react-router'
import { CoutsPage } from '@/components/CoutsPage'
import { moisValide } from '@/lib/couts'
import { seo } from '@/lib/seo'
import { lireCouts } from '@/server/couts'

export const Route = createFileRoute('/en/costs')({
  validateSearch: (search: Record<string, unknown>): { mois?: string } => ({
    mois: moisValide(search.mois),
  }),
  loaderDeps: ({ search }) => ({ mois: search.mois }),
  loader: ({ deps }) => lireCouts({ data: { mois: deps.mois } }),
  component: Page,
  head: () =>
    seo({
      title: "What our apps cost — L'Alternative Fabrique",
      description:
        "Each month, what the Fabrique spends to run its apps: catalogue services, language models, and the total per app.",
      path: '/en/costs',
      alternate: { fr: '/couts', en: '/en/costs' },
    }),
})

function Page() {
  return <CoutsPage couts={Route.useLoaderData()} lang="en" />
}
