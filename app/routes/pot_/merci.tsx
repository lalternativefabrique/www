import { createFileRoute } from '@tanstack/react-router'
import { MerciDon } from '@/components/MerciDon'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/pot_/merci')({
  component: MerciPage,
  head: () =>
    seo({
      title: "Contribution enregistrée — L'Alternative Fabrique",
      description: 'Votre contribution au projet est enregistrée.',
      path: '/pot/merci',
      noindex: true,
    }),
})

function MerciPage() {
  return <MerciDon locale="fr" />
}
