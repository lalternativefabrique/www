import { createFileRoute } from '@tanstack/react-router'
import { LitteraturePage } from '@/components/Litterature'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/litterature')({
  component: () => <LitteraturePage locale="fr" />,
  head: () =>
    seo({
      title: "Littérature technique — L'Alternative Fabrique",
      description:
        "Les standards et les sources techniques sur lesquels la Fabrique construit ses applications : mémoire des agents, protocoles, autorisations, identité.",
      path: '/litterature',
      alternate: { fr: '/litterature', en: '/en/literature' },
    }),
})
