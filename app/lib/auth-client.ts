import { createPlatformAuthClient } from '@lalternative/auth/client'

/**
 * Browser-side auth. Talks to the handler mounted at /api/auth/*.
 *
 * Same origin as the site, so no base URL is configured here: an absolute one
 * would have to be kept in step with wherever the app is deployed.
 */
export const authClient = createPlatformAuthClient({})
