import { Outlet, createFileRoute } from '@tanstack/react-router'
import adminCss from '@lalternative/admin/styles.css?url'

/**
 * Everything under /admin, signed in or not.
 *
 * The guard lives one level down, in the pathless _authed layout: login and
 * setup are under /admin too, and a sign-in screen behind its own guard
 * redirects to itself.
 *
 * The stylesheet is loaded here rather than in __root so the public site never
 * carries it — and so the login form is styled, which it is not if the sheet
 * only ships with the authenticated screens.
 */
export const Route = createFileRoute('/admin')({
  head: () => ({ links: [{ rel: 'stylesheet', href: adminCss }] }),
  component: () => (
    <div className="min-h-screen bg-neutral-950">
      <Outlet />
    </div>
  ),
})
