import { getRequest } from '@tanstack/react-start/server'

/**
 * The admin behind the current request, or undefined.
 *
 * Every server function that reads or writes admin data calls this first. The
 * route guard in the browser only decides what to render — it is not what keeps
 * a server function from running, so the check has to live here too.
 */

export type Admin = { id: string; email: string }

/**
 * One session read per request, however many server functions ask for it.
 *
 * Reading a session hits the database, and a screen that loads two lists asks
 * twice for the same answer — the dashboard asks three times. Keyed on the
 * Request object so the memo cannot outlive the request it belongs to, and a
 * WeakMap so it is collected with it.
 */
const perRequest = new WeakMap<Request, Promise<Admin | undefined>>()

export async function requireAdmin(): Promise<Admin | undefined> {
  let request: Request
  try {
    request = getRequest()
  } catch {
    // Outside a request there is nothing to memoise against, and nothing to
    // authenticate either.
    return undefined
  }

  const cached = perRequest.get(request)
  if (cached) return cached

  const pending = read(request)
  perRequest.set(request, pending)
  return pending
}

async function read(request: Request): Promise<Admin | undefined> {
  try {
    const { auth } = await import('./auth')
    const session = await auth().api.getSession({ headers: request.headers })

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
