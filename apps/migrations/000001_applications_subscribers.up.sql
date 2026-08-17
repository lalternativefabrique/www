-- The two things the public site collects: people asking to join the collective,
-- and people subscribing to the revue.
--
-- Both are written by anonymous visitors, so both carry the same defence: the
-- address is unique, and a resubmission updates the existing row rather than
-- creating a second one. That makes the public endpoints safe to retry and
-- removes the need to deduplicate at read time.
--
-- No foreign key to the auth tables. An applicant is not a user — they have no
-- account, that is the whole point — and a subscriber may never create one.

CREATE TABLE IF NOT EXISTS applications (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email        TEXT NOT NULL,
    name         TEXT NOT NULL,
    -- Free text: what the person wants to do with the collective. The form is
    -- deliberately open, so nothing here is parsed into columns.
    message      TEXT NOT NULL DEFAULT '',
    -- Where they can be read: a site, a repository, a profile. One per line.
    links        TEXT NOT NULL DEFAULT '',
    -- 'pending' until read, then 'accepted' or 'declined'. Kept as text rather
    -- than an enum so a new outcome does not need a migration.
    status       TEXT NOT NULL DEFAULT 'pending',
    -- Why it was accepted or declined, for whoever reads the row next.
    note         TEXT NOT NULL DEFAULT '',
    -- 'fr' or 'en': which side of the site they came from, so the reply is
    -- written in the language they used.
    locale       TEXT NOT NULL DEFAULT 'fr',
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    reviewed_at  TIMESTAMPTZ,
    UNIQUE (email)
);

-- The triage screen reads pending-first, newest-first.
CREATE INDEX IF NOT EXISTS applications_status_created_idx
    ON applications (status, created_at DESC);

CREATE TABLE IF NOT EXISTS subscribers (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email          TEXT NOT NULL,
    locale         TEXT NOT NULL DEFAULT 'fr',
    -- Which page the sign-up came from, to tell what actually converts.
    source         TEXT NOT NULL DEFAULT '',
    confirmed_at   TIMESTAMPTZ,
    -- Set instead of deleting the row: an address that unsubscribed must stay
    -- known, or the next import silently mails it again.
    unsubscribed_at TIMESTAMPTZ,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (email)
);

-- Sending reads the live list: subscribed, never unsubscribed.
CREATE INDEX IF NOT EXISTS subscribers_active_idx
    ON subscribers (created_at DESC)
    WHERE unsubscribed_at IS NULL;
