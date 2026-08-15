# syntax=docker/dockerfile:1.7
#
# web image — Node server.
#
# This used to be an nginx image serving a fully prerendered dist/client, with
# dist/server thrown away. Articles are now published to a bucket and rendered
# on demand, so the handler is what ships and the runtime needs Node — see
# docs/adr/0001-articles-from-bucket-ssr-blog-admin.md.
#
# The fixed pages are still prerendered into dist/client and served as files by
# server.js; only /blog, /en/blog, the article routes and the two SEO files are
# rendered per request.

# ───────────────────────── builder ─────────────────────────
# Full toolchain (vite, esbuild, all devDeps) lives here; the layer is
# discarded. Only the build output and the production dependencies flow into
# the runtime stage.
FROM node:24-bookworm AS builder

WORKDIR /app

# Pin pnpm to the version in .sklp/space.yaml so the lockfile resolves the same
# way here as it does in CI.
RUN corepack enable && corepack prepare pnpm@11.3.0 --activate

# pnpm-workspace.yaml is not a monorepo marker here — it carries the
# onlyBuiltDependencies/allowBuilds settings that let esbuild run its
# postinstall. Without it `vite build` fails on a missing native binary.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# NODE_ENV is intentionally NOT production: pnpm would skip devDependencies,
# and vite lives there. CI=true disables the interactive build-script approval
# prompt that would otherwise hang the build.
ENV CI=true
RUN pnpm install --frozen-lockfile

# The prerender pass boots a Vite preview server and crawls it over HTTP.
# Vite binds it to `localhost`, which has to resolve through NSS — and a bare
# OCI rootfs has no /etc/hosts at all. Docker papers over this by bind-mounting
# one into every build container; sklp's runc builder does not, so
# getaddrinfo("localhost") returns ENOTFOUND, vite.preview() throws, and the
# build dies on "Failed to start the Vite preview server for prerendering".
#
# Writing the file into the image layer fixes it for every builder, with no
# dependency on what the runtime chooses to mount. Both families are listed:
# Node resolves localhost to ::1 first, and the server does listen on ::.
RUN printf '127.0.0.1\tlocalhost\n::1\tlocalhost ip6-localhost ip6-loopback\n' > /etc/hosts

# Keep the crawler on IPv4 once the name resolves. dist/client is fetched over
# this same loopback, and mixing families between the listener and the client
# has bitten this build before.
ENV NODE_OPTIONS=--dns-result-order=ipv4first

COPY tsconfig.json vite.config.ts ./
COPY app app
COPY public public

RUN pnpm build

# Resolve the runtime tree in a directory of its own.
#
# Running --prod over the build install would not do: pnpm unlinks the packages
# from node_modules but leaves them in the .pnpm store beside it, so vite,
# esbuild and the rest of the toolchain still ship — and the image scan reads
# every package.json it finds, not the ones actually reachable.
RUN mkdir /runtime \
    && cp package.json pnpm-lock.yaml pnpm-workspace.yaml /runtime/ \
    && cd /runtime \
    && pnpm install --frozen-lockfile --prod --ignore-scripts

# ───────────────────────── runtime ─────────────────────────
# -slim rather than the full image: it drops the build toolchain that ships in
# node:24-bookworm and is dead weight next to a server that only reads files and
# answers HTTP.
FROM node:24-bookworm-slim

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080
ENV HOST=0.0.0.0

COPY --from=builder /runtime/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY server.js ./server.js

# Read at runtime, not bundled: the first query applies whatever is not yet in
# schema_migrations, so the files have to be in the image.
COPY migrations ./migrations

# node is the non-root user baked into the official image. Numeric form so the
# runtime does not need to resolve /etc/passwd.
USER 1000:1000

EXPOSE 8080

CMD ["node", "server.js"]
