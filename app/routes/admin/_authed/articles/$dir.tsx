import { createFileRoute } from '@tanstack/react-router'
import { EditeurArticle } from '@/components/admin/EditeurArticle'
import { LectureAudioAdmin } from '@/components/admin/LectureAudioAdmin'
import { readArticleSources } from '@/server/admin-data'

export const Route = createFileRoute('/admin/_authed/articles/$dir')({
  component: Modifier,
  loader: ({ params }) => readArticleSources({ data: { dir: params.dir } }),
})

function Modifier() {
  const { dir } = Route.useParams()
  const sources = Route.useLoaderData()

  return (
    <div className="space-y-6">
      <EditeurArticle dir={dir} fr={sources.fr} en={sources.en} />
      <LectureAudioAdmin dir={dir} />
    </div>
  )
}
