# Supprimer un nœud Kubernetes sans supprimer une partie du produit

> Statut : base éditoriale à reprendre avant publication.
> Série possible : « Les coûts cachés de la fabrique ».

## Angle

Le prix affiché d'un nœud Kubernetes est simple. Le coût réel inclut tout ce
qu'il faut construire autour de sa disparition : capacité disponible ailleurs,
répliques correctement distribuées, éviction progressive, vérification de
santé, arrêt gracieux, budget de perturbation et observation du retour à
l'équilibre.

Kubernetes sait recréer un pod. Il ne peut pas décider à notre place combien
de temps une interruption est acceptable, si deux répliques placées sur le
même nœud constituent vraiment une redondance, ni si une requête interrompue
peut être rejouée sans dommage.

Le sujet n'est donc pas « comment supprimer un nœud », mais **tout ce qu'il
faut avoir décidé avant de pouvoir le supprimer sans que le client le voie**.

## Titres possibles

1. **Supprimer un nœud sans supprimer une partie du produit**
2. **Le prix d'un nœud est affiché, le coût de sa disparition ne l'est pas**
3. **Kubernetes recrée les pods, pas la continuité de service**

Titre de travail retenu : **Le prix d'un nœud est affiché, le coût de sa
disparition ne l'est pas**.

## Chapeau provisoire

Une machine disparaît du cluster. Kubernetes recrée ses pods ailleurs. Entre
ces deux événements se cachent pourtant de la capacité, du placement, des
délais, des requêtes interrompues et parfois une application indisponible. Le
coût réel du nœud est dans ces détails.

## Ouverture rédigée

Dans la console du fournisseur, supprimer un nœud tient dans un bouton.

La machine disparaît de la facture. Mais elle ne disparaît pas seule.

Elle héberge peut-être l'unique instance d'une API. Ou deux répliques que le
scheduler a placées au même endroit. Elle traite peut-être une requête longue,
consomme un message ou conserve un fichier temporaire dont un autre service
attend le résultat. Les autres composants de l'application tournent encore,
répartis sur les nœuds restants. Le produit paraît vivant, mais une partie de
son chemin ne répond plus.

Kubernetes recréera les pods manquants. Cette promesse est réelle. Elle ne dit
cependant ni où ils pourront redémarrer, ni quand ils seront prêts, ni ce qui
arrivera aux opérations interrompues entre les deux.

> L'orchestrateur rétablit un état désiré. La continuité de service dépend de la
> précision avec laquelle nous avons décrit cet état — et tous ses détails.

Le coût d'un nœud n'est donc pas seulement son prix mensuel. C'est aussi le
prix de la capacité laissée libre sur les autres nœuds, des répliques, des
sondes, des règles de placement, de l'arrêt gracieux et des tests nécessaires
pour rendre sa disparition ordinaire.

## Scène technique à développer

Un cluster possède trois nœuds. Une application est composée d'un front, d'une
API et de workers. Ses pods sont distribués par le scheduler.

Le nœud B doit être retiré :

1. le front continue de répondre depuis A ;
2. l'unique pod de l'API, placé sur B, cesse de répondre ;
3. les workers présents sur C continuent de consommer des tâches qui dépendent
   de cette API ;
4. le contrôleur demande une nouvelle instance ;
5. le scheduler cherche un nœud disposant des ressources nécessaires ;
6. l'image est téléchargée, le conteneur démarre, les migrations ou
   initialisations s'exécutent, puis la sonde de disponibilité finit par
   réussir ;
7. pendant cet intervalle, le système n'est pas entièrement arrêté, mais il
   n'est plus entièrement fonctionnel.

Cette scène devra être remplacée ou complétée par un cas réel observé dans nos
clusters.

## Plan de l'article

### 1. Une suppression simple dans la console, une perturbation distribuée

Montrer le contraste entre l'action opérateur et les nombreuses conséquences
dans le cluster. Un nœud est une unité de facturation ; pour l'application,
c'est un ensemble changeant de capacités et de dépendances.

### 2. Ce que Kubernetes garantit — et ce qu'il ne garantit pas

Un `Deployment` maintient un nombre désiré de pods. Le scheduler leur cherche
une place. Les `EndpointSlice` cessent de présenter un pod en terminaison comme
une destination valide.

Mais plusieurs questions restent à la charge de l'architecture :

- existe-t-il une autre réplique ?
- se trouve-t-elle sur un autre nœud ou dans une autre zone ?
- les nœuds restants ont-ils assez de ressources pour accueillir le
  remplacement ?
