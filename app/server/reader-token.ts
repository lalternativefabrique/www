/**
 * The urbangate access token of the person behind a request, or undefined.
 *
 * Signing in through the suite's identity provider leaves the OAuth tokens in
 * Better Auth's account row; getAccessToken hands back the current one and
 * refreshes it when it has lapsed. An anonymous request has no session, and
 * listUserAccounts throws on it, which the catch turns into "no token". A
 * password-only session has no provider account, and is anonymous as far as
 * the chat service is concerned.
 */
export async function readerAccessToken(
  request: Request,
): Promise<string | undefined> {
  try {
    const { auth, ssoConfig } = await import('./auth')
    if (!ssoConfig) return undefined

    const accounts = await auth().api.listUserAccounts({
      headers: request.headers,
    })
    const account = accounts.find((a) => a.providerId === 'urbangate')
    if (!account) return undefined

    const res = await auth().api.getAccessToken({
      headers: request.headers,
      body: { accountId: account.id },
    })
    return res?.accessToken ?? undefined
  } catch {
    return undefined
  }
}
