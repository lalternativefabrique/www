import { createServerFn } from '@tanstack/react-start'

/**
 * Contributions to the pot, collected through Lungor.
 *
 * The app key authenticates this site as a whole, so it never reaches the
 * browser: a key in the bundle lets anyone open checkout sessions against the
 * app. The amount is checked here and again by Lungor, which prices the plan —
 * what this function sends is a request, not an instruction.
 *
 * Nothing is written locally. The payment, the customer and the invoice are
 * Lungor's records; this only opens the session and hands back where to go.
 */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const MIN_CENTS = 100
const MAX_CENTS = 500_000

const apiURL = process.env.LUNGOR_API_URL
const apiKey = process.env.LUNGOR_API_KEY
const planID = process.env.LUNGOR_DON_PLAN_ID
const siteURL = process.env.PUBLIC_SITE_URL

/**
 * A site without payment configuration still serves /pot: the section hides
 * itself rather than offering a form that cannot lead anywhere. Same reason
 * db.ts keeps dbConfigured — a local clone and the build run without any of it.
 */
export const donConfigured = Boolean(apiURL && apiKey && planID && siteURL)

type Echec =
  | 'invalid-email'
  | 'invalid-amount'
  | 'unavailable'
  | 'refused'

export const creerDon = createServerFn({ method: 'POST' })
  .inputValidator(
    (d: {
      amountCents: number
      email: string
      name?: string
      locale?: 'fr' | 'en'
    }) => d,
  )
  .handler(async ({ data }) => {
    if (!donConfigured) {
      return { ok: false as const, reason: 'unavailable' satisfies Echec }
    }

    const email = data.email.trim().toLowerCase()
    if (email.length > 254 || !EMAIL.test(email)) {
      return { ok: false as const, reason: 'invalid-email' satisfies Echec }
    }

    const amountCents = Math.round(data.amountCents)
    if (
      !Number.isFinite(amountCents) ||
      amountCents < MIN_CENTS ||
      amountCents > MAX_CENTS
    ) {
      return { ok: false as const, reason: 'invalid-amount' satisfies Echec }
    }

    const locale = data.locale ?? 'fr'
    const base = siteURL!.replace(/\/$/, '')
    const prefix = locale === 'en' ? '/en' : ''

    const res = await fetch(`${apiURL!.replace(/\/$/, '')}/finance/checkout`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        price_id: planID,
        amount_cents: amountCents,
        email,
        name: (data.name ?? '').trim().slice(0, 120),
        country: 'FR',
        // Lungor refuses anything that is not absolute https.
        success_url: `${base}${prefix}/pot/merci`,
        cancel_url: `${base}${prefix}/pot`,
        // Contributions carry no account, and Lungor scopes a customer by this
        // id. The address is what identifies a returning contributor.
        external_user_id: `don:${email}`,
      }),
    })

    if (!res.ok) {
      // The body carries Lungor's reason (amount out of range, plan closed).
      // It is logged rather than returned: it describes the catalogue, and the
      // visitor can act on none of it.
      console.error('lungor checkout refused', res.status, await res.text())
      return { ok: false as const, reason: 'refused' satisfies Echec }
    }

    const body = (await res.json()) as { redirect_url?: string }
    if (!body.redirect_url) {
      console.error('lungor checkout returned no redirect url')
      return { ok: false as const, reason: 'refused' satisfies Echec }
    }

    return { ok: true as const, redirectURL: body.redirect_url }
  })

export const bornes = { minCents: MIN_CENTS, maxCents: MAX_CENTS }
