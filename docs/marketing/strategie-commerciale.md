# Stratégie commerciale — quatre applications, un système de communication

> Date : 2026-10-20
> Complète `strategie-generale.md` (la thèse) et `plan-communication.md` (le site). Ce document dit **comment on vend**, à partir de ce que le code des cinq dépôts montre réellement : www, synthiz, spore, partage, messag, et les playbooks de communication encodés dans Partage.
> Toute affirmation est adossée au code. ⚠️ = à décider ou à vérifier avant de publier.

---

## 1. Ce que nous vendons, état vérifié

| App | Promesse en une ligne | Cible | Offre réelle (code) | Paiement | Statut public à afficher |
|---|---|---|---|---|---|
| **Partage** | Écrire un post une fois, le publier au bon moment sur chaque réseau | Indépendants qui écrivent eux-mêmes, devs solos, auto-entrepreneurs | Gratuit 10 publications/mois · Maker 9 € / 50 · Pro 19 € / 200 · Studio 49 € / 1000 (`partage/tenants/lungor.yaml`) | Checkout Mollie via Lungor câblé, **en mode test** | Disponible |
| **Synthiz** | Transcrire et résumer vidéos, podcasts, PDF, articles, puis retrouver la source exacte d'une idée des mois plus tard | Créateurs de contenu, étudiants, chercheurs, consultants, veilleurs | Free 20 synthèses/mois · Pro 300/mois, prix lu dans Lungor (migration `000110`) | Checkout Lungor câblé, **en mode test** | Disponible, mais le CTA dit « Rejoindre la beta » |
| **Spore** | Les e-mails transactionnels de votre application partent d'une infrastructure européenne que nous possédons | Développeurs backend, devs SaaS solos, équipes qui quittent SES ou Resend | Free / Pro / Max, prix et quotas lus dans Lungor, aucun chiffre dans le dépôt | Checkout câblé (`useStartCheckout('pro')`), **en mode test** | Disponible, mais le hero dit « Get early access » |
| **Messag** | Mail, agenda, contacts, drive et pages de rendez-vous, hébergés en France, avec Gmail et Outlook rapatriés dans une seule boîte | Indépendants et petits pros français : artisan, coiffeuse, consultante | Normal 0 € (10 Go, 2 domaines) · Pro 5 €/mois ou 50 €/an (50 Go, 10 domaines, 20 adresses de groupe, 5 pages de rendez-vous) | Checkout câblé, **en mode test** ; la FAQ dit que le Pro « n'est pas encore ouvert » | Inscription gratuite ouverte ; Pro ⚠️ à ouvrir |

Deux faits structurants :

- **Les quatre applications ont un paiement câblé, et aucune n'encaisse.** Lungor et les prestataires de paiement tournent en mode test partout : il n'y a pas encore eu un euro réel. Le premier chantier commercial n'est donc pas un post, c'est **passer la chaîne de paiement en production** sur les quatre applications (§ 8, J1).
- **Trois surfaces sur quatre disent le contraire de leur code** (§ 4).
- **Aucune preuve sociale n'existe.** Ni client nommé, ni témoignage, ni chiffre d'usage. Les playbooks de Partage l'interdisent, et ils ont raison : on vend par démonstration jusqu'à ce qu'un client accepte d'être cité.

---

## 2. Le message commun et son déclinaison

### La culture, telle que le site la dit depuis aujourd'hui

> Nos applications allègent les tâches numériques du quotidien, personnelles ou professionnelles. Elles font l'inverse des applications qui retiennent l'attention : on accomplit sa tâche, on repart, on garde son temps pour son travail et pour les gens autour de soi.

C'est la phrase mère. Chaque application en tient une déclinaison, écrite **problème d'abord** (pattern `problem_first` de la doctrine Partage) :

