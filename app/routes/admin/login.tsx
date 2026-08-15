import { Link, createFileRoute, useRouter } from '@tanstack/react-router'
import { AdminLoginForm } from '@lalternative/admin'
import { authClient } from '@/lib/auth-client'
import { currentAdmin } from '@/server/admin-session'

/**
 * Sign-in. A sibling of the _authed layout rather than a child, so the guard
 * that redirects here does not also guard this.
 */
export const Route = createFileRoute('/admin/login')({
  component: Login,
  validateSearch: (
    search: Record<string, unknown>,
  ): { redirect?: string } => ({
    redirect: typeof search.redirect === 'string' ? search.redirect : undefined,
  }),
})

function Login() {
  const router = useRouter()
  const { redirect } = Route.useSearch()

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <AdminLoginForm
        authClient={authClient}
        getProfile={async () => {
          const admin = await currentAdmin()
          // The form reads `roles` to decide whether the account may pass;
          // requireAdmin has already checked it on the server.
          return {
            user_id: admin?.id ?? '',
            email: admin?.email ?? '',
            name: admin?.email ?? '',
            roles: admin ? ['admin'] : [],
          }
        }}
        onSuccess={() => router.navigate({ to: redirect ?? '/admin' })}
        title="L'Alternative Fabrique"
        subtitle="Administration"
        footer={
          <Link
            to="/admin/setup"
            className="text-sm text-white/50 underline hover:text-white"
          >
            Créer le premier compte
          </Link>
        }
      />
    </div>
  )
}
