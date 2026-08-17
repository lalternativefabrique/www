import { Link, Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { AdminLayout } from '@lalternative/admin'
import { currentAdmin } from '@/server/admin-session'

/**
 * The screens that require a session. Pathless, so /admin/articles keeps its
 * URL while sitting behind this guard — and /admin/login, which is not a child
 * of it, stays reachable.
 *
 * This decides what to render. It is not what protects the data: every server
 * function checks the session itself, since one is reachable by anyone who
 * knows its URL.
 */
export const Route = createFileRoute('/admin/_authed')({
  beforeLoad: async ({ location }) => {
    const admin = await currentAdmin()
    if (!admin) {
      throw redirect({
        to: '/admin/login',
        search: { redirect: location.href },
      })
    }
    return { admin }
  },
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
              className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
              activeProps={{ className: 'px-3 py-2 text-sm text-foreground' }}
            >
              {item.label}
            </Link>
          ))}
        </>
      }
      backToApp={
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
          Retour au site
        </Link>
      }
    >
      <Outlet />
    </AdminLayout>
  )
}