| App | Le problème que le lecteur reconnaît | Ce qu'il garde |
|---|---|---|
| Partage | Publier sur trois réseaux, c'est trois onglets, trois réécritures, et une matinée passée dans des fils conçus pour qu'on y reste | Sa matinée. Il écrit une fois, programme, et n'ouvre aucun réseau |
| Synthiz | Deux cents vidéos sauvegardées, quarante podcasts, aucune idée retrouvable au moment où elle sert | L'heure de réécoute. Il cherche par le sens, il retrouve la source exacte |
| Spore | L'e-mail transactionnel est le seul morceau de l'application qu'on ne contrôle pas : délivrabilité, réputation, données chez un acteur américain | Les journées de configuration et la dépendance. Un domaine, un DKIM, une API |
| Messag | Trois boîtes, deux agendas, un lien de rendez-vous facturé à part, et un client mail qui prévient l'expéditeur dès qu'on ouvre un message | Les allers-retours entre outils, et le pistage |

Le hero actuel de Messag (« Trois boîtes, deux agendas, un lien de rendez-vous facturé à part. ») est déjà exactement cette forme. Les trois autres hero sont à aligner (§ 4).

### Ce que la Fabrique apporte à la vente, et ce qu'elle n'apporte pas

On vend **en direct, par l'application**. Une personne achète la réponse à son problème, pas une organisation. La Fabrique intervient **après** : pied de page, page de prix, reçu, pour expliquer où va l'argent et pourquoi rester. C'est le § 5 du plan de communication, toujours à faire sur les sites des applications.

---

## 3. Le système de communication

Quatre rôles, quatre outils, tous à nous. Chaque publication est aussi une démonstration, et se signe comme telle.

| Rôle | Outil | Ce qu'il fait |
|---|---|---|
| Raconter | **www** (la revue) | Un texte de fond par campagne, dans la voix éditoriale. C'est le « pilier » au sens de la doctrine : la pièce longue dont tout le reste dérive |
| Publier | **Partage** | Découpe le pilier en dérivés par réseau, programme, publie. Porte une **stratégie de marque** par application (§ 6) |
| Envoyer | **Spore** | La lettre de la revue, à chaque parution |
| Mesurer | **Nakoda**, Lungor | Visites et inscriptions par application ; abonnés payants |

### La doctrine à suivre, celle que Partage encode

Les playbooks de Partage (`apps/core/cortex/infrastructure/playbooks/`) sont notre méthode écrite. On l'applique à la main comme la machine l'applique :

- **Peu de sujets, chacun traité une fois correctement, puis recoupé par canal.** « Ce n'est pas un quota de publication. »
- **Un thème par semaine au maximum**, nommé par son sujet, pas par son étage de funnel. Les thèmes qui expliquent passent avant ceux qui vendent.
- **Un angle est une affirmation avec laquelle on peut être en désaccord.** Un argument de vente n'est pas un angle.
- **Une preuve repose sur une pièce d'évidence réelle.** Sans évidence, pas de slot preuve : une démonstration à la place.
- **Au plus un slot promotionnel toutes les deux semaines**, jamais deux de suite sur un canal.
- **Deux à trois slots par semaine** est le rythme tenable pour une personne. On laisse des jours vides.
- **Un dérivé n'est jamais l'article collé ailleurs.** Un argument sur LinkedIn, un détail sur Bluesky, une accroche sur X, un pas-à-pas sur Dev.to.
- **Accroche d'une ligne, douze mots au plus.** Jamais le nom du produit, « Nous », « Découvrez » en ouverture. Jamais de paradoxe qui sonne profond.
- **Voix fondateur et voix produit séparées** (`founder_to_brand`) : le raisonnement personnel sur le compte du fondateur ; la vérité produit, les démonstrations et le savoir durable sur les canaux des applications.

### Les comptes

⚠️ À vérifier : quels comptes LinkedIn, Bluesky, X et Dev.to existent par application. Recommandation ferme pour les trois premiers mois : **le compte du fondateur porte tout**. C'est la seule audience qui existe. Les comptes des applications republient en `product_speaks` (une capture, une phrase) et ne portent pas de raisonnement. On ne construit pas quatre audiences à la fois.

