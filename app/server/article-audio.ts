/**
 * Where an article's spoken version lives, and whether it exists.
 *
 * The bucket answers both, as it does for the prose: an article has audio when
 * the object is there. Nothing is recorded in the database, so a reader never
 * waits on it, and a piece restored into the bucket comes back with its
 * narration without a row to repair.
 *
 * The key carries a hash of the narrated text. A corrected article is read
 * again under a new key, so a stale recording is never served — and republishing
 * an unchanged text finds its audio already there and costs nothing.
 */

import { createHash } from 'node:crypto'

const PREFIX = 'audio/articles/'

export type AudioLang = 'fr' | 'en'

/** The bucket key for a narration of `text`, and the URL that serves it. */
export function audioKey(dir: string, lang: AudioLang, text: string): string {
  return `${PREFIX}${dir}/${lang}-${fingerprint(text)}.mp3`
}

/**
 * The public path for a key. The route serving it takes the file name only —
 * the directory is in the key, not the URL, so one flat segment addresses it.
 */
export function audioUrl(key: string): string {
  return `/${key}`
}

export function fingerprint(text: string): string {
  return createHash('sha256').update(text, 'utf8').digest('hex').slice(0, 16)
}

/**
 * The narration already in the bucket for this article, if any.
 *
 * Listing rather than probing a computed key: the caller asking "does this
 * article have audio" holds the article, not the text that was read when it was
 * published, and rendering the page again to recompute the hash would cost more
 * than a prefix listing.
 */
export async function findAudio(
  dir: string,
  lang: AudioLang,
): Promise<string | undefined> {
  const { bucketConfigured, listKeys } = await import('./bucket')
  if (!bucketConfigured) return undefined

  const keys = await listKeys(`${PREFIX}${dir}/${lang}-`)
  // More than one means an earlier recording outlived its text. The newest key
  // is not knowable from a listing without dates, so the last one wins by sort
  // order — deterministic, and the stale ones are removed on publish.
  return keys.sort().at(-1)
}
