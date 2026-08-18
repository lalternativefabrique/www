import { createServerFn } from '@tanstack/react-start'

/**
 * What the admin screens read and write.
 *
 * Every function guards on requireAdmin: the router guard decides what to
 * render, not what may run. A server function is reachable by anyone who knows
 * its URL.
 */

export type Application = {
  id: string
  email: string
  name: string
  message: string
  links: string
  status: string
  note: string
  locale: string
  createdAt: string
  reviewedAt?: string
}

export type Subscriber = {
  id: string
  email: string
  locale: string
  source: string
  createdAt: string
  unsubscribedAt?: string
}

export type ArticleRow = {
  dir: string
  slug: string
  titre: string
  organe: string
  date?: string
  publishedAt?: string
  hasEn: boolean
}

const FORBIDDEN = 'forbidden'

/**
 * The dashboard's four figures, counted where they live.
 *
 * The screen used to call the three list functions and count their length,
 * which meant shipping every application, every subscriber and every article
 * across the wire to render four numbers.
 */
export const adminCounts = createServerFn({ method: 'GET' }).handler(
  async (): Promise<{
    pending: number
    applications: number
    subscribers: number
    articles: number
  }> => {
    const { requireAdmin } = await import('./admin-guard')
    if (!(await requireAdmin())) throw new Error(FORBIDDEN)

    const { loadArticles } = await import('./articles-store')
    const { query, dbConfigured } = await import('./db')

    // The article count comes from the bucket, not the table: the bucket is
    // what the site serves, and a piece published before the table existed has
    // no row.
    const articles = (await loadArticles()).length

    if (!dbConfigured) {
      return { pending: 0, applications: 0, subscribers: 0, articles }
    }

    const rows = await query<{
      pending: string
      applications: string
      subscribers: string
    }>(
      `SELECT
         (SELECT count(*) FROM applications WHERE status = 'pending')::text AS pending,
         (SELECT count(*) FROM applications)::text AS applications,
         (SELECT count(*) FROM subscribers WHERE unsubscribed_at IS NULL)::text AS subscribers`,
    )

    return {
      pending: Number(rows[0]?.pending ?? 0),
      applications: Number(rows[0]?.applications ?? 0),
      subscribers: Number(rows[0]?.subscribers ?? 0),
      articles,
    }
  },
)

export const listApplications = createServerFn({ method: 'GET' }).handler(
  async (): Promise<Application[]> => {
    const { requireAdmin } = await import('./admin-guard')
    if (!(await requireAdmin())) throw new Error(FORBIDDEN)

    const { query, dbConfigured } = await import('./db')
    if (!dbConfigured) return []

    // Pending first, then newest: the screen exists to work through a queue.
    return query<Application>(
      `SELECT id, email, name, message, links, status, note, locale,
              created_at AS "createdAt", reviewed_at AS "reviewedAt"
       FROM applications
       ORDER BY (status = 'pending') DESC, created_at DESC
       LIMIT 500`,
    )
  },
)

export const reviewApplication = createServerFn({ method: 'POST' })
  .inputValidator((d: { id: string; status: string; note?: string }) => d)
  .handler(async ({ data }): Promise<{ ok: boolean }> => {
    const { requireAdmin } = await import('./admin-guard')
    if (!(await requireAdmin())) throw new Error(FORBIDDEN)

    if (!['pending', 'accepted', 'declined'].includes(data.status)) {
      throw new Error('unknown status')
    }

    const { query } = await import('./db')
    await query(
      `UPDATE applications
       SET status = $2,
           note = COALESCE($3, note),
           reviewed_at = CASE WHEN $2 = 'pending' THEN NULL ELSE NOW() END
       WHERE id = $1`,
      [data.id, data.status, data.note ?? null],
    )

    return { ok: true }
  })

export const listSubscribers = createServerFn({ method: 'GET' }).handler(
  async (): Promise<Subscriber[]> => {
    const { requireAdmin } = await import('./admin-guard')
    if (!(await requireAdmin())) throw new Error(FORBIDDEN)

    const { query, dbConfigured } = await import('./db')
    if (!dbConfigured) return []

    return query<Subscriber>(
      `SELECT id, email, locale, source,
              created_at AS "createdAt", unsubscribed_at AS "unsubscribedAt"
       FROM subscribers
       ORDER BY created_at DESC
       LIMIT 1000`,
    )
  },
)

/**
 * The article index, read from the bucket rather than the table: the bucket is
 * what the site serves, so it is what the admin must show. The table only adds
 * what a bucket cannot answer — whether a piece was ever published, and when.
 */
export const listArticleRows = createServerFn({ method: 'GET' }).handler(
  async (): Promise<ArticleRow[]> => {
    const { requireAdmin } = await import('./admin-guard')
    if (!(await requireAdmin())) throw new Error(FORBIDDEN)

    const { loadArticles } = await import('./articles-store')
    const { query, dbConfigured } = await import('./db')

    const live = await loadArticles()
    const rows = dbConfigured
      ? await query<{ dir: string; slug: string; publishedAt?: string }>(
          `SELECT dir, slug, published_at AS "publishedAt" FROM articles`,
        )
      : []

    const dirBySlug = new Map(rows.map((r) => [r.slug, r.dir]))
    const publishedBySlug = new Map(rows.map((r) => [r.slug, r.publishedAt]))

    return live.map((a) => ({
      // A piece published before the table existed has no row; its slug is then
      // the best directory guess, and republishing writes the row.
      dir: dirBySlug.get(a.slug) ?? a.slug,
      slug: a.slug,
      titre: a.titre,
      organe: a.organe,
      date: a.date,
      publishedAt: publishedBySlug.get(a.slug),
      hasEn: Boolean(a.en),
    }))
  },
)

/** The sources behind an article, so a published piece can be edited again. */
export const readArticleSources = createServerFn({ method: 'GET' })
  .inputValidator((d: { dir: string }) => d)
  .handler(async ({ data }): Promise<{ fr: string; en: string }> => {
    const { requireAdmin } = await import('./admin-guard')
    if (!(await requireAdmin())) throw new Error(FORBIDDEN)

    const { getObject } = await import('./bucket')
    const [fr, en] = await Promise.all([
      getObject(`articles/${data.dir}/index.fr.mdx`),
      getObject(`articles/${data.dir}/index.en.mdx`),
    ])

    return { fr: fr ?? '', en: en ?? '' }
  })
