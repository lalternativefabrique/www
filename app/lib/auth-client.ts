import { createPlatformAuthClient } from '@lalternative/auth/client'

/**
 * Browser-side auth. Talks to the handler mounted at /api/auth/*.
 *
 * Same origin as the site, so no base URL is configured here: an absolute one
 * would have to be kept in step with wherever the app is deployed.
 */
export const authClient = createPlatformAuthClient({})

/**
 * The suite's sign-in, branded Messag: urbangate shows its Messag screen
 * (sign in with a messag address, or create one) when the authorization
 * request carries `brand=messag`, which is what the auth package's own
 * "sign in with messag" sends. The reader lands back on `callbackURL`.
 */
export function startMessagSignIn(callbackURL: string) {
  return authClient.signIn.social({
    provider: 'urbangate',
    callbackURL,
    errorCallbackURL: callbackURL,
    additionalParams: { brand: 'messag', prompt: 'login' },
  } as Parameters<typeof authClient.signIn.social>[0])
}
