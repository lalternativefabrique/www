import type { Host, Publisher, Site } from '@lalternative/legal'
import { CONTACT_EMAIL, SITE_NAME } from '@/lib/seo'

export const PUBLISHER: Publisher = {
  name: SITE_NAME,
  legalForm: 'entrepreneur individuel (micro-entreprise)',
  address: ['8 route de la Taoulère', '64400 Eysus, France'],
  registration: '823 762 653 00033',
  apeCode: '6201Z',
  publicationDirector: 'Sylvain Lapart',
  vatExempt: true,
}

export const HOSTS: Host[] = [
  {
    name: 'Scaleway SAS',
    address: ["8 rue de la Ville-l'Évêque", '75008 Paris, France'],
  },
  {
    name: 'OVH SAS',
    address: ['2 rue Kellermann', '59100 Roubaix, France'],
  },
]

const PATHS = {
  legal: '/mentions-legales',
  cookies: '/cookies',
  privacy: '/mentions-legales',
  terms: '/mentions-legales',
} as const

export const SITE_FR: Site = {
  product: SITE_NAME,
  domain: 'lalternativefabrique.org',
  contactEmail: CONTACT_EMAIL,
  paths: PATHS,
}

export const SITE_EN: Site = {
  ...SITE_FR,
  paths: {
    legal: '/en/mentions-legales',
    cookies: '/en/cookies',
    privacy: '/en/mentions-legales',
    terms: '/en/mentions-legales',
  },
}

export const LEGAL_UPDATED_AT = '2026-09-05'

export const LEGAL_CLASSNAMES = {
  root: 'mx-auto w-full max-w-3xl px-6 py-16 sm:py-24',
  title: 'display-xl',
  updated: 'label mt-6 text-text/60',
  section: 'mt-14',
  sectionTitle: 'font-heading text-2xl uppercase leading-tight sm:text-3xl',
  sectionBody: 'prose-editorial mt-6 text-text/85',
  link: 'underline underline-offset-2 hover:text-accent-primary',
  list: 'list-disc space-y-2 pl-5',
} as const
