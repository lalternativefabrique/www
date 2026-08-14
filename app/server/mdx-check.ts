import { compile, run } from '@mdx-js/mdx'
import * as runtime from 'react/jsx-runtime'
import remarkGfm from 'remark-gfm'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'

/**
 * Compiles a source the way the site will, to find out whether it works.
 *
 * The bucket accepts anything. Without this check a malformed article is
 * written, and the failure surfaces on the reader's page rather than in the
 * editor's screen — where it can still be fixed.
 *
 * Same remark chain as articles-store, so a source that passes here renders
 * there.
 */

export type CheckResult =
  | { ok: true; meta: Record<string, unknown> }
  | { ok: false; error: string }

export async function compileForCheck(source: string): Promise<CheckResult> {
  try {
    const code = await compile(source, {
      outputFormat: 'function-body',
      development: false,
      remarkPlugins: [
        remarkGfm,
        remarkFrontmatter,
        [remarkMdxFrontmatter, { name: 'meta' }],
      ],
    })

    const mod = await run(code, { ...runtime, baseUrl: import.meta.url })

    return { ok: true, meta: (mod.meta ?? {}) as Record<string, unknown> }
  } catch (err) {
    // The message carries the line and column of the offending syntax, which is
    // the only part worth showing to whoever pasted the markdown.
    return { ok: false, error: err instanceof Error ? err.message : String(err) }
  }
}