---

## 4. Ce qui bloque la conversion aujourd'hui, à lever avant de pousser

Chaque ligne est une petite correction, pas une fonctionnalité. Aucune ne justifie de retarder la première publication ; toutes doivent être faites avant que la campagne de l'application concernée envoie du trafic.

| App | Le site dit | Le code fait | Correction |
|---|---|---|---|
| Synthiz | CTA « Rejoindre la beta » | Paiement en production, plans Free/Pro | CTA « Commencer gratuitement ». Le mot bêta disparaît |
| Synthiz | www : « Pro 5 €/mois · Max 12 €/mois » | Lungor sert un Pro à 300 synthèses, prix seed 9 € ; pas de Max côté Synthiz | ⚠️ Aligner `catalogue.ts` sur le catalogue Lungor réel |
| Spore | Hero « Get early access » | Inscription libre, checkout Pro live | CTA « Créer un compte gratuit » |
| Spore | La démo vend la boucle entrant / réponse | Entrant « needs an MX », threads en V2 | Retirer l'entrant de la démo ou l'étiqueter « bientôt » |
| Spore | Pied de page : adresse personnelle | Légal : `contact@sporee.fr` | Une seule adresse |
| Messag | FAQ : paiement Pro « pas encore ouvert » | `POST /billing/checkout` et bouton dans les réglages existent | ⚠️ Ouvrir le Pro, ou retirer le prix de la page tarifs |
| Messag | Pro inclut 500 rédactions IA | « pas encore disponible » | Retirer la ligne du plan jusqu'à livraison |
| Partage | Pro : « Publications sans limite » | Plafond Lungor 200/mois, et la page dit que tout plan a un plafond | « 200 publications par mois » |
| Partage | Studio 49 € existe dans Lungor | Aucune copy dans `presentation.go` | Écrire la fiche ou retirer le plan du catalogue |
| Partage | FAQ : Instagram et Facebook « arrivent bientôt » ; page Buffer : « ne gère ni Instagram ni Facebook » | Clients codés, redirections prod, pas d'app Meta instance | Une seule phrase partout : « Facebook et Instagram avec votre propre application Meta », ou « pas encore » |
| Partage | Gratuit : « LinkedIn, Bluesky et Dev.to » | X publié sur tous les plans | Ajouter X |
| www | Messag « Bientôt », Partage « Disponible » | Messag inscription ouverte | Messag passe en « Bêta » ou « Disponible » (décision en attente du plan de communication) |

Et le point du plan de communication toujours ouvert : **le pourcentage réinvesti** ⚠️. Sans lui, la phrase « utiliser finance la suite » reste une promesse.

---

## 5. Le plan : lancement parallèle, quatre marques dans Partage

Décision du fondateur (2026-10-20) : les quatre applications sont prêtes et se lancent **en même temps**, chacune avec ses propres comptes, pour toucher large. La contrainte d'une seule personne est levée par l'outil : Partage porte une marque par application, une stratégie par marque, et son planificateur propose les campagnes. Le travail du fondateur est la relecture et la correction, pas la rédaction. Ordre de grandeur : huit à douze posts par semaine à relire, une heure par jour.

### Les comptes

Un jeu de comptes par application, connectés à sa marque dans Partage. Le compte personnel du fondateur relaie et porte la Fabrique.

| Marque | Réseaux | Pourquoi ceux-là |
|---|---|---|
| **Spore** | X, Bluesky, Dev.to, page LinkedIn | Devs : X et Bluesky pour la conversation, Dev.to pour les guides |
| **Partage** | X, Bluesky, Dev.to, page LinkedIn | Mêmes réseaux ; chaque post est sa propre démo |
| **Synthiz** | X, LinkedIn, Bluesky | Créateurs, étudiants, veilleurs : LinkedIn et X d'abord |
| **Messag** | Facebook Page, Instagram, LinkedIn | Les pros locaux sont sur Facebook et Instagram. ⚠️ Nécessite une application Meta : Partage n'a pas d'app instance, il faut la créer une fois pour la Fabrique |
| **La Fabrique** | Compte du fondateur : LinkedIn, Bluesky, X | Le pourquoi, le comment, et le lien vers Participer |

