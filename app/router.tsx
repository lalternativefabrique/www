import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

export function getRouter() {
  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: 'intent',
    // Without this, loader data is stale the moment it lands: every visit
    // re-runs the loader, and preloading on hover fetches once for the hover
    // and again for the click. On the admin screens, where each loader is a
    // database round trip behind a session check, that showed up as seconds of
    // waiting per navigation.
    //
    // 30s is short enough that a screen reopened after acting on something
    // reloads, and the mutations invalidate the router themselves anyway.
    defaultStaleTime: 30_000,
    defaultPreloadStaleTime: 30_000,
  })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
