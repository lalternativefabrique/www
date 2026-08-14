import { createFileRoute } from '@tanstack/react-router'
import { listArticles } from '@/server/article-list'
import { buildSitemap } from '@/server/seo-files'

/**
 * Served from the live article list rather than written at build time: an
 * article is published by a write to the bucket, so a file baked into the image
 * would omit everything published since the last deployment.
 */
export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: async () => {
        const [fr, en] = await Promise.all([
          listArticles({ data: { lang: 'fr' } }),
          listArticles({ data: { lang: 'en' } }),
        ])

        return new Response(buildSitemap(fr, en), {
          headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, max-age=300',
          },
        })
      },
    },
  },
})