### La méthode, celle de Partage

Pour chaque marque : stratégie saisie (§ 6), puis une campagne de **3 semaines** planifiée dans Partage, objectif `awareness` tant que le paiement n'est pas en production, `acquisition` ensuite. On corrige ce que le planificateur propose, on ne repart pas de zéro. Deux à trois slots par semaine et par marque, jamais deux promos de suite, un texte pilier dans la revue par marque sur le cycle.

Le planificateur a des défauts connus (`partage/docs/qa/campaigns-inside-strategy.md`) : il invente des superlatifs et des chiffres si la stratégie n'a pas d'évidence. La relecture vérifie trois choses : aucun chiffre qui ne soit dans les évidences, aucun « le seul », aucune fonctionnalité promise qui ne tourne pas.

### Les thèmes d'ouverture, une marque par ligne

| Marque | Thème semaine 1 | Angle (discutable) |
|---|---|---|
| Spore | La seule brique de ton app que tu ne possèdes pas | Déléguer l'e-mail transactionnel, c'est déléguer sa réputation |
| Partage | Une matinée par semaine à nourrir des plateformes | Les réseaux sont des lieux de séjour, pas des canaux |
| Synthiz | Deux cents vidéos sauvegardées, aucune retrouvée | Sauvegarder n'est pas retenir |
| Messag | Trois boîtes, deux agendas, un lien facturé à part | Un indépendant paie trois outils pour un seul métier |
| Fabrique | Reprendre la maîtrise de nos outils | On participe peu à la conception des outils dont on dépend |

### La vente directe, en parallèle : Messag vitrine

Seul produit vendable à des non-devs sans audience : la **vitrine** (`messag/apps/core/profile`, ADR 0011). Page publique à son nom, prestations et horaires tirés des pages de rendez-vous, **demande de devis avec photos**, réservation, génération de la page depuis le site ou la fiche Google du pro, guide Google Business Profile. Incluse dans Pro, 5 €/mois. Limites : « Propulsé par Messag », pas de domaine personnalisé, pas d'avis.

Le flux : préparer la page d'un pro listé publiquement avec le brief, l'appeler ou lui écrire avec le lien, « si elle vous sert, c'est 5 € par mois », noter chaque refus. Prospection B2B sur coordonnées publiques, droit d'opposition respecté. Métiers de départ : coiffure, artisans du bâtiment.

### Ce qu'on refuse

- Un chiffre, un superlatif, un témoignage qui n'existe pas. La doctrine Partage les refuse à la machine ; la relecture les refuse à la main.
- Un slot promotionnel sur une application dont le paiement est encore en mode test.
- Débriefer après un post. Après cinq, par marque.

---

## 6. Les stratégies de marque à saisir dans Partage

Produit → Stratégie, une par application. Champs de la doctrine : audience, pas pour, problème, différenciateurs, sujets légitimes, piliers, patterns, évidences, manques, consigne. Tout ce qui suit est **tiré du code** ; les manques sont des manques, pas des évidences.

### Partage

