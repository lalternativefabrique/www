import pg from 'pg'

/**
 * Postgres, for what the admin needs: applications, subscribers, and the
 * article index.
 *
 * The public site never reads any of it. Articles are listed from the bucket,
 * so a published piece renders whether or not this database is reachable — see
 * docs/adr/0001-articles-from-bucket-ssr-blog-admin.md.
 *
 * The schema is applied out of band, by the golang-migrate Job in
 * infra/k8s/overlays/production-migrations — not here. This module assumes the
 * database it connects to is already migrated.
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

export async function query<T extends pg.QueryResultRow>(
  text: string,
  params?: unknown[],
): Promise<T[]> {
  const res = await db().query<T>(text, params)
  return res.rows
}
