# 1. Articles served from a bucket, blog rendered on demand, admin in the same app

Date: 2026-08-14

## Status

Accepted

## Context

Articles currently live as `.mdx` files under `app/content/articles/`, compiled
into the bundle by Vite and prerendered into static HTML. The site ships as an
nginx image serving `dist/client`, with no server-side runtime.

That shape ties publishing to the release cycle: a new article is a commit, a
build, an image push and a redeployment. The editorial need is the opposite —
drop a text and have it appear, without touching the deployment.

Two other gaps point the same way. `Inscription.tsx` posts to an endpoint that
does not exist (`VITE_INSCRIPTION_URL`), and its own comment says a provider
that stores addresses is still needed. There is also no place to receive or
triage the applications people send to join the collective.

The packages repo offers parts, not a solution: `@lalternative/admin` is a
React component library over the Better Auth admin plugin, `@lalternative/auth`
wraps Better Auth itself. Neither is an application, neither stores anything.
Nothing in the repo talks to object storage.

## Decision

**Articles move to a bucket, and the blog routes render on demand.**

`/blog/*` and `/en/blog/*` read their MDX from the bucket and compile it at
request time. Publishing is a write to the bucket: no build, no image, no
pipeline run.

**The rest of the site stays prerendered.** `/`, `/apps`, `/outils`, `/pot`,
`/contact`, `/a-propos` have no server-side state and are built to static HTML
as they are today.

**`/sitemap.xml` and `/llms.txt` become dynamic.** They are generated from the
article list, which now lives in the bucket. Left at build time they would omit
every article published since the last deployment — and `llms.txt` is what
answer engines read.

**The admin lives in this app, under `/admin/*`**, rendered on the server. It
receives applications and newsletter sign-ups, and writes articles to the
bucket. One app, one image, one deployment.

**Articles are cached in memory and invalidated on publish.** Reads are served
from the cache, so a request costs what a static file costs; the admin drops
the entry it just wrote. A short TTL backstops a missed invalidation.

**No Go service.** Three tables and a CRUD do not warrant a second language and
a second deployment. Migrations are numbered SQL, matching `lungor/core` and
`go/webhooks`. The event-driven toolkit in `go/eda` is built for a different
problem and would be scaffolding around a form.

## Consequences

The site gains a Node runtime. The image grows from ~60 MB of nginx to a Node
server carrying its dependency tree, and that tree is now what gets scanned and
patched. The public site depends on a process and on the bucket, where it
previously depended on neither — a 5xx is now reachable in a way a file server
could not produce.

MDX compiles at runtime instead of through the Vite plugin, so `@mdx-js/mdx`
moves from a dev dependency to a runtime one. The component map in
`MdxProse.tsx` is unchanged: it is passed as a prop and does not care when the
compilation happened.

A compiled article is a React component, and a route loader's return value is
serialized for hydration — a function does not survive that transport. So the
loader returns the metadata only, and the body is rendered from the server-side
store. The consequence is that an article body is server-rendered and never
re-rendered on the client, which is what a static page did anyway.

The admin shares a process with the public site. A crash takes both down, and
the code that holds bucket write credentials and session handling now runs in
the same server that answers anonymous traffic. Splitting them into two images
from this one repo remains available if that surface becomes a concern.

Search engines and answer-engine crawlers are unaffected: server rendering
delivers the same complete HTML the prerender did, and neither GPTBot nor
ClaudeBot executes JavaScript, so the distinction they would notice — a page
filled in by client-side fetch — is exactly what this decision avoids.

The article loader in `app/content/articles.ts` was written with this move in
mind: it is the single place that knows where articles come from, and the two
`import.meta.glob` calls at its top are what change.

Sign-in requires a verified email address, which `createPlatformAuth` imposes
and does not make optional. Until `SPORE_API_KEY` is set and the sending domain
is verified, nobody can sign in — the first admin included. The admin is
unreachable before mail works.

## Alternatives considered

**Keep everything static, trigger a rebuild on publish.** Preserves the nginx
image and every property that comes with it, at the cost of a pipeline run per
article. Rejected: the requirement is explicitly to publish without rebuilding
an image.

**Static shell, articles fetched client-side from the bucket.** Publishing
would be instant and the image would stay static, but the HTML served to a
crawler would be empty. Answer-engine crawlers do not run JavaScript, so this
would forfeit the citation surface that `robots.txt` and `llms.txt` are built
to earn.

**A separate Go API for applications, subscribers and bucket writes.** Buys a
clean domain boundary and reuse of `go/eda`, and costs a second service, a
second CI, and an authenticated network hop for what is a CRUD over three
tables. Reconsider if the domain grows past that.