- **Audience** : indépendants qui écrivent leurs propres posts · développeurs solos qui publient sur Dev.to et LinkedIn · auto-entrepreneurs qui tiennent un rythme de publication
- **Pas pour** : agences qui gèrent des dizaines de comptes · équipes qui ont besoin de validation à plusieurs
- **Problème** : republier un même texte sur plusieurs réseaux demande de l'ouvrir trois fois, de le réécrire trois fois, et de rester dans des fils conçus pour retenir ; la matinée part, le texte n'est pas meilleur
- **Différenciateurs** : un brouillon maître, des variantes par réseau dans un profil de voix qu'on règle · programmation côté serveur, machine éteinte · articles Dev.to en Markdown · identifiants chiffrés NaCl · aucun texte utilisé pour entraîner un modèle
- **Sujets légitimes** : écriture multi-réseaux · voix éditoriale et modèles · programmation et publication · ce que Buffer fait bien et où il s'arrête · la doctrine de campagne elle-même
- **Piliers** : build, expertise, proof, opinion, conversation
- **Patterns** : problem_first, product_speaks, build_show_explain, founder_to_brand
- **Évidences** : la page de prix lue depuis Lungor · le scheduler avec ses reprises à 1, 5 et 30 minutes · le post lui-même, sorti par Partage · les tests QA du planificateur (`docs/qa/`)
- **Manques** : aucun utilisateur nommé · pas de statistiques LinkedIn · Facebook et Instagram sans application instance
- **Consigne** : voir § 2, la phrase mère. Toujours dire que le post est sorti par Partage.

### Synthiz

- **Audience** : créateurs de contenu qui accumulent des sources · étudiants et chercheurs · consultants et veilleurs
- **Pas pour** : équipes qui veulent un wiki partagé · qui cherche un lecteur RSS seulement
- **Problème** : on sauvegarde des vidéos, des podcasts et des articles qu'on ne retrouve jamais au moment où l'idée sert ; réécouter coûte l'heure qu'on voulait gagner
- **Différenciateurs** : recherche par le sens ou par les mots exacts, avec la source exacte · vidéo, podcast, PDF, page web, RSS dans une même mémoire · plafonds fermes, pas de dépassement facturé · hébergement européen, pas d'hyperscaler américain
- **Sujets légitimes** : transcription et son coût réel · retrouver une idée des mois après · NotebookLM, Readwise, Obsidian : ce qu'ils font bien · le coût d'un modèle hébergé en Europe
- **Piliers** : expertise, proof, engineering, opinion
- **Patterns** : problem_first, internal_learning_to_public_knowledge, product_speaks
- **Évidences** : coût unitaire Whisper 0,000767 €/min (`docs/strategy/pricing-abonnement.md`) · marge publiée ~69 % Pro dans le pire cas · pages de comparaison existantes · page de démo publique
- **Manques** : aucun utilisateur nommé · applications mobiles « bientôt » · ⚠️ prix affichés sur www à aligner
- **Consigne** : ne jamais dire « bêta ». Ne jamais promettre le mobile au présent.

### Spore

- **Audience** : développeurs backend · devs SaaS solos · équipes qui quittent SES ou le palier gratuit de Resend
- **Pas pour** : marketeurs · newsletters · qui veut un éditeur visuel
- **Problème** : l'e-mail transactionnel est la seule brique de l'application qu'on ne possède pas ; la délivrabilité, la réputation et les données dépendent d'un fournisseur américain qui change ses règles
- **Différenciateurs** : MTA Postfix à nous sur OVH, pools d'IP propres · DKIM généré côté serveur, DNS vérifié · plafond ferme, jamais de dépassement facturé · facturé en euros · webhooks signés HMAC avec reprise · SDK TypeScript publié
- **Sujets légitimes** : DKIM, SPF, DMARC · réputation d'IP · SMTP contre API · ce que Resend, SendGrid, Mailgun et SES font bien · ce que coûte une infrastructure d'envoi
- **Piliers** : engineering, expertise, build, proof
- **Patterns** : build_show_explain, internal_learning_to_public_knowledge, problem_first
- **Évidences** : code d'infrastructure CDKTF (`infra/smtp`) · ADR 0002 pools d'IP · guides DKIM/SPF/DMARC publiés · la lettre de la revue envoyée par Spore
- **Manques** : **aucun taux de délivrabilité mesuré et publié**, c'est le seul chiffre qu'un acheteur regarde · entrant sans MX · SDK Python depuis git seulement
- **Consigne** : ne pas vendre l'entrant. Ne pas citer de délivrabilité tant qu'elle n'est pas mesurée.

### Messag

