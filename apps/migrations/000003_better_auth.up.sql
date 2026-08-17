-- Better Auth's own tables, which it reads and writes but never creates.
--
-- The admin has never worked against a fresh database: signing in, and creating
-- the first administrator, both start with a query on "user", and the setup
-- screen answered `relation "user" does not exist`. The tables were missing
-- from the schema rather than from the code — nothing in @lalternative/auth,
-- in better-auth, or in the old in-app migrations ever created them.
--
-- Canonical schema for better-auth ^1.6 with the admin plugin, which is what
-- createPlatformAuth enables: role/banned/banReason/banExpires on "user" are
-- that plugin's columns. The jwt plugin is not enabled here, so there is no
-- jwks table — the site verifies nothing for a separate service, unlike the
-- repos where a Go core reads the JWKS.
--
-- Quoted, camelCase identifiers: better-auth builds its queries with these
-- exact names, and an unquoted createdAt would be folded to lowercase and not
-- found.

CREATE TABLE IF NOT EXISTS "user" (
    id              TEXT PRIMARY KEY,
    name            TEXT NOT NULL,
    email           TEXT NOT NULL UNIQUE,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    image           TEXT,
    role            TEXT NOT NULL DEFAULT 'user',
    banned          BOOLEAN DEFAULT false,
    "banReason"     TEXT,
    "banExpires"    TIMESTAMPTZ,
    "createdAt"     TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt"     TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "session" (
    id           TEXT PRIMARY KEY,
    "expiresAt"  TIMESTAMP NOT NULL,
    token        TEXT NOT NULL UNIQUE,
    "createdAt"  TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt"  TIMESTAMP NOT NULL DEFAULT NOW(),
    "ipAddress"  TEXT,
    "userAgent"  TEXT,
    "userId"     TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS session_userid_idx ON "session" ("userId");

-- Holds the password hash for email sign-in, alongside the OAuth columns
-- better-auth uses for providers this site does not have.
CREATE TABLE IF NOT EXISTS "account" (
    id                      TEXT PRIMARY KEY,
    "accountId"             TEXT NOT NULL,
    "providerId"            TEXT NOT NULL,
    "userId"                TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    "accessToken"           TEXT,
    "refreshToken"          TEXT,
    "idToken"               TEXT,
    "accessTokenExpiresAt"  TIMESTAMP,
    "refreshTokenExpiresAt" TIMESTAMP,
    scope                   TEXT,
    password                TEXT,
    "createdAt"             TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt"             TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS account_userid_idx ON "account" ("userId");

-- Email verification codes and password resets. createPlatformAuth requires a
-- verified address, so this is on the path of every sign-in.
CREATE TABLE IF NOT EXISTS "verification" (
    id           TEXT PRIMARY KEY,
    identifier   TEXT NOT NULL,
    value        TEXT NOT NULL,
    "expiresAt"  TIMESTAMP NOT NULL,
    "createdAt"  TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt"  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS verification_identifier_idx ON "verification" (identifier);
