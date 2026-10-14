# 3. Comments under the articles live in the suite's chat service

Date: 2026-10-13

## Status

Accepted

## Context

Readers have no way to answer a piece of the revue. The need is a discussion
under each article, in both languages, read by anyone and written by people
who stand behind their name, with the collective reading each comment before
it appears.

The site already has a Node server, Postgres and an admin (ADR 0001), so a
`comments` table and a form would fit the shape of the applications and the
newsletter. But the suite decided otherwise before this site needed it: messag
ADR 0016 makes one chat service for every product, with a `public` room
policy and a `moderated` flag written for exactly this case, and names
fabrique's articles as a room subject. Nakoda's support uses the same surface.

## Decision

**The discussion under an article is a room of the suite's chat service.**
This site is the `www` tenant. One room per article and per language, attached
to the subject `article/<dir>:<locale>`: a reader of the English page must not
land in a French thread. The room is `public` and `moderated`, in standard
mode, since comments are public by nature.

**Nobody needs an account to comment.** A name is enough: the form posts
through this server, which signs the comment as a guest of the `www` tenant
with its app key. A reader who has a suite account may sign in and the
comment then carries their urbangate identity, the same one as on every
product. Both wait for a moderator. The guest path is what the collective
asked for on 2026-10-14: a blog that demands an account before a reply loses
the reply. Against bots it keeps a honeypot field, a minimum fill time and a
per-address rate, and the moderation reads everything anyway; no email is
asked for, so nothing personal is stored beyond the name the person chose.

**The server owns the tenant surface, the browser only reaches the rooms.**
`chat-service.ts` holds the app key the chat service issued to the `www`
tenant, opens the rooms on publish and moderates from `/admin`. The
browser talks to the rooms surface through `/api/chat/*`, a relay that admits
only the posts routes and attaches the reader's urbangate token from the
Better Auth session. The token never reaches the browser, and the app key
never leaves the server.

**The article never waits for the chat.** The comments mount after hydration,
ask the server for the room id, and read the posts themselves. The service
down, or unconfigured, means no section, not a broken page; this is the rule
ADR 0001 set for the database, applied again.

**No generated client.** The site uses five routes of the contract. A typed
fetch wrapper the size of a screen costs less than publishing and tracking
`@messag/chat-client` across repositories; the day a sixth product needs the
same, the client gets published and this wrapper goes.

**No table here.** The service holds the posts, their status and the room
list. This site stores nothing about comments.

## Consequences

The comment section depends on a service of another repository, reached over
the public network. Its contract (`apps/chat/api/openapi.yaml` in messag) is
what this site is written against; a breaking change there is a change here.

The tenant surface has to list the pending posts across the tenant's rooms
for the admin screen; that route was added to the service for this site and
for nakoda.

A comment is personal data held by the chat service, under the suite's
account. Erasing an account reaches the chat through urbangate's membership
erasure (ADR 0016), not through this site. The legal notice must name the
discussion and the account it requires.

Running the site without `CHAT_URL` shows no comments and costs nothing else;
`CHAT_KEY` unset leaves the rooms unopened and the admin screen empty, which
the screen says.
