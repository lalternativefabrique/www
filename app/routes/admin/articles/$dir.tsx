import { createFileRoute } from '@tanstack/react-router'
import { EditeurArticle } from '@/components/admin/EditeurArticle'
import { readArticleSources } from '@/server/admin-data'

export const Route = createFileRoute('/admin/articles/$dir')({
  component: Modifier,
  loader: ({ params }) => readArticleSources({ data: { dir: params.dir } }),
})

function Modifier() {
  const { dir } = Route.useParams()
  const sources = Route.useLoaderData()

  return <EditeurArticle dir={dir} fr={sources.fr} en={sources.en} />
}
