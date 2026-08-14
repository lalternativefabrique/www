import { Link, Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { AdminLayout } from '@lalternative/admin'
import adminCss from '@lalternative/admin/styles.css?url'
import { currentAdmin } from '@/server/admin-session'

/**
 * The admin shell: everything under /admin renders inside it, and nothing does
 * without a session carrying the admin role.
 *
 * This guard decides what to render. It is not what protects the data — every
 * server function checks the session itself, since one is reachable by anyone
 * who knows its URL.
 */
export const Route = createFileRoute('/admin')({
  beforeLoad: async ({ location }) => {
    const admin = await currentAdmin()
    if (!admin) {
      throw redirect({
        to: '/admin-login',
        search: { redirect: location.href },
      })
    }
    return { admin }
  },
  // Loaded here rather than in __root: the public site never renders these
  // components, and has no reason to carry their stylesheet.
  head: () => ({ links: [{ rel: 'stylesheet', href: adminCss }] }),
  component: AdminShell,
})

const NAV = [
  // Exact on the dashboard only: every other path starts with /admin, so it
  // would otherwise stay highlighted on all of them.
  { to: '/admin', label: 'Tableau de bord', exact: true },
  { to: '/admin/articles', label: 'Articles', exact: false },
  { to: '/admin/candidatures', label: 'Candidatures', exact: false },
  { to: '/admin/inscriptions', label: 'Inscriptions', exact: false },
] as const

function AdminShell() {
  return (
    <AdminLayout
      app={{ name: "L'Alternative", tone: 'amber' }}
      nav={
        <>
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.exact }}
              className="px-3 py-2 text-sm text-white/60 hover:text-white"
              activeProps={{ className: 'px-3 py-2 text-sm text-white' }}
            >
              {item.label}
            </Link>
          ))}
        </>
      }
      backToApp={
        <Link to="/" className="text-sm text-white/60 hover:text-white">
          Retour au site
        </Link>
      }
    >
      <Outlet />
    </AdminLayout>
  )
}
