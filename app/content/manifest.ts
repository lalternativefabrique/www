import { readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'

/**
 * The article list, read straight off the filesystem.
 *
 * vite.config.ts needs it to build the prerender and sitemap lists, and runs
 * under plain Node — where `import.meta.glob` does not exist and an .mdx import
 * has no loader. So the frontmatter is parsed here rather than imported from
 * ./articles, which is the same data reached through the bundler.
 *
 * Only the fields those two lists consume are read. Anything richer belongs in
 * ./articles, whose types the MDX files are checked against.
 */
export type ArticleMeta = {
  slug: string
  titre: string
  chapeau: string
  organe: string
  date: string
  dateRevision?: string
  en?: { slug: string; titre: string; chapeau: string; organe: string }
}

/**
 * A deliberately small YAML reader: flat `key: value` pairs, quoted or bare.
 * Nested blocks (illustration) are skipped — no consumer here needs them, and a
 * real YAML dependency would have to be loadable from the Vite config too.
 */
function frontmatter(source: string): Record<string, string> {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) return {}

  const out: Record<string, string> = {}
  for (const line of match[1].split(/\r?\n/)) {
    // Indented lines belong to a nested block; blank and comment lines carry nothing.
    if (!line.trim() || line.startsWith(' ') || line.startsWith('#')) continue
    const at = line.indexOf(':')
    if (at === -1) continue
    const key = line.slice(0, at).trim()
    let value = line.slice(at + 1).trim()
    if (!value) continue
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    out[key] = value
  }
  return out
}

const ARTICLES_DIR = resolve(process.cwd(), 'app/content/articles')

/** Newest first, matching the order ./articles derives for /blog. */
export function readArticles(): ArticleMeta[] {
  return readdirSync(ARTICLES_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .flatMap((entry) => {
      const dir = resolve(ARTICLES_DIR, entry.name)
      let fr: Record<string, string>
      try {
        fr = frontmatter(readFileSync(resolve(dir, 'index.fr.mdx'), 'utf8'))
      } catch {
        // A directory without a French file is not an article.
        return []
      }
      if (!fr.slug || !fr.date) return []

      let en: ArticleMeta['en']
      try {
        const raw = frontmatter(
          readFileSync(resolve(dir, 'index.en.mdx'), 'utf8'),
        )
        if (raw.slug) {
          en = {
            slug: raw.slug,
            titre: raw.titre ?? '',
            chapeau: raw.chapeau ?? '',
            organe: raw.organe ?? '',
          }
        }
      } catch {
        // Untranslated: the article simply has no English counterpart.
      }

      return [
        {
          slug: fr.slug,
          titre: fr.titre ?? '',
          chapeau: fr.chapeau ?? '',
          organe: fr.organe ?? '',
          date: fr.date,
          dateRevision: fr.dateRevision,
          en,
        },
      ]
    })
    .sort((a, b) => b.date.localeCompare(a.date))
}