- le nouveau pod devient-il réellement prêt avant de recevoir du trafic ?
- l'ancien sait-il terminer ce qu'il a commencé ?
- une requête ou un message interrompu peut-il être rejoué sans double effet ?

### 3. Retirer n'est pas arracher

Pour une maintenance volontaire, le drainage marque le nœud comme non
planifiable puis évince les pods. Les évictions peuvent respecter leur délai
d'arrêt et les `PodDisruptionBudget`.

Supprimer directement la machine retire cette phase de coordination. Une panne
réelle peut évidemment l'imposer ; c'est précisément pourquoi la disponibilité
ne peut pas dépendre uniquement d'une procédure manuelle de drainage.

### 4. La redondance doit être topologique

Deux répliques ne protègent pas d'une panne de nœud si elles sont placées sur
le même nœud. Les contraintes de répartition topologique permettent d'exprimer
la distribution souhaitée entre hôtes ou zones.

Cette protection possède un prix : davantage de pods, davantage de capacité
réservée et parfois un placement refusé lorsque le cluster est trop petit pour
respecter la règle.

### 5. Le coût caché de la capacité libre

Un cluster rempli à 100 % est économique jusqu'à la première disparition. Si
les nœuds restants ne peuvent pas accueillir les pods déplacés, le contrôle
plane sait ce qu'il voudrait faire mais n'a nulle part où le faire.

La marge inutilisée ressemble à du gaspillage dans une feuille de calcul. En
production, elle achète le droit de perdre une machine sans perdre le service.

### 6. Les détails qui rendent la disparition ordinaire

- plusieurs répliques lorsque le service l'exige ;
- répartition entre nœuds ou zones ;
- demandes de ressources réalistes ;
- capacité de remplacement disponible ;
- sondes de démarrage, de disponibilité et de vie distinctes ;
- délai d'arrêt et hooks adaptés au comportement réel de l'application ;
- budgets de perturbation ;
- traitements idempotents et files capables de rejouer ;
- état persistant hors du disque éphémère du nœud ;
- alerte sur la capacité dégradée, pas seulement sur l'arrêt total ;
- exercice régulier de retrait d'un nœud.

### 7. Ce que l'on paie vraiment

Le fournisseur facture la machine. Le produit paie le travail nécessaire pour
que cette machine puisse disparaître : conception, capacité excédentaire,
automatisation, tests et exploitation.

Ce coût est facile à cacher parce qu'il n'apparaît pas sur la ligne « nœud » de
la facture. Il apparaît dans le temps d'ingénierie — ou, plus tard, dans le
temps d'indisponibilité.

## Phrase de conclusion possible

> Une infrastructure devient solide lorsqu'une machine peut disparaître sans
> devenir un événement produit.

## Points à confirmer avant publication

- Reconstituer un retrait ou une panne de nœud réellement observé sur notre
  infrastructure.
- Identifier les applications et les dépendances présentes sur chaque nœud au
  moment du cas choisi.
- Vérifier les répliques, contraintes de répartition, `PodDisruptionBudget`,
  sondes et délais d'arrêt effectivement configurés.
- Mesurer le temps entre le début du drainage ou de la panne et le retour à la
  capacité nominale.
- Distinguer clairement maintenance volontaire, suppression brutale, pression
  de ressources et arrêt propre de la machine : Kubernetes ne leur applique
  pas exactement les mêmes garanties.
- Ne pas promettre de haute disponibilité lorsque le cluster ou la base de
  données conserve un point unique de défaillance.

## Sources techniques de travail

- Kubernetes, [*Safely Drain a Node*](https://kubernetes.io/docs/tasks/administer-cluster/safely-drain-node/) : drainage, arrêt gracieux et respect des budgets de perturbation.
- Kubernetes, [*Disruptions*](https://kubernetes.io/docs/concepts/workloads/pods/disruptions/) : perturbations volontaires ou involontaires et rôle des `PodDisruptionBudget`.
- Kubernetes, [*API-initiated Eviction*](https://kubernetes.io/docs/concepts/scheduling-eviction/api-eviction/) : séquence d'éviction et retrait du pod des `EndpointSlice`.
- Kubernetes, [*Pod Topology Spread Constraints*](https://kubernetes.io/docs/concepts/scheduling-eviction/topology-spread-constraints/) : distribution des répliques entre domaines de panne.
- Kubernetes, [*Node-pressure Eviction*](https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/) : différences entre éviction sous pression, grâce d'arrêt et budgets de perturbation.

