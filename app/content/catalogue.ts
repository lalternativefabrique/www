export type Pilier = 'Connaissance' | 'Technique' | 'Communication' | 'Financement'

export type Statut = 'Disponible' | 'Bêta' | 'Bientôt'

export type Application = {
  name: string
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
    pilier: 'Connaissance',
    statut: 'Disponible',
    url: 'https://synthiz.com',
    resume: 'Retrouver et relier ses sources.',
    tagline: 'Votre mémoire de travail, alimentée par vos sources.',
    detail:
      "Transcrivez vidéos, podcasts et documents, puis retrouvez, reliez et synthétisez ce que vous avez accumulé. Vos notes et vos sources restent les vôtres.",
    pour: 'Créateurs, chercheurs, consultants, veilleurs',
    prix: 'Gratuit · Pro 5 €/mois · Max 12 €/mois',
    accent: 'primary',
  },
  {
    name: 'Spore',
    pilier: 'Communication',
    statut: 'Disponible',
    url: 'https://sporee.fr',
    resume: 'Envoyer ses emails depuis une infrastructure indépendante.',
    tagline: 'Vos emails partent de votre infrastructure.',
    detail:
      "Rattachez vos domaines, générez vos identités DKIM, publiez vos enregistrements DNS et envoyez. L'infrastructure SMTP nous appartient — vous ne louez pas une couche posée sur celle d'un autre.",
    pour: 'Équipes techniques qui envoient des emails transactionnels',
    accent: 'paper',
  },
  {
    name: 'Partage',
    pilier: 'Communication',
    statut: 'Disponible',
    url: 'https://partagg.fr',
    resume: 'Écrire un post une fois, le publier sur chaque réseau.',
    tagline: 'Un brouillon, plusieurs réseaux, une date.',
    detail:
      "Rédigez un texte, adaptez-le au ton de chaque réseau selon un profil d'écriture que vous réglez, puis programmez sa sortie. Publie sur LinkedIn, Bluesky et Dev.to.",
    pour: 'Indépendants et petites équipes qui publient régulièrement',
    accent: 'secondary',
  },
  {
    name: 'Messag',
    pilier: 'Communication',
    statut: 'Bientôt',
    resume: 'Mail, agenda et contacts, sur ordinateur et mobile.',
    tagline: 'Votre messagerie, sans mouchard.',
    detail:
      "Mail, agenda et contacts dans une seule application, sur ordinateur et sur mobile. Les images distantes restent bloquées tant que vous ne les autorisez pas : ouvrir un message ne prévient pas son expéditeur.",
    pour: 'Toute personne qui veut lire son courrier sans être suivie',
    accent: 'paper',
  },
  {
    name: 'Lungor',
    pilier: 'Financement',
    statut: 'Bêta',
    url: 'https://lungor.fr',
    resume: 'Piloter les revenus de son logiciel.',
    tagline: 'Les revenus de votre SaaS, enfin lisibles.',
    detail:
      "Chiffre d'affaires, abonnements, relances et factures conformes, sur un seul tableau de bord. Lungor encaisse déjà les contributions de ce site. Il s'appuie sur des prestataires de paiement agréés : nous ne touchons ni vos coordonnées bancaires ni l'identité de vos clients.",
    pour: 'Développeurs solos et petites équipes qui éditent un SaaS',
    projet: 'Le projet : encaisser sans intermédiaire',
    accent: 'warm',
  },
  {
    name: 'Skalpai',
    pilier: 'Technique',
    statut: 'Bêta',
    url: 'https://skalpai.dev',
    resume: 'Faire tourner et observer ses applications.',
    tagline: 'Voir ce que font vos applications, sans y passer un budget.',
    detail:
      "Observabilité et télémétrie pour vos services, avec le CLI sklp et le gestionnaire de toolchain skt. C'est le socle sur lequel tournent toutes les applications de cette page.",
    pour: 'Développeurs et petites équipes',
    accent: 'paper',
  },
  {
    name: "L'Alter",
    pilier: 'Connaissance',
    statut: 'Bêta',
    url: 'https://lalter.fr',
    resume: 'Un assistant à votre service.',
    tagline: 'Un assistant qui se souvient et agit pour vous.',
    detail:
      "Il garde en mémoire ce que vous lui confiez, cherche sur le web, vous rappelle ce qui doit l'être. Sur le web, sur ordinateur et sur mobile. C'est un assistant, pas un oracle : il peut se tromper, et ses réponses se vérifient.",
    pour: 'Toute personne qui veut déléguer sans confier sa vie à une grande plateforme',
    accent: 'secondary',
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
    nom: 'Reczi',
    etat: 'En cours',
    resume:
      'Publier vidéos, articles et podcasts sur son propre journal, sans dépendre de YouTube ni de Substack.',
  },
  {
    nom: 'Encaisser sans intermédiaire',
    etat: 'En cours',
    resume:
      "Faire de Lungor un établissement de paiement autorisé, au lieu de dépendre de la licence d'un autre.",
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
