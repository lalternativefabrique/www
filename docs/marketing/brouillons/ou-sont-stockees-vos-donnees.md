# Voici où sont stockées vos données chez [application]

> Statut : base éditoriale à reprendre avant publication.
> Série : « Où sont vos données », un article par application. Le premier
> exemplaire, rédigé ci-dessous, porte sur le site L'Alter lui-même, parce
> que c'est le seul dont ce dépôt permet de vérifier chaque ligne. Les
> suivants (Synthiz, Techtuel, Spore, Skalpai) suivent le même gabarit après
> inspection de leur propre dépôt.
> Organe : Technique.

## Angle

Toute application affirme que vos données sont « hébergées en Europe » et
« sécurisées ». Presque aucune ne dit dans quel centre de données, chez quel
fournisseur, sous quel contrat, ni ce qui part ailleurs quand une
fonctionnalité l'exige. L'information existe pourtant : elle est dans la
configuration de déploiement, lisible par toute l'équipe technique.

L'article publie cette configuration, service par service, pour une
application précise. Pas la politique de confidentialité : la carte. Base de
données, sauvegardes, fichiers, secrets, images de conteneur, emails sortants,
appels à des modèles. Pour chaque ligne : quoi, chez qui, dans quelle ville,
et ce qui en sort.

La transparence est le seul argument de vente. Si le lecteur trouve une ligne
qui ne lui convient pas, il a eu la réponse qu'aucune autre application ne
lui donne.

## Titres possibles

1. **Voici où sont stockées vos données chez L'Alter**
2. **Vos données sont « hébergées en Europe ». Mais où, exactement ?**
3. **La carte de nos données, service par service**

Titre de travail retenu : **Voici où sont stockées vos données chez
L'Alter**. Le titre est un gabarit : remplacer le nom à chaque article de la
série.

## Chapeau provisoire

« Hébergé en Europe » est une réponse à une question que personne n'a posée.
Voici la vraie réponse pour cette application : chaque donnée, le fournisseur
qui la détient, la ville où elle dort, et ce qui en sort.

## Ouverture rédigée

Posez la question à n'importe quel éditeur : « où sont mes données ? »

Vous obtiendrez une page de politique de confidentialité, un paragraphe sur
le RGPD, et l'expression « hébergé dans l'Union européenne ». C'est exact et
cela ne répond pas. L'Union européenne compte vingt-sept pays, des dizaines
de fournisseurs, et des centaines de centres de données. Et cette phrase ne
dit rien de ce qui sort : la sauvegarde nocturne, l'email de confirmation,
l'appel au modèle de langue qui résume votre document.

L'information précise existe. Elle est dans un fichier de déploiement que
tous les développeurs de l'application peuvent lire. Il n'y a aucune raison
technique de ne pas vous le montrer.

Alors le voici.

## La carte, pour le site L'Alter (vérifiée dans ce dépôt)

Chaque ligne ci-dessous est lue dans la configuration de déploiement, pas
dans une promesse.

| Donnée | Où | Fournisseur | Lieu |
|---|---|---|---|
| Base de données (comptes, articles publiés, dons) | Postgres sur notre propre nœud, piloté par sklp | L'Alter | ⚠️ ville du nœud à confirmer |
| Sauvegarde quotidienne de la base | Export compressé envoyé chaque nuit à 3 h | OVH Object Storage | Gravelines (région `gra`) |
| Archivage continu des journaux de transactions | pgBackRest vers le même bucket | OVH Object Storage | Gravelines |
| Sources des articles | Bucket de contenu | OVH Object Storage | ⚠️ région lue du secret, à confirmer |
| Secrets de production (clés, mots de passe) | Secret Manager | Scaleway | Paris (`fr-par`) |
| Images de conteneur | Registre privé | Scaleway | Paris (`fr-par`) |
| Certificats TLS | Let's Encrypt, validation DNS via OVH | Let's Encrypt (États-Unis) | Le certificat est public par nature |
| Emails sortants | ⚠️ à confirmer : Spore ou autre | | |

Ce qui sort de France : rien, pour les données de compte. Le seul acteur non
européen de la liste est Let's Encrypt, qui émet des certificats et ne reçoit
aucune donnée utilisateur.

Ce qui sort du pays pour la chaîne IA des autres produits de la maison
(transcription, traduction, synthèse) est déjà documenté dans « Faire de l'IA
en France, en 2026 » : OVH AI Endpoints à Gravelines, Mistral en France,
Scaleway à Paris. Chaque article de la série reprendra la ligne qui le
concerne.

## Plan de l'article

### 1. La question que personne ne pose parce que personne n'y répond

Partir de l'expérience du lecteur : la page « Sécurité » d'un SaaS, ses
logos de certification, et l'absence totale de nom de ville. Poser le
contraste avec une facture d'électricité, qui indique la centrale.

### 2. Ce que « hébergé en Europe » ne dit pas

Trois choses que la formule laisse dans l'ombre.

