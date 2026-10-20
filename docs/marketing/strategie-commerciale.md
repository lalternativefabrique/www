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

- **Les quatre applications ont un paiement câblé, et aucune n'encaisse.** Lungor et les prestataires de paiement tournent en mode test partout : il n'y a pas encore eu un euro réel. Le premier chantier commercial n'est donc pas un post, c'est **passer la chaîne de paiement en production** sur l'application qui ouvre la rotation (§ 5), puis sur les autres au fil du cycle.
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

## 5. Le plan : notoriété par la publication, une application à la fois

Le choix est fait : on construit la notoriété par les réseaux, avec Partage, et on vend en direct depuis chaque application. La contrainte est une personne et quatre produits. La doctrine dit deux à trois slots par semaine ; on la respecte, donc **on tourne**.

### La rotation

Un cycle de **trois semaines par application**, planifié comme une campagne Partage (objectif `acquisition` pour les applications achetables, `awareness` tant que le paiement n'est pas ouvert). Un texte de la revue par cycle, qui sert de pilier. Les trois autres applications ne se taisent pas : un dérivé `product_speaks` par semaine, sans raisonnement, sur leur propre compte.

Prérequis par application, **avant** le slot promotionnel de sa troisième semaine : paiement en production (clé Mollie ou PayPlug live dans Lungor, un achat réel à 9 € fait par nous et remboursé, le reçu reçu). Tant que ce n'est pas fait, la campagne reste en objectif `awareness` et le CTA est l'inscription gratuite, pas le plan payant.

| Semaines | Application en campagne | Pourquoi dans cet ordre |
|---|---|---|
| 1 à 3 | **Partage** | Chaque post publié est la démonstration du produit. Le texte pilier (le temps passé à nourrir les réseaux) porte aussi la culture de la Fabrique |
| 4 à 6 | **Synthiz** | Paiement prêt, pages d'usage et comparatifs déjà écrits (NotebookLM, Notion AI, Readwise), la cible est aussi celle qui lit les posts de la semaine 1 à 3 |
| 7 à 9 | **Messag** | Le hero est le meilleur des quatre. Condition : Pro ouvert, sinon objectif `awareness` et inscription gratuite |
| 10 à 12 | **Spore** | Cible la plus étroite et la plus exigeante en preuve. On arrive avec dix semaines d'e-mails envoyés par Spore pour la lettre de la revue : c'est la preuve |

Au terme du cycle, on recommence avec ce qu'on a appris, et on retire une application de la rotation si elle n'a produit ni inscription ni conversation en trois semaines d'exposition.

### Le premier cycle, Partage, semaines 1 à 3

Structure dictée par la doctrine : trois thèmes, chacun avec un angle discutable, trois slots par semaine, un slot promotionnel au plus, ouverture sur `educate`.

| Semaine | Thème | Angle (discutable) | Slots |
|---|---|---|---|
| 1 | Le coût d'une matinée de publication | Les réseaux ne sont pas des canaux de diffusion, ce sont des lieux de séjour, et leur modèle dépend de ce séjour | LinkedIn `educate` (le décompte des onglets, ce qu'on y perd) · Bluesky `opinion` (une phrase) · teaser vers le texte de la revue |
| 2 | Écrire une fois, parler à chaque réseau | Un même texte collé sur quatre réseaux est pire que quatre absences : chaque réseau a une lecture | LinkedIn `demonstrate` (un brouillon, trois sorties, capture) · Dev.to `educate` (comment le profil de voix fonctionne, ses limites) · Bluesky `product_speaks` |
| 3 | Ce que Partage ne fait pas | Un outil pour une personne qui écrit ne doit pas ressembler à Buffer | LinkedIn `compare` (ce que Buffer fait bien, où il cesse de convenir) · X `objection` (« encore un outil IA qui écrit à ma place ? ») · LinkedIn `promote` (le seul du cycle : le plan gratuit, dix publications, sans carte) |

Le texte de la revue qui sert de pilier : titre de travail **« Une matinée par semaine à nourrir des plateformes »**. Problème, pourquoi les outils existants (Buffer, Hootsuite, publier à la main) déçoivent pour une personne seule, le vrai problème (ce n'est pas publier, c'est rester), la réponse, les limites (quatre réseaux, pas de réponses, pas de vidéo, statistiques partielles), la suite naturelle.

### Ce qu'on refuse

- Quatre lancements simultanés. La stratégie générale le dit déjà : deux lancements en même temps, c'est zéro lancement.
- Un calendrier de contenu à trente jours avant que le premier post soit parti.
- Un chiffre, un superlatif, un témoignage qui n'existe pas. La doctrine Partage les refuse à la machine ; on se les refuse à la main.

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

1. **J1** : passer le paiement de Partage en production dans Lungor et faire un achat réel de 9 €, remboursé ensuite. C'est le seul euro qui compte cette semaine.
2. **J1** : saisir la stratégie de marque Partage dans Partage (§ 6). Publier le premier post du thème 1, dans la voix du fondateur, par Partage, LinkedIn et Bluesky. Quinze minutes d'édition, puis envoi.
3. **J1** : corriger les trois lignes Partage du § 4 (Pro « 200 », X dans Gratuit, une seule phrase sur Meta). Une PR.
4. **J2** : écrire le texte pilier de la revue, « Une matinée par semaine à nourrir des plateformes ». Publier à 80 %.
5. **J3** : planifier la campagne Partage dans Partage, objectif acquisition, 3 semaines, avec le texte comme lien d'entrée. Corriger ce que le planificateur propose plutôt que repartir de zéro.
6. **J3** : Synthiz : CTA « Commencer gratuitement », retirer « bêta ». ⚠️ Vérifier le catalogue Lungor et aligner www.
7. **J5** : deuxième et troisième posts du thème 1 partis. Lettre de la revue envoyée par Spore aux inscrits, même s'ils sont peu.
8. **J7** : débrief écrit en dix lignes : qui a répondu, quoi, ce qu'on change pour le thème 2. Saisir les stratégies Synthiz, Messag, Spore dans Partage.

---

## 9. Ce document ne décide pas

- Le pourcentage réinvesti ⚠️.
- L'ouverture du paiement Pro de Messag ⚠️.
- L'ordre de passage en production des paiements : Partage d'abord, selon la rotation, sauf avis contraire.
- Les prix Synthiz à afficher sur www ⚠️.
- Le statut public de Messag ⚠️.

Quatre décisions, toutes du fondateur, toutes à prendre avant la semaine 4.
