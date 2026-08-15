import { Link, createFileRoute } from '@tanstack/react-router'
import { AdminKpi } from '@lalternative/admin'
import { listApplications, listSubscribers } from '@/server/admin-data'
import { listArticleRows } from '@/server/admin-data'

export const Route = createFileRoute('/admin/_authed/')({
  component: Dashboard,
  loader: async () => {
    const [applications, subscribers, articles] = await Promise.all([
      listApplications(),
      listSubscribers(),
      listArticleRows(),
    ])

    return {
      pending: applications.filter((a) => a.status === 'pending').length,
      applications: applications.length,
      subscribers: subscribers.filter((s) => !s.unsubscribedAt).length,
      articles: articles.length,
    }
  },
})

function Dashboard() {
  const stats = Route.useLoaderData()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Tableau de bord</h1>
        <p className="mt-1 text-sm text-white/50">
          La revue, les candidatures et les inscriptions.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AdminKpi label="Candidatures à lire" value={stats.pending} />
        <AdminKpi label="Candidatures reçues" value={stats.applications} />
        <AdminKpi label="Inscrits à la revue" value={stats.subscribers} />
        <AdminKpi label="Articles publiés" value={stats.articles} />
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          to="/admin/articles/nouveau"
          className="rounded-md bg-white px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-white/90"
        >
          Publier un article
        </Link>
        <Link
          to="/admin/candidatures"
          className="rounded-md border border-white/20 px-4 py-2 text-sm text-white hover:bg-white/10"
        >
          Lire les candidatures
        </Link>
      </div>
    </div>
  )
}
