import { createServerFn } from '@tanstack/react-start'

/**
 * Everything an article page needs, in one server round trip: the metadata that
 * drives the head tags, and the body already rendered to HTML.
 *
 * The body cannot travel as a component. A compiled article is a React
 * component and a loader's return value is serialized for hydration, which a
 * function does not survive — the build reports a seroval error and drops the
 * value. Rendering it here costs nothing at read time, since the store hands
 * back an already-compiled article, and the body is prose: no state, no
 * handler, nothing hydration would have added.
 *
 * Imports sit inside the handler so the bucket client, the MDX compiler and
 * react-dom/server stay out of the client bundle — the plugin strips the
 * handler body, not the module's top level.
 *
 * See docs/adr/0001-articles-from-bucket-ssr-blog-admin.md.
 */

export type ArticlePage = {
  slug: string
  titre: string
  chapeau: string
  metaDescription?: string
  organe: string
  outil: string
  outilUrl: string
  date: string
  dateRevision?: string
  lecture: string
  illustration?: { src: string; alt: string }
  /** The other language's slug, for the hreflang pair. Absent when untranslated. */
  autreSlug?: string
  /** The body, server-rendered. */
  html: string
}

export const loadArticle = createServerFn({ method: 'GET' })
  .inputValidator((d: { slug: string; lang: 'fr' | 'en' }) => d)
  .handler(async ({ data }): Promise<ArticlePage | undefined> => {
    const { createElement } = await import('react')
    const { renderToStaticMarkup } = await import('react-dom/server')
    const { MdxProse } = await import('@/components/MdxProse')
    const { findBySlug, findEnBySlug } = await import('./articles-store')

    // The English page is found through its own slug, but every fact below is
    // read off the French article: the two versions are one piece, and only the
    // prose is translated.
    const fr =
      data.lang === 'en'
        ? await findEnBySlug(data.slug)
        : await findBySlug(data.slug)
    if (!fr) return undefined

    const traduit = data.lang === 'en' ? fr.en : undefined
    if (data.lang === 'en' && !traduit) return undefined

    const corps = traduit?.corps ?? fr.corps
    const html = renderToStaticMarkup(
      createElement(MdxProse, { corps, lang: data.lang }),
    )

    return {
      slug: data.lang === 'en' ? traduit!.slug : fr.slug,
      titre: traduit?.titre ?? fr.titre,
      chapeau: traduit?.chapeau ?? fr.chapeau,
      metaDescription: traduit?.metaDescription ?? fr.metaDescription,
      organe: traduit?.organe ?? fr.organe,
      outil: fr.outil,
      outilUrl: fr.outilUrl,
      date: fr.date,
      dateRevision: fr.dateRevision,
      lecture: fr.lecture,
      illustration: fr.illustration
        ? {
            src: fr.illustration.src,
            alt:
              data.lang === 'en'
                ? (fr.illustration.altEn ?? fr.illustration.alt)
                : fr.illustration.alt,
          }
        : undefined,
      autreSlug: data.lang === 'en' ? fr.slug : fr.en?.slug,
      html,
    }
  })
