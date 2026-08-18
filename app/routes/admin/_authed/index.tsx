import { Link, createFileRoute } from '@tanstack/react-router'
import { AdminKpi } from '@lalternative/admin'
import { adminCounts } from '@/server/admin-data'

export const Route = createFileRoute('/admin/_authed/')({
  component: Dashboard,
  loader: () => adminCounts(),
})

function Dashboard() {
  const stats = Route.useLoaderData()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Tableau de bord</h1>
        <p className="mt-1 text-sm text-muted-foreground">
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
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Publier un article
        </Link>
        <Link
          to="/admin/personnes"
          className="rounded-md border border-border px-4 py-2 text-sm text-foreground hover:bg-muted"
        >
          Lire les candidatures
        </Link>
      </div>
    </div>
  )
}
