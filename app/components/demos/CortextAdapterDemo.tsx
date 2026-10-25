import { useCallback, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import type { Locale } from '@/lib/i18n'
import {
  pauseAfter,
  useLoop,
  useOnScreen,
  useReducedMotion,
  type Waiter,
} from './playback'

const cortextTheme = {
  '--background': '30 8% 5%',
  '--foreground': '30 10% 92%',
  '--card': '30 6% 9%',
  '--secondary': '30 5% 14%',
  '--muted-foreground': '30 5% 60%',
  '--border': '30 5% 17%',
  '--brand': '158 47% 46%',
} as CSSProperties

type Part = 'mission' | 'dossiers' | 'web' | 'preuves' | 'limites' | 'ia'

type Scene = {
  job: string
  mission: string
  access: string
  ai: string
  question: string
  steps: Array<string>
  uses: Array<Part>
  answer: string
}

const scenes: Array<Scene> = [
  {
    job: 'Service client',
    mission:
      'Réponds avec courtoisie. Consulte toujours la commande avant de répondre.',
    access: 'Tickets, commandes',
    ai: 'Mistral',
    question: "Ma commande 4182 n'est pas arrivée.",
    steps: ['Lit le ticket', 'Suit la commande 4182'],
    uses: ['mission', 'dossiers'],
    answer:
      "Votre commande 4182 est partie mardi. Elle est bloquée au centre de tri de Lyon depuis hier. J'ai ouvert une réclamation : vous recevrez un nouveau suivi sous 48 heures.",
  },
  {
    job: 'Veille',
    mission: 'Surveille les annonces de nos concurrents. Cite chaque source.',
    access: 'Recherche et lecture web',
    ai: 'Scaleway',
    question: "Qu'ont annoncé nos concurrents cette semaine ?",
    steps: ['Cherche les annonces', 'Lit deux articles'],
    uses: ['mission', 'web', 'preuves'],
    answer:
      'Deux annonces cette semaine. Acme baisse son offre d’entrée de 20 % [1]. Nordia ouvre un centre à Francfort [2]. Rien de notable chez les autres.',
  },
  {
    job: 'Analyse',
    mission:
      'Analyse les ventes. Chaque chiffre doit venir des données, avec le calcul.',
    access: 'Base des ventes',
    ai: 'DeepSeek',
    question: 'Comment évoluent les ventes du trimestre ?',
    steps: ['Interroge la base des ventes', 'Vérifie chaque chiffre'],
    uses: ['mission', 'dossiers', 'preuves'],
    answer:
      'Le chiffre d’affaires passe de 412 k€ à 467 k€, soit +13,3 %. La hausse vient surtout du Sud-Ouest : 38 k€ sur les 55 k€ gagnés.',
  },
]

const company: Array<{ id: Part; label: string; hint: string }> = [
  { id: 'mission', label: 'La mission', hint: 'votre métier, votre ton' },
  { id: 'dossiers', label: 'Vos dossiers', hint: 'clients, commandes, ventes' },
  { id: 'web', label: 'Le web', hint: 'recherche, lecture' },
]

const frame: Array<{ id: Part; label: string; hint: string }> = [
  { id: 'preuves', label: 'Des preuves', hint: 'chaque chiffre sourcé' },
  { id: 'limites', label: 'Des limites', hint: 'un budget par client' },
]

export function CortextAdapterDemo({ locale }: { locale: Locale }) {
  const ref = useRef<HTMLDivElement>(null)
  const visible = useOnScreen(ref)
  const reduced = useReducedMotion()
  const [paused, setPaused] = useState(false)
  const [index, setIndex] = useState(0)
  const [typed, setTyped] = useState({ mission: '', access: '', ai: '' })
  const [done, setDone] = useState<Array<string>>([])
  const [answer, setAnswer] = useState('')
  const [lit, setLit] = useState<Array<Part>>([])
  const [status, setStatus] = useState('')
  const start = useRef(0)

  const script = useCallback(
    async (wait: Waiter, cancelled: () => boolean) => {
      const s = scenes[start.current % scenes.length]
      setIndex(start.current % scenes.length)
      setTyped({ mission: '', access: '', ai: '' })
      setDone([])
      setAnswer('')
      setLit([])
      setStatus('')
      if (reduced) {
        setTyped({ mission: s.mission, access: s.access, ai: s.ai })
        setDone(s.steps)
        setAnswer(s.answer)
        setLit([...s.uses, 'limites', 'ia'])
        setStatus('Réponse prête')
        await wait(6000)
        start.current += 1
        return
      }
      for (const key of ['mission', 'access', 'ai'] as const) {
        for (let i = 1; i <= s[key].length; i++) {
          if (cancelled()) return
          setTyped((t) => ({ ...t, [key]: s[key].slice(0, i) }))
          await wait(14)
        }
      }
      await wait(500)
      setLit(['mission'])
      setStatus('Lit sa mission')
      await wait(900)
      for (const step of s.steps) {
        if (cancelled()) return
        setLit([...s.uses.filter((u) => u !== 'preuves'), 'ia'])
        setStatus(step)
        await wait(1100)
        setDone((d) => [...d, step])
      }
      setLit(['ia', 'limites'])
      setStatus(`Rédige avec ${s.ai}`)
      let text = ''
      for (const word of s.answer.split(' ')) {
        if (cancelled()) return
        text = text ? `${text} ${word}` : word
        setAnswer(text)
        await wait(pauseAfter(word, 55))
      }
      setLit(s.uses.includes('preuves') ? ['preuves', 'limites'] : ['limites'])
      setStatus(
        s.uses.includes('preuves')
          ? 'Sources vérifiées, budget respecté'
          : 'Budget respecté',
      )
      await wait(3500)
      start.current += 1
    },
    [reduced],
  )

  useLoop(visible && !paused, script)

  const scene = scenes[index]
  const on = (p: Part) => lit.includes(p)

  return (
    <div
      ref={ref}
      style={cortextTheme}
      lang={locale === 'fr' ? undefined : 'fr'}
      className="relative rounded-2xl border border-text/15 bg-white p-4 font-sans shadow-[0_24px_60px_-30px_rgba(26,26,26,0.35)] sm:p-6"
    >
      <div className="flex flex-col gap-10 rounded-xl bg-background p-4 text-foreground sm:p-6">
        <div
          className="grid items-stretch gap-3 md:grid-cols-[1fr_auto_1.1fr_auto_1fr]"
          aria-label="L'entreprise, cortext, l'intelligence artificielle"
        >
          <Column title="Votre entreprise" heading="Ce que vous savez faire">
            {company.map((c) => (
              <Chip key={c.id} active={on(c.id)} {...c} />
            ))}
          </Column>
          <Wire active={lit.length > 0} />
          <Column title="cortext" heading="L'agent" core>
            <Chip
              id="mission"
              active={on('mission')}
              label="Son rôle"
              hint="les mêmes à chaque réponse"
            />
            {frame.map((c) => (
              <Chip key={c.id} active={on(c.id)} {...c} />
            ))}
            <p className="mt-2 min-h-5 text-xs text-[hsl(var(--brand))]" aria-live="polite">
              {status}
            </p>
          </Column>
          <Wire active={on('ia')} />
          <Column
            title="L'intelligence artificielle"
            heading="Celle que vous choisissez"
          >
            <Chip
              id="ia"
              active={on('ia')}
              label="Mistral, Scaleway, OVH…"
              hint="vous en changez quand vous voulez"
            />
            <Chip
              id="limites"
              active={false}
              label="Votre abonnement"
              hint="payé directement, sans marge"
            />
          </Column>
        </div>

        <div>
          <div className="mb-4 flex flex-wrap items-center gap-2" role="tablist">
            {scenes.map((s, i) => (
              <button
                key={s.job}
                type="button"
                role="tab"
                aria-selected={i === index}
                onClick={() => {
                  start.current = i
                  setPaused(false)
                  setIndex(i)
                }}
                className={`rounded-full border px-4 py-1.5 text-sm ${
                  i === index
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border text-muted-foreground hover:text-foreground'
                }`}
              >
                {s.job}
              </button>
            ))}
            <button
              type="button"
              aria-pressed={paused}
              onClick={() => setPaused((p) => !p)}
              className="ml-auto rounded-md border border-border px-3 py-1 text-xs text-muted-foreground hover:text-foreground"
            >
              {paused ? 'Lecture' : 'Pause'}
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr_1.25fr]">
            <Pane title="La fiche de poste de l'agent">
              <Field label="Métier" value={scene.job} />
              <Field label="Mission" value={typed.mission} />
              <Field label="Accès" value={typed.access} />
              <Field label="Intelligence artificielle" value={typed.ai} />
            </Pane>
            <Pane title="Dans votre application">
              <p className="mb-4 rounded-lg bg-secondary px-3 py-2 text-sm">
                « {scene.question} »
              </p>
              <ul className="mb-4 flex flex-wrap gap-2">
                {done.map((d) => (
                  <li
                    key={d}
                    className="rounded-full border border-emerald-500/50 px-3 py-0.5 text-xs text-emerald-400"
                  >
                    ✓ {d}
                  </li>
                ))}
              </ul>
              <p className="min-h-28 leading-relaxed" aria-live="polite">
                {answer}
              </p>
            </Pane>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Démonstration illustrative : la commande, les concurrents et les
            chiffres sont fictifs.
          </p>
        </div>
      </div>
    </div>
  )
}

