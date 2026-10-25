import { useCallback, useRef, useState, type CSSProperties } from 'react'
import type { Locale } from '@/lib/i18n'
import {
  pauseAfter,
  useLoop,
  useOnScreen,
  useReducedMotion,
  type Waiter,
} from './playback'

const SOURCE_URL = 'radiofrance.fr/frontieres-poreuses-eveil-sommeil'
const SOURCE_TITLE = 'Les frontières poreuses entre éveil et sommeil'
const SOURCE_AUTHOR = 'Delphine Oudiette'

const TYPE_MS = 70
const WORD_MS = 45

const texts = {
  fr: {
    addPlaceholder: 'Collez un lien : vidéo, podcast, article',
    addButton: 'Ajouter',
    transcribing: 'Transcription…',
    synthesizing: 'Synthèse…',
    synthesis:
      "Le sommeil n'est pas un interrupteur. Delphine Oudiette montre que des régions du cerveau peuvent dormir pendant que d'autres restent actives : on s'endort par morceaux, et l'on se réveille de la même façon. Ces frontières poreuses expliquent les micro-siestes créatives comme les réveils confus.",
    excerpt:
      "des régions du cerveau peuvent dormir pendant que d'autres restent actives",
    concepts: ['sommeil local', 'hypnagogie', 'créativité'],
    stored: 'Dans votre mémoire',
    searchPlaceholder: 'Rechercher dans votre mémoire',
    query: 'être à moitié endormi',
    chipSense: 'sens',
    chipExact: 'mots exacts',
    match: '1 résultat',
    recap: 'Retrouvée par le sens, sans les mots exacts.',
    sr: 'Démonstration : un lien de podcast est ajouté, Synthiz le transcrit et en écrit la synthèse, puis une recherche sans les mots exacts retrouve cette source.',
  },
  en: {
    addPlaceholder: 'Paste a link: video, podcast, article',
    addButton: 'Add',
    transcribing: 'Transcribing…',
    synthesizing: 'Summarizing…',
    synthesis:
      'Sleep is not a switch. Delphine Oudiette shows that some brain regions can sleep while others stay active: we fall asleep in pieces, and wake up the same way. These porous boundaries explain creative micro-naps as much as confused awakenings.',
    excerpt: 'some brain regions can sleep while others stay active',
    concepts: ['local sleep', 'hypnagogia', 'creativity'],
    stored: 'In your memory',
    searchPlaceholder: 'Search your memory',
    query: 'being half asleep',
    chipSense: 'meaning',
    chipExact: 'exact words',
    match: '1 result',
    recap: 'Found by meaning, without the exact words.',
    sr: 'Demo: a podcast link is added, Synthiz transcribes and summarizes it, then a search without the exact words finds that source again.',
  },
}

const synthizTheme = {
  '--background': '0 0% 98%',
  '--foreground': '0 0% 10%',
  '--text-secondary': '0 0% 45%',
  '--text-tertiary': '0 0% 64%',
  '--border-subtle': '0 0% 0% / 0.06',
  '--accent': '217 91% 60%',
  '--accent-foreground': '0 0% 100%',
} as CSSProperties

type Phase =
  | 'url_typing'
  | 'url_pressing'
  | 'transcribing'
  | 'synthesizing'
  | 'writing'
  | 'stored'
  | 'query_typing'
  | 'searching'
  | 'found'
  | 'done'

const ACT_SEARCH: ReadonlySet<Phase> = new Set([
  'query_typing',
  'searching',
  'found',
  'done',
])
const CARD_SHOWN: ReadonlySet<Phase> = new Set([
  'transcribing',
  'synthesizing',
  'writing',
  'stored',
  'found',
  'done',
])

const icones = {
  search: 'M21 21l-4.3-4.3M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14z',
  link: 'M9 17H7A5 5 0 0 1 7 7h2M15 7h2a5 5 0 0 1 0 10h-2M8 12h8',
  loader: 'M21 12a9 9 0 1 1-6.22-8.56',
  sparkles:
    'M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9zM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z',
  check: 'M20 6L9 17l-5-5',
  podcast:
    'M12 11a1 1 0 1 0 0 2 1 1 0 0 0 0-2zM12 15v6M8.5 15.5a5 5 0 1 1 7 0M5.6 18.4a9 9 0 1 1 12.8 0',
}

