export type Pilier = 'Connaissance' | 'Technique' | 'Communication' | 'Financement'

export type Statut = 'Disponible' | 'Bêta' | 'Bêta sur invitation' | 'Bientôt'

export type Application = {
  name: string
  icone?: string
  pilier: Pilier
  statut: Statut
  url?: string
  resume: string
  tagline: string
  detail: string
  pour: string
  prix?: string
  projet?: string
  accent: 'primary' | 'secondary' | 'warm' | 'paper'
}

export const applications: Application[] = [
  {
    name: 'Synthiz',
    icone: '/images/apps/synthiz.png',
    pilier: 'Connaissance',
    statut: 'Disponible',
    url: 'https://synthiz.com',
    resume: 'Retrouver et relier ses sources.',
    tagline: 'Retrouvez ce que vous avez appris.',
    detail:
      "Transcrivez vidéos, podcasts et documents, puis retrouvez, reliez et synthétisez ce que vous avez accumulé. Vos notes et vos sources restent les vôtres.",
    pour: 'Créateurs, chercheurs, consultants, veilleurs',
    prix: 'Gratuit · Pro 5 €/mois · Max 12 €/mois',
    accent: 'primary',
  },
  {
    name: 'Spore',
    icone: '/images/apps/spore.png',
    pilier: 'Communication',
    statut: 'Disponible',
    url: 'https://sporee.fr',
    resume: 'Envoyer ses emails depuis une infrastructure indépendante.',
    tagline: 'Vos e-mails sur une infrastructure maîtrisée.',
    detail:
      "Rattachez vos domaines, générez vos identités DKIM, publiez vos enregistrements DNS et envoyez. L'infrastructure SMTP nous appartient — vous ne louez pas une couche posée sur celle d'un autre.",
    pour: 'Équipes techniques qui envoient des emails transactionnels',
    accent: 'paper',
  },
  {
    name: 'Partage',
    icone: '/images/apps/partage.png',
    pilier: 'Communication',
    statut: 'Disponible',
    url: 'https://partagg.fr',
    resume: 'Écrire un post une fois, le publier sur chaque réseau.',
    tagline: 'Un brouillon, trois réseaux.',
    detail:
      "Rédigez un texte, adaptez-le au ton de chaque réseau selon un profil d'écriture que vous réglez, puis programmez sa sortie. Publie sur LinkedIn, Bluesky et Dev.to.",
    pour: 'Indépendants et petites équipes qui publient régulièrement',
    accent: 'secondary',
  },
  {
    name: 'Messag',
    icone: '/images/apps/messag.png',
    pilier: 'Communication',
    statut: 'Bientôt',
    url: 'https://messag.eco',
    resume: 'Mail, agenda et contacts, sur ordinateur et mobile.',
    tagline: 'Mail, agenda et contacts. Réunis.',
    detail:
      "Mail, agenda et contacts dans une seule application, sur ordinateur et sur mobile. Les images distantes restent bloquées tant que vous ne les autorisez pas : ouvrir un message ne prévient pas son expéditeur.",
    pour: 'Toute personne qui veut lire son courrier sans être suivie',
    accent: 'paper',
  },
  {
    name: 'Lungor',
    icone: '/images/apps/lungor.png',
    pilier: 'Financement',
    statut: 'Bêta',
    url: 'https://lungor.fr',
    resume: 'Piloter les revenus de son logiciel.',
    tagline: 'Les revenus de votre logiciel, enfin lisibles.',
    detail:
      "Chiffre d'affaires, abonnements, relances et factures conformes, sur un seul tableau de bord. Lungor encaisse déjà les contributions de ce site. Il s'appuie sur des prestataires de paiement agréés : nous ne touchons ni vos coordonnées bancaires ni l'identité de vos clients.",
    pour: 'Développeurs solos et petites équipes qui éditent un SaaS',
    projet: 'Le projet : encaisser sans intermédiaire',
    accent: 'warm',
  },
  {
    name: 'Skalpai',
    icone: '/images/apps/skalpai.png',
    pilier: 'Technique',
    statut: 'Bêta',
    url: 'https://skalpai.dev',
    resume: 'Faire tourner et observer ses applications.',
    tagline: 'Vos applications, en production et sous vos yeux.',
    detail:
      "Observabilité et télémétrie pour vos services, avec le CLI sklp et le gestionnaire de toolchain skt. C'est le socle sur lequel tournent toutes les applications de cette page.",
    pour: 'Développeurs et petites équipes',
    accent: 'paper',
  },
  {
    name: 'Nakoda',
    icone: '/images/apps/nakoda.png',
    pilier: 'Technique',
    statut: 'Bêta',
    url: 'https://nakoda.club',
    resume: 'Mesurer l’audience et les retours de ses applications.',
    tagline: "Ce que font vos utilisateurs. Ce qu'ils vous disent.",
    detail:
      "Visites, inscriptions et retours des utilisateurs, réunis par application. Les signalements de bugs partent directement vers Skalpai. Les applications de cette page s'y mesurent.",
    pour: 'Éditeurs de logiciels et petites équipes',
    accent: 'paper',
  },
  {
    name: "L'Alter",
    icone: '/images/apps/lalter.png',
    pilier: 'Connaissance',
    statut: 'Bêta',
    url: 'https://lalter.fr',
    resume: 'Un assistant à votre service.',
    tagline: 'Un assistant qui garde le fil pour vous.',
    detail:
      "Il garde en mémoire ce que vous lui confiez, cherche sur le web, vous rappelle ce qui doit l'être. Sur le web, sur ordinateur et sur mobile. C'est un assistant, pas un oracle : il peut se tromper, et ses réponses se vérifient.",
    pour: 'Toute personne qui veut déléguer sans confier sa vie à une grande plateforme',
    accent: 'secondary',
  },
  {
    name: 'Cortext',
    icone: '/images/apps/cortext.svg',
    pilier: 'Technique',
    statut: 'Bêta sur invitation',
    url: 'https://cortext.lalter.fr/decouvrir',
    resume: 'Déclarer et faire tourner des agents pour son équipe.',
    tagline: 'Vos agents, déclarés et gardés chez vous.',
    detail:
      "La solution pour les entreprises : vous déclarez un agent, ses outils et ses clés, et il tourne. C'est Cortext qui fait déjà tourner les agents de L'Alter, Synthiz, Partage et Skalpai.",
    pour: 'Entreprises et équipes qui veulent leurs propres agents',
    accent: 'secondary',
  },
  {
    name: 'Orbit',
    icone: '/images/apps/orbit.svg',
    pilier: 'Connaissance',
    statut: 'Bientôt',
    resume: "Son poste de travail, d'une seule pièce.",
    tagline: "Vos sites, l'assistant, le courrier et vos notes dans une fenêtre.",
    detail:
      "Une application de bureau qui réunit les sites que vous utilisez, l'assistant, le courrier et vos notes. Station, son agent local, travaille sur votre machine et n'en sort pas. Nous l'utilisons déjà chaque jour.",
    pour: 'Toute personne qui travaille sur ordinateur',
    accent: 'primary',
  },
  {
    name: 'ark',
    icone: '/images/apps/ark.svg',
    pilier: 'Technique',
    statut: 'Bientôt',
    resume: "L'agent de code de L'Alter, sur ordinateur et en terminal.",
    tagline: 'Un agent de code qui travaille sur votre machine.',
    detail:
      "Il lit, modifie et teste votre code là où il se trouve. Votre compte, votre modèle et votre mémoire restent ceux de L'Alter. Une partie du code de cette page a été écrite avec lui.",
    pour: 'Développeurs',
    accent: 'paper',
  },
]

