import { createServerFn } from '@tanstack/react-start'

/**
 * What the public site collects: newsletter sign-ups, and applications to join
 * the collective.
 *
 * Both are written by anonymous visitors, so both are idempotent on the email
 * address: a resubmission updates the existing row. That makes a double-click,
 * a retry or a refresh harmless, and leaves nothing to deduplicate at read
 * time.
 *
 * Neither ever reports whether an address is already known. Answering that
 * turns a public form into an oracle for testing whether someone subscribed.
 */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Trimmed, lowercased, length-bounded. Empty when it is not an address. */
function normalizeEmail(raw: string): string {
  const email = raw.trim().toLowerCase()
  // 254 is the maximum length of an address per RFC 5321.
  if (email.length > 254 || !EMAIL.test(email)) return ''
  return email
}

function clamp(raw: string, max: number): string {
  return raw.trim().slice(0, max)
}

export const subscribe = createServerFn({ method: 'POST' })
  .inputValidator(
    (d: { email: string; locale?: 'fr' | 'en'; source?: string }) => d,
  )
  .handler(async ({ data }) => {
    const email = normalizeEmail(data.email)
    if (!email) return { ok: false as const, reason: 'invalid-email' as const }

    const { query, dbConfigured } = await import('./db')
    if (!dbConfigured) return { ok: false as const, reason: 'unavailable' as const }

    // A resubscribe after unsubscribing clears the flag: the person is asking
    // again, and refusing silently would look like the form is broken.
    await query(
      `INSERT INTO subscribers (email, locale, source)
       VALUES ($1, $2, $3)
       ON CONFLICT (email) DO UPDATE
       SET unsubscribed_at = NULL,
           locale = EXCLUDED.locale,
           source = COALESCE(NULLIF(EXCLUDED.source, ''), subscribers.source)`,
      [email, data.locale ?? 'fr', clamp(data.source ?? '', 120)],
    )

    return { ok: true as const }
  })

export const apply = createServerFn({ method: 'POST' })
  .inputValidator(
    (d: {
      email: string
      name: string
      message?: string
      links?: string
      locale?: 'fr' | 'en'
    }) => d,
  )
  .handler(async ({ data }) => {
    const email = normalizeEmail(data.email)
    if (!email) return { ok: false as const, reason: 'invalid-email' as const }

    const name = clamp(data.name, 120)
    if (!name) return { ok: false as const, reason: 'missing-name' as const }

    const { query, dbConfigured } = await import('./db')
    if (!dbConfigured) return { ok: false as const, reason: 'unavailable' as const }

    // Resubmitting replaces the text but keeps the review state: someone who
    // sends twice must not silently reopen a decision already taken.
    await query(
      `INSERT INTO applications (email, name, message, links, locale)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (email) DO UPDATE
       SET name = EXCLUDED.name,
           message = EXCLUDED.message,
           links = EXCLUDED.links,
           locale = EXCLUDED.locale`,
      [
        email,
        name,
        clamp(data.message ?? '', 4000),
        clamp(data.links ?? '', 1000),
        data.locale ?? 'fr',
      ],
    )

    return { ok: true as const }
  })
