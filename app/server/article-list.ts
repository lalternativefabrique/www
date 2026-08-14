import { createServerFn } from '@tanstack/react-start'

/**
 * The article list for the two index pages and the SEO files.
 *
 * Metadata only: no body, so the payload is serializable and the index pages
 * cost one small round trip rather than compiling every article to render a
 * list of titles.
 */

export type ArticleCard = {
  slug: string
  titre: string
  chapeau: string
  organe: string
  date: string
  dateRevision?: string
  lecture: string
  /** The other language's slug. Absent when the piece is untranslated. */
  autreSlug?: string
}

export const listArticles = createServerFn({ method: 'GET' })
  .inputValidator((d: { lang: 'fr' | 'en' }) => d)
  .handler(async ({ data }): Promise<ArticleCard[]> => {
    const { loadArticles } = await import('./articles-store')
    const articles = await loadArticles()

    if (data.lang === 'en') {
      // Only translated pieces exist under /en, so an untranslated one is never
      // listed into a page that would then 404.
      return articles.flatMap((a) =>
        a.en
          ? [
              {
                slug: a.en.slug,
                titre: a.en.titre,
                chapeau: a.en.chapeau,
                organe: a.en.organe,
                date: a.date,
                dateRevision: a.dateRevision,
                lecture: a.lecture,
                autreSlug: a.slug,
              },
            ]
          : [],
      )
    }

    return articles.map((a) => ({
      slug: a.slug,
      titre: a.titre,
      chapeau: a.chapeau,
      organe: a.organe,
      date: a.date,
      dateRevision: a.dateRevision,
      lecture: a.lecture,
      autreSlug: a.en?.slug,
    }))
  })
