export type Etape = {
  app: string
  date: string
  commits?: number
  pourquoi?: string
  episode?: string
}

export const histoire: ReadonlyArray<Etape> = [
  { app: 'Skalpai', date: '2026-03-01', commits: 3340, episode: 'coulisses-01-skalpai-le-socle', pourquoi: "Chaque entreprise technique qui dure repose sur une brique technique forte. Avant la première application, il fallait l'endroit où la faire tourner." },
  { app: 'Synthiz', date: '2026-03-09', commits: 3854, episode: 'coulisses-02-synthiz-tout-etait-conserve', pourquoi: "Tout était conservé. Rien n'était vraiment retrouvable." },
  { app: 'Spore', date: '2026-04-30', commits: 839, episode: 'coulisses-03-spore-donner-une-voix-aux-applications', pourquoi: "Une application doit pouvoir confirmer, informer et prévenir. Plutôt que payer une API d'envoi par application, nous avons construit cette voix une fois pour toutes." },
  { app: 'Lungor', date: '2026-05-22', commits: 2243, episode: 'coulisses-04-lungor-suivre-le-chemin-de-l-argent', pourquoi: "Un prix affiché à 5 € ne devient pas 5 € sur le compte. Lungor suit le chemin de l'argent, en attendant de pouvoir encaisser nous-mêmes." },
  { app: "L'Alter", date: '2026-08-07', commits: 1622, episode: 'coulisses-05-lalter-de-la-reponse-a-l-assistance', pourquoi: "Une réponse impressionne une fois. Une assistance utile doit tenir tous les jours." },
  { app: 'Partage', date: '2026-08-23', commits: 979, episode: 'coulisses-06-partage-sortir-de-l-atelier', pourquoi: "Jusqu'ici, nous apprenions à construire. Avec Partage, nous commençons à apprendre à être vus." },
  { app: 'Messag', date: '2026-08-18', commits: 1738, episode: 'coulisses-07-messag-les-cles-d-un-assistant-independant', pourquoi: "Un assistant ne peut pas aider s'il ne voit ni vos mails, ni votre agenda, ni vos fichiers. Messag lui ouvre cet accès, avec votre consentement." },
  { app: 'Nakoda', date: '2026-09-26', commits: 309 },
  { app: 'Orbit', date: '2026-10-20' },
]
