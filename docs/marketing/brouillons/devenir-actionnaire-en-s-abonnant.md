# Devenir actionnaire en s'abonnant — brouillon

> Statut : brouillon, sujet retiré de la page Projets le 2026-10-07 faute de temps pour le traiter.
> Idée de départ : offrir une part de l'entreprise à ceux qui croient au projet et veulent faire partie de l'aventure — utilisateurs, clients, fans, personnes qui partagent la même philosophie.
> Le cadre juridique ci-dessous vient d'une analyse non vérifiée par un juriste. Les points marqués ⚠️ sont à confirmer avant publication.

## Angle

Ouvrir sur le problème : ceux qui font vivre un service n'en détiennent jamais une part. Un abonné paie, recommande, signale les bugs, parfois pendant des années, et reste un client. Quand l'entreprise est vendue ou lève des fonds, il n'est pas dans la pièce.

Puis la position : une application financée par ses utilisateurs peut aussi leur appartenir en partie. Pas comme une récompense, comme un alignement : les gens dont on dépend ont intérêt à ce que l'entreprise dure.

Puis les limites, avant la solution : c'est réglementé, c'est administrativement lourd, et une part de société non cotée ne se revend pas.

## Ce que ça pourrait être

Une offre réservée aux abonnés : en souscrivant, on prend une action de la société qui fabrique les applications. Chaque abonné-actionnaire a une voix à l'assemblée, reçoit l'information annuelle, et une part des bénéfices s'il y en a.

À décider :

- Une action par abonné, ou proportionnel au montant ?
- Réservé aux premiers abonnés (cercle restreint) ou ouvert à tous ?
- Priorité à la gouvernance (une personne, une voix) ou à la valeur (une action, une voix) ?

## Le cadre juridique

### Il faut d'abord une société

L'Alternative Fabrique est une entreprise individuelle : pas de capital, pas d'actions. Rien n'est possible avant la création de la société (voir `fabrique/vehicule-juridique.md`, qui recommande une SAS à mission).

### Offrir ses actions au public est réglementé

Proposer ses titres au-delà d'un petit cercle est une offre au public de titres financiers (règlement Prospectus 2017/1129, Code monétaire et financier).

| Situation | Régime |
|---|---|
| Moins de 150 personnes par pays, ou investisseurs qualifiés seulement | Cercle restreint : pas d'offre au public, seul le droit des sociétés s'applique |
| Offre au public sous 8 M€ sur 12 mois | Pas de prospectus, mais un document d'information synthétique déposé auprès de l'AMF ⚠️ seuil bas à vérifier |
| Au-delà de 8 M€ | Prospectus visé par l'AMF |

### Le piège de la SAS

Une SAS ne peut pas faire d'offre au public de ses actions (Code de commerce, art. L. 227-2) ⚠️, sauf :

- par une plateforme de financement participatif agréée (PSFP, règlement 2020/1503) ;
- ou en restant dans le cercle restreint.

Offrir directement à des milliers d'utilisateurs demanderait une SA (37 000 € de capital, conseil d'administration, commissaire aux comptes).

Conséquence : pas besoin d'être PSFP soi-même. Une plateforme existante (Tudigo, Sowefund, WiSEED…) peut porter une offre réservée aux abonnés et appliquer les protections prévues : fiche d'informations clés, test de connaissances, simulation de perte, quatre jours de rétractation, plafond de 5 M€ par an.

### Les difficultés propres à l'offre liée à l'abonnement

- Prix : séparer la part qui paie le service (TVA) de la part qui paie l'action (apport en capital, hors TVA).
- Chaque entrée au capital est une augmentation de capital : décision collective, registre des mouvements de titres, statuts à jour. Des milliers de micro-actionnaires font de l'administration un métier.
- Dilution à chaque nouvelle offre, à annoncer.
- Communication : la promotion d'un investissement doit être équilibrée, exacte et non trompeuse, risques aussi visibles que les avantages. « Abonnez-vous et devenez actionnaire » sans mention de la perte possible est sanctionnable.
- Sortie : une action de SAS non cotée ne se revend pas.

### Trois voies réalistes

1. **Cercle restreint** : moins de 150 abonnés choisis, dès la société créée. Permet de tester vite.
2. **Plateforme PSFP existante** : pour passer à l'échelle ; la plateforme regroupe souvent les investisseurs dans une holding pour éviter des milliers de lignes au capital.
3. **SCIC** : les utilisateurs achètent une part au nominal, une personne égale une voix, remboursement au nominal à la sortie. Pas de spéculation, une vraie place dans la gouvernance. ⚠️ régime d'offre des parts de coopérative à confirmer.

## Preuves à réunir avant d'écrire

- Avis d'un juriste sur l'art. L. 227-2 et le seuil du document d'information synthétique.
- Deux ou trois exemples d'entreprises françaises ayant ouvert leur capital à leurs clients, avec ce que ça a donné.
- Le coût administratif réel par actionnaire (plateforme, registre, assemblées).

## Conclusion visée

Sobre : le problème (les utilisateurs ne détiennent rien), le public concerné (abonnés qui veulent faire partie de l'aventure), la valeur (alignement, pas récompense), et l'étape suivante : créer la société, puis une première offre en cercle restreint.
