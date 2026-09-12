-- ONE-SHOT cutover: hand the migration history from the in-app TypeScript
-- runner to golang-migrate. Applied once per environment, before the first
-- golang-migrate `up`. It is NOT a numbered migration and golang-migrate never
-- runs it — the leading underscore and the missing up/down suffix keep it out
-- of the migration set.
--
-- Why this is needed:
--   * Old runner table:      schema_migrations(name TEXT PK, applied_at)
--     -> one row per file, e.g. '001_applications_subscribers.up.sql'
--   * golang-migrate table:  schema_migrations(version BIGINT PK, dirty BOOL)
--     -> a single row holding the current version number, e.g. 2
--   Same table name, incompatible shape. Without this cutover golang-migrate
--   either chokes on the old table or believes nothing is applied and tries to
--   re-run 000001 against a database that already has those tables.
--
-- Safety: this rewrites the *tracking* table only. It does not touch
-- applications, subscribers or articles, and it is guarded so that running it
-- against a database already on golang-migrate is a no-op.
--
-- The Job applies it before `up` (see infra/k8s/overlays/production-migrations/
-- job.yaml). Once every environment has been through it, it can be deleted.

BEGIN;

DO $$
DECLARE
    -- The old runner's shape: a text primary key naming the file.
    legacy BOOLEAN := EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'schema_migrations'
          AND column_name = 'name'
    );
    -- How far the old runner had got. Read rather than assumed: an environment
    -- that never ran 000002 must not be told it did.
    reached BIGINT;
BEGIN
    IF NOT legacy THEN
        RAISE NOTICE 'cutover: nothing to do (no legacy schema_migrations)';
        RETURN;
    END IF;

    SELECT COALESCE(MAX(SUBSTRING(name FROM '^[0-9]+')::BIGINT), 0)
      INTO reached
      FROM schema_migrations;

    RAISE NOTICE 'cutover: legacy table found, highest applied version is %', reached;

    DROP TABLE schema_migrations;

    CREATE TABLE schema_migrations (
        version BIGINT  NOT NULL PRIMARY KEY,
        dirty   BOOLEAN NOT NULL
    );

    -- A database that had applied nothing gets no row at all, which is what
    -- golang-migrate reads as "no migration applied yet".
    IF reached > 0 THEN
        INSERT INTO schema_migrations (version, dirty) VALUES (reached, false);
    END IF;
END
$$;

COMMIT;