- **La sauvegarde.** Une base à Paris sauvegardée chez un fournisseur
  américain n'est pas hébergée en Europe. Elle l'est à moitié.
- **Les sous-traitants fonctionnels.** Email transactionnel, modèle de langue,
  recherche, analytics. Chacun reçoit une copie de quelque chose.
- **Le droit applicable au fournisseur.** Un centre de données à Francfort
  exploité par une société américaine reste soumis au droit américain
  (CLOUD Act). Ce n'est pas un détail juridique, c'est le sujet.

### 3. La carte

Insérer le tableau ci-dessus, avec un paragraphe par ligne qui dit pourquoi
ce choix et ce qu'il coûte.

- Postgres sur notre nœud plutôt qu'une base managée : nous gardons le
  contrôle de la restauration, nous assumons l'exploitation. Le prix est le
  temps passé à tester les restaurations, qui est réel.
- Sauvegardes chez OVH à Gravelines : second fournisseur, second site, même
  pays. Une panne du nœud ne touche pas la sauvegarde.
- Secrets et registre chez Scaleway : troisième acteur, pour ne pas dépendre
  d'un seul fournisseur pour tout.

### 4. Ce qui sort, et pourquoi

Nommer honnêtement chaque flux sortant. Pour le site : Let's Encrypt, et
c'est tout. Pour les produits avec IA : les appels aux endpoints OVH et
Mistral, en France. Pour l'email : préciser l'infrastructure Spore, qui nous
appartient (serveur, IP, signature DKIM).

Dire aussi ce qui n'est pas parfait. ⚠️ Lister les outils d'exploitation
non européens encore utilisés (dépôt de code, CI, monitoring si c'est le
cas). La règle de la série : on publie la ligne gênante aussi.

### 5. Comment vérifier

Expliquer qu'un lecteur n'a pas à nous croire sur parole.

- Le dépôt du site est public ⚠️ (confirmer avant de l'écrire) : le fichier
  de déploiement est lisible.
- Les régions OVH et Scaleway sont documentées publiquement par les deux
  fournisseurs.
- Un enregistrement DNS suffit à vérifier d'où partent les emails.

### 6. Ce que cette carte ne garantit pas

Rester net sur les limites.

- Une localisation n'est pas une sécurité. Une base à Gravelines mal
  configurée est moins sûre qu'une base à Dublin bien tenue.
- Aucune certification SecNumCloud ou ISO 27001 n'est détenue aujourd'hui.
  La gap-analysis existe, elle est honnête, elle est en cours.
- Un seul nœud reste un point unique de défaillance pour la base en
  production. La sauvegarde protège les données, pas la disponibilité.

## Phrase de conclusion possible

> Vous n'avez pas à nous faire confiance. Vous avez la carte, et vous avez
> les moyens de la vérifier.

## Gabarit pour les articles suivants de la série

Pour chaque application, remplir le même tableau à partir du dépôt concerné.

| Donnée | Où | Fournisseur | Lieu |
|---|---|---|---|
| Base de données | | | |
| Sauvegardes | | | |
| Fichiers utilisateurs (audio, documents, exports) | | | |
| Secrets | | | |
| Images de conteneur | | | |
| Emails sortants | | | |
| Appels à des modèles (transcription, LLM, embeddings) | | | |
| Paiement | | | |
| Journaux et monitoring | | | |

Puis les trois paragraphes obligatoires : ce qui sort du pays, ce qui n'est
pas parfait, comment vérifier.

Ordre proposé : Synthiz en premier, parce que c'est le produit avec des
utilisateurs et des fichiers personnels ; puis Techtuel, Spore, Skalpai.

## Points à confirmer avant publication

- Confirmer la ville du nœud de production qui héberge Postgres.
- Confirmer la région du bucket de contenu (elle est lue depuis le secret
  Scaleway, pas écrite dans le dépôt).
- Confirmer le fournisseur des emails sortants du site.
- Lister sans omission les outils d'exploitation non européens encore
  utilisés, et les publier.
- Vérifier que le dépôt est bien public avant d'inviter à le lire.
- Pour Synthiz et Techtuel : vérifier dans leurs dépôts le bucket des
  fichiers audio et des transcriptions, et le prestataire de paiement actuel.
- Faire relire la section juridique (CLOUD Act, sous-traitants) par le
  skill juriste-entreprise avant publication.

## Sources de travail

- Ce dépôt : `.sklp/www/deploy.yaml` (Postgres, sauvegardes, région `gra`),
  `infra/k8s/base-www/s3-external-secret.yaml` (bucket de contenu,
  Secret Manager Scaleway), `infra/k8s/base-www/ingress.yaml`
  (Let's Encrypt, validation DNS OVH).
- Article interne : « Faire de l'IA en France, en 2026 » (chaîne IA, lieux,
  coûts mesurés).
- Article interne : « Un service d'email sobre, éthique et souverain »
  (infrastructure SMTP propre).
- Stratégie générale, section 5 : la règle « on décrit au présent uniquement
  ce qui tourne ».
- OVHcloud et Scaleway, documentation publique des régions.