export const piliers: { name: Pilier; phrase: string }[] = [
  { name: 'Connaissance', phrase: 'Garder la main sur ce que l’on sait.' },
  { name: 'Technique', phrase: 'Faire tourner ses services soi-même.' },
  { name: 'Communication', phrase: 'Écrire et publier par ses propres moyens.' },
  { name: 'Financement', phrase: 'Encaisser et financer sans intermédiaire.' },
]

export type Projet = {
  nom: string
  etat: 'En cours' | 'Ensuite'
  resume: string
}

export const projets: Projet[] = [
  {
    nom: 'Orbit',
    etat: 'En cours',
    resume:
      "Un poste de travail d'une seule pièce : vos sites, l'assistant, le courrier et vos notes dans une même fenêtre.",
  },
  {
    nom: 'Cortext',
    etat: 'En cours',
    resume:
      'Des agents prêts à brancher pour les entreprises. Ils font déjà tourner L’Alter, Synthiz, Partage et Skalpai.',
  },
  {
    nom: 'Reczi',
    etat: 'En cours',
    resume:
      'Publier vidéos, articles et podcasts sur son propre journal, sans dépendre de YouTube ni de Substack.',
  },
  {
    nom: 'Encaisser sans intermédiaire',
    etat: 'En cours',
    resume:
      "Obtenir notre propre autorisation d'encaisser, au lieu de dépendre de la licence d'un prestataire.",
  },
]

export const projetsEnCours = projets.filter(
  (projet) => projet.etat === 'En cours',
)

export function applicationsDuPilier(pilier: Pilier) {
  return applications.filter((application) => application.pilier === pilier)
}

export function decompte(statut: Statut) {
  return applications.filter((application) => application.statut === statut).length
}

export const aFinaliser = applications.filter(
  (application) => application.statut === 'Bientôt',
)

export const enService = applications.filter(
  (application) => application.statut !== 'Bientôt',
)
