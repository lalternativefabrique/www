/**
 * Editorial articles for the revue.
 *
 * Every factual claim here must be backed by the product code or docs.
 * Prices and costs come from `synthiz/docs/strategy/pricing-abonnement.md`.
 *
 * The prose lives in app/content/articles/<dir>/index.{fr,en}.mdx. This module
 * only assembles them: it is the single place that knows where articles come
 * from, so moving the source elsewhere is a change to the two globs below.
 */

import type { ComponentType } from 'react'

export type MdxCorps = ComponentType<{ components?: Record<string, unknown> }>

export type Illustration = {
  src: string
  alt: string
  altEn?: string
}

/**
 * Frontmatter of the French file. It carries the facts — date, tool, reading
 * time, illustration — that the English version inherits rather than restates.
 */
type MetaFr = {
  slug: string
  titre: string
  chapeau: string
  /**
   * Meta description, when the chapeau runs past the ~160 chars search engines
   * display. Absent means the chapeau is short enough to serve as both.
   */
  metaDescription?: string
  organe: string
  outil: string
  outilUrl: string
  date: string
  /** Only when the text was actually revised. Absent means never touched. */
  dateRevision?: string
  lecture: string
  illustration?: Illustration
}

/**
 * Frontmatter of the English file: what translation actually changes, and
 * nothing else. Dates and tooling are read off the French article, so the two
 * versions cannot state different facts.
 */
type MetaEn = {
  slug: string
  titre: string
  chapeau: string
  metaDescription?: string
  organe: string
}

export type ArticleEn = MetaEn & { corps: MdxCorps }

export type Article = MetaFr & {
  /**
   * The directory holding the sources, in the repo and in the bucket alike.
   * Stable across a title change, unlike the slug, which is why anything filed
   * beside an article — its narration — is filed under this.
   */
  dir: string
  corps: MdxCorps
  /**
   * Optional per article: a piece with no `en` simply does not exist under /en,
   * so the revue can be translated one text at a time without the site ever
   * advertising a page that is not written yet.
   */
  en?: ArticleEn
}

type MdxModule = { default: MdxCorps; meta: Record<string, unknown> }

// Eager: the article list drives the prerendered route list, so it must exist
// at build time, not after an async import resolves.
const FR = import.meta.glob<MdxModule>('./articles/*/index.fr.mdx', {
  eager: true,
})
const EN = import.meta.glob<MdxModule>('./articles/*/index.en.mdx', {
  eager: true,
})

const dirOf = (path: string) => path.split('/')[2]

const enByDir = new Map<string, ArticleEn>(
  Object.entries(EN).map(([path, mod]) => [
    dirOf(path),
    { ...(mod.meta as MetaEn), corps: mod.default },
  ]),
)

/**
 * Newest first. The order is derived from the dates rather than from the
 * filesystem, whose ordering is not guaranteed and would silently reshuffle
 * /blog when a directory is renamed.
 */
export const articles: Article[] = Object.entries(FR)
  .map(([path, mod]) => ({
    ...(mod.meta as MetaFr),
    dir: dirOf(path),
    corps: mod.default,
    en: enByDir.get(dirOf(path)),
  }))
  .sort((a, b) => b.date.localeCompare(a.date))

export function articleBySlug(slug: string) {
  return articles.find((a) => a.slug === slug)
}

/** Only the articles that have been translated. Drives /en/blog and its prerender. */
export const articlesEn = articles.flatMap((a) => (a.en ? [a.en] : []))

export function articleEnBySlug(slug: string) {
  return articles.find((a) => a.en?.slug === slug)?.en
}

/**
 * The French article behind an English slug, for the hreflang pair. The English
 * slug is its own — a translated title yields a different URL — so the link
 * back cannot be derived from the slug.
 */
export function articleFrByEnSlug(slug: string) {
  return articles.find((a) => a.en?.slug === slug)
}
