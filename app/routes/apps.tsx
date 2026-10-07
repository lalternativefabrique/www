import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/apps')({
  beforeLoad: () => {
    throw redirect({ to: '/', hash: 'piliers', statusCode: 301 })
  },
})
