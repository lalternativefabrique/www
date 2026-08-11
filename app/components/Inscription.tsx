import { useState } from 'react'
import { chrome, useLocale } from '@/lib/i18n'

/**
 * Revue sign-up.
 *
 * The endpoint is injected at build time via VITE_INSCRIPTION_URL so the form
 * can move to Spore (or any provider) without touching this component. Spore
 * currently only sends mail — it has no subscriber list — so a provider that
 * stores addresses is needed until that exists.
 *
 * With no endpoint configured the form degrades to a mailto: link rather than
 * silently dropping addresses.
 */
const ENDPOINT = import.meta.env.VITE_INSCRIPTION_URL as string | undefined
const CONTACT = 'contact@lalternativefabrique.org'

type Etat = 'repos' | 'envoi' | 'ok' | 'erreur'

export function Inscription({ compact = false }: { compact?: boolean }) {
  const t = chrome[useLocale()].signup
  const [email, setEmail] = useState('')
  const [etat, setEtat] = useState<Etat>('repos')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!ENDPOINT) return
    setEtat('envoi')
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) throw new Error(String(res.status))
      setEtat('ok')
      setEmail('')
    } catch {
      setEtat('erreur')
    }
  }

  if (etat === 'ok') {
    return (
      <p className="chapeau text-accent-primary">
        {t.done}
      </p>
    )
  }

  return (
    <div>
      {!compact ? (
        <>
          <p className="label text-text/50">{t.kicker}</p>
          <p className="font-heading mt-4 text-3xl uppercase leading-tight sm:text-4xl">
            {t.heading}
          </p>
          <p className="mt-4 max-w-md text-base text-text/75">
            {t.blurb}
          </p>
        </>
      ) : null}

      {ENDPOINT ? (
        <form
          onSubmit={onSubmit}
          className={`flex flex-col gap-3 sm:flex-row ${compact ? 'mt-4' : 'mt-8'}`}
        >
          <label htmlFor="inscription-email" className="sr-only">
            {t.emailLabel}
          </label>
          <input
            id="inscription-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.placeholder}
            className="w-full border-2 border-text bg-bg px-4 py-3 text-base text-text placeholder:text-text/40 focus:outline-none focus:ring-2 focus:ring-accent-primary sm:max-w-xs"
          />
          <button
            type="submit"
            disabled={etat === 'envoi'}
            className="label border-2 border-text px-6 py-3 hover:bg-text hover:text-bg disabled:opacity-50"
          >
            {etat === 'envoi' ? t.sending : t.submit}
          </button>
        </form>
      ) : (
        <a
          href={`mailto:${CONTACT}?subject=${t.mailSubject}`}
          className={`label inline-flex w-fit items-center gap-3 border-2 border-text px-6 py-3 hover:bg-text hover:text-bg ${
            compact ? 'mt-4' : 'mt-8'
          }`}
        >
          {t.byEmail} <span aria-hidden>→</span>
        </a>
      )}

      {etat === 'erreur' ? (
        <p className="mt-4 text-base text-accent-primary">
          {t.errorLead}{' '}
          <a href={`mailto:${CONTACT}`} className="underline">
            {CONTACT}
          </a>
          .
        </p>
      ) : null}
    </div>
  )
}
