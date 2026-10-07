# Le coût caché des détails

> Statut : base éditoriale à reprendre avant publication.
> Série possible : « Les coûts cachés de la fabrique ».

## Angle

Créer une application coûte de moins en moins cher. La rendre complète coûte
toujours aussi cher, car les cas discrets s'accumulent : désabonnement,
suppression d'un compte, droits d'accès, factures à conserver, traitements en
cours, données à effacer ou à archiver.

Avec plusieurs applications, le même détail revient partout. Le traiter six
fois indépendamment produit six comportements, six occasions d'oublier une
étape et six endroits à corriger. Tout centraliser dans un service unique crée
le problème inverse : un composant omniscient dont toutes les applications
dépendent.

La vraie industrialisation consiste à trouver un terrain commun : une règle et
un contrat partagés, puis une responsabilité locale clairement attribuée à
chaque application.

## Titres possibles

1. **Ce qui coûte cher dans une application, ce sont les détails**
2. **Un bouton pour se désabonner, six systèmes à arrêter**
3. **Le dernier pour cent d'une application contient la moitié du travail**

Titre de travail retenu : **Un bouton pour se désabonner, six systèmes à
arrêter**.

## Chapeau provisoire

Se désabonner tient dans un bouton. Derrière, il faut arrêter une facturation,
retirer des droits, terminer des traitements, conserver certaines factures et
effacer certaines données. Répétez ce détail dans six applications : vous
obtenez un problème d'architecture.

## Ouverture rédigée

Un client clique sur « Se désabonner ».

Pour lui, l'action est terminée.

Pour le système, elle commence à peine.

Il faut empêcher le prochain prélèvement sans effacer les factures qui doivent
être conservées. Retirer les droits au bon moment. Décider ce qui arrive aux
traitements déjà lancés. Révoquer les clés d'API. Arrêter les emails qui n'ont
plus lieu d'être envoyés. Conserver la preuve de ce qui a été fait. Puis donner
au client une réponse assez claire pour qu'il n'ait pas besoin d'écrire au
support.

Aucune de ces opérations n'est spectaculaire. Chacune est un détail. Leur
somme fait pourtant la différence entre une démonstration et un produit.

Le problème change encore d'échelle lorsque la même personne utilise plusieurs
applications. Faut-il reconstruire le désabonnement dans chacune ? Faut-il
confier toute la procédure à un service central qui connaîtrait chaque produit,
chaque donnée et chaque exception ?

Ni la copie ni le grand orchestrateur omniscient ne constituent une bonne
fondation. Il faut trouver un terrain commun sans retirer à chaque application
la responsabilité de son propre métier.

> Le détail n'est pas ce que l'on ajoute à la fin. C'est l'endroit où le produit
> rencontre enfin la réalité.

## Plan de l'article

### 1. La fonctionnalité visible tient dans un bouton

Partir du geste du client. L'interface donne l'impression d'une opération
unique et instantanée. Montrer ensuite la chaîne de conséquences qu'elle
masque.

### 2. Un même mot recouvre plusieurs décisions

« Désabonner » peut signifier :

- arrêter le renouvellement, immédiatement ou à la fin de la période payée ;
- retirer des droits dans une ou plusieurs applications ;
- laisser finir, suspendre ou annuler les traitements en cours ;
- révoquer les clés, sessions et intégrations ;
- distinguer les données à effacer de celles à conserver légalement ;
- interrompre certains messages sans supprimer les communications obligatoires ;
- rendre l'opération rejouable sans facturer ou supprimer deux fois.

Le coût se trouve moins dans chaque ligne que dans la cohérence entre toutes
les lignes.

### 3. Six applications, trois mauvaises réponses

Première réponse : recopier la procédure dans chaque application. Elle est
rapide la première fois, coûteuse toutes les suivantes.

Deuxième réponse : créer un service central qui fait tout. Il finit par devoir
connaître les tables, les exceptions et le vocabulaire de chaque produit.

Troisième réponse : faire croire que le problème n'existe pas encore. Les
équipes le découvrent alors à travers des prélèvements indus, des accès restés
ouverts ou des suppressions incomplètes.

### 4. Trouver le terrain commun

Le commun n'est pas nécessairement une implémentation géante. Il peut être :

- une identité partagée ;
- un état de souscription faisant autorité ;
- un contrat d'événement stable ;
- des règles communes d'idempotence, de reprise et d'audit ;
- une politique commune de conservation ;
- un parcours et un vocabulaire cohérents pour le client.

Chaque application reçoit la même intention, puis reste responsable de ses
conséquences locales. Le système commun dit qu'une souscription prend fin. Le
produit sait quels droits retirer et quels travaux terminer.

### 5. Ce que l'on industrialise vraiment

On n'industrialise pas seulement la création d'un dépôt, d'une API ou d'une
page de connexion. On industrialise les décisions qui reviennent lorsque le
produit rencontre un cas réel.

Une fondation répétable ne supprime pas le détail. Elle évite de le redécouvrir
et de le résoudre différemment à chaque application.

### 6. Les détails font le produit

Refermer sur la formule de Charles Eames : « Les détails ne sont pas des
détails. Ils font le produit. » Elle vient du film *ECS* consacré en 1961 à un
système de mobilier modulaire, et non de Steve Jobs.

Le parallèle avec le logiciel est direct : ce ne sont pas les grandes briques
isolées qui donnent sa vie au produit, mais leurs connexions — précisément les
endroits où les petits cas deviennent coûteux.

Apple a institutionnalisé une idée voisine : ses responsables sont censés
connaître les détails de leur organisation plusieurs niveaux sous eux, parce
que les décisions rapides et justes en dépendent.

## Phrase de conclusion possible

> Une application devient un produit lorsque ses détails cessent d'être des
> exceptions et deviennent un système.

## Points à confirmer avant publication

- Nommer les applications réellement concernées par le parcours de
  désabonnement.
- Décrire uniquement les briques déjà en place ; présenter le reste comme un
  choix d'architecture ou une direction.
- Vérifier le partage réel entre Lungor, l'identité commune et les handlers
  propres à chaque produit.
- Ajouter un exemple d'incident ou de cas limite réellement rencontré.
- Mesurer, si possible, le nombre d'étapes ou de composants touchés par un
  désabonnement réel.

## Sources de travail

- Herman Miller, [*Frame by Frame*](https://www.hermanmiller.com/stories/why-magazine/frame-by-frame/) : origine de la formule de Charles Eames dans le film *ECS* de 1961.
- Apple, [*How Apple Is Organized for Innovation*](https://www.apple.com/jobs/pdf/HBR_How_Apple_Is_Organized_For_Innovation-4.pdf) : expertise des responsables et immersion dans les détails.