function Icone({
  nom,
  className,
}: {
  nom: keyof typeof icones
  className?: string
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d={icones[nom]} />
    </svg>
  )
}

function Caret() {
  return (
    <span className="ml-px inline-block h-[1.05em] w-px animate-pulse bg-[hsl(var(--foreground))] align-text-bottom" />
  )
}

export function SynthizSearchDemo({ locale }: { locale: Locale }) {
  const t = texts[locale]
  const rootRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const onScreen = useOnScreen(rootRef)
  const [phase, setPhase] = useState<Phase>('url_typing')
  const [typed, setTyped] = useState('')
  const [written, setWritten] = useState('')

  const script = useCallback(
    async (wait: Waiter, isCancelled: () => boolean) => {
      const typeInto = async (text: string) => {
        for (let i = 0; i <= text.length; i++) {
          if (isCancelled()) return
          setTyped(text.slice(0, i))
          await wait(TYPE_MS)
        }
      }
      const step = async (next: Phase, ms: number) => {
        if (isCancelled()) return
        setPhase(next)
        await wait(ms)
      }

      setTyped('')
      setWritten('')
      setPhase('url_typing')
      await typeInto(SOURCE_URL)
      await wait(600)
      await step('url_pressing', 180)
      await step('transcribing', 1500)
      await step('synthesizing', 1000)

      setPhase('writing')
      const words = t.synthesis.split(' ')
      for (let i = 1; i <= words.length; i++) {
        if (isCancelled()) return
        setWritten(words.slice(0, i).join(' '))
        await wait(pauseAfter(words[i - 1], WORD_MS))
      }
      await wait(900)
      await step('stored', 1600)

      setTyped('')
      setPhase('query_typing')
      await wait(400)
      await typeInto(t.query)
      await wait(500)
      await step('searching', 1100)
      await step('found', 600)
      await step('done', 4200)
    },
    [t],
  )

  useLoop(onScreen && !reduced, script)

  const shownPhase: Phase = reduced ? 'done' : phase
  const searching = ACT_SEARCH.has(shownPhase)
  const shownTyped = reduced ? t.query : typed
  const busy = shownPhase === 'transcribing' || shownPhase === 'synthesizing'
  const found = shownPhase === 'found' || shownPhase === 'done'
  const collapsed = shownPhase === 'stored'
  const showBody = shownPhase === 'writing' || shownPhase === 'stored' || found
  const bodyText = found || reduced ? t.synthesis : written
  const excerptAt = found ? bodyText.indexOf(t.excerpt) : -1

  return (
    <div
      ref={rootRef}
      style={synthizTheme}
      className="relative flex h-[440px] flex-col gap-4 rounded-2xl border border-text/15 bg-white p-4 font-sans text-[hsl(var(--foreground))] shadow-[0_24px_60px_-30px_rgba(26,26,26,0.35)] sm:h-[480px] sm:p-6"
    >
      <div aria-hidden="true" className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <div className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-lg border border-[hsl(var(--border-subtle))] bg-[hsl(var(--background))] px-3 text-sm">
            {searching ? (
              <Icone nom="search" className="h-4 w-4 shrink-0 text-[hsl(var(--accent))]" />
            ) : (
              <Icone nom="link" className="h-4 w-4 shrink-0 text-[hsl(var(--text-tertiary))]" />
            )}
            {shownTyped ? (
              <span className="truncate">{shownTyped}</span>
            ) : (
              <span className="truncate text-[hsl(var(--text-tertiary))]">
                {searching ? t.searchPlaceholder : t.addPlaceholder}
              </span>
            )}
            {!reduced &&
              (shownPhase === 'url_typing' ||
                shownPhase === 'query_typing') && <Caret />}
          </div>
          {!searching && (
            <div
              className={`inline-flex h-10 shrink-0 items-center gap-2 rounded-lg bg-[hsl(var(--accent))] px-4 text-sm font-medium text-[hsl(var(--accent-foreground))] transition-all duration-150 ${
                shownPhase === 'url_pressing' ? 'scale-95' : 'scale-100'
              } ${shownTyped ? 'opacity-100' : 'opacity-50'}`}
            >
              {busy ? (
                <Icone nom="loader" className="h-4 w-4 animate-spin" />
              ) : (
                <Icone nom="sparkles" className="h-4 w-4" />
              )}
              {t.addButton}
            </div>
          )}
        </div>

        <div
          className={`flex items-center gap-2 text-xs transition-opacity duration-300 ${
            shownPhase === 'searching' ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <span className="animate-pulse rounded-full bg-[hsl(var(--accent)/0.12)] px-2.5 py-1 font-medium text-[hsl(var(--accent))]">
            {t.chipSense}
          </span>
          <span className="animate-pulse rounded-full bg-[hsl(var(--accent)/0.12)] px-2.5 py-1 font-medium text-[hsl(var(--accent))] [animation-delay:200ms]">
            {t.chipExact}
          </span>
        </div>

        <div
          className={`rounded-xl border border-[hsl(var(--border-subtle))] bg-[hsl(var(--background))] transition-all duration-500 ${
            CARD_SHOWN.has(shownPhase)
              ? 'translate-y-0 opacity-100'
              : 'translate-y-3 opacity-0'
          } ${found ? 'ring-1 ring-[hsl(var(--accent)/0.5)]' : ''}`}
        >
          <div className="flex items-center gap-3 p-3">
            <div
              className={`flex shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500 to-orange-400 text-white transition-all duration-500 ${
                collapsed ? 'h-9 w-9' : 'h-14 w-14'
              }`}
            >
              <Icone nom="podcast" className={collapsed ? 'h-4 w-4' : 'h-6 w-6'} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold leading-tight">
                {SOURCE_TITLE}
              </p>
              <p className="mt-0.5 truncate text-xs text-[hsl(var(--text-secondary))]">
                {SOURCE_AUTHOR} · podcast · 52 min
              </p>
            </div>
            <div className="shrink-0 text-xs font-medium">
              {busy && (
                <span className="inline-flex items-center gap-1.5 text-[hsl(var(--text-secondary))]">
                  <Icone nom="loader" className="h-3.5 w-3.5 animate-spin" />
                  {shownPhase === 'transcribing' ? t.transcribing : t.synthesizing}
                </span>
              )}
              {collapsed && (
                <span className="inline-flex items-center gap-1.5 text-emerald-600">
                  <Icone nom="check" className="h-3.5 w-3.5" />
                  {t.stored}
                </span>
              )}
              {found && (
                <span className="rounded-full bg-[hsl(var(--accent)/0.12)] px-2 py-0.5 text-[hsl(var(--accent))]">
                  {t.match}
                </span>
              )}
            </div>
          </div>

          <div
            className={`grid transition-[grid-template-rows] duration-500 ${
              showBody && !collapsed ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
            }`}
          >
            <div className="overflow-hidden">
              <div className="border-t border-[hsl(var(--border-subtle))] px-3 pb-3 pt-3">
                <p className="text-[13px] leading-relaxed text-[hsl(var(--text-secondary))]">
                  {excerptAt >= 0 ? (
                    <>
                      {bodyText.slice(0, excerptAt)}
                      <mark className="rounded bg-[hsl(var(--accent)/0.2)] px-0.5 text-[hsl(var(--foreground))]">
                        {t.excerpt}
                      </mark>
                      {bodyText.slice(excerptAt + t.excerpt.length)}
                    </>
                  ) : (
                    bodyText
                  )}
                  {shownPhase === 'writing' && <Caret />}
                </p>
                <div
                  className={`mt-3 flex flex-wrap gap-1.5 transition-opacity duration-500 ${
                    shownPhase === 'writing' ? 'opacity-0' : 'opacity-100'
                  }`}
                >
                  {t.concepts.map((c) => (
                    <span
                      key={c}
                      className="rounded-full border border-[hsl(var(--border-subtle))] px-2 py-0.5 text-[11px] font-medium text-[hsl(var(--text-secondary))]"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <p
          className={`flex items-center gap-2 text-xs text-[hsl(var(--text-secondary))] transition-opacity duration-500 ${
            found ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Icone nom="sparkles" className="h-3.5 w-3.5 text-[hsl(var(--accent))]" />
          {t.recap}
        </p>
      </div>
      <p className="sr-only">{t.sr}</p>
    </div>
  )
}
