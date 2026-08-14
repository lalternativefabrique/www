import { useState } from 'react'
import { chrome, useLocale } from '@/lib/i18n'
import { subscribe } from '@/server/submissions'

/**
 * Revue sign-up.
 *
 * Addresses are stored by this app now. It used to POST to whatever
 * VITE_INSCRIPTION_URL pointed at, which was nothing — the form dropped every
 * address it collected.
 *
 * A failure falls back to the contact address rather than reporting success,
 * since the person has no other way to know their sign-up went nowhere.
 */
const CONTACT = 'contact@lalternativefabrique.org'

type Etat = 'repos' | 'envoi' | 'ok' | 'erreur'

export function Inscription({ compact = false }: { compact?: boolean }) {
  const locale = useLocale()
  const t = chrome[locale].signup
  const [email, setEmail] = useState('')
  const [etat, setEtat] = useState<Etat>('repos')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setEtat('envoi')
    try {
      const res = await subscribe({
        data: { email, locale, source: window.location.pathname },
      })
      if (!res.ok) throw new Error(res.reason)
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
