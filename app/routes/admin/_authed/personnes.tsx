import { useState } from 'react'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { listApplications, listSubscribers, reviewApplication } from '@/server/admin-data'
import type { Application, Subscriber } from '@/server/admin-data'

/**
 * Everyone who left an address: the people asking to join, and the people
 * subscribed to the revue.
 *
 * One screen rather than two, but two tabs rather than one list — the two are
 * read differently. Applications are a queue: opened to work through what is
 * left. Subscribers are a register: opened to look something up. Merging them
 * into a single table would bury three applications to read under four hundred
 * addresses, and lose the one thing worth seeing at a glance.
 *
 * Both lists load together. Switching tabs is then a local state change rather
 * than a round trip, which is what the two separate pages cost.
 */
export const Route = createFileRoute('/admin/_authed/personnes')({
  component: Personnes,
  loader: async () => {
    const [applications, subscribers] = await Promise.all([
      listApplications(),
      listSubscribers(),
    ])
    return { applications, subscribers }
  },
})

const STATUS_LABEL: Record<string, string> = {
  pending: 'À lire',
  accepted: 'Acceptée',
  declined: 'Déclinée',
}

function Personnes() {
  const { applications, subscribers } = Route.useLoaderData()
  const [onglet, setOnglet] = useState<'candidatures' | 'inscriptions'>(
    'candidatures',
  )

  const aLire = applications.filter((a) => a.status === 'pending').length
  const actifs = subscribers.filter((s) => !s.unsubscribedAt)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Personnes</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Celles qui demandent à rejoindre le collectif, et celles qui suivent
          la revue.
        </p>
      </div>

      <div className="flex gap-1 border-b border-border">
        <Onglet
          actif={onglet === 'candidatures'}
          onClick={() => setOnglet('candidatures')}
        >
          Candidatures
          {aLire > 0 ? (
            // The count is the reason this tab is first: it is the only one
            // carrying something to do.
            <span className="ml-2 rounded-full bg-primary px-1.5 py-0.5 text-xs text-primary-foreground">
              {aLire}
            </span>
          ) : null}
        </Onglet>
        <Onglet
          actif={onglet === 'inscriptions'}
          onClick={() => setOnglet('inscriptions')}
        >
          Inscriptions
          <span className="ml-2 text-xs text-muted-foreground">
            {actifs.length}
          </span>
        </Onglet>
      </div>

      {onglet === 'candidatures' ? (
        <Candidatures applications={applications} />
      ) : (
        <Inscriptions subscribers={subscribers} actifs={actifs} />
      )}
    </div>
  )
}

function Onglet({
  actif,
  onClick,
  children,
}: {
  actif: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`-mb-px border-b-2 px-4 py-2.5 text-sm ${
        actif
          ? 'border-primary font-medium text-foreground'
          : 'border-transparent text-muted-foreground hover:text-foreground'
      }`}
    >
      {children}
    </button>
  )
}

function Candidatures({ applications }: { applications: Application[] }) {
  const [filtre, setFiltre] = useState<string>('pending')

  const visibles = applications.filter((a) =>
    filtre === 'all' ? true : a.status === filtre,
  )

  return (
    <div className="space-y-5">
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

      {erreur ? <p className="mt-3 text-sm text-red-400">{erreur}</p> : null}
    </li>
  )
}

function Inscriptions({
  subscribers,
  actifs,
}: {
  subscribers: Subscriber[]
  actifs: Subscriber[]
}) {
  /**
   * The list, as addresses one per line. Sending is not wired here, so this is
   * how the list actually leaves the screen — and it is worth being explicit
   * that it does, rather than pretending a button will mail them.
   */
  function copier() {
    void navigator.clipboard.writeText(actifs.map((s) => s.email).join('\n'))
  }

  if (subscribers.length === 0) {
    return <p className="text-sm text-muted-foreground">Personne pour l'instant.</p>
  }

  const desinscrits = subscribers.length - actifs.length

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {actifs.length} inscrit{actifs.length > 1 ? 's' : ''} à la revue,{' '}
          {desinscrits} désinscrit{desinscrits > 1 ? 's' : ''}.
        </p>
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

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-muted text-muted-foreground">
            <tr>
              <th className="px-4 py-2.5 font-medium">Adresse</th>
              <th className="px-4 py-2.5 font-medium">Langue</th>
              <th className="px-4 py-2.5 font-medium">Inscrit le</th>
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
    </div>
  )
}
