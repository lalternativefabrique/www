import { useCallback, useEffect, useRef } from 'react'
import { speakSource, useReadAlong, useVoicePlayback } from '@lalternative/vvaves-sdk-react'
import { signerLecture } from '@/server/lecture'

const VITESSES = [1, 1.25, 1.5, 2, 0.75]

function minutes(secondes: number) {
  const s = Math.max(0, Math.floor(secondes))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

export function LectureAudio({ slug, lang = 'fr' }: { slug: string; lang?: 'fr' | 'en' }) {
  const t = lang === 'en' ? EN : FR

  const resolve = useCallback(async () => {
    const lecture = await signerLecture({ data: { slug, lang } })
    if (!lecture) throw new Error('unavailable')
    return speakSource(lecture)
  }, [slug, lang])

  const playback = useVoicePlayback(resolve)
  const { state, toggle, position, buffered, duration, seek, skip, rate, setRate } = playback
  const region = useRef<HTMLElement>(null)
  const article = useRef<HTMLElement | null>(null)
  useEffect(() => {
    article.current = region.current?.closest('article') ?? null
  }, [])
  useReadAlong(playback, article)

  if (state === 'unavailable') return null

  const total = duration ?? buffered
  const enCours = state === 'playing'
  const actif = state !== 'idle'

  return (
    <section ref={region} className="mt-10 border-2 border-text p-5" aria-label={t.region}>
      <p className="label text-text/60">{t.kicker}</p>
      <div className="mt-4 flex items-center gap-4">
        <button
          type="button"
          onClick={toggle}
          aria-label={enCours ? t.pause : t.play}
          className="grid size-12 shrink-0 place-items-center bg-text text-bg hover:bg-accent-primary"
        >
          {state === 'loading' ? (
            <span aria-hidden className="size-4 animate-spin border-2 border-bg border-t-transparent" />
          ) : enCours ? (
            <svg aria-hidden viewBox="0 0 16 16" className="size-4" fill="currentColor">
              <path d="M3 2h4v12H3zM9 2h4v12H9z" />
            </svg>
          ) : (
            <svg aria-hidden viewBox="0 0 16 16" className="size-4" fill="currentColor">
              <path d="M4 2l10 6-10 6z" />
            </svg>
          )}
        </button>
        <div className="min-w-0 flex-1">
          <input
            type="range"
            min={0}
            max={Math.max(total, 0.1)}
            step={0.1}
            value={position}
            disabled={!actif}
            onChange={(e) => seek(Number(e.target.value))}
            aria-label={t.position}
            className="w-full accent-[var(--color-accent-primary)]"
          />
          <div className="label mt-1 flex justify-between text-text/60">
            <span>{minutes(position)}</span>
            <span>{duration ? minutes(duration) : actif ? t.reading : ''}</span>
          </div>
        </div>
      </div>
      {actif ? (
        <div className="label mt-3 flex gap-4 text-text/70">
          <button type="button" onClick={() => skip(-15)} className="hover:text-accent-primary">
            −15 s
          </button>
          <button type="button" onClick={() => skip(15)} className="hover:text-accent-primary">
            +15 s
          </button>
          <button
            type="button"
            onClick={() => setRate(VITESSES[(VITESSES.indexOf(rate) + 1) % VITESSES.length] ?? 1)}
            className="hover:text-accent-primary"
          >
            ×{rate}
          </button>
        </div>
      ) : null}
    </section>
  )
}

const FR = {
  region: "Lecture audio de l'article",
  kicker: 'Écouter cet article',
  play: 'Écouter',
  pause: 'Pause',
  position: 'Position dans la lecture',
  reading: 'lecture en cours…',
}

const EN = {
  region: 'Audio version of this article',
  kicker: 'Listen to this article',
  play: 'Listen',
  pause: 'Pause',
  position: 'Position in the reading',
  reading: 'reading…',
}
