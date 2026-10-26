import { applications } from '@/content/catalogue'

export type Remplacement = { avant: string; apres: string; url?: string }

const urlDe = (nom: string) => applications.find((a) => a.name === nom)?.url

export const remplacements: ReadonlyArray<Remplacement> = [
  { avant: 'Gmail, Outlook', apres: 'Messag' },
  { avant: 'Mailchimp, SendGrid', apres: 'Spore' },
  { avant: 'ChatGPT', apres: "L'Alter" },
  { avant: 'Notion, Readwise', apres: 'Synthiz' },
  { avant: 'Buffer, Hootsuite', apres: 'Partage' },
  { avant: 'Google Analytics', apres: 'Nakoda' },
  { avant: 'Google Search', apres: 'Tornad' },
].map((r) => ({ ...r, url: urlDe(r.apres) }))
  .concat({ avant: 'Stripe', apres: 'Mollie', url: 'https://www.mollie.com' })
