import { useCallback, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import type { Locale } from '@/lib/i18n'
import { useLoop, useOnScreen, useReducedMotion, type Waiter } from './playback'

const texts = {
  fr: {
    stage: {
      send: "Votre app appelle l'API",
      trust: "Spore authentifie l'envoi",
      track: "L'email est remis",
      inbound: 'La réponse arrive',
      notify: 'Votre app est notifiée',
    },
    panel: {
      app: 'Votre application',
      trust: "Identité d'envoi",
      mailbox: 'Boîte du destinataire',
      notify: 'Webhook vers votre app',
    },
    fromAddress: 'facture@sporee.fr',
    webhookUrl: 'POST https://votre-app/webhooks',
    accepted: '202 Accepted',
    notified: '200 OK',
    trustBody:
      "Le domaine est vérifié une fois pour toutes. Chaque message part signé, ce qui le fait entrer en boîte de réception plutôt qu'en indésirable.",
    mailSubject: 'Votre facture #4021',
    replySubject: 'Re : Votre facture #4021',
    footnote:
      "Spore suit la remise du message, pas son ouverture : aucun pixel espion n'est inséré dans vos emails.",
    sr: "Le cycle complet d'un email : votre application envoie une requête POST /emails, Spore signe le message avec DKIM, SPF et DMARC, l'email est remis au destinataire et émet l'évènement email.delivered, le destinataire répond, Spore reçoit la réponse et livre l'évènement message.received à votre application par webhook signé.",
  },
  en: {
    stage: {
      send: 'Your app calls the API',
      trust: 'Spore signs the send',
      track: 'The email is delivered',
      inbound: 'The reply comes in',
      notify: 'Your app is notified',
    },
    panel: {
      app: 'Your application',
      trust: 'Sending identity',
      mailbox: 'Recipient mailbox',
      notify: 'Webhook to your app',
    },
    fromAddress: 'invoices@sporee.fr',
    webhookUrl: 'POST https://your-app/webhooks',
    accepted: '202 Accepted',
    notified: '200 OK',
    trustBody:
      'The domain is verified once and for all. Every message leaves signed, which is what puts it in the inbox rather than the spam folder.',
    mailSubject: 'Your invoice #4021',
    replySubject: 'Re: Your invoice #4021',
    footnote:
      'Spore tracks delivery, not opens: no tracking pixel is ever inserted into your emails.',
    sr: 'The full life of an email: your application sends a POST /emails request, Spore signs the message with DKIM, SPF and DMARC, the email is delivered to the recipient and emits the email.delivered event, the recipient replies, Spore receives the reply and hands the message.received event to your application over a signed webhook.',
  },
}

const sporeTheme = {
  '--foreground': '240 11% 4%',
  '--card': '0 0% 100%',
  '--primary': '133 100% 27%',
  '--primary-foreground': '0 0% 98%',
  '--muted': '240 4% 96%',
  '--muted-foreground': '240 4% 46%',
  '--border': '240 6% 90%',
} as CSSProperties

const icones = {
  arrowRight: 'M5 12h14M12 5l7 7-7 7',
  bellRing:
    'M10.27 21a2 2 0 0 0 3.46 0M3.26 15.33A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.67C19.41 13.96 18 12.5 18 8A6 6 0 0 0 6 8c0 4.5-1.41 5.96-2.74 7.33M22 8c0-2.3-.8-4.3-2-6M4 2C2.8 3.7 2 5.7 2 8',
  check: 'M20 6L9 17l-5-5',
  inbox:
    'M22 12h-6l-2 3h-4l-2-3H2M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z',
  loader: 'M21 12a9 9 0 1 1-6.22-8.56',
  mailCheck:
    'M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8M22 7l-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7M16 19l2 2 4-4',
  send: 'M14.54 21.69a.5.5 0 0 0 .94-.03l6.5-19a.5.5 0 0 0-.64-.64l-19 6.5a.5.5 0 0 0-.03.94l7.93 3.18a2 2 0 0 1 1.11 1.11zM21.85 2.15L10.91 13.09',
  shieldCheck:
    'M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1zM9 12l2 2 4-4',
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
  | 'sending'
  | 'accepted'
  | 'signing'
  | 'trusted'
  | 'delivering'
  | 'delivered'
  | 'replying'
  | 'received'
  | 'notifying'
  | 'notified'

const RANK: Record<Phase, number> = {
  idle: 0,
  sending: 1,
  accepted: 2,
  signing: 3,
  trusted: 4,
  delivering: 5,
  delivered: 6,
  replying: 7,
  received: 8,
  notifying: 9,
  notified: 10,
}

type StageKey = 'send' | 'trust' | 'track' | 'inbound' | 'notify'

const STAGES: ReadonlyArray<{
  key: StageKey
  icon: keyof typeof icones
  active: Phase
  done: Phase
}> = [
  { key: 'send', icon: 'send', active: 'sending', done: 'accepted' },
  { key: 'trust', icon: 'shieldCheck', active: 'signing', done: 'trusted' },
  { key: 'track', icon: 'mailCheck', active: 'delivering', done: 'delivered' },
  { key: 'inbound', icon: 'inbox', active: 'replying', done: 'received' },
  { key: 'notify', icon: 'bellRing', active: 'notifying', done: 'notified' },
]

const CHECKS = ['DKIM', 'SPF', 'DMARC'] as const

export function SporeWorkflowDemo({ locale }: { locale: Locale }) {
  const t = texts[locale]
  const rootRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const onScreen = useOnScreen(rootRef)
  const [phase, setPhase] = useState<Phase>('idle')
  const [lines, setLines] = useState(0)

  const requestLines = [
    'POST /emails',
    '{',
    `  "from": "${t.fromAddress}",`,
    '  "to": ["client@gmail.com"],',
    `  "subject": "${t.mailSubject}"`,
    '}',
  ]

  const script = useCallback(
    async (wait: Waiter, isCancelled: () => boolean) => {
      setPhase('idle')
      setLines(0)
      await wait(700)

      setPhase('sending')
      for (let i = 1; i <= requestLines.length; i++) {
        if (isCancelled()) return
        setLines(i)
        await wait(150)
      }
      await wait(500)
      setPhase('accepted')
      await wait(900)

      setPhase('signing')
      await wait(1500)
      setPhase('trusted')
      await wait(900)

      setPhase('delivering')
      await wait(1400)
      setPhase('delivered')
      await wait(1100)

      setPhase('replying')
      await wait(1500)
      setPhase('received')
      await wait(1000)

      setPhase('notifying')
      await wait(1200)
      setPhase('notified')
      await wait(4500)
    },
    [requestLines.length],
  )

  useLoop(onScreen && !reduced, script)

  const shown: Phase = reduced ? 'notified' : phase
  const rank = RANK[shown]
  const shownLines = reduced ? requestLines.length : lines

  return (
    <div
      ref={rootRef}
      style={sporeTheme}
      className="relative rounded-2xl border border-text/15 bg-white p-4 text-left font-sans text-foreground shadow-[0_24px_60px_-30px_rgba(26,26,26,0.35)] sm:p-6"
    >
      <ol aria-hidden="true" className="grid gap-2 sm:grid-cols-5 sm:gap-3">
        {STAGES.map((stage) => {
          const isDone = rank >= RANK[stage.done]
          const isActive = rank >= RANK[stage.active] && !isDone
          return (
            <li
              key={stage.key}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 transition-colors duration-500 ${
                isDone
                  ? 'border-primary/40 bg-primary/5'
                  : isActive
                    ? 'border-primary/40 bg-card'
                    : 'border-border/60 bg-muted/30'
              }`}
            >
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors duration-500 ${
                  isDone
                    ? 'bg-primary text-primary-foreground'
                    : isActive
                      ? 'bg-primary/15 text-primary'
                      : 'bg-border/70 text-muted-foreground'
                }`}
              >
                {isDone ? (
                  <Icone nom="check" className="h-3.5 w-3.5" strokeWidth={3} />
                ) : isActive ? (
                  <Icone nom="loader" className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Icone nom={stage.icon} className="h-3.5 w-3.5" />
                )}
              </span>
              <span
                className={`text-xs font-medium leading-tight transition-colors duration-500 ${
                  isDone || isActive ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                {t.stage[stage.key]}
              </span>
            </li>
          )
        })}
      </ol>

      <div
        aria-hidden="true"
        className="mt-4 grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-stretch"
      >
        <div className="flex flex-col gap-3">
          <Panel label={t.panel.app}>
            <pre className="overflow-x-auto font-mono text-[11px] leading-relaxed text-muted-foreground sm:text-xs">
              {requestLines.slice(0, shownLines).map((line, i) => (
                <div
                  key={line}
                  className={i === 0 ? 'font-semibold text-foreground' : undefined}
                >
                  {line}
                </div>
              ))}
              {!reduced && shown === 'sending' && (
                <span className="inline-block h-[1.05em] w-px animate-pulse bg-foreground align-text-bottom" />
              )}
            </pre>
            <Badge show={rank >= RANK.accepted} text={t.accepted} />
          </Panel>

          <Panel label={t.panel.notify} muted={rank < RANK.notifying}>
            <div
              className={`transition-opacity duration-500 ${
                rank >= RANK.notifying ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <pre className="overflow-x-auto font-mono text-[11px] leading-relaxed text-muted-foreground sm:text-xs">
                <div className="font-semibold text-foreground">{t.webhookUrl}</div>
                <div>Spore-Signature: t=…,v1=…</div>
                <div>{'{ "type": "message.received" }'}</div>
              </pre>
              <Badge show={rank >= RANK.notified} text={t.notified} />
            </div>
          </Panel>
        </div>

        <div className="flex items-center justify-center lg:flex-col">
          <Icone
            nom="arrowRight"
            className={`h-5 w-5 shrink-0 transition-colors duration-500 ${
              rank >= RANK.signing ? 'text-primary' : 'text-border'
            }`}
          />
        </div>

        <div className="flex flex-col gap-3">
          <Panel label={t.panel.trust} muted={rank < RANK.signing}>
            <div className="flex flex-wrap gap-1.5">
              {CHECKS.map((check) => (
                <span
                  key={check}
                  className={`rounded-full border px-2 py-0.5 font-mono text-[11px] transition-colors duration-500 ${
                    rank >= RANK.trusted
                      ? 'border-primary/40 bg-primary/5 text-foreground'
                      : 'border-border/60 text-muted-foreground'
                  }`}
                >
                  {check}
                </span>
              ))}
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              {t.trustBody}
            </p>
          </Panel>

          <Panel label={t.panel.mailbox} muted={rank < RANK.delivering}>
            <div
              className={`transition-opacity duration-500 ${
                rank >= RANK.delivering ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <p className="text-xs font-medium text-foreground">{t.mailSubject}</p>
              <Badge show={rank >= RANK.delivered} text="email.delivered" mono />
              <div
                className={`mt-3 border-t border-border/60 pt-3 transition-opacity duration-500 ${
                  rank >= RANK.replying ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <p className="text-xs font-medium text-foreground">
                  {t.replySubject}
                </p>
                <Badge show={rank >= RANK.received} text="message.received" mono />
              </div>
            </div>
          </Panel>
        </div>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
        {t.footnote}
      </p>
      <p className="sr-only">{t.sr}</p>
    </div>
  )
}

function Panel({
  label,
  children,
  muted = false,
}: {
  label: string
  children: ReactNode
  muted?: boolean
}) {
  return (
    <div
      className={`flex-1 rounded-xl border p-3.5 transition-colors duration-500 sm:p-4 ${
        muted ? 'border-border/60 bg-muted/20' : 'border-border/80 bg-card'
      }`}
    >
      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </span>
      <div className="mt-2.5">{children}</div>
    </div>
  )
}

function Badge({
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
      className={`mt-2 inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/5 px-2 py-0.5 text-[11px] text-foreground transition-opacity duration-500 ${
        show ? 'opacity-100' : 'opacity-0'
      } ${mono ? 'font-mono' : 'font-medium'}`}
    >
      <Icone nom="check" className="h-3 w-3 text-primary" strokeWidth={3} />
      {text}
    </span>
  )
}
