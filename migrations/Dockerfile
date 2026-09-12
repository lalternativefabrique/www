# The migration image: golang-migrate plus this directory's SQL, and nothing
# else. The SQL is the image, which is what makes "a new migration" and "a new
# tag" the same event — and the tag is what ArgoCD diffs to decide the Job must
# run again.
#
# Built from source rather than pulled from migrate/migrate:vX, whose published
# images carry known CVEs in their transitive dependencies and would fail the
# publish scan.
FROM golang:1.26-alpine AS builder

ARG MIGRATE_VERSION=v4.19.1

RUN apk add --no-cache git ca-certificates

WORKDIR /src
RUN git clone --depth 1 --branch ${MIGRATE_VERSION} https://github.com/golang-migrate/migrate.git .

# Force-upgrade the transitive dependencies Trivy flags in the pinned release.
RUN go get \
        github.com/golang-jwt/jwt/v4@v4.5.2 \
        github.com/jackc/pgx/v5@v5.9.0 \
        golang.org/x/crypto@v0.46.0 \
        golang.org/x/oauth2@v0.34.0 \
        google.golang.org/grpc@v1.79.3 \
        github.com/go-jose/go-jose/v4@v4.1.4 \
    && go mod tidy

# The postgres tag builds the pgx driver and the file source. Without it
# `migrate up` exits non-zero and applies no schema.
RUN CGO_ENABLED=0 GOOS=linux go build \
        -tags "postgres" \
        -ldflags="-s -w -X main.Version=${MIGRATE_VERSION}" \
        -o /out/migrate ./cmd/migrate

# alpine rather than distroless: the Job wraps `up` in a shell script to log the
# schema version on each side of it, and distroless ships no shell to run it in.
# psql comes with it, for the one-shot cutover the Job applies before `up`.
FROM alpine:3.21

RUN apk add --no-cache ca-certificates postgresql17-client && \
    addgroup -g 65532 -S migrate && adduser -u 65532 -G migrate -S migrate

COPY --from=builder /out/migrate /usr/local/bin/migrate
COPY . /migrations

USER 65532:65532
ENTRYPOINT ["migrate", "-path", "/migrations", "-database"]
CMD ["--help"]
