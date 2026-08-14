import { createServerFn } from '@tanstack/react-start'

/**
 * Publishing an article: write the sources to the bucket, drop the cache, and
 * record the piece in the admin index.
 *
 * The bucket is what the public site reads, so the write is what makes an
 * article live — the database row exists for the admin's own listing and is
 * never on the reader's path. See
 * docs/adr/0001-articles-from-bucket-ssr-blog-admin.md.
 */

export type PublishInput = {
  /** Bucket directory. Stable across a title change, unlike the slug. */
  dir: string
  /** The complete .mdx source, frontmatter included. */
  fr: string
  /** The English source, when the piece is translated. */
  en?: string
}

export type PublishResult =
  | { ok: true; slug: string; hasEn: boolean }
  | { ok: false; reason: string }

const DIR = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export const publishArticle = createServerFn({ method: 'POST' })
  .inputValidator((d: PublishInput) => d)
  .handler(async ({ data }): Promise<PublishResult> => {
    const { requireAdmin } = await import('./admin-guard')
    const admin = await requireAdmin()
    if (!admin) return { ok: false, reason: 'forbidden' }

    // The directory becomes a bucket key: anything outside this shape could
    // climb out of the articles/ prefix.
    if (!DIR.test(data.dir)) return { ok: false, reason: 'invalid-dir' }

    const { compileForCheck } = await import('./mdx-check')

    // Compile before writing. An article that does not compile would be written
    // to the bucket and then break the route that renders it — for readers, not
    // for whoever published it.
    const fr = await compileForCheck(data.fr)
    if (!fr.ok) return { ok: false, reason: `fr: ${fr.error}` }
    if (!fr.meta.slug) return { ok: false, reason: 'fr: missing slug' }
    if (!fr.meta.date) return { ok: false, reason: 'fr: missing date' }

    let enMeta: Record<string, unknown> | undefined
    if (data.en?.trim()) {
      const en = await compileForCheck(data.en)
      if (!en.ok) return { ok: false, reason: `en: ${en.error}` }
      if (!en.meta.slug) return { ok: false, reason: 'en: missing slug' }
      enMeta = en.meta
    }

    const { putObject, deleteObject } = await import('./bucket')
    const prefix = `articles/${data.dir}`

    await putObject(`${prefix}/index.fr.mdx`, data.fr)
    if (data.en?.trim()) {
      await putObject(`${prefix}/index.en.mdx`, data.en)
    } else {
      // A translation that was removed must leave the bucket, or the site keeps
      // serving the English page from the file that is still there.
      await deleteObject(`${prefix}/index.en.mdx`).catch(() => {})
    }

    const { invalidate } = await import('./articles-store')
    invalidate()

    const { query, dbConfigured } = await import('./db')
    if (dbConfigured) {
      await query(
        `INSERT INTO articles (dir, slug, titre, organe, date, published_at, has_en, published_by)
         VALUES ($1, $2, $3, $4, $5, NOW(), $6, $7)
         ON CONFLICT (dir) DO UPDATE
         SET slug = EXCLUDED.slug,
             titre = EXCLUDED.titre,
             organe = EXCLUDED.organe,
             date = EXCLUDED.date,
             published_at = NOW(),
             has_en = EXCLUDED.has_en,
             published_by = EXCLUDED.published_by,
             updated_at = NOW()`,
        [
          data.dir,
          String(fr.meta.slug),
          String(fr.meta.titre ?? ''),
          String(fr.meta.organe ?? ''),
          String(fr.meta.date),
          Boolean(enMeta),
          admin.id,
        ],
      )
    }

    return { ok: true, slug: String(fr.meta.slug), hasEn: Boolean(enMeta) }
  })

export const unpublishArticle = createServerFn({ method: 'POST' })
  .inputValidator((d: { dir: string }) => d)
  .handler(async ({ data }): Promise<{ ok: boolean; reason?: string }> => {
    const { requireAdmin } = await import('./admin-guard')
    if (!(await requireAdmin())) return { ok: false, reason: 'forbidden' }
    if (!DIR.test(data.dir)) return { ok: false, reason: 'invalid-dir' }

    const { deleteObject } = await import('./bucket')
    const prefix = `articles/${data.dir}`
    await deleteObject(`${prefix}/index.fr.mdx`).catch(() => {})
    await deleteObject(`${prefix}/index.en.mdx`).catch(() => {})

    const { invalidate } = await import('./articles-store')
    invalidate()

    const { query, dbConfigured } = await import('./db')
    if (dbConfigured) {
      await query(
        'UPDATE articles SET published_at = NULL, updated_at = NOW() WHERE dir = $1',
        [data.dir],
      )
    }

    return { ok: true }
  })
