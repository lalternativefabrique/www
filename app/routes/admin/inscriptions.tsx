import { createFileRoute } from '@tanstack/react-router'
import { listSubscribers } from '@/server/admin-data'

export const Route = createFileRoute('/admin/inscriptions')({
  component: Inscriptions,
  loader: () => listSubscribers(),
})

function Inscriptions() {
  const subscribers = Route.useLoaderData()
  const actifs = subscribers.filter((s) => !s.unsubscribedAt)

  /**
   * The list, as addresses one per line. Sending is not wired here, so this is
   * how the list actually leaves the screen — and it is worth being explicit
   * that it does, rather than pretending a button will mail them.
   */
  function copier() {
    void navigator.clipboard.writeText(actifs.map((s) => s.email).join('\n'))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-white">Inscriptions</h1>
          <p className="mt-1 text-sm text-white/50">
            {actifs.length} inscrit{actifs.length > 1 ? 's' : ''} à la revue,{' '}
            {subscribers.length - actifs.length} désinscrit
            {subscribers.length - actifs.length > 1 ? 's' : ''}.
          </p>
        </div>
        {actifs.length > 0 ? (
          <button
            type="button"
            onClick={copier}
            className="rounded-md border border-white/20 px-3 py-1.5 text-sm text-white hover:bg-white/10"
          >
            Copier les adresses
          </button>
        ) : null}
      </div>

      {subscribers.length === 0 ? (
        <p className="text-sm text-white/50">Personne pour l'instant.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/10 bg-white/5 text-white/60">
              <tr>
                <th className="px-4 py-2.5 font-medium">Adresse</th>
                <th className="px-4 py-2.5 font-medium">Langue</th>
                <th className="px-4 py-2.5 font-medium">Depuis</th>
                <th className="px-4 py-2.5 font-medium">Page</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((s) => (
                <tr
                  key={s.id}
                  className={`border-b border-white/5 last:border-b-0 ${
                    s.unsubscribedAt ? 'text-white/35' : 'text-white/85'
                  }`}
                >
                  <td className="px-4 py-2.5">
                    {s.email}
                    {s.unsubscribedAt ? (
                      <span className="ml-2 text-xs text-white/40">
                        désinscrit
                      </span>
                    ) : null}
                  </td>
                  <td className="px-4 py-2.5">{s.locale.toUpperCase()}</td>
                  <td className="px-4 py-2.5">
                    {new Date(s.createdAt).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-4 py-2.5 text-white/50">{s.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
