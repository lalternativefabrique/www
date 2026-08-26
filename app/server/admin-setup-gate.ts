const REQUIRED_TOKEN = process.env.ADMIN_SETUP_TOKEN
const ALLOWED_EMAILS = process.env.ADMIN_ALLOWED_EMAILS?.split(',')
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean)

/**
 * startSetup is reachable with no session by design (the first admin can't
 * authenticate before they exist). Without this gate, whoever reaches it
 * first — not necessarily the operator who deployed the service — creates
 * the account and receives the OTP that activates it. The OTP only proves
 * the requester controls the address they typed in, not that they are
 * authorized to become admin at all. Both checks are opt-in via env so
 * existing deployments aren't locked out until they're configured.
 */
export function checkAdminSetupGate(email: string, setupToken: string | undefined): string | null {
  if (REQUIRED_TOKEN && setupToken !== REQUIRED_TOKEN) {
    return 'Jeton de configuration invalide ou manquant.'
  }
  if (ALLOWED_EMAILS && !ALLOWED_EMAILS.includes(email.trim().toLowerCase())) {
    return 'Cette adresse n’est pas autorisée à créer le compte administrateur.'
  }
  return null
}
