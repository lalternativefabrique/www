import { useEffect, useState } from 'react'
import { startSso } from '@lalternative/auth/client'
import { authClient } from '@/lib/auth-client'
import { chrome, useLocale } from '@/lib/i18n'
import { commentsRoom, postGuestComment } from '@/server/comments'
import type { GuestPostInput } from '@/server/comments'

/**
 * The discussion under an article, held by the suite's chat service.
 *
 * Mounted after hydration and silent when nothing answers: the article is the
 * page, the comments are a guest on it. Nobody needs an account: a name is
 * enough, the suite's sign-in is offered for those who have one, and every
 * post waits for a moderator before it shows.
 */

type Post = {
  seq: number
  sender_sub: string
  sender_handle: string
  body: string
  status: 'published' | 'pending'
  created_at: string
}

type Etat = 'repos' | 'envoi' | 'ok' | 'erreur'

const MAX_BODY = 8000

export function Commentaires({ slug }: { slug: string }) {
  const locale = useLocale()
  const t = chrome[locale].comments
  const [room, setRoom] = useState<string | undefined>()
  const [posts, setPosts] = useState<Post[] | undefined>()

  useEffect(() => {
    let cancelled = false
    commentsRoom({ data: { slug, lang: locale } })
      .then((res) => {
        if (!cancelled && res) setRoom(res.room)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [slug, locale])

  useEffect(() => {
    if (!room) return
    let cancelled = false
    fetchPosts(room)
      .then((list) => {
        if (!cancelled) setPosts(list)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [room])

  if (!room || !posts) return null

  const dateFormat = new Intl.DateTimeFormat(locale === 'en' ? 'en-GB' : 'fr-FR', {
    dateStyle: 'long',
  })

  return (
    <section className="border-t-2 border-text">
      <div className="mx-auto w-full max-w-3xl px-6 py-16 sm:py-20">
        <p className="label text-text/50">{t.kicker}</p>
        <h2 className="font-heading mt-4 text-3xl leading-tight sm:text-4xl">
          {posts.length === 0 ? t.none : t.heading(posts.length)}
        </h2>

        {posts.length > 0 ? (
          <ol className="mt-10 space-y-8">
            {posts.map((post) => (
              <li key={post.seq} className="border-l-2 border-text pl-5">
                <p className="label text-text/60">
                  {post.sender_handle}
                  <span className="mx-2" aria-hidden>
                    —
                  </span>
                  {dateFormat.format(new Date(post.created_at))}
                  {post.status === 'pending' ? (
                    <span className="ml-3 text-accent-primary">{t.pendingTag}</span>
                  ) : null}
                </p>
                <p className="mt-3 whitespace-pre-wrap text-base leading-relaxed text-text/85">
                  {post.body}
                </p>
              </li>
            ))}
          </ol>
        ) : null}

        <Formulaire
          room={room}
          slug={slug}
          onPosted={(post) => setPosts((list) => [...(list ?? []), post])}
        />
      </div>
    </section>
  )
}

async function fetchPosts(room: string): Promise<Post[]> {
  const res = await fetch(`/api/chat/v1/rooms/${room}/posts?limit=200`, {
    credentials: 'same-origin',
  })
  if (!res.ok) throw new Error(`comments: ${res.status}`)
  return (await res.json()) as Post[]
}

function Formulaire({
  room,
  slug,
  onPosted,
}: {
  room: string
  slug: string
  onPosted: (post: Post) => void
}) {
  const locale = useLocale()
  const t = chrome[locale].comments
  const { data: session, isPending } = authClient.useSession()
  const [name, setName] = useState('')
  const [body, setBody] = useState('')
  const [website, setWebsite] = useState('')
  const [startedAt] = useState(() => Date.now())
  const [etat, setEtat] = useState<Etat>('repos')

  if (isPending) return null

  const signedIn = Boolean(session?.user)
  const signature = session?.user ? session.user.name || session.user.email : name

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const text = body.trim()
    if (!text || (!signedIn && !name.trim())) return
    setEtat('envoi')
    try {
      const post = signedIn
        ? await postAsReader(room, text)
        : await postAsGuest({ slug, lang: locale, name, body: text, website, startedAt })
      onPosted(post)
      setBody('')
      setEtat('ok')
    } catch {
      setEtat('erreur')
    }
  }

  return (
    <form onSubmit={onSubmit} className="relative mt-12">
      {signedIn ? (
        <p className="label text-text/60">{t.writingAs(signature)}</p>
      ) : (
        <>
          <label htmlFor="commentaire-nom" className="label text-text/60">
            {t.nameLabel}
          </label>
          <input
            id="commentaire-nom"
            required
            maxLength={120}
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-3 block w-full max-w-md border-2 border-text bg-bg px-4 py-3 text-base text-text focus:outline-none focus:ring-2 focus:ring-accent-primary"
          />
          <div className="absolute -left-[9999px]" aria-hidden>
            <label htmlFor="commentaire-site">{t.websiteLabel}</label>
            <input
              id="commentaire-site"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>
        </>
      )}
      <label htmlFor="commentaire" className="label mt-6 block text-text/60">
        {t.bodyLabel}
      </label>
      <textarea
        id="commentaire"
        required
        rows={5}
        maxLength={MAX_BODY}
        value={body}
        onChange={(e) => {
          setBody(e.target.value)
          if (etat !== 'repos') setEtat('repos')
        }}
        className="mt-3 block w-full border-2 border-text bg-bg px-4 py-3 text-base leading-relaxed text-text focus:outline-none focus:ring-2 focus:ring-accent-primary"
      />
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={etat === 'envoi' || !body.trim() || (!signedIn && !name.trim())}
          className="label inline-flex w-fit items-center gap-3 border-2 border-text px-6 py-3 hover:bg-text hover:text-bg disabled:opacity-50"
        >
          {etat === 'envoi' ? t.sending : t.submit}
        </button>
        <p className="text-sm text-text/60">
          {etat === 'ok'
            ? t.posted
            : etat === 'erreur'
              ? t.error
              : t.moderationNote}
        </p>
      </div>
      {!signedIn ? (
        <p className="mt-6 text-sm text-text/60">
          {t.signInLead}{' '}
          <button
            type="button"
            onClick={() =>
              startSso(authClient, {
                callbackURL: window.location.pathname,
                errorCallbackURL: window.location.pathname,
              })
            }
            className="underline hover:text-accent-primary"
          >
            {t.signIn}
          </button>
        </p>
      ) : null}
    </form>
  )
}

async function postAsReader(room: string, body: string): Promise<Post> {
  const res = await fetch(`/api/chat/v1/rooms/${room}/posts`, {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ body }),
  })
  if (!res.ok) throw new Error(`comments: ${res.status}`)
  return (await res.json()) as Post
}

async function postAsGuest(input: GuestPostInput): Promise<Post> {
  const res = await postGuestComment({ data: input })
  if (!res.ok) throw new Error(res.reason)
  return {
    seq: res.seq,
    sender_sub: '',
    sender_handle: res.name,
    body: res.body,
    status: 'pending',
    created_at: res.createdAt,
  }
}
