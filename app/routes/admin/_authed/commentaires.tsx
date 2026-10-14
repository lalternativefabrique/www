import { useState } from 'react'
import { Link, createFileRoute, useRouter } from '@tanstack/react-router'
import { listPendingComments, reviewComment } from '@/server/admin-comments'
import type { PendingComment } from '@/server/admin-comments'

/**
 * The comments waiting to be read. Nothing else: once approved a comment is
 * on the article, once rejected it is gone, and neither needs a screen here.
 */
export const Route = createFileRoute('/admin/_authed/commentaires')({
  component: Commentaires,
  loader: () => listPendingComments(),
})

function Commentaires() {
  const { configured, comments } = Route.useLoaderData()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Commentaires</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Ce que les lecteurs ont écrit sous les articles, en attente de lecture.
        </p>
      </div>

      {!configured ? (
        <p className="text-sm text-muted-foreground">
          Le service de discussion n'est pas configuré (CHAT_URL, CHAT_KEY).
        </p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-muted-foreground">Rien à lire.</p>
      ) : (
        <ul className="space-y-4">
          {comments.map((comment) => (
            <Carte key={`${comment.room}/${comment.seq}`} comment={comment} />
          ))}
        </ul>
      )}
    </div>
  )
}

function articleOf(raw: string): { dir: string; label: string } | undefined {
  const article = decodeURIComponent(raw)
  const sep = article.lastIndexOf(':')
  if (sep < 0) return undefined
  const dir = article.slice(0, sep)
  const locale = article.slice(sep + 1)
  return { dir, label: `${dir} · ${locale.toUpperCase()}` }
}

function Carte({ comment }: { comment: PendingComment }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [erreur, setErreur] = useState('')
  const link = articleOf(comment.article)

  async function decide(decision: 'approve' | 'reject') {
    setBusy(true)
    setErreur('')
    try {
      await reviewComment({ data: { room: comment.room, seq: comment.seq, decision } })
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
        <p className="font-medium text-foreground">{comment.author}</p>
        <p className="text-xs text-muted-foreground">
          {new Date(comment.createdAt).toLocaleString('fr-FR')}
        </p>
      </div>
      {link ? (
        <p className="mt-1 text-sm text-muted-foreground">
          Sous{' '}
          <Link
            to="/admin/articles/$dir"
            params={{ dir: link.dir }}
            className="underline hover:text-foreground"
          >
            {link.label}
          </Link>
        </p>
      ) : null}

      <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
        {comment.body}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={busy}
          onClick={() => decide('approve')}
          className="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          Publier
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => decide('reject')}
          className="rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground hover:bg-background disabled:opacity-50"
        >
          Refuser
        </button>
        {erreur ? <p className="text-sm text-destructive">{erreur}</p> : null}
      </div>
    </li>
  )
}
