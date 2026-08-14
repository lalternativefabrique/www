import { createServerFn } from '@tanstack/react-start'

/**
 * Turning pasted markdown into a publishable .mdx source.
 *
 * Two things markdown cannot express on its own and the site needs: an image's
 * intrinsic size, and a frontmatter block whose quoting survives an apostrophe.
 * Both are produced here rather than asked of whoever writes the piece.
 */

export type Frontmatter = {
  slug: string
  titre: string
  chapeau: string
  metaDescription?: string
  organe: string
  outil: string
  outilUrl: string
  date: string
  lecture: string
}

/** Reads an existing frontmatter block, so a pasted .mdx pre-fills the form. */
export function splitFrontmatter(source: string): {
  meta: Record<string, string>
  body: string
} {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/)
  if (!match) return { meta: {}, body: source }

  const meta: Record<string, string> = {}
  for (const line of match[1].split(/\r?\n/)) {
    if (!line.trim() || line.startsWith(' ') || line.startsWith('#')) continue
    const at = line.indexOf(':')
    if (at === -1) continue
    const key = line.slice(0, at).trim()
    let value = line.slice(at + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1).replace(/\\"/g, '"')
    }
    if (value) meta[key] = value
  }

  return { meta, body: source.slice(match[0].length) }
}

/**
 * A YAML scalar that survives the apostrophes and colons this corpus is full
 * of. Always double-quoted: deciding when quoting is unnecessary is how a
 * frontmatter breaks on the one title that needed it.
 */
function yaml(value: string): string {
  return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`
}

export function buildFrontmatter(
  meta: Frontmatter,
  illustration?: { src: string; alt: string; altEn?: string },
): string {
  const lines = [
    '---',
    `slug: ${meta.slug}`,
    `titre: ${yaml(meta.titre)}`,
    `chapeau: ${yaml(meta.chapeau)}`,
    ...(meta.metaDescription
      ? [`metaDescription: ${yaml(meta.metaDescription)}`]
      : []),
    `organe: ${meta.organe}`,
    `outil: ${meta.outil}`,
    `outilUrl: ${meta.outilUrl}`,
    `date: ${meta.date}`,
    `lecture: ${meta.lecture}`,
    ...(illustration
      ? [
          'illustration:',
          `  src: ${illustration.src}`,
          `  alt: ${yaml(illustration.alt)}`,
          ...(illustration.altEn ? [`  altEn: ${yaml(illustration.altEn)}`] : []),
        ]
      : []),
    '---',
    '',
  ]

  return lines.join('\n')
}

/**
 * Uploads the images a pasted body references and rewrites them as <Figure>.
 *
 * A markdown image carries no dimensions, so the browser cannot reserve its
 * space and the page shifts as each one loads. The size is read from the file
 * here, where it is known, instead of being left to the reader's layout.
 */
export const importImages = createServerFn({ method: 'POST' })
  .inputValidator(
    (d: {
      body: string
      /** Images to host, keyed by the URL used in the markdown. */
      images: { url: string; base64: string; filename: string }[]
    }) => d,
  )
  .handler(async ({ data }): Promise<{ body: string; uploaded: string[] }> => {
    const { requireAdmin } = await import('./admin-guard')
    if (!(await requireAdmin())) throw new Error('forbidden')

    const { putObject } = await import('./bucket')
    const { imageSize } = await import('./image-size')

    const uploaded: string[] = []
    let body = data.body

    for (const image of data.images) {
      const bytes = Buffer.from(image.base64, 'base64')
      const size = imageSize(bytes)
      // A file whose header cannot be read is not an image this site can lay
      // out; leaving the markdown untouched keeps it visible as a problem.
      if (!size) continue

      const safe = image.filename
        .toLowerCase()
        .replace(/[^a-z0-9.-]+/g, '-')
        .replace(/^-+|-+$/g, '')
      const key = `images/articles/${safe}`

      await putObject(key, bytes, mimeOf(safe))
      uploaded.push(`/${key}`)

      // Replace ![alt](url) with the component that carries the size.
      const pattern = new RegExp(
        `!\\[([^\\]]*)\\]\\(${escapeRegex(image.url)}\\)`,
        'g',
      )
      body = body.replace(
        pattern,
        (_, alt: string) =>
          `<Figure src="/${key}" alt="${alt.replace(/"/g, '&quot;')}" width={${size.width}} height={${size.height}} />`,
      )
    }

    return { body, uploaded }
  })

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function mimeOf(filename: string): string {
  if (filename.endsWith('.png')) return 'image/png'
  if (filename.endsWith('.webp')) return 'image/webp'
  if (filename.endsWith('.avif')) return 'image/avif'
  if (filename.endsWith('.svg')) return 'image/svg+xml'
  return 'image/jpeg'
}
