import { useCallback, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import type { Locale } from '@/lib/i18n'
import { useLoop, useOnScreen, useReducedMotion, type Waiter } from './playback'

const texts = {
  fr: { search: 'Rechercher ou demander… ⌘K', apps: 'Apps', openPages: 'Pages ouvertes' },
  en: { search: 'Search or ask… ⌘K', apps: 'Apps', openPages: 'Open pages' },
}

const orbitTheme = {
  '--night': '26 23% 5%',
  '--night-raised': '26 17% 8%',
  '--night-ink': '31 10% 91%',
  '--night-ink-soft': '29 3% 59%',
  '--night-ink-faint': '29 3% 36%',
  '--night-edge': '26 9% 16%',
  '--night-canvas': '24 26% 2%',
  '--orbit-mark': '0 79% 60%',
} as CSSProperties

type App = { name: string; host: string; tile: string }

const apps: App[] = [
  { name: 'Messag', host: 'app.messag.eco', tile: 'bg-[#2f7cf6]' },
  { name: 'Partage', host: 'partage.eco', tile: 'bg-[#3b82f6]' },
  {
    name: 'Synthiz',
    host: 'synthiz.com',
    tile: 'bg-gradient-to-br from-[#5b8cff] to-[#9b6bff]',
  },
]

const openPages = ['surf anglet · Recherche', 'Ton temps · semaine']

type Scene = {
  app: number
  palette: boolean
  query: string
  pick: number | null
}

const rest: Scene = { app: 0, palette: false, query: '', pick: null }

function OrbitMark({ className }: { className: string }) {
  return (
    <span
      className={`border-[hsl(var(--orbit-mark))] inline-grid place-items-center rounded-full border-2 ${className}`}
    >
      <span className="bg-[hsl(var(--orbit-mark))] size-1/3 rounded-full" />
    </span>
  )
}

function Page({ app }: { app: number }) {
  if (app === 0)
    return (
      <div className="space-y-2">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-md bg-white/70 p-2.5"
          >
            <span className="size-6 rounded-full bg-[#dbe6fb]" />
            <div className="flex-1 space-y-1.5">
              <div className="h-2 w-1/3 rounded bg-[#cfd6e3]" />
              <div className="h-1.5 w-3/4 rounded bg-[#e3e7ee]" />
            </div>
          </div>
        ))}
      </div>
    )
  if (app === 1)
    return (
      <div className="grid grid-cols-3 gap-3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="aspect-[4/3] rounded-lg bg-[#e3e8f5]" />
        ))}
      </div>
    )
  return (
    <div className="max-w-md space-y-3">
      <div className="h-3 w-2/3 rounded bg-[#d6d0ee]" />
      {['100%', '92%', '85%', '96%', '60%'].map((w) => (
        <div
          key={w}
          className="h-2 rounded bg-[#e6e2f3]"
          style={{ width: w }}
        />
      ))}
    </div>
  )
}

