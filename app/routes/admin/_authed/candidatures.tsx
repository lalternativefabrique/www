import { useState } from 'react'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { listApplications, reviewApplication } from '@/server/admin-data'
import type { Application } from '@/server/admin-data'

export const Route = createFileRoute('/admin/_authed/candidatures')({
  component: Candidatures,
  loader: () => listApplications(),
})

const STATUS_LABEL: Record<string, string> = {
  pending: 'À lire',
  accepted: 'Acceptée',
  declined: 'Déclinée',
}

function Candidatures() {
  const applications = Route.useLoaderData()
  const [filtre, setFiltre] = useState<string>('pending')

  const visibles = applications.filter((a) =>
    filtre === 'all' ? true : a.status === filtre,
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Candidatures</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Les personnes qui demandent à rejoindre le collectif.
        </p>
      </div>

      <div className="flex gap-2">
        {['pending', 'accepted', 'declined', 'all'].map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setFiltre(key)}
            className={`rounded-md px-3 py-1.5 text-sm ${
              filtre === key
                ? 'bg-primary text-primary-foreground'
                : 'border border-border text-muted-foreground hover:bg-muted'
            }`}
          >
            {key === 'all' ? 'Toutes' : STATUS_LABEL[key]}
          </button>
        ))}
      </div>

      {visibles.length === 0 ? (
        <p className="text-sm text-muted-foreground">Aucune candidature ici.</p>
      ) : (
        <ul className="space-y-4">
          {visibles.map((application) => (
            <Carte key={application.id} application={application} />
          ))}
        </ul>
      )}
    </div>
  )
}

function Carte({ application }: { application: Application }) {
  const router = useRouter()
  const [note, setNote] = useState(application.note)
  const [busy, setBusy] = useState(false)
  const [erreur, setErreur] = useState('')

  async function decide(status: string) {
    setBusy(true)
    setErreur('')
    try {
      await reviewApplication({ data: { id: application.id, status, note } })
      await router.invalidate()
    } catch (err) {
      setErreur(err instanceof Error ? err.message : String(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <li className="rounded-lg border border-border bg-muted p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <p className="font-medium text-foreground">{application.name}</p>
          <a
            href={`mailto:${application.email}`}
            className="text-sm text-muted-foreground underline hover:text-foreground"
          >
            {application.email}
          </a>
        </div>
        <div className="text-right">
          <span className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground">
            {STATUS_LABEL[application.status] ?? application.status}
          </span>
          <p className="mt-1 text-xs text-muted-foreground">
            {new Date(application.createdAt).toLocaleDateString('fr-FR')} —{' '}
            {application.locale.toUpperCase()}
          </p>
        </div>
      </div>

      {application.message ? (
        <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
          {application.message}
        </p>
      ) : null}

      {application.links ? (
        <p className="mt-3 whitespace-pre-wrap text-sm text-muted-foreground">
          {application.links}
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Note interne"
          className="flex-1 rounded-md border border-border bg-transparent px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground"
        />
        <button
          type="button"
          disabled={busy}
          onClick={() => decide('accepted')}
          className="rounded-md bg-emerald-500/90 px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-emerald-400 disabled:opacity-50"
        >
          Accepter
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => decide('declined')}
          className="rounded-md border border-border px-3 py-1.5 text-sm text-foreground hover:bg-muted disabled:opacity-50"
        >
          Décliner
        </button>
        {application.status !== 'pending' ? (
          <button
            type="button"
            disabled={busy}
            onClick={() => decide('pending')}
            className="text-sm text-muted-foreground underline hover:text-foreground disabled:opacity-50"
          >
            Remettre à lire
          </button>
        ) : null}
      </div>

      {erreur ? (
        <p className="mt-3 text-sm text-red-400">{erreur}</p>
      ) : null}
    </li>
  )
}
