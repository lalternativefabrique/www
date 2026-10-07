import type { Application, Pilier, Projet, Statut } from './catalogue'

export const statutEn: Record<Statut, string> = {
  Disponible: 'Available',
  Bêta: 'Beta',
  Bientôt: 'Coming soon',
}

export const pilierEn: Record<Pilier, string> = {
  Connaissance: 'Knowledge',
  Technique: 'Technique',
  Communication: 'Communication',
  Financement: 'Funding',
}

export const applicationsEn: Application[] = [
  {
    name: 'Synthiz',
    pilier: 'Connaissance',
    statut: 'Disponible',
    url: 'https://synthiz.com',
    resume: 'Find and connect your sources.',
    tagline: 'Your working memory, fed by your sources.',
    detail:
      'Transcribe videos, podcasts and documents, then find, connect and summarise what you have gathered. Your notes and sources stay yours.',
    pour: 'Creators, researchers, consultants, analysts',
    prix: 'Free · Pro €5/month · Max €12/month',
    accent: 'primary',
  },
  {
    name: 'Spore',
    pilier: 'Communication',
    statut: 'Disponible',
    url: 'https://sporee.fr',
    resume: 'Send your emails from independent infrastructure.',
    tagline: 'Your emails leave from your own infrastructure.',
    detail:
      'Attach your domains, generate your DKIM identities, publish your DNS records and send. The SMTP infrastructure is ours: you are not renting a layer built on top of someone else.',
    pour: 'Technical teams sending transactional email',
    accent: 'paper',
  },
  {
    name: 'Partage',
    pilier: 'Communication',
    statut: 'Disponible',
    url: 'https://partagg.fr',
    resume: 'Write a post once, publish it on every network.',
    tagline: 'One draft, several networks, one date.',
    detail:
      'Write a text, adapt it to the voice of each network with a writing profile you tune, then schedule it. Publishes to LinkedIn, Bluesky and Dev.to.',
    pour: 'Independents and small teams that publish regularly',
    accent: 'secondary',
  },
  {
    name: 'Messag',
    pilier: 'Communication',
    statut: 'Bientôt',
    resume: 'Mail, calendar and contacts, on desktop and mobile.',
    tagline: 'Your mailbox, without trackers.',
    detail:
      'Mail, calendar and contacts in one application, on desktop and mobile. Remote images stay blocked until you allow them: opening a message does not tell its sender.',
    pour: 'Anyone who wants to read their mail without being tracked',
    accent: 'paper',
  },
  {
    name: 'Lungor',
    pilier: 'Financement',
    statut: 'Bêta',
    url: 'https://lungor.fr',
    resume: 'Steer the revenue of your software.',
    tagline: 'Your SaaS revenue, finally readable.',
    detail:
      'Revenue, subscriptions, reminders and compliant invoices on one dashboard. Lungor already collects the contributions made on this site. It relies on licensed payment providers: we never touch your bank details or the identity of your customers.',
    pour: 'Solo developers and small teams running a SaaS',
    projet: 'The project: collecting payments without a middleman',
    accent: 'warm',
  },
  {
    name: 'Skalpai',
    pilier: 'Technique',
    statut: 'Bêta',
    url: 'https://skalpai.dev',
    resume: 'Run and observe your applications.',
    tagline: 'See what your applications do, without spending a budget on it.',
    detail:
      'Observability and telemetry for your services, with the sklp CLI and the skt toolchain manager. It is the ground every application on this page runs on.',
    pour: 'Developers and small teams',
    accent: 'paper',
  },
  {
    name: "L'Alter",
    pilier: 'Connaissance',
    statut: 'Bêta',
    url: 'https://lalter.fr',
    resume: 'An assistant at your service.',
    tagline: 'An assistant that remembers and acts for you.',
    detail:
      'It keeps what you entrust to it, searches the web, reminds you of what needs reminding. On the web, on desktop and on mobile. It is an assistant, not an oracle: it can be wrong, and its answers are meant to be checked.',
    pour: 'Anyone who wants to delegate without handing their life to a large platform',
    accent: 'secondary',
  },
]

export const piliersEn: { name: Pilier; phrase: string }[] = [
  { name: 'Connaissance', phrase: 'Keep a hold on what you know.' },
  { name: 'Technique', phrase: 'Run your own services yourself.' },
  { name: 'Communication', phrase: 'Write and publish by your own means.' },
  { name: 'Financement', phrase: 'Collect and fund without a middleman.' },
]

export const projetsEn: Projet[] = [
  {
    nom: 'Reczi',
    etat: 'En cours',
    resume:
      'Publish videos, articles and podcasts on your own journal, without depending on YouTube or Substack.',
  },
  {
    nom: 'Collecting payments without a middleman',
    etat: 'En cours',
    resume:
      "Make Lungor an authorised payment institution, instead of depending on someone else's licence.",
  },
]

export const etatEn: Record<Projet['etat'], string> = {
  'En cours': 'Under way',
  Ensuite: 'Next',
}

export function applicationsEnDuPilier(pilier: Pilier) {
  return applicationsEn.filter((application) => application.pilier === pilier)
}
