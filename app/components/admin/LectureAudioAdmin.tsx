import { useCallback, useEffect, useRef, useState } from 'react'
import { articleNarration, narrateArticle } from '@/server/narrate'
import type { NarrationState } from '@/server/narrate'

/**
 * Narration controls for one article.
 *
 * Reading a piece aloud takes minutes, so the button starts the work and the
 * panel follows it: the request returns immediately and the state is polled
 * until the reading lands. Publishing is untouched — an article goes live with
 * or without audio, and this is where the audio is made.
 *
 * Rendered only for a saved article. There is nothing in the bucket to read
 * before the sources are written.
 */
export function LectureAudioAdmin({ dir }: { dir: string }) {
  const [states, setStates] = useState<NarrationState[]>([])
  const [erreur, setErreur] = useState('')
  const [chargement, setChargement] = useState(true)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  const rafraichir = useCallback(async () => {
    try {
      const next = await articleNarration({ data: { dir } })
      setStates(next)
      return next
    } catch (err) {
      setErreur(err instanceof Error ? err.message : String(err))
      return []
    } finally {
      setChargement(false)
    }
  }, [dir])

  // One polling loop, driven by whether anything is being read. An idle screen
  // asks once and then makes no requests at all; starting a reading flips a
  // state to running, which is what puts the loop back in motion.
  const enCours = states.some((s) => s.running)

  useEffect(() => {
    let cancelled = false

    const tick = async () => {
      const next = await rafraichir()
      if (cancelled) return
      if (next.some((s) => s.running)) timer.current = setTimeout(tick, 4000)
    }

    void tick()
    return () => {
      cancelled = true
      clearTimeout(timer.current)
    }
  }, [rafraichir, enCours])

  async function lancer(lang: 'fr' | 'en') {
    setErreur('')
    try {
      const res = await narrateArticle({ data: { dir, lang } })
      if (!res.ok) {
        setErreur(raison(res.reason))
        return
      }
      // Marks it running, which restarts the polling loop through the effect.
      setStates((prev) =>
        prev.map((s) =>
          s.lang === lang ? { ...s, running: true, error: undefined } : s,
        ),
      )
    } catch (err) {
      setErreur(err instanceof Error ? err.message : String(err))
    }
  }

  const lisibles = states.filter((s) => s.exists)

  return (
    <section className="rounded-lg border border-border p-4">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-sm font-medium text-foreground">Lecture audio</h2>
        <p className="text-xs text-muted-foreground">
          Quelques minutes par langue. La publication n'attend pas.
        </p>
      </div>

      {chargement ? (
        <p className="mt-3 text-sm text-muted-foreground">Chargement…</p>
      ) : lisibles.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">
          Publiez l'article pour pouvoir le faire lire.
        </p>
      ) : (
        <ul className="mt-3 space-y-3">
          {lisibles.map((s) => (
            <li key={s.lang} className="flex flex-wrap items-center gap-3">
              <span className="w-8 text-sm font-medium text-foreground">
                {s.lang.toUpperCase()}
              </span>

              <Etat state={s} />

              <button
                type="button"
                onClick={() => lancer(s.lang)}
                disabled={s.running}
                className="rounded-md border border-border px-3 py-1.5 text-sm text-foreground hover:bg-muted disabled:opacity-40"
              >
                {s.src ? 'Refaire' : 'Générer'}
              </button>

              {s.src ? (
                <audio controls preload="none" src={s.src} className="h-8" />
              ) : null}
            </li>
          ))}
        </ul>
      )}

      {erreur ? <p className="mt-3 text-sm text-red-400">{erreur}</p> : null}
    </section>
  )
}

function Etat({ state }: { state: NarrationState }) {
  if (state.running) {
    return <span className="text-sm text-amber-300">lecture en cours…</span>
  }
  if (state.error) {
    return <span className="text-sm text-red-400">échec : {state.error}</span>
  }
  if (!state.src) {
    return <span className="text-sm text-muted-foreground">absente</span>
  }
  if (!state.current) {
    // The text moved on since it was read: what is in the bucket is a reading
    // of an older version, and it stays served until a new one replaces it.
    return <span className="text-sm text-amber-300">à refaire (texte modifié)</span>
  }
  return <span className="text-sm text-emerald-400">à jour</span>
}

function raison(code?: string): string {
  switch (code) {
    case 'tts-not-configured':
      return "Aucune voix configurée : TTS_URL n'est pas défini."
    case 'already-running':
      return 'Une lecture est déjà en cours pour cette langue.'
    case 'no-source':
      return "Pas de source dans cette langue."
    case 'forbidden':
      return 'Session expirée.'
    default:
      return code ?? 'Échec inconnu.'
  }
}
