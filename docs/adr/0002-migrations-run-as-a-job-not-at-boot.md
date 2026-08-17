# 2. Migrations run as a Job, not at boot

Date: 2026-08-17

## Status

Accepted

Supersedes the migration mechanism described in
[0001](0001-articles-from-bucket-ssr-blog-admin.md), which stands otherwise.

## Context

The schema was applied by the server itself, on the first query: `migrate()` in
`app/server/db.ts` read `migrations/`, took an advisory lock and applied
whatever was not yet in `schema_migrations`. ADR 0001 chose that deliberately —
one image, one deployment, and no step anyone has to remember.

Every other service in the family had already moved the other way. `spore`,
`lungor`, `skalpai`, `partage` and `amv` each apply their schema from a
Kubernetes Job running `golang-migrate`, promoted by its own ArgoCD
Application, and each states in its own code that the app assumes the schema is
already in place.

That convergence was not a matter of taste. Two failures are recorded in those
repos:

- **skalpai** raced its own Job. The server and the Job resolved the unqualified
  `schema_migrations` to different schemas through `search_path`, so each
  believed nothing had been applied, re-ran migrations against populated tables,
  and crash-looped the pod.
- **lungor** ran the Job as an ArgoCD `Sync` hook. A hook Job is deleted once it
  has run and is excluded from the diff either way, so ArgoCD had no live
  resource to compare and reported `Synced` against a schema that was never
  migrated. A table was missing from a schema the app declared fully deployed.

Neither is reachable from a single-replica site that migrates at boot. Both
become reachable the moment there are two replicas, which the deployment already
allows.

The in-app runner also had a narrower reach than it appeared to. It applied
files in filename order inside a transaction, but it could not report a version,
could not be run without booting the app, and had no way to express a schema
change that must land *before* the new image rolls — which is the ordering a
deployment needs.

## Decision

**The schema is applied by a Kubernetes Job running `golang-migrate`, and by
nothing else.**

`app/server/db.ts` no longer migrates. It connects and queries, and assumes the
database it reaches is already migrated.

**The SQL lives in `apps/migrations/` and is the migration image.** `COPY .
/migrations` is the whole of it, so a new migration is a new image is a new tag
— and the tag is what ArgoCD diffs. Publishing is scoped to that directory, so a
deploy that changes no schema does not restate one.

**The Job is a plain resource, never a Sync hook.** `Replace=true,Force=true`,
because a Job spec is immutable and the controller stamps immutable labels onto
the pod template; delete-then-create is the only sequence the API accepts.
`ttlSecondsAfterFinished` is deliberately unset — a reaped Job would read as
OutOfSync and `selfHeal` would recreate it on a loop.

**Its Application sits at sync-wave 1**, between the database (wave 0) and the
site (wave 2), so the schema lands before the pods that read it roll.

**The image-updater strategy is `alphabetical`, not `newest-build`.** Tags are
`YYYYMMDD-HHMM-<sha>`, so lexical order is chronological; `newest-build` sorts on
the image config's `.created` field, which `sklp image push` writes as
`0001-01-01`, making every fresh build look older than the current one. That left
lungor's Job pinned to a July tag for two weeks.

**Filenames are `NNNNNN_snake_case.{up,down}.sql`, checked in CI.** golang-migrate
reads the directory as a set and refuses a malformed one whole — a duplicate
version number means *nothing* is applied, not that one file is skipped. The CI
step also requires a `.down.sql` for every `.up.sql`. Those downs are a writing
discipline, not an operational rollback: recovery is a restore from the CNPG
backup, and no manifest runs `migrate down`.

**Existing databases are handed over by `_cutover_to_golang_migrate.sql`.** The
old runner's table is `schema_migrations(name TEXT, applied_at)`; golang-migrate's
is `schema_migrations(version BIGINT, dirty BOOL)` — same name, incompatible
shape. The cutover reads how far the old runner got, drops its table, recreates
it in the new shape and seeds it to that version. It is guarded, so it is a no-op
on a database already converted and on one that is empty. The leading underscore
and the missing `.up`/`.down` suffix keep it out of the migration set.

## Consequences

Publishing an image is no longer sufficient to deploy a schema change: the
migrate image has to be published too. Both come out of the same `sklp run
publish`, but a change under `apps/migrations/` and a change under `app/` now
produce two images with independent scopes.

The site can boot against a database whose schema is older than the code
expects. Before, the code and the schema arrived together by construction; now
the wave ordering is what guarantees it, and a Job that fails leaves the site
running against the previous schema. That is the intended failure mode — a
failed migration should not take the public site down — but it means the Job's
status is worth watching, which is why the Job survives its run and its logs
stay readable until the next tag replaces it.

`migrations/` moved to `apps/migrations/` and the files were renumbered to six
digits. Anyone with the old path in muscle memory will find nothing there.

The site image no longer carries the SQL, which is the correct blast radius: the
credentials that can alter the schema now belong to a Job that runs for seconds,
not to a server answering anonymous traffic for weeks.

## Alternatives considered

**Keep migrating at boot.** No new image, no new Application, and it had worked.
Rejected on the two recorded failures above: with more than one replica, boot
migration is a race, and it cannot express "schema first, then pods".

**Run the Job as a PreSync hook.** The obvious shape, and the one lungor started
from. Rejected because a hook is invisible to the diff: ArgoCD reports Synced
whether or not the schema landed, which is exactly how the incident went
unnoticed.

**Write our own migration CLI in Go.** `packages/` is where shared Go lives, and
a small runner would fit there. Rejected: `golang-migrate` already handles the
advisory lock, the dirty flag and the version reporting, every sibling service
pins the same `v4.19.1`, and a second implementation would have to earn the
difference before it could be trusted with a schema.
