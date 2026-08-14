import { createFileRoute } from '@tanstack/react-router'
import { listArticles } from '@/server/article-list'
import { buildLlmsTxt } from '@/server/seo-files'

/**
 * The corpus map answer engines read. Served live for the same reason as the
 * sitemap: a file frozen at build time would not list anything published since.
 */
export const Route = createFileRoute('/llms.txt')({
  server: {
    handlers: {
      GET: async () => {
        const [fr, en] = await Promise.all([
          listArticles({ data: { lang: 'fr' } }),
          listArticles({ data: { lang: 'en' } }),
        ])

        return new Response(buildLlmsTxt(fr, en), {
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'public, max-age=300',
          },
        })
      },
    },
  },
})
