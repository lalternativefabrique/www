import { createServerFn } from '@tanstack/react-start'

/**
 * Creating the first administrator.
 *
 * Reachable without a session, which is the whole point — and why it refuses
 * as soon as one admin exists. An open endpoint that grants the admin role is
 * how a back-office is taken over.
 */

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

export const createFirstAdmin = createServerFn({ method: 'POST' })
  .inputValidator((d: { name: string; email: string; password: string }) => d)
  .handler(
    async ({ data }): Promise<{ ok: true } | { ok: false; error: string }> => {
      const { query, dbConfigured } = await import('./db')
      if (!dbConfigured) {
        return { ok: false, error: 'La base de données n’est pas configurée.' }
      }

      // Checked again here rather than trusting the screen: the form hides
      // itself once an admin exists, but this function is reachable directly.
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

      const { auth } = await import('./auth')

      try {
        // Signing up through Better Auth rather than inserting a row: it owns
        // the password hashing and the account record, and a hand-written user
        // would have neither.
        await auth().api.signUpEmail({
          body: {
            name: data.name.trim(),
            email: data.email.trim().toLowerCase(),
            password: data.password,
          },
        })
      } catch (err) {
        return {
          ok: false,
          error: err instanceof Error ? err.message : String(err),
        }
      }

      // The role is not something sign-up can set — it is what this endpoint
      // exists to grant, once.
      await query(`UPDATE "user" SET role = 'admin' WHERE email = $1`, [
        data.email.trim().toLowerCase(),
      ])

      return { ok: true }
    },
  )
