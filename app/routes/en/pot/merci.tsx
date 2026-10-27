import { createFileRoute } from '@tanstack/react-router'
import { MerciDon } from '@/components/MerciDon'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/en/pot/merci')({
  component: ThanksPage,
  head: () =>
    seo({
      title: "Contribution recorded — L'Alternative Fabrique",
      description: 'Your contribution to the project is recorded.',
      path: '/en/pot/merci',
      locale: 'en',
      noindex: true,
    }),
})

function ThanksPage() {
  return <MerciDon locale="en" />
}