export function OrbitDemo({ locale }: { locale: Locale }) {
  const t = texts[locale]
  const ref = useRef<HTMLDivElement>(null)
  const visible = useOnScreen(ref)
  const reduced = useReducedMotion()
  const [scene, setScene] = useState<Scene>(rest)

  const script = useCallback(async (wait: Waiter, cancelled: () => boolean) => {
    for (const target of [2, 1, 0]) {
      await wait(1600)
      setScene((s) => ({ ...s, palette: true, query: '', pick: null }))
      const word = apps[target].name.toLowerCase().slice(0, 4)
      for (let i = 1; i <= word.length; i++) {
        await wait(160)
        if (cancelled()) return
        setScene((s) => ({ ...s, query: word.slice(0, i) }))
      }
      await wait(350)
      setScene((s) => ({ ...s, pick: target }))
      await wait(450)
      setScene({ app: target, palette: false, query: '', pick: null })
    }
  }, [])
  useLoop(visible && !reduced, script)

  const shown = reduced ? { ...rest, palette: true } : scene
  const matches = apps
    .map((a, i) => ({ ...a, i }))
    .filter((a) => a.name.toLowerCase().startsWith(shown.query))

  return (
    <div
      ref={ref}
      style={orbitTheme}
      className="relative rounded-2xl border border-text/15 bg-white p-4 font-sans shadow-[0_24px_60px_-30px_rgba(26,26,26,0.35)] sm:p-6"
      aria-hidden
    >
      <div className="overflow-hidden rounded-2xl border border-[hsl(var(--night-edge))] bg-[hsl(var(--night-canvas))]">
        <div className="border-[hsl(var(--night-edge))] text-[hsl(var(--night-ink-faint))] flex items-center gap-4 border-b px-4 py-2.5 text-sm">
          <OrbitMark className="size-3.5" />
          <span>⌂</span>
          <span>‹</span>
          <span>›</span>
          <span>↻</span>
          <span>+</span>
          <span className="bg-[hsl(var(--night-raised))] text-[hsl(var(--night-ink-soft))] ml-auto w-1/2 truncate rounded-md px-3 py-1 text-right text-xs transition-all">
            https://{apps[shown.app].host}/
          </span>
        </div>
        <div className="flex aspect-[16/9] max-h-[640px] w-full">
          <div className="border-[hsl(var(--night-edge))] flex w-11 flex-col items-center gap-3 border-r pt-4">
            {apps.map((a, i) => (
              <span key={a.name} className="relative flex justify-center">
                {shown.app === i && (
                  <span className="bg-[hsl(var(--night-ink))] absolute top-1 -left-3 h-3 w-0.5 rounded-full" />
                )}
                <i
                  className={`block size-5 rounded-md transition-transform duration-300 ${a.tile} ${shown.app === i ? 'scale-110' : 'opacity-80'}`}
                />
              </span>
            ))}
            <span className="bg-[hsl(var(--night-edge))] h-px w-5" />
            {['G', 'G', 'A'].map((l, i) => (
              <span
                key={i}
                className="text-[hsl(var(--night-ink-soft))] bg-[hsl(var(--night-raised))] grid size-5 place-items-center rounded text-[10px]"
              >
                {l}
              </span>
            ))}
          </div>
          <div className="relative flex-1 overflow-hidden bg-[#f6f5f2] p-6 sm:p-10">
            <div key={shown.app} className="animate-[orbit-page_400ms_ease-out]">
              <Page app={shown.app} />
            </div>
            <div
              className={`bg-[hsl(var(--night-raised))] border-[hsl(var(--night-edge))] absolute top-[12%] left-1/2 w-[min(92%,520px)] -translate-x-1/2 rounded-xl border p-3 text-left shadow-2xl transition-all duration-200 ${shown.palette ? 'opacity-100' : 'pointer-events-none -translate-y-2 scale-95 opacity-0'}`}
            >
              <div className="bg-[hsl(var(--night-canvas))] text-[hsl(var(--night-ink))] rounded-lg px-3 py-2 text-xs sm:text-sm">
                {shown.query ? (
                  <>
                    {shown.query}
                    <span className="bg-[hsl(var(--night-ink))] ml-px inline-block h-3.5 w-px animate-pulse align-middle" />
                  </>
                ) : (
                  <span className="text-[hsl(var(--night-ink-soft))]">
                    {t.search}
                  </span>
                )}
              </div>
              <div className="text-[hsl(var(--night-ink-faint))] mt-3 px-1 text-[10px] tracking-widest uppercase">
                {t.apps}
              </div>
              <div className="mt-1.5 flex flex-wrap gap-1.5 px-1">
                {matches.map((a) => (
                  <span
                    key={a.name}
                    className={`rounded-full px-2.5 py-1 text-[11px] transition-colors ${shown.pick === a.i ? 'bg-[hsl(var(--night-ink))] text-[hsl(var(--night))]' : 'bg-[hsl(var(--night-canvas))] text-[hsl(var(--night-ink))]'}`}
                  >
                    {a.name}
                  </span>
                ))}
              </div>
              {!shown.query && (
                <>
                  <div className="text-[hsl(var(--night-ink-faint))] mt-3 px-1 text-[10px] tracking-widest uppercase">
                    {t.openPages}
                  </div>
                  {openPages.map((p, i) => (
                    <div
                      key={p}
                      className={`text-[hsl(var(--night-ink))] mt-1 rounded-md px-2 py-1.5 text-xs ${i === 0 ? 'bg-[hsl(var(--night-canvas))]' : ''}`}
                    >
                      {p}
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
