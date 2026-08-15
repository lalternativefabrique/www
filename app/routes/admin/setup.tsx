import { Link, createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import { AdminSetupForm } from '@lalternative/admin'
import { adminExists, createFirstAdmin } from '@/server/admin-setup'

/**
 * The first administrator, created before anyone can sign in.
 *
 * Closes as soon as one exists: an open endpoint that grants the admin role is
 * how a back-office is taken over. The redirect below hides the screen; the
 * server function refuses on its own, which is what actually protects it.
 */
export const Route = createFileRoute('/admin/setup')({
  beforeLoad: async () => {
    if (await adminExists()) {
      throw redirect({ to: '/admin/login' })
    }
  },
  component: Setup,
})

function Setup() {
  const router = useRouter()

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <AdminSetupForm
        onSubmit={async ({ name, email, password }) => {
          const res = await createFirstAdmin({
            data: { name, email, password },
          })
          if (!res.ok) throw new Error(res.error)
        }}
        onSuccess={() => router.navigate({ to: '/admin/login' })}
        title="L'Alternative Fabrique"
        subtitle="Premier administrateur"
        footer={
          <Link
            to="/admin/login"
            className="text-sm text-white/50 underline hover:text-white"
          >
            Se connecter
          </Link>
        }
      />
    </div>
  )
}
