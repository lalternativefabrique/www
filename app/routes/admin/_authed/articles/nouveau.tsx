import { createFileRoute } from '@tanstack/react-router'
import { EditeurArticle } from '@/components/admin/EditeurArticle'

export const Route = createFileRoute('/admin/_authed/articles/nouveau')({
  component: () => <EditeurArticle />,
})
