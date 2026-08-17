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
  // lalt-admin is where the package reads its palette from, and where this app
  // overrides it with the revue's own — see app/styles/app.css. The package
  // sets the class on the components it renders itself; putting it here extends
  // the same tokens to the screens this app draws, so the dashboard and the
  // editor are not a different theme from the login form above them.
  component: () => (
    <div className="lalt-admin min-h-screen">
      <Outlet />
    </div>
  ),
})
