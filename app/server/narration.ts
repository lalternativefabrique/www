/**
 * The text of an article, as it is meant to be heard.
 *
 * Read aloud, an article is not the page: a figure, a table and a code listing
 * are things to look at, and a voice reading their contents produces a stretch
 * of noise a listener cannot act on. They are dropped here rather than in the
 * component map, because the page keeps showing them.
 *
 * The source is the rendered HTML, not the MDX. The body is JSX by the time it
 * reaches the bucket — <Figure>, <Tableau> — and stripping tags is a smaller
 * and more honest job than parsing components: whatever the article renders as
 * is what gets read.
 */

/** What a listener hears, and the key the audio is stored under. */
export type Narration = {
  text: string
  /** Runes, not bytes — what a per-character TTS price is counted in. */
  length: number
}

const DROPPED_ELEMENTS = ['figure', 'table', 'pre', 'script', 'style']

/**
 * Elements whose end is a pause. Without them the tag-strip runs sentences
 * together — a heading straight into the paragraph below it — and the voice
 * reads across the join with no break.
 */
const BLOCK_ELEMENTS = [
  'p',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'li',
  'blockquote',
  'div',
  'section',
  'article',
  'header',
  'footer',
  'hr',
  'br',
]

export function narrationOf(article: {
  titre: string
  chapeau: string
  html: string
}): Narration {
  const text = joinParts([
    article.titre,
    article.chapeau,
    proseOf(article.html),
  ])

  return { text, length: [...text].length }
}

/**
 * The body, with everything visual removed and everything spoken kept.
 */
export function proseOf(html: string): string {
  let out = html

  for (const tag of DROPPED_ELEMENTS) {
    out = out.replace(
      new RegExp(`<${tag}\\b[^>]*>[\\s\\S]*?</${tag}>`, 'gi'),
      '\n\n',
    )
  }

  // Decorative marks carry meaning by being seen — the em dash MdxProse puts
  // before each list item is hidden from screen readers for the same reason a
  // voice must not read it as a word.
  out = out.replace(
    /<([a-z]+)\b[^>]*\baria-hidden=["']?true["']?[^>]*>[\s\S]*?<\/\1>/gi,
    ' ',
  )

  for (const tag of BLOCK_ELEMENTS) {
    out = out.replace(new RegExp(`</?${tag}\\b[^>]*>`, 'gi'), '\n\n')
  }

  out = out.replace(/<[^>]+>/g, '')

  return normalize(decodeEntities(out))
}

/**
 * A blank line between parts, which is where Split prefers to cut. Cutting
 * between paragraphs is inaudible; cutting mid-sentence is not.
 */
function joinParts(parts: string[]): string {
  return parts.map((p) => p.trim()).filter(Boolean).join('\n\n')
}

function decodeEntities(s: string): string {
  const named: Record<string, string> = {
    amp: '&',
    lt: '<',
    gt: '>',
    quot: '"',
    apos: "'",
    nbsp: ' ',
    hellip: '…',
    mdash: '—',
    ndash: '–',
    laquo: '«',
    raquo: '»',
    eacute: 'é',
    egrave: 'è',
    ecirc: 'ê',
    agrave: 'à',
    ccedil: 'ç',
    ugrave: 'ù',
    ocirc: 'ô',
    icirc: 'î',
    iuml: 'ï',
    euro: 'euros',
    // The typographic apostrophe, which MDX produces from a plain one.
    rsquo: '’',
    lsquo: '‘',
    ldquo: '“',
    rdquo: '”',
  }

  return s
    .replace(/&#(\d+);/g, (_, code: string) =>
      String.fromCodePoint(Number(code)),
    )
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) =>
      String.fromCodePoint(Number.parseInt(code, 16)),
    )
    .replace(/&([a-z]+);/gi, (whole, name: string) => named[name] ?? whole)
}

/**
 * Collapses the whitespace the tag-strip leaves behind, keeping paragraph
 * breaks: they are the only whitespace a voice reads.
 */
function normalize(s: string): string {
  return s
    .replace(/\r\n?/g, '\n')
    .replace(/[^\S\n]+/g, ' ')
    .replace(/ *\n */g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}
