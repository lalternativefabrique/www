import { createFileRoute, useRouter } from '@tanstack/react-router'
import { AdminLoginForm } from '@lalternative/admin'
import { startSso } from '@lalternative/auth'
import { authClient } from '@/lib/auth-client'
import { currentAdmin, ssoEnabled } from '@/server/admin-session'

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
  loader: () => ssoEnabled(),
})

function Login() {
  const router = useRouter()
  const { redirect } = Route.useSearch()
  const sso = Route.useLoaderData()

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
        sso={
          sso
            ? {
                only: true,
                signIn: async () => {
                  await startSso(authClient, { callbackURL: redirect ?? '/admin' })
                },
              }
            : undefined
        }
        title="L'Alternative Fabrique"
        subtitle="Administration"
      />
    </div>
  )
}
