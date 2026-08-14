-- The article index. The prose itself lives in object storage — see
-- docs/adr/0001-articles-from-bucket-ssr-blog-admin.md — and this table holds
-- what a bucket cannot answer: which pieces are drafts, when each was
-- published, and who published it.
--
-- The public site never reads this table. It lists the bucket, so a published
-- article renders even if the database is down. This is the admin's index,
-- which is why a row can exist with nothing published behind it (a draft) and
-- why the bucket, not this table, decides what is live.

CREATE TABLE IF NOT EXISTS articles (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- The bucket directory holding index.fr.mdx and index.en.mdx. Stable across
    -- a title change, unlike the slug, so renaming a piece does not orphan it.
    dir           TEXT NOT NULL,
    -- Mirrors the frontmatter, for listing and searching without fetching and
    -- compiling every source. The bucket stays the source of truth: on a
    -- disagreement, the file wins.
    slug          TEXT NOT NULL,
    titre         TEXT NOT NULL DEFAULT '',
    organe        TEXT NOT NULL DEFAULT '',
    -- The article's own date, from the frontmatter. Not created_at: a piece can
    -- be backdated, and that date is what orders /blog.
    date          DATE,
    -- NULL while the piece is a draft. Set when the sources are written to the
    -- bucket, cleared when they are removed from it.
    published_at  TIMESTAMPTZ,
    -- Whether index.en.mdx exists in the bucket. Cheaper than a HEAD per row on
    -- the listing screen.
    has_en        BOOLEAN NOT NULL DEFAULT FALSE,
    -- The admin who last wrote it out. Plain id, no foreign key: the auth tables
    -- are managed by Better Auth and are not this migration's to reference.
    published_by  TEXT NOT NULL DEFAULT '',
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (dir)
);

-- Two articles must never claim the same URL. Enforced only over published rows:
-- drafts are allowed to collide while a replacement is being written.
CREATE UNIQUE INDEX IF NOT EXISTS articles_slug_published_idx
    ON articles (slug)
    WHERE published_at IS NOT NULL;

-- The listing screen: drafts first, then published newest-first.
CREATE INDEX IF NOT EXISTS articles_published_idx
    ON articles (published_at DESC NULLS FIRST, date DESC);
