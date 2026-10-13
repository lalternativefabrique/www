import { createServerFn } from '@tanstack/react-start'

/**
 * The comment room under an article, for the public page.
 *
 * Called from the browser after hydration, never from the route loader: the
 * article renders whether or not the chat service answers, which is the rule
 * docs/adr/0001-articles-from-bucket-ssr-blog-admin.md set for the database.
 * Resolving the slug here keeps the bucket directory out of the client.
 */
export const commentsRoom = createServerFn({ method: 'GET' })
  .inputValidator((d: { slug: string; lang: 'fr' | 'en' }) => d)
  .handler(async ({ data }): Promise<{ room: string } | undefined> => {
    const { chatTenantConfigured, ensureArticleRoom } = await import(
      './chat-service'
    )
    if (!chatTenantConfigured) return undefined

    const { findBySlug, findEnBySlug } = await import('./articles-store')
    const fr =
      data.lang === 'en'
        ? await findEnBySlug(data.slug)
        : await findBySlug(data.slug)
    if (!fr || fr.commentaires === false) return undefined
    if (data.lang === 'en' && !fr.en) return undefined

    try {
      const room = await ensureArticleRoom(
        fr.dir,
        data.lang,
        data.lang === 'en' ? fr.en!.titre : fr.titre,
      )
      return { room: room.id }
    } catch (err) {
      console.error('[comments] room for', fr.dir, data.lang, err)
      return undefined
    }
  })
