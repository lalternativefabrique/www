-- Dropping these signs everyone out and deletes every administrator account.
-- Order matters: session and account carry the foreign keys to "user".

DROP TABLE IF EXISTS "verification";
DROP TABLE IF EXISTS "account";
DROP TABLE IF EXISTS "session";
DROP TABLE IF EXISTS "user";
