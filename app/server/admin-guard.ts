import { getRequest } from '@tanstack/react-start/server'

/**
 * The admin behind the current request, or undefined.
 *
 * Every server function that reads or writes admin data calls this first. The
 * route guard in the browser only decides what to render — it is not what keeps
 * a server function from running, so the check has to live here too.
 */

export type Admin = { id: string; email: string }

export async function requireAdmin(): Promise<Admin | undefined> {
  try {
    const { auth } = await import('./auth')
    const session = await auth().api.getSession({
      headers: getRequest().headers,
    })

    if (!session?.user) return undefined

    // The single admin rule, shared with the UI through @lalternative/admin's
    // hasAdminFeatures. A user with no role is a signed-in reader, not an admin.
    const role = (session.user as { role?: string | null }).role
    if (role !== 'admin') return undefined

    return { id: session.user.id, email: session.user.email }
  } catch {
    // An unconfigured database or secret means no session can be read, which is
    // the same answer as an anonymous request: not an admin.
    return undefined
  }
}
