import { createFileRoute } from '@tanstack/react-router'
import { ParticiperPage } from '@/components/ParticiperPage'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/en/take-part')({
  component: () => <ParticiperPage lang="en" />,
  head: () =>
    seo({
      title: "Take part — L'Alternative Fabrique",
      description:
        'A shared organisation you enter by what you can give: money to cover our financial needs, or your trade to hold a function.',
      path: '/en/take-part',
      alternate: { fr: '/participer', en: '/en/take-part' },
    }),
})