- **Audience** : indépendants et petits pros français qui jonglent entre plusieurs boîtes · qui paient un outil de rendez-vous à part · qui veulent lire son courrier sans être suivi
- **Pas pour** : grandes équipes · qui veut rester entièrement chez Google
- **Problème** : trois boîtes, deux agendas, un lien de rendez-vous facturé à part, et un client mail qui prévient l'expéditeur dès qu'on ouvre un message
- **Différenciateurs** : Gmail, Outlook et IMAP rapatriés dans une boîte, avec une adresse @messag.eco · images distantes bloquées tant qu'on ne les autorise pas · pages de rendez-vous incluses dans Pro · hébergé en France · un quota est un plafond, pas un compteur
- **Sujets légitimes** : pistage par images distantes · alternatives à Gmail et Workspace · prise de rendez-vous sans Calendly · hébergement français, ce que ça veut dire et ne veut pas dire
- **Piliers** : launch, expertise, opinion, proof
- **Patterns** : problem_first, launch_sequence, product_speaks
- **Évidences** : rendu en cadre isolé sans script (`lib/mail/src/render.ts`) · chiffrement d'enveloppe KMS Scaleway · détection de liens de phishing · ADR publics
- **Manques** : Pro non achetable dans l'app · desktop et mobile en développement · aucun utilisateur nommé · ⚠️ « hébergeurs français » alors que les images sont chez Scaleway et le chat sur un autre domaine : préciser
- **Consigne** : ne pas promettre le mobile. Ne pas dire « sans mouchard » au-delà de ce que le blocage des images fait réellement.

---

## 7. Mesure

Une métrique par application, lue dans Lungor et Nakoda, jamais dans les impressions.

| App | La seule qui compte | Secondaire |
|---|---|---|
| Partage | Abonnés Maker ou Pro payants | Comptes gratuits ayant publié au moins une fois |
| Synthiz | Abonnés Pro payants | Free ayant fait 3 synthèses ou plus (seuil du doc `v1-lean-scope`) |
| Messag | Pro payants dès l'ouverture ; avant : comptes ayant rattaché un compte externe | Pages de rendez-vous créées |
| Spore | Domaines vérifiés ayant envoyé en production | Passages Free vers Pro |

Débrief après **cinq** posts, jamais après un. Un post sans réponse est le résultat attendu d'un post.

---

## 8. Les sept premiers jours

1. **J1** : paiements en production dans Lungor pour les quatre applications ; un achat réel sur chacune, remboursé, reçu vérifié.
2. **J1** : créer les comptes manquants (X, Bluesky, Dev.to, pages LinkedIn ; Facebook et Instagram pour Messag) et les connecter aux marques dans Partage. ⚠️ Application Meta à créer pour Facebook et Instagram.
3. **J2** : saisir les cinq stratégies de marque (§ 6, plus la Fabrique) dans Partage.
4. **J2** : premier post par marque, dans la voix de chaque marque, publié par Partage. Quinze minutes de relecture par post.
5. **J3** : planifier les cinq campagnes de 3 semaines dans Partage, objectif `awareness`, à passer en `acquisition` dès que le paiement de la marque est en production. Corriger, ne pas réécrire.
6. **J3 à J5** : Messag vitrine : préparer dix pages de pros avec le brief, appeler ou écrire. Noter chaque réponse.
7. **J4** : corrections de copy du § 4, une PR par application.
8. **J7** : débrief en dix lignes par marque : réponses, inscriptions, ce qu'on change pour la semaine 2. Lettre de la revue envoyée par Spore.

---

## 9. Ce document ne décide pas

- Le pourcentage réinvesti ⚠️.
- L'ouverture du paiement Pro de Messag ⚠️.
- L'application Meta pour Facebook et Instagram : au nom de la Fabrique, ou une par application ⚠️.
- Les prix Synthiz à afficher sur www ⚠️.
- Le statut public de Messag ⚠️.

Quatre décisions, toutes du fondateur, toutes à prendre avant la semaine 4.
