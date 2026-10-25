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
      { to: '/coulisses', label: 'Les coulisses' },
      { to: '/pot', label: 'Financement' },
      { to: '/participer', label: 'Participer' },
      { to: '/blog', label: 'Revue' },
      { to: '/a-propos', label: 'À propos' },
    ],
    action: { to: '/outils', hash: undefined, label: 'Applications' },
    more: [
      { to: '/projets', label: 'Projets' },
      { to: '/litterature', label: 'Littérature technique' },
    ],
    home: "L'Alternative Fabrique — accueil",
    mainNav: 'Navigation principale',
    footerTagline:
      "Nous reprenons nos moyens de produire en ligne. Utiliser une application finance la suivante.",
    navHeading: 'Navigation',
    contactHeading: 'Contact',
    motto: 'Nos outils, nos règles',
    switchTo: 'English',
    switchPath: '/en',
    legal: [
      { to: '/mentions-legales', label: 'Mentions légales' },
      { to: '/cookies', label: 'Politique cookies' },
    ],
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
    comments: {
      kicker: 'Discussion',
      none: 'Aucun commentaire pour le moment.',
      heading: (n: number) => (n === 1 ? 'Un commentaire' : `${n} commentaires`),
      pendingTag: 'en attente de lecture',
      guestLead: "Pour qu'on puisse vous répondre : votre email, ou votre compte messag.",
      emailLabel: 'Votre adresse email',
      emailPlaceholder: 'vous@exemple.fr',
      emailNote: "L'email n'est jamais publié.",
      registerTail: ', une adresse sobre et sans publicité.',
      nameLabel: 'Signer (facultatif)',
      namePlaceholder: 'Votre nom',
      bodyLabel: 'Votre commentaire',
      signupLead: 'Une adresse à vous, sobre et sans publicité ?',
      websiteLabel: 'Site web',
      or: 'ou',
      messagSignIn: 'Se connecter avec messag',
      noAccount: 'Pas de compte messag ?',
      register: 'Créer un compte',
      writingAs: (name: string) => `Votre commentaire, signé ${name}`,
      submit: 'Envoyer',
      sending: 'Envoi…',
      posted: "C'est reçu. Il sera publié après lecture.",
      error: "L'envoi n'a pas fonctionné. Réessayez dans un instant.",
      moderationNote: 'Les commentaires sont lus avant publication.',
    },
  },
  en: {
    nav: [
      { to: '/en/projets', label: 'Projects' },
      { to: '/en/pot', label: 'Funding' },
      { to: '/en/take-part', label: 'Take part' },
      { to: '/en/blog', label: 'Review' },
      { to: '/en/a-propos', label: 'About' },
    ],
    action: { to: '/en/outils', hash: undefined, label: 'Applications' },
    more: [{ to: '/en/literature', label: 'Technical literature' }],
    home: "L'Alternative Fabrique — home",
    mainNav: 'Main navigation',
    footerTagline:
      'We are taking back our means of producing online. Using one application funds the next.',
    navHeading: 'Navigation',
    contactHeading: 'Contact',
    motto: 'Our tools, our rules',
    switchTo: 'Français',
    switchPath: '/',
    legal: [
      { to: '/en/mentions-legales', label: 'Legal notice' },
      { to: '/en/cookies', label: 'Cookie policy' },
    ],
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
    comments: {
      kicker: 'Discussion',
      none: 'No comments yet.',
      heading: (n: number) => (n === 1 ? 'One comment' : `${n} comments`),
      pendingTag: 'awaiting review',
      guestLead: 'So we can answer you: your email, or your messag account.',
      emailLabel: 'Your email address',
      emailPlaceholder: 'you@example.com',
      emailNote: 'The email is never published.',
      registerTail: ', a sober, ad-free address.',
      nameLabel: 'Sign (optional)',
      namePlaceholder: 'Your name',
      bodyLabel: 'Your comment',
      signupLead: 'An address of your own, sober and ad-free?',
      websiteLabel: 'Website',
      or: 'or',
      messagSignIn: 'Sign in with messag',
      noAccount: 'No messag account?',
      register: 'Create one',
      writingAs: (name: string) => `Your comment, signed ${name}`,
      submit: 'Send',
      sending: 'Sending…',
      posted: 'Received. It will appear once read.',
      error: 'Sending did not go through. Try again in a moment.',
      moderationNote: 'Comments are read before they are published.',
    },
  },
} as const
