import { createServerFn } from '@tanstack/react-start'

/**
 * Creating the first administrator.
 *
 * Reachable without a session, which is the whole point — and why it refuses
 * as soon as one admin exists. An open endpoint that grants the admin role is
 * how a back-office is taken over.
 */

type OtpApi = {
  sendVerificationOTP: (args: {
    body: { email: string; type: 'email-verification' }
  }) => Promise<unknown>
  verifyEmailOTP: (args: {
    body: { email: string; otp: string }
  }) => Promise<unknown>
}

/**
 * The email-OTP endpoints, which exist on the instance but not on its type.
 *
 * createPlatformAuth always registers the emailOTP plugin, and both methods are
 * on `api` at runtime — verified by listing it. What the package exports is an
 * inferred type that does not carry the plugin's endpoints, so the calls do not
 * typecheck without this. Narrow rather than `any`: a rename upstream should
 * still break the build here.
 */
function otpApi(instance: ReturnType<typeof import('./auth').auth>): OtpApi {
  return instance.api as unknown as OtpApi
}

export const adminExists = createServerFn({ method: 'GET' }).handler(
  async (): Promise<boolean> => {
    const { query, dbConfigured } = await import('./db')
    if (!dbConfigured) return false

    // Better Auth owns this table; it is only read here, never written.
    const rows = await query<{ n: string }>(
      `SELECT count(*)::text AS n FROM "user" WHERE role = 'admin'`,
    ).catch(() => [])

    return Number(rows[0]?.n ?? 0) > 0
  },
)

/**
 * Creates the account and sends the code that will activate it.
 *
 * The order is Better Auth's, not a choice: sendVerificationOTP against an
 * address with no user answers {success:true} and sends nothing — it will not
 * disclose whether an address is registered. Sign-up is what triggers the mail,
 * and it does so on its own, so this creates the account and the code follows.
 *
 * The account is unverified until createFirstAdmin checks the code, and an
 * unverified user is one createPlatformAuth refuses to sign in. It is also not
 * an admin yet: the role is granted only once the code is verified, so a
 * half-finished setup leaves nothing that can reach the back-office.
 */
export const startSetup = createServerFn({ method: 'POST' })
  .inputValidator(
    (d: { name: string; email: string; password: string }) => d,
  )
  .handler(
    async ({ data }): Promise<{ ok: true } | { ok: false; error: string }> => {
      const { dbConfigured } = await import('./db')
      if (!dbConfigured) {
        return { ok: false, error: 'La base de données n\u2019est pas configurée.' }
      }

      if (await adminExists()) {
        return {
          ok: false,
          error: 'Un administrateur existe déjà. Utilisez la connexion.',
        }
      }

      if (data.password.length < 12) {
        return {
          ok: false,
          error: 'Le mot de passe doit faire au moins 12 caractères.',
        }
      }

      const email = data.email.trim().toLowerCase()
      const { auth } = await import('./auth')

      try {
        // Signing up through Better Auth rather than inserting a row: it owns
        // the password hashing and the account record, and a hand-written user
        // would have neither. The verification mail leaves with it.
        await auth().api.signUpEmail({
          body: { name: data.name.trim(), email, password: data.password },
        })
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        // Re-running the first step after a failed code is normal — the account
        // is already there, and what is wanted is another code.
        if (/exists|existe|déjà/i.test(message)) {
          try {
            await otpApi(auth()).sendVerificationOTP({
              body: { email, type: 'email-verification' },
            })
            return { ok: true }
          } catch {
            return { ok: false, error: message }
          }
        }
        return { ok: false, error: message }
      }

      return { ok: true }
    },
  )

/**
 * Finishes the setup: checks the code, then grants the role.
 *
 * The account was created by startSetup and is unverified until here. Verifying
 * is what makes it usable at all — createPlatformAuth refuses to sign in an
 * unverified address — and the role is granted only afterwards, so a code that
 * is never entered leaves an ordinary user with no way into the back-office.
 */
export const createFirstAdmin = createServerFn({ method: 'POST' })
  .inputValidator(
    (d: { name: string; email: string; password: string; code?: string }) => d,
  )
  .handler(
    async ({ data }): Promise<{ ok: true } | { ok: false; error: string }> => {
      const { query, dbConfigured } = await import('./db')
      if (!dbConfigured) {
        return { ok: false, error: 'La base de données n\u2019est pas configurée.' }
      }

      // Checked again here rather than trusting the screen: the form hides
      // itself once an admin exists, but this function is reachable directly.
      if (await adminExists()) {
        return {
          ok: false,
          error: 'Un administrateur existe déjà. Utilisez la connexion.',
        }
      }

      if (!data.code?.trim()) {
        return { ok: false, error: 'Saisissez le code reçu par courriel.' }
      }

      const email = data.email.trim().toLowerCase()
      const { auth } = await import('./auth')

      try {
        await otpApi(auth()).verifyEmailOTP({
          body: { email, otp: data.code.trim() },
        })
      } catch (err) {
        // The account stays, unverified and roleless: the code expires in five
        // minutes and asking for another is the first step run again, which is
        // less hostile than deleting an account over a mistyped digit.
        return {
          ok: false,
          error:
            err instanceof Error
              ? `Code refusé : ${err.message}`
              : 'Code refusé.',
        }
      }

      // The role is not something sign-up can set — it is what this endpoint
      // exists to grant, once, and only against an address now proven to be
      // readable by whoever is at the screen.
      await query(`UPDATE "user" SET role = 'admin' WHERE email = $1`, [email])

      return { ok: true }
    },
  )
