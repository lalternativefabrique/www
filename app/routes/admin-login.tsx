import { createFileRoute, useRouter } from '@tanstack/react-router'
import { AdminLoginForm } from '@lalternative/admin'
import { authClient } from '@/lib/auth-client'
import { currentAdmin } from '@/server/admin-session'

/**
 * Sign-in, deliberately outside /admin: the guard on that route redirects here,
 * and a login screen behind its own guard is a loop.
 */
export const Route = createFileRoute('/admin-login')({
  component: Login,
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search.redirect === 'string' ? search.redirect : undefined,
  }),
})

function Login() {
  const router = useRouter()
  const { redirect } = Route.useSearch()

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-6">
      <AdminLoginForm
        authClient={authClient}
        getProfile={async () => {
          const admin = await currentAdmin()
          // The form only reads `roles` to decide whether the account may pass;
          // requireAdmin has already checked it server-side.
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
      />
    </div>
  )
}
