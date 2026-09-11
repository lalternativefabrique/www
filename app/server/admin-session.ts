import { createServerFn } from '@tanstack/react-start'

/**
 * The signed-in admin, for the route guard.
 *
 * Separate from requireAdmin, which server functions call: this one crosses the
 * network to the browser, so it returns a shape safe to serialize and never the
 * session itself.
 */
export const currentAdmin = createServerFn({ method: 'GET' }).handler(
  async (): Promise<{ id: string; email: string } | undefined> => {
    const { requireAdmin } = await import('./admin-guard')
    return requireAdmin()
  },
)

export const ssoEnabled = createServerFn({ method: 'GET' }).handler(
  async (): Promise<boolean> => {
    const { ssoConfig } = await import('./auth')
    return ssoConfig !== undefined
  },
)
