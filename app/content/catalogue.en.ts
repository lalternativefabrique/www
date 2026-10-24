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
    icone: '/images/apps/synthiz.png',
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
    icone: '/images/apps/spore.png',
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
    icone: '/images/apps/partage.png',
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
    icone: '/images/apps/messag.png',
    pilier: 'Communication',
    statut: 'Bientôt',
    url: 'https://messag.eco',
    resume: 'Mail, calendar and contacts, on desktop and mobile.',
    tagline: 'Your mailbox, without trackers.',
    detail:
      'Mail, calendar and contacts in one application, on desktop and mobile. Remote images stay blocked until you allow them: opening a message does not tell its sender.',
    pour: 'Anyone who wants to read their mail without being tracked',
    accent: 'paper',
  },
  {
    name: 'Lungor',
    icone: '/images/apps/lungor.png',
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
    icone: '/images/apps/skalpai.png',
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
    name: 'Nakoda',
    icone: '/images/apps/nakoda.png',
    pilier: 'Technique',
    statut: 'Bêta',
    url: 'https://nakoda.club',
    resume: 'Measure your apps’ audience and feedback.',
    tagline: 'Know who comes, what works and what jams, without trackers.',
    detail:
      'Visits, sign-ups and user feedback, gathered per application. Bug reports go straight to Skalpai. The applications on this page are measured with it.',
    pour: 'Software publishers and small teams',
    accent: 'paper',
  },
  {
    name: "L'Alter",
    icone: '/images/apps/lalter.png',
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
  {
    name: 'Cortext',
    pilier: 'Technique',
    statut: 'Disponible',
    resume: 'Declare and run agents for your team.',
    tagline: 'Your agents, declared and kept on your side.',
    detail:
      'The solution for businesses: you declare an agent, its tools and its keys, and it runs. Cortext already runs the agents of L\'Alter, Synthiz, Partage and Skalpai.',
    pour: 'Companies and teams that want their own agents',
    accent: 'secondary',
  },
  {
    name: 'Orbit',
    icone: '/images/apps/orbit.svg',
    pilier: 'Connaissance',
    statut: 'Bientôt',
    resume: 'Your workstation, in one piece.',
    tagline: 'Your sites, the assistant, your mail and your notes in one window.',
    detail:
      'A desktop application that brings together the sites you use, the assistant, your mail and your notes. Station, its local agent, works on your machine and never leaves it. We already use it every day.',
    pour: 'Anyone who works on a computer',
    accent: 'primary',
  },
  {
    name: 'ark',
    pilier: 'Technique',
    statut: 'Bientôt',
    resume: "L'Alter's code agent, on desktop and in the terminal.",
    tagline: 'A code agent that works on your machine.',
    detail:
      "It reads, edits and tests your code where it lives. Your account, your model and your memory stay L'Alter's. Part of this page's code was written with it.",
    pour: 'Developers',
    accent: 'paper',
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
      "Obtain our own authorisation to collect payments, instead of depending on a provider's licence.",
  },
]

export const etatEn: Record<Projet['etat'], string> = {
  'En cours': 'Under way',
  Ensuite: 'Next',
}

export function applicationsEnDuPilier(pilier: Pilier) {
  return applicationsEn.filter((application) => application.pilier === pilier)
}

export const aFinaliserEn = applicationsEn.filter(
  (application) => application.statut === 'Bientôt',
)

export const enServiceEn = applicationsEn.filter(
  (application) => application.statut !== 'Bientôt',
)
