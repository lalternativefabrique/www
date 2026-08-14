import { Link, createFileRoute } from '@tanstack/react-router'
import { listArticleRows } from '@/server/admin-data'

export const Route = createFileRoute('/admin/articles/')({
  component: Articles,
  loader: () => listArticleRows(),
})

function Articles() {
  const articles = Route.useLoaderData()

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-white">Articles</h1>
          <p className="mt-1 text-sm text-white/50">
            Ce que le site sert en ce moment. Publier écrit dans le bucket : pas
            de build, pas de déploiement.
          </p>
        </div>
        <Link
          to="/admin/articles/nouveau"
          className="rounded-md bg-white px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-white/90"
        >
          Publier un article
        </Link>
      </div>

      {articles.length === 0 ? (
        <p className="text-sm text-white/50">Aucun article publié.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/10 bg-white/5 text-white/60">
              <tr>
                <th className="px-4 py-2.5 font-medium">Titre</th>
                <th className="px-4 py-2.5 font-medium">Organe</th>
                <th className="px-4 py-2.5 font-medium">Date</th>
                <th className="px-4 py-2.5 font-medium">EN</th>
                <th className="px-4 py-2.5 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {articles.map((a) => (
                <tr
                  key={a.slug}
                  className="border-b border-white/5 text-white/85 last:border-b-0"
                >
                  <td className="px-4 py-2.5">
                    <a
                      href={`/blog/${a.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:underline"
                    >
                      {a.titre}
                    </a>
                  </td>
                  <td className="px-4 py-2.5 text-white/60">{a.organe}</td>
                  <td className="px-4 py-2.5 text-white/60">{a.date}</td>
                  <td className="px-4 py-2.5 text-white/60">
                    {a.hasEn ? 'oui' : '—'}
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <Link
                      to="/admin/articles/$dir"
                      params={{ dir: a.dir }}
                      className="text-white/60 underline hover:text-white"
                    >
                      Modifier
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
