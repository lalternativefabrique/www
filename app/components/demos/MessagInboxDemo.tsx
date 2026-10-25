import { useCallback, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import type { Locale } from '@/lib/i18n'
import { useLoop, useOnScreen, useReducedMotion, type Waiter } from './playback'

const fr = {
  inbox: 'Boîte de réception',
  syncing: 'Synchronisation…',
  counter: (n: number) => `${n} messages`,
  rows: [
    {
      from: 'Camille Roy',
      subject: 'Compte rendu de lundi',
      preview: 'Les points qu’on a laissés ouverts…',
      at: '09:12',
      origin: 'Gmail',
    },
    {
      from: 'Atelier Nord',
      subject: 'Devis 2026-114',
      preview: 'Bonjour, veuillez trouver ci-joint…',
      at: '08:47',
      origin: 'orange.fr',
    },
    {
      from: 'Julien Meyer',
      subject: 'Re: planning de mars',
      preview: 'Ça me va pour le 12, je bloque…',
      at: '08:30',
      origin: 'Gmail',
    },
    {
      from: 'Service client',
      subject: 'Votre commande est expédiée',
      preview: 'Suivi disponible dès ce soir…',
      at: '07:58',
      origin: 'Outlook',
    },
    {
      from: 'Nadia Belkacem',
      subject: 'Photos du chantier',
      preview: 'Je t’envoie les dernières prises…',
      at: '07:21',
      origin: 'orange.fr',
    },
  ],
  sr: 'Une boîte de réception qui rassemble cinq messages venus de Gmail, d’Outlook et d’un compte IMAP, chacun marqué de son fournisseur.',
}

// Messag's landing ships in French only; there is no English copy to take.
const texts: Record<Locale, typeof fr> = { fr, en: fr }

const messagTheme = {
  '--background': '0 0% 100%',
  '--foreground': '229 85% 5%',
  '--card': '0 0% 100%',
  '--secondary': '210 41% 96%',
  '--muted-foreground': '215 18% 47%',
  '--border': '214 33% 91%',
  '--accent-soft': '213 100% 95%',
} as CSSProperties

const ROW_MS = 520

function OriginPill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex shrink-0 items-center rounded-full border border-border px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
      {children}
    </span>
  )
}

export function MessagInboxDemo({ locale }: { locale: Locale }) {
  const demoInbox = texts[locale]
  const ROWS = demoInbox.rows
  const ref = useRef<HTMLDivElement>(null)
  const onScreen = useOnScreen(ref)
  const reduced = useReducedMotion()

  const [shown, setShown] = useState(0)
  const [count, setCount] = useState(0)
  const [selected, setSelected] = useState(-1)

  const script = useCallback(
    async (wait: Waiter, isCancelled: () => boolean) => {
      setShown(0)
      setCount(0)
      setSelected(-1)
      await wait(600)
      for (let i = 1; i <= ROWS.length; i += 1) {
        if (isCancelled()) return
        setShown(i)
        await wait(ROW_MS)
      }
      for (let n = 1; n <= ROWS.length; n += 1) {
        if (isCancelled()) return
        setCount(n)
        await wait(180)
      }
      await wait(700)
      if (isCancelled()) return
      setSelected(2)
      await wait(1200)
      if (isCancelled()) return
      await wait(4000)
    },
    [ROWS.length],
  )

  useLoop(onScreen && !reduced, script)

  const shownRows = reduced ? ROWS.length : shown
  const shownCount = reduced ? ROWS.length : count
  const shownSelected = reduced ? 2 : selected
  const visible = ROWS.slice(0, shownRows)

  return (
    <div
      ref={ref}
      style={messagTheme}
      className="relative rounded-2xl border border-text/15 bg-white p-4 font-sans text-foreground shadow-[0_24px_60px_-30px_rgba(26,26,26,0.35)] sm:p-6"
    >
      <div className="overflow-hidden rounded-lg border border-border bg-card shadow-[0_1px_2px_oklch(0_0_0/0.04),0_8px_24px_-12px_oklch(0_0_0/0.10)]">
        <div className="hidden items-center gap-2 border-b border-border bg-secondary/60 px-4 py-2.5 sm:flex">
          <span className="size-2.5 rounded-full bg-border" />
          <span className="size-2.5 rounded-full bg-border" />
          <span className="size-2.5 rounded-full bg-border" />
          <span className="ml-3 truncate rounded-md bg-background px-2.5 py-1 text-xs text-muted-foreground">
            app.messag.eco
          </span>
        </div>
        <div aria-hidden="true" className="h-[300px] overflow-hidden sm:h-[400px]">
          <div className="flex h-full">
            <div className="hidden w-12 shrink-0 flex-col items-center gap-3 border-r border-border bg-secondary/40 py-4 sm:flex">
              {ROWS.slice(0, 3).map((_, i) => (
                <span
                  key={i}
                  className={`size-7 rounded-md border border-border transition-colors duration-500 ${
                    shownRows > i ? 'bg-[hsl(var(--accent-soft))]' : 'bg-transparent'
                  }`}
                />
              ))}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
                <span className="text-sm font-medium">{demoInbox.inbox}</span>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {shownRows === 0 ? demoInbox.syncing : demoInbox.counter(shownCount)}
                </span>
              </div>

              <ul className="divide-y divide-border">
                {visible.map((row, i) => (
                  <li
                    key={row.subject}
                    className={`flex items-start gap-3 px-3 py-2.5 transition-all duration-500 sm:px-4 sm:py-3 ${
                      shownSelected === i ? 'rounded-lg bg-secondary' : ''
                    }`}
                  >
                    <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-medium">
                      {row.from.charAt(0)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="truncate text-sm font-medium">{row.from}</span>
                        <OriginPill>{row.origin}</OriginPill>
                      </span>
                      <span className="mt-0.5 block truncate text-sm">{row.subject}</span>
                      <span className="mt-0.5 hidden truncate text-xs text-muted-foreground sm:block">
                        {row.preview}
                      </span>
                    </span>
                    <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                      {row.at}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <p className="sr-only">{demoInbox.sr}</p>
    </div>
  )
}
