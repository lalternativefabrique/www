import { createServerFn } from '@tanstack/react-start'

/**
 * Renders a source the way the site will, before it is written anywhere.
 *
 * Same compile and same component map as the live route, so what the editor
 * sees is what a reader gets — an approximation would hide exactly the
 * mistakes this screen exists to catch.
 */
export const previewMarkdown = createServerFn({ method: 'POST' })
  .inputValidator((d: { source: string; lang: 'fr' | 'en' }) => d)
  .handler(
    async ({
      data,
    }): Promise<{ ok: true; html: string } | { ok: false; error: string }> => {
      const { requireAdmin } = await import('./admin-guard')
      if (!(await requireAdmin())) return { ok: false, error: 'forbidden' }

      const { compile, run } = await import('@mdx-js/mdx')
      const runtime = await import('react/jsx-runtime')
      const { default: remarkGfm } = await import('remark-gfm')
      const { default: remarkFrontmatter } = await import('remark-frontmatter')
      const { default: remarkMdxFrontmatter } = await import(
        'remark-mdx-frontmatter'
      )
      const { createElement } = await import('react')
      const { renderToStaticMarkup } = await import('react-dom/server')
      const { MdxProse } = await import('@/components/MdxProse')

      try {
        const code = await compile(data.source, {
          outputFormat: 'function-body',
          development: false,
          remarkPlugins: [
            remarkGfm,
            remarkFrontmatter,
            [remarkMdxFrontmatter, { name: 'meta' }],
          ],
        })

        const mod = await run(code, { ...runtime, baseUrl: import.meta.url })

        const html = renderToStaticMarkup(
          createElement(MdxProse, {
            corps: mod.default as never,
            lang: data.lang,
          }),
        )

        return { ok: true, html }
      } catch (err) {
        return {
          ok: false,
          error: err instanceof Error ? err.message : String(err),
        }
      }
    },
  )
