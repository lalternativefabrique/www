# Publication — « Faire de l'IA en France, en 2026 »

> Textes prêts à coller. C'est vous qui publiez : chacun de ces messages vous engage
> publiquement sous votre nom.
> URL à utiliser une fois le site en ligne : `https://lalter.org/blog/faire-de-lia-en-france-en-2026`
> ⚠️ Ne rien publier tant que le site n'est pas déployé — un lien mort tue le post.

---

## Ordre recommandé

1. **LinkedIn** — audience acquise, risque faible, permet de roder le message
2. **Communautés dev FR** — public réellement concerné
3. **Hacker News** — le plus fort potentiel, mais un seul essai par URL. À garder pour la fin,
   une fois le texte éprouvé ailleurs.

Ne pas tout publier le même jour. Espacer de quelques jours pour pouvoir corriger entre deux.

---

## 1. LinkedIn

Format : accroche courte, pas de lien dans les 3 premières lignes (l'algorithme pénalise
les liens sortants — le mettre en commentaire fonctionne mieux).

```
« Pour faire de l'IA, il faut partir aux États-Unis. »

On me l'a répété assez souvent pour que je vérifie.

Nos outils transcrivent, traduisent et indexent des contenus toute la journée.
Voici la chaîne complète :

— Reconnaissance vocale : Whisper large-v3-turbo, sur OVH AI Endpoints
— Modèles de langue : Mistral, hébergés en France
— Recherche sémantique : embeddings bge-m3, même infrastructure
— Stockage : OVH (Gravelines) et Scaleway (Paris)

Aucun appel ne sort de France. Ce n'est pas une feuille de route, c'est ce qui
tourne en production.

Le coût ? Transcrire une heure d'audio : 0,046 €. La traduire : 0,0047 €.
À ces niveaux, la question du surcoût ne se pose plus.

Le catalogue est plus étroit qu'ailleurs, je ne prétends pas le contraire.
Les modèles récents sortent aux États-Unis d'abord. Mais pour transcrire,
traduire, résumer, indexer — l'essentiel de ce que font les produits réels —
ce qui est disponible ici fait le travail.

Construire en France n'est plus un sacrifice qu'on consent par principe.
Encore faut-il l'essayer avant de le déclarer impossible.

J'ai détaillé les chiffres et l'architecture ↓
```

Premier commentaire : le lien vers l'article.

---

## 2. Communautés dev francophones

Cibles : r/devfr, r/france (prudence — audience généraliste), Discord et Slack de dev FR,
Indie Hackers FR, forums d'hébergement.

**Règle absolue** : ne jamais poster un lien seul. Ces communautés sanctionnent la
promotion sèche. Apporter le contenu, le lien vient après.

```
Titre : Nos chiffres après un an d'IA hébergée uniquement en France

On fait tourner de la transcription et de la synthèse en production,
entièrement sur OVH AI Endpoints et Mistral. Zéro appel sortant vers
les États-Unis.

Les chiffres qu'on peut partager :
- Transcription d'une heure d'audio : 0,046 €
- Traduction de la même heure : 0,0047 €
- Whisper large-v3-turbo, Mistral, embeddings bge-m3

Ce qui marche : pour transcrire, traduire, résumer, indexer, le catalogue
français fait le travail sans compromis notable.

Ce qui marche moins : le catalogue est plus étroit, les modèles récents
sortent ailleurs d'abord. Sur des usages très pointus, l'écart est réel.

J'ai écrit le détail ici si ça intéresse : [lien]

Content d'échanger si vous avez des retours d'expérience sur OVH AI
Endpoints — les chiffres publics sont rares.
```

La dernière ligne compte : elle ouvre une conversation au lieu de conclure une annonce.

---

## 3. Hacker News

⚠️ **Un seul essai par URL.** Un post qui échoue ne se rejoue pas. Publier en dernier,
une fois le texte éprouvé ailleurs.

Titre — factuel, sans superlatif, c'est ce qui marche sur HN :

```
Running production AI entirely on French infrastructure: our numbers
```

Alternatives si la première ne convainc pas :

```
We run Whisper and Mistral on EU-only infra. Here is what it costs
One year of AI in production without a single US API call
```

**Moment** : mardi–jeudi, 8h–10h heure de New York (14h–16h Paris).

**Premier commentaire, à poster vous-même immédiatement** — HN attend que l'auteur
se présente :

```
Author here. Some context that didn't fit in the post:

We build tools for content transcription and knowledge management. Every
inference call runs on OVH AI Endpoints (Whisper large-v3-turbo, Mistral,
bge-m3), storage on OVH Gravelines and Scaleway Paris.

The honest tradeoff: the model catalogue is narrower and new models land
in the US first. For transcription, translation, summarization and
embeddings, we haven't hit a wall. For frontier reasoning tasks, we would.

Costs are in the post — happy to answer anything about the setup.
```

**À anticiper** : on vous demandera de comparer les performances avec les modèles
américains. Répondez honnêtement, y compris quand c'est défavorable. Un post qui
prétend qu'il n'y a aucun compromis se fait démolir en trois commentaires.

---

## Ce qu'il ne faut pas faire

- ❌ Publier partout le même jour — aucune marge de correction
- ❌ Poster sur HN avant d'avoir éprouvé le message ailleurs
- ❌ Prétendre qu'il n'y a aucun inconvénient — l'aveu de la limite est ce qui rend crédible
- ❌ Enchaîner sur un argumentaire produit dans les commentaires — l'article amène le lecteur,
  il choisit ensuite
- ❌ Inventer un chiffre d'audience ou de clients pour paraître plus établi

---

## Mesurer

Le seul indicateur utile : **les visites sur `/outils` et `techtuel.com` venant de l'article.**

Trafic, likes et commentaires ne disent rien. Ce qui compte, c'est si un lecteur va voir
les produits.

⚠️ Aucune mesure d'audience n'est installée sur le site aujourd'hui — pas d'analytics.
Sans ça, vous publierez à l'aveugle. À installer avant de lancer la diffusion.
