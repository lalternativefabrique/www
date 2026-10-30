import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/en/apps')({
  beforeLoad: () => {
    throw redirect({ to: '/en/outils', statusCode: 301 })
  },
})
