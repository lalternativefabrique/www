import { useRef } from 'react'
import { Link, createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import { AdminSetupForm } from '@lalternative/admin'
import {
  adminExists,
  createFirstAdmin,
  startSetup,
} from '@/server/admin-setup'

/**
 * The first administrator, created before anyone can sign in.
 *
 * Closes as soon as one exists: an open endpoint that grants the admin role is
 * how a back-office is taken over. The redirect below hides the screen; the
 * server function refuses on its own, which is what actually protects it.
 */
export const Route = createFileRoute('/admin/setup')({
  validateSearch: (search: Record<string, unknown>): { token?: string } => ({
    token: typeof search.token === 'string' ? search.token : undefined,
  }),
  beforeLoad: async () => {
    if (await adminExists()) {
      throw redirect({ to: '/admin/login' })
    }
  },
  component: Setup,
})

function Setup() {
  const router = useRouter()
  const { token } = Route.useSearch()
  // The form hands onRequestCode the address alone, but creating the account is
  // what makes Better Auth send the code — and that needs the name and the
  // password too. They are read off the form's own inputs as they are typed,
  // which is the only place they exist before submit.
  const details = useRef({ name: '', password: '' })

  return (
    <div
      className="flex min-h-screen items-center justify-center px-6"
      onChange={(event) => {
        const input = event.target as HTMLInputElement
        if (input.type === 'password') details.current.password = input.value
        else if (input.type === 'text') details.current.name = input.value
      }}
    >
      <AdminSetupForm
        // Supplying this turns the form into two steps: details, then the
        // code. Without it the account was created unverified and the login
        // screen refused it — an account nobody could use, with no code ever
        // asked for.
        //
        // The form hands this step the address only, so the account itself is
        // created here rather than on submit: sign-up is what makes Better Auth
        // send the code, and there is nothing to send one about until the user
        // exists. Name and password travel through the ref the form filled on
        // its way here.
        onRequestCode={async (email) => {
          const res = await startSetup({
            data: {
              name: details.current.name,
              email,
              password: details.current.password,
              setupToken: token,
            },
          })
          if (!res.ok) throw new Error(res.error)
        }}
        onSubmit={async ({ name, email, password, code }) => {
          const res = await createFirstAdmin({
            data: { name, email, password, code },
          })
          if (!res.ok) throw new Error(res.error)
        }}
        onSuccess={() => router.navigate({ to: '/admin/login' })}
        title="L'Alternative Fabrique"
        subtitle="Premier administrateur"
        footer={
          <Link
            to="/admin/login"
            className="text-sm text-muted-foreground underline hover:text-foreground"
          >
            Se connecter
          </Link>
        }
      />
    </div>
  )
}
