import { createFileRoute } from '@tanstack/react-router'
import { listSubscribers } from '@/server/admin-data'

export const Route = createFileRoute('/admin/_authed/inscriptions')({
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
          <h1 className="text-2xl font-semibold text-foreground">Inscriptions</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {actifs.length} inscrit{actifs.length > 1 ? 's' : ''} à la revue,{' '}
            {subscribers.length - actifs.length} désinscrit
            {subscribers.length - actifs.length > 1 ? 's' : ''}.
          </p>
        </div>
        {actifs.length > 0 ? (
          <button
            type="button"
            onClick={copier}
            className="rounded-md border border-border px-3 py-1.5 text-sm text-foreground hover:bg-muted"
          >
            Copier les adresses
          </button>
        ) : null}
      </div>

      {subscribers.length === 0 ? (
        <p className="text-sm text-muted-foreground">Personne pour l'instant.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted text-muted-foreground">
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
                  className={`border-b border-border last:border-b-0 ${
                    s.unsubscribedAt ? 'text-muted-foreground' : 'text-foreground'
                  }`}
                >
                  <td className="px-4 py-2.5">
                    {s.email}
                    {s.unsubscribedAt ? (
                      <span className="ml-2 text-xs text-muted-foreground">
                        désinscrit
                      </span>
                    ) : null}
                  </td>
                  <td className="px-4 py-2.5">{s.locale.toUpperCase()}</td>
                  <td className="px-4 py-2.5">
                    {new Date(s.createdAt).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">{s.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
