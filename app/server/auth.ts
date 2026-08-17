import { createPlatformAuth } from '@lalternative/auth/server'
import { configureSporeClient, getSporeAPI } from '@lalternative/spore-sdk'
import pg from 'pg'
import { db } from './db'

/**
 * Admin authentication.
 *
 * Server-only: this module holds the auth secret and the Spore key, and
 * importing it from a component would ship both to the browser.
 *
 * createPlatformAuth requires a verified email address, so nobody — the first
 * admin included — can sign in until SPORE_API_KEY and SPORE_FROM are set and
 * the sending domain is verified.
 */

const SPORE_FROM = process.env.SPORE_FROM ?? 'noreply@lalter.org'

let sporeReady = false

/**
 * Delivers the mails Better Auth renders: verification codes, sign-in codes,
 * password resets. Configuration is deferred rather than run at import so the
 * module can be loaded — by a typecheck, by the build — without a key.
 */
async function mailer(args: { to: string; subject: string; html: string }) {
  if (!process.env.SPORE_API_KEY) {
    throw new Error('SPORE_API_KEY is not set: no verification mail can be sent.')
  }

  if (!sporeReady) {
    configureSporeClient({ apiKey: process.env.SPORE_API_KEY })
    sporeReady = true
  }

  try {
    await getSporeAPI().sendEmail({
      from: SPORE_FROM,
      // The API takes a list, not an address.
      to: [args.to],
      subject: args.subject,
      html: args.html,
    })
  } catch (err) {
    // The SDK throws the raw axios error, whose message says nothing about
    // which send failed. Better Auth logs what comes out of here.
    const status = (err as { response?: { status?: number } })?.response?.status
    const body = (err as { response?: { data?: { message?: string } } })
      ?.response?.data
    throw new Error(
      `Spore refused the ${args.subject} mail to ${args.to} (${status ?? 'no status'}): ${
        body?.message ?? (err instanceof Error ? err.message : String(err))
      }`,
    )
  }
}

let instance: ReturnType<typeof createPlatformAuth> | undefined

export function auth() {
  if (!process.env.BETTER_AUTH_SECRET) {
    throw new Error('BETTER_AUTH_SECRET is not set.')
  }

  instance ??= createPlatformAuth({
    // Better Auth manages its own tables; it takes the pool, not our queries.
    database: db() as unknown as pg.Pool,
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.BETTER_AUTH_URL ?? 'http://localhost:3000',
    appName: "L'Alternative Fabrique",
    mailer,
  })

  return instance
}
