# Mise en route de l'admin et du bucket

Le site public tourne sans rien de ce qui suit : il sert les `.mdx` embarqués
dans l'image. L'admin, lui, ne fonctionne pas tant que les trois dépendances
ci-dessous n'existent pas — et l'ordre compte, chaque étape produisant ce que la
suivante consomme.

## 1. Créer le bucket OVH

Déclaré dans `kube-infra`, `stacks/platform/ovh/buckets-v1.ts` :
`lalternative-prod-content` pour les articles, `lalternative-prod-backups` pour
les sauvegardes Postgres.

```bash
cd ~/code/projects/kube-infra
export ENABLE_OVH_BUCKETS_V1=true
make ovh-buckets-v1-diff     # lire le plan avant
make ovh-buckets-v1-deploy
```

Le stack crée les buckets, un utilisateur OVH limité à ceux-ci par policy IAM,
et publie les credentials dans SCW Secret Manager sous
`/platform-ops/buckets/ovh/lalternative/ovh-buckets-lalternative-credentials`.

L'`ExternalSecret` `lalter-www-s3` les recopie dans le namespace. Rien à faire à
la main.

## 2. Déposer les articles

Le site liste le bucket pour trouver les articles : tant qu'il est vide, la
revue l'est aussi. Les `.mdx` du dépôt sont le corpus de départ.

```bash
# depuis www/, avec les credentials du bucket dans l'environnement
node scripts/seed-bucket.mjs --dry-run   # vérifier la liste
node scripts/seed-bucket.mjs
```

22 objets : 16 sources et 6 illustrations. L'opération est rejouable.

## 3. Créer la base

Tout ce que le pod lit vient de l'entrée SCW
`/lalternative/lalternative-production`, en clé/valeur :

| Clé | Ce que c'est |
|---|---|
| `POSTGRES_PASSWORD` | le rôle `lalter`, dont CNPG se sert pour bootstrapper |
| `BETTER_AUTH_SECRET` | signature des sessions ; une valeur aléatoire longue |
| `BETTER_AUTH_URL` | `https://lalternativefabrique.org` — les liens de connexion en sont dérivés |
| `SPORE_API_KEY` | voir l'étape 4 |
| `SPORE_FROM` | `contact@lalternativefabrique.org` |

Elles arrivent dans le pod telles quelles ; seul `DATABASE_URL` est composé à
partir de `POSTGRES_PASSWORD`. Ajouter une variable plus tard ne demande donc
aucun changement de manifeste.

`POSTGRES_PASSWORD` doit exister avant la synchronisation, sinon
l'`ExternalSecret` reste en erreur et CNPG ne peut pas bootstrapper.

L'Application ArgoCD `lalter-data` est en **synchronisation manuelle** : elle
possède un volume, et un prune automatique emporterait la base. Il faut donc la
synchroniser explicitement depuis l'interface ArgoCD, ou :

```bash
argocd app sync lalter-data
```

Les migrations SQL sont appliquées par le Job `db-migration`, que synchronise
l'application ArgoCD `lalter-migrations` (vague 1, avant le site) — voir
`docs/adr/0002-migrations-run-as-a-job-not-at-boot.md`. Publier une image
`migrate` est ce qui déclenche la migration ; il n'y a rien à lancer à la main.

Le Job survit à son exécution, donc ses journaux restent lisibles :

```bash
kubectl -n lalternative-prod logs -l app=db-migration --tail=-1
```

Sans la ligne finale `=== migration job done ===`, l'exécution n'est pas allée
à son terme.

## 4. Vérifier le domaine dans Spore

L'authentification impose une adresse vérifiée : sans mail qui part, personne ne
peut se connecter, y compris le premier administrateur.

1. `POST /identities` avec `{"name": "lalternativefabrique.org"}` sur
   `https://api.sporee.fr` — la réponse contient les enregistrements DNS à
   publier, dont le sélecteur DKIM qui n'est pas devinable à l'avance.
2. Publier les enregistrements. **DKIM et SPF sont bloquants** ; DMARC et le
   CNAME de bounce sont vérifiés mais n'empêchent pas la validation.
   Attention : un seul enregistrement `v=spf1` sur l'apex, plusieurs valent
   échec permanent.
3. `POST /identities/:id/verify` jusqu'à ce que DKIM et SPF passent.
4. Créer une clé sur `app.sporee.fr` (format `sk_live_*`, affichée une seule
   fois) et la déposer dans l'entrée SCW `lalternative-production` sous
   `SPORE_API_KEY`.

## 5. Créer le premier administrateur

Une fois le mail opérationnel, `/admin-login` répond et l'écran de création du
premier compte devient utilisable.

## Vérifier

```bash
curl -s https://lalternativefabrique.org/healthz          # ok
curl -s https://lalternativefabrique.org/llms.txt | head  # les articles du bucket
```

Un article publié depuis l'admin doit apparaître immédiatement dans
`/llms.txt` et `/sitemap.xml` : ils sont générés à la demande, pas au build.
S'il n'y figure pas, le cache mémoire n'a pas été invalidé — il expire de
lui-même en une minute.
