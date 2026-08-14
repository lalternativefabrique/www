import { readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import pg from 'pg'

/**
 * Postgres, for what the admin needs: applications, subscribers, and the
 * article index.
 *
 * The public site never reads any of it. Articles are listed from the bucket,
 * so a published piece renders whether or not this database is reachable — see
 * docs/adr/0001-articles-from-bucket-ssr-blog-admin.md.
 */

const url = process.env.DATABASE_URL

/**
 * Absent connection string is not an error on its own: the build and a local
 * clone run without one. It only becomes fatal when a caller needs a query.
 */
export const dbConfigured = Boolean(url)

let pool: pg.Pool | undefined

export function db(): pg.Pool {
  if (!url) {
    throw new Error('DATABASE_URL is not set.')
  }
  pool ??= new pg.Pool({
    connectionString: url,
    // The server holds this pool for its whole life; an idle connection that is
    // never reclaimed is what exhausts a managed Postgres' connection limit.
    idleTimeoutMillis: 30_000,
    max: 10,
  })
  return pool
}

/**
 * Migrations run on the first query rather than from a deploy step: this ships
 * as a single image, and a step that has to be remembered is a step that gets
 * skipped. Held as a promise so concurrent callers await the same pass.
 */
let migrated: Promise<void> | undefined

export async function query<T extends pg.QueryResultRow>(
  text: string,
  params?: unknown[],
): Promise<T[]> {
  migrated ??= migrate()
  await migrated

  const res = await db().query<T>(text, params)
  return res.rows
}

/**
 * Applies the migrations in ./migrations, in filename order, once each.
 *
 * Runs at startup rather than from a separate command: this app is deployed as
 * a single image, and a migration step that has to be remembered is a migration
 * step that gets skipped. Each file runs inside a transaction with an advisory
 * lock held, so two replicas booting together cannot apply the same file twice.
 */
export async function migrate(): Promise<void> {
  if (!dbConfigured) return

  const dir = resolve(process.cwd(), 'migrations')
  const files = readdirSync(dir)
    .filter((f) => f.endsWith('.up.sql'))
    .sort()

  const client = await db().connect()
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        name       TEXT PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `)

    // An arbitrary but stable key: any other booting replica takes the same one
    // and waits here rather than racing through the same file.
    await client.query('SELECT pg_advisory_lock($1)', [8_140_251])

    try {
      const applied = new Set(
        (
          await client.query<{ name: string }>(
            'SELECT name FROM schema_migrations',
          )
        ).rows.map((r) => r.name),
      )

      for (const file of files) {
        if (applied.has(file)) continue

        const sql = readFileSync(resolve(dir, file), 'utf8')
        await client.query('BEGIN')
        try {
          await client.query(sql)
          await client.query(
            'INSERT INTO schema_migrations (name) VALUES ($1)',
            [file],
          )
          await client.query('COMMIT')
          console.log(`[migrate] applied ${file}`)
        } catch (err) {
          await client.query('ROLLBACK')
          throw err
        }
      }
    } finally {
      await client.query('SELECT pg_advisory_unlock($1)', [8_140_251])
    }
  } finally {
    client.release()
  }
}
