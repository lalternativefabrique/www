import { createFileRoute } from '@tanstack/react-router'
import { LitteraturePage } from '@/components/Litterature'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/en/literature')({
  component: () => <LitteraturePage locale="en" />,
  head: () =>
    seo({
      title: "Technical literature — L'Alternative Fabrique",
      description:
        "The standards and technical sources the Fabrique builds its applications on: agent memory, protocols, authorization, identity.",
      path: '/en/literature',
      alternate: { fr: '/litterature', en: '/en/literature' },
    }),
})
