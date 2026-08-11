import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
  useRouterState,
} from '@tanstack/react-router'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import appCss from '@/styles/app.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      { title: "L'Alternative Fabrique" },
      {
        name: 'description',
        content:
          "L'Alternative Fabrique — construire une alternative en reprenant les moyens techniques, économiques et de gouvernance. Un organe après l'autre.",
      },
      // Social previews. Per-route head() overrides title/description above.
      { property: 'og:site_name', content: "L'Alternative Fabrique" },
      { property: 'og:type', content: 'website' },
      { property: 'og:locale', content: 'fr_FR' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
      { rel: 'icon', href: '/favicon-32.png', type: 'image/png' },
      { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: '' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700&display=swap',
      },
    ],
  }),
  shellComponent: RootDocument,
  component: RootContent,
  notFoundComponent: NotFound,
})

function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6">
      <div className="text-center">
        <p className="display-xl text-accent-primary">404</p>
        <p className="mt-4 label text-text/60">Page introuvable</p>
      </div>
    </div>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  // The /en prefix is what makes a page English, so the pathname is the whole
  // signal — no context or loader data needed to set the document language.
  const { pathname } = useRouterState({ select: (s) => s.location })
  const lang = pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'fr'

  return (
    <html lang={lang}>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}

function RootContent() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
