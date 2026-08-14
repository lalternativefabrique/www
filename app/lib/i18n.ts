import { useRouterState } from '@tanstack/react-router'

export type Locale = 'fr' | 'en'

/** The /en prefix is the whole signal: no context, no loader data needed. */
export function localeFromPath(pathname: string): Locale {
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'fr'
}

export function useLocale(): Locale {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  return localeFromPath(pathname)
}

/**
 * Chrome shared by every page: navigation, footer, the language switch.
 *
 * Page bodies keep their own copy inside their route — splitting a whole page
 * into keys would scatter the prose across two files and make it harder to
 * write, not easier.
 */
export const chrome = {
  fr: {
    nav: [
      { to: '/apps', label: 'Organes' },
      { to: '/outils', label: 'Outils' },
      { to: '/pot', label: 'Pot commun' },
      { to: '/blog', label: 'Revue' },
      { to: '/a-propos', label: 'À propos' },
      { to: '/contact', label: 'Contact' },
    ],
    home: "L'Alternative Fabrique — accueil",
    mainNav: 'Navigation principale',
    footerTagline:
      "Des outils sobres pour construire une alternative. Un organe après l'autre.",
    navHeading: 'Navigation',
    contactHeading: 'Contact',
    motto: 'Nos outils, nos règles',
    switchTo: 'English',
    switchPath: '/en',
    signup: {
      done: "C'est noté. Vous recevrez le prochain numéro.",
      kicker: 'La revue',
      heading: 'Recevoir les prochains numéros.',
      blurb: "Quelques textes par an, rien d'autre. Pas de relance, pas de promotion.",
      emailLabel: 'Votre adresse email',
      placeholder: 'vous@exemple.fr',
      submit: "S'inscrire",
      sending: 'Envoi…',
      errorLead: "L'inscription n'a pas fonctionné. Écrivez-nous à",
    },
  },
  en: {
    nav: [
      { to: '/en/apps', label: 'Organs' },
      { to: '/en/outils', label: 'Tools' },
      { to: '/en/pot', label: 'Common pot' },
      { to: '/en/blog', label: 'Review' },
      { to: '/en/a-propos', label: 'About' },
      { to: '/en/contact', label: 'Contact' },
    ],
    home: "L'Alternative Fabrique — home",
    mainNav: 'Main navigation',
    footerTagline:
      'Frugal tools for building an alternative. One organ at a time.',
    navHeading: 'Navigation',
    contactHeading: 'Contact',
    motto: 'Our tools, our rules',
    switchTo: 'Français',
    switchPath: '/',
    signup: {
      done: 'Noted. You will get the next issue.',
      kicker: 'The review',
      heading: 'Get the next issues.',
      blurb: 'A few pieces a year, nothing else. No follow-ups, no promotions.',
      emailLabel: 'Your email address',
      placeholder: 'you@example.com',
      submit: 'Sign up',
      sending: 'Sending…',
      errorLead: 'Sign-up did not go through. Write to us at',
    },
  },
} as const
