import { useCallback, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import type { Locale } from '@/lib/i18n'
import { useLoop, useOnScreen, useReducedMotion, type Waiter } from './playback'

type VariantKey = 'bluesky' | 'linkedin' | 'devto'

type Variant = { platform: string; limit: string; shape: string; body: string }

const texts: Record<
  Locale,
  {
    draft: { label: string; body: string; badge: string }
    variants: Record<VariantKey, Variant>
    review: string
    schedule: string
    footnote: string
    sr: string
  }
> = {
  fr: {
    draft: {
      label: 'Ton brouillon',
      body: 'On a réécrit la file de publication : plus de perte de post quand la plateforme répond en erreur, on réessaie et on te dit ce qui s’est passé.',
      badge: 'Brouillon',
    },
    variants: {
      bluesky: {
        platform: 'Bluesky',
        limit: '300',
        shape: 'Accroche',
        body: 'Un post qui échoue ne disparaît plus. On réessaie, et tu vois pourquoi ça a raté.',
      },
      linkedin: {
        platform: 'LinkedIn',
        limit: '3 000',
        shape: 'Accroche',
        body: 'Perdre un post parce que l’API a renvoyé une 500, c’est le genre de détail qui coûte une semaine de régularité.\n\nLa file réessaie désormais toute seule.',
      },
      devto: {
        platform: 'Dev.to',
        limit: '—',
        shape: 'Article',
        body: '## Pourquoi une file de publication\n\nUne publication programmée traverse un réseau qu’on ne contrôle pas…',
      },
    },
    review: 'Tu relis avant que ça parte',
    schedule: 'scheduled',
    footnote:
      'Rien n’est publié sans que tu l’aies vu : chaque variante passe par ta relecture avant d’être programmée.',
    sr: 'Le parcours d’un post : tu écris un seul brouillon, Partage en produit une variante pour Bluesky limitée à 300 caractères, une accroche pour LinkedIn, un post X limité à 280 caractères et un article pour Dev.to, en gardant ta façon d’écrire. Tu relis les trois variantes, puis tu les programmes : la publication part à la date choisie, sans que tu sois devant ton écran.',
  },
  en: {
    draft: {
      label: 'Your draft',
      body: 'We rewrote the publishing queue: a post is no longer lost when the platform errors out — it is retried, and you get told what happened.',
      badge: 'Draft',
    },
    variants: {
      bluesky: {
        platform: 'Bluesky',
        limit: '300',
        shape: 'Hook',
        body: 'A failed post no longer vanishes. It gets retried, and you see why it broke.',
      },
      linkedin: {
        platform: 'LinkedIn',
        limit: '3,000',
        shape: 'Hook',
        body: 'Losing a post because the API returned a 500 is the kind of detail that costs a week of consistency.\n\nThe queue now retries on its own.',
      },
      devto: {
        platform: 'Dev.to',
        limit: '—',
        shape: 'Article',
        body: '## Why a publishing queue\n\nA scheduled post crosses a network nobody controls…',
      },
    },
    review: 'You read it before it goes out',
    schedule: 'scheduled',
    footnote:
      'Nothing is published without you seeing it: every variant goes through your review before it is scheduled.',
    sr: 'The life of a post: you write a single draft, Partage produces a Bluesky variant capped at 300 characters, a LinkedIn hook, an X post capped at 280 characters and a Dev.to article, keeping the way you write. You review all three variants, then schedule them: the post goes out on the date you picked, without you sitting at your screen.',
  },
}

const partageTheme = {
  '--foreground': '60 4% 11%',
  '--brand': '213 67% 50%',
  '--surface': '60 9% 98%',
  '--muted-foreground': '45 3% 52%',
  '--border': '60 6% 91%',
} as CSSProperties

const icones = {
  check: 'M20 6L9 17l-5-5',
  loader: 'M21 12a9 9 0 1 1-6.22-8.56',
}

function Icone({
  nom,
  className,
  strokeWidth = 2,
}: {
  nom: keyof typeof icones
  className?: string
  strokeWidth?: number
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d={icones[nom]} />
    </svg>
  )
}

type Phase =
  | 'idle'
  | 'typing'
  | 'drafted'
  | 'adapting'
  | 'bluesky'
  | 'linkedin'
  | 'devto'
  | 'reviewed'
  | 'scheduling'
  | 'scheduled'

const RANK: Record<Phase, number> = {
  idle: 0,
  typing: 1,
  drafted: 2,
  adapting: 3,
  bluesky: 4,
  linkedin: 5,
  devto: 6,
  reviewed: 7,
  scheduling: 8,
  scheduled: 9,
}

const VARIANTS: ReadonlyArray<{ key: VariantKey }> = [
  { key: 'bluesky' },
  { key: 'linkedin' },
  { key: 'devto' },
]

export function PartageDraftDemo({ locale }: { locale: Locale }) {
  const copy = texts[locale]
  const rootRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const onScreen = useOnScreen(rootRef)
  const [phase, setPhase] = useState<Phase>('idle')
  const [typed, setTyped] = useState(0)

  const draft = copy.draft.body
  const script = useCallback(
    async (wait: Waiter, isCancelled: () => boolean) => {
      setPhase('idle')
      setTyped(0)
      await wait(600)

      setPhase('typing')
      for (let i = 1; i <= draft.length; i += 2) {
        if (isCancelled()) return
        setTyped(i)
        await wait(18)
      }
      setTyped(draft.length)
      await wait(400)
      setPhase('drafted')
      await wait(700)

      setPhase('adapting')
      await wait(1100)
      setPhase('bluesky')
      await wait(600)
      setPhase('linkedin')
      await wait(600)
      setPhase('devto')
      await wait(900)

      setPhase('reviewed')
      await wait(1000)
      setPhase('scheduling')
      await wait(1000)
      setPhase('scheduled')
      await wait(4500)
    },
    [draft],
  )

  useLoop(onScreen && !reduced, script)

  const shown: Phase = reduced ? 'scheduled' : phase
  const rank = RANK[shown]
  const shownDraft = reduced ? draft : draft.slice(0, typed)

  return (
    <div
      ref={rootRef}
      style={partageTheme}
      className="relative rounded-2xl border border-text/15 bg-white p-5 text-left font-sans text-[hsl(var(--foreground))] shadow-[0_24px_60px_-30px_rgba(26,26,26,0.35)] sm:p-7"
    >
      <div
        aria-hidden="true"
        className="grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)] lg:items-start"
      >
        <Panel label={copy.draft.label}>
          <p className="min-h-[5.5rem] text-sm leading-relaxed text-[hsl(var(--foreground))]">
            {shownDraft}
            {!reduced && shown === 'typing' && (
              <span className="ml-px inline-block h-[1.1em] w-px animate-pulse bg-[hsl(var(--foreground))] align-text-bottom" />
            )}
          </p>
          <Tag show={rank >= RANK.drafted} text={copy.draft.badge} />
        </Panel>

        <div className="grid gap-3 sm:grid-cols-3">
          {VARIANTS.map(({ key }) => {
            const variant = copy.variants[key]
            const done = rank >= RANK[key]
            const busy = rank >= RANK.adapting && !done
            return (
              <div
                key={key}
                className={`rounded-2xl border p-4 transition-colors duration-500 ${
                  done
                    ? 'border-[hsl(var(--brand)/0.4)] bg-[hsl(var(--surface))]'
                    : 'border-[hsl(var(--border))] bg-[hsl(var(--surface)/0.4)]'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium tracking-tight">
                    {variant.platform}
                  </span>
                  <span className="font-mono text-[10px] text-[hsl(var(--muted-foreground))] tabular-nums">
                    {variant.limit}
                  </span>
                </div>

                <div className="mt-3 min-h-[4.5rem]">
                  {busy ? (
                    <Icone
                      nom="loader"
                      className="size-4 animate-spin text-[hsl(var(--brand))]"
                    />
                  ) : (
                    <p
                      className={`text-xs leading-relaxed text-[hsl(var(--muted-foreground))] transition-opacity duration-500 ${
                        done ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      {variant.body}
                    </p>
                  )}
                </div>

                <span
                  className={`mt-3 inline-block rounded-full border border-[hsl(var(--border))] px-2 py-0.5 text-[10px] text-[hsl(var(--muted-foreground))] transition-opacity duration-500 ${
                    done ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  {variant.shape}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      <div
        aria-hidden="true"
        className="mt-5 flex flex-wrap items-center gap-3 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--surface)/0.4)] px-4 py-3"
      >
        <Tag show={rank >= RANK.reviewed} text={copy.review} />
        <Tag show={rank >= RANK.scheduled} text={copy.schedule} mono />
      </div>

      <p className="mt-4 text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">
        {copy.footnote}
      </p>
      <p className="sr-only">{copy.sr}</p>
    </div>
  )
}

function Panel({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-4 sm:p-5">
      <span className="text-[10px] font-semibold tracking-[0.18em] text-[hsl(var(--muted-foreground))] uppercase">
        {label}
      </span>
      <div className="mt-3">{children}</div>
    </div>
  )
}

function Tag({
  show,
  text,
  mono = false,
}: {
  show: boolean
  text: string
  mono?: boolean
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-[hsl(var(--brand)/0.4)] bg-[hsl(var(--brand)/0.05)] px-2.5 py-0.5 text-[11px] text-[hsl(var(--foreground))] transition-opacity duration-500 ${
        show ? 'opacity-100' : 'opacity-0'
      } ${mono ? 'font-mono' : 'font-medium'}`}
    >
      <Icone nom="check" className="size-3 text-[hsl(var(--brand))]" strokeWidth={3} />
      {text}
    </span>
  )
}
