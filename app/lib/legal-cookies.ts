import type { CookieEntry } from '@lalternative/legal'

/**
 * Set by Better Auth on the /admin back-office only; a visitor who never signs
 * in carries none of them. Names follow the default `better-auth` prefix — the
 * platform auth package sets no `advanced.cookiePrefix` — and gain a
 * `__Secure-` prefix in production.
 */
export const COOKIES_FR: CookieEntry[] = [
  {
    name: 'better-auth.session_token',
    purpose:
      "Maintien de la session d'administration : identifie la session ouverte entre deux pages de la rédaction",
    retention: '7 jours',
  },
  {
    name: 'better-auth.session_data',
    purpose:
      "Cache signé des données de session, pour éviter une lecture en base à chaque page",
    retention: '5 minutes',
  },
  {
    name: 'better-auth.dont_remember',
    purpose:
      "Mémorise le refus d'une session persistante : la connexion expire alors à la fermeture du navigateur",
    retention: 'session',
  },
  {
    name: 'better-auth.state, better-auth.pkce_code_verifier',
    purpose:
      "Sécurité de la connexion : protègent l'échange d'authentification contre le rejeu et la falsification de requête",
    retention: '15 minutes',
  },
]

export const COOKIES_EN: CookieEntry[] = [
  {
    name: 'better-auth.session_token',
    purpose:
      'Keeps the back-office session open between two editorial pages',
    retention: '7 days',
  },
  {
    name: 'better-auth.session_data',
    purpose:
      'Signed session cache, so every page need not read the database again',
    retention: '5 minutes',
  },
  {
    name: 'better-auth.dont_remember',
    purpose:
      'Records a refusal of a persistent session: sign-in then expires when the browser closes',
    retention: 'session',
  },
  {
    name: 'better-auth.state, better-auth.pkce_code_verifier',
    purpose:
      'Sign-in security: protect the authentication exchange against replay and request forgery',
    retention: '15 minutes',
  },
]