function Column({
  title,
  heading,
  core,
  children,
}: {
  title: string
  heading: string
  core?: boolean
  children: ReactNode
}) {
  return (
    <div
      className={`rounded-xl border bg-card p-5 ${
        core ? 'border-[hsl(var(--brand)/0.7)] ring-4 ring-[hsl(var(--brand)/0.1)]' : 'border-border'
      }`}
    >
      <p className="text-xs tracking-widest text-muted-foreground uppercase">
        {title}
      </p>
      <p className="mb-3 text-lg font-semibold">{heading}</p>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  )
}

function Chip({
  label,
  hint,
  active,
}: {
  id: Part
  label: string
  hint: string
  active: boolean
}) {
  return (
    <div
      className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
        active ? 'border-[hsl(var(--brand)/0.7)] bg-[hsl(var(--brand)/0.1)]' : 'border-border'
      }`}
    >
      <span
        className={`size-1.5 shrink-0 rounded-full ${active ? 'bg-[hsl(var(--brand))]' : 'bg-muted-foreground'}`}
      />
      <span>
        <b className="font-semibold">{label}</b>
        <span className="text-muted-foreground"> — {hint}</span>
      </span>
    </div>
  )
}

function Wire({ active }: { active: boolean }) {
  return (
    <div
      aria-hidden
      className={`h-6 w-0.5 self-center justify-self-center md:h-0.5 md:w-12 ${
        active ? 'bg-[hsl(var(--brand))]' : 'bg-border'
      } transition-colors`}
    />
  )
}

function Pane({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <p className="border-b border-border px-4 py-2.5 text-xs text-muted-foreground">
        {title}
      </p>
      <div className="p-4">{children}</div>
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="mb-3">
      <p className="mb-1 text-xs text-muted-foreground">{label}</p>
      <p className="min-h-9 rounded-md border border-border bg-background px-3 py-1.5 text-sm">
        {value}
      </p>
    </div>
  )
}
