import type { ComponentType, ReactNode } from 'react'

/**
 * A figure inside an article body. Written as JSX in the MDX rather than as a
 * markdown image: the intrinsic size is required to reserve the space before
 * the file loads, and markdown has nowhere to put it.
 */
export function Figure({
  src,
  alt,
  altEn,
  caption,
  width,
  height,
  lang = 'fr',
}: {
  src: string
  alt: string
  altEn?: string
  caption?: string
  width: number
  height: number
  lang?: 'fr' | 'en'
}) {
  return (
    <figure className="my-14 w-full">
      <img
        src={src}
        alt={lang === 'en' ? (altEn ?? alt) : alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        className="block h-auto w-full border-2 border-text"
      />
      {caption ? (
        <figcaption className="mt-3 text-sm leading-relaxed text-text/55">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  )
}

/** Figures belong in a table, not in prose. `accent` highlights our column. */
export function Tableau({
  colonnes,
  lignes,
  accent,
  note,
}: {
  colonnes: string[]
  lignes: string[][]
  accent?: number
  note?: string
}) {
  return (
    <figure className="my-12">
      <div className="overflow-x-auto border-2 border-text">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b-2 border-text bg-text text-bg">
              {colonnes.map((col, c) => (
                <th
                  key={col}
                  scope="col"
                  className={`label px-4 py-3 font-medium ${
                    c === accent ? 'text-warm' : ''
                  }`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {lignes.map((ligne) => (
              <tr
                key={ligne[0]}
                className="border-b border-text/20 last:border-b-0"
              >
                {ligne.map((cell, c) => (
                  <td
                    key={c}
                    className={`px-4 py-3 text-base ${
                      c === 0 ? 'text-text/70' : 'text-text'
                    } ${c === accent ? 'font-medium text-accent-primary' : ''}`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {note ? (
        <figcaption className="label mt-3 text-text/50">{note}</figcaption>
      ) : null}
    </figure>
  )
}

const mdxComponents = {
  Figure,
  Tableau,
  h2: (props: { children?: ReactNode }) => (
    <h2
      className="font-heading mb-6 mt-16 text-3xl uppercase leading-tight sm:text-4xl"
      {...props}
    />
  ),
  h3: (props: { children?: ReactNode }) => (
    <h3
      className="font-heading mb-4 mt-12 text-2xl uppercase leading-tight"
      {...props}
    />
  ),
  blockquote: ({ children }: { children?: ReactNode }) => (
    <blockquote className="my-14 border-l-4 border-accent-primary pl-6 [&>p]:chapeau [&>p]:text-text">
      {children}
    </blockquote>
  ),
  ul: (props: { children?: ReactNode }) => (
    <ul className="my-8 space-y-3" {...props} />
  ),
  ol: (props: { children?: ReactNode }) => (
    <ol className="my-8 list-decimal space-y-3 pl-6" {...props} />
  ),
  li: ({ children }: { children?: ReactNode }) => (
    <li className="flex gap-3">
      <span aria-hidden className="text-accent-primary">
        —
      </span>
      <span>{children}</span>
    </li>
  ),
  a: (props: { href?: string; children?: ReactNode }) => (
    <a
      className="underline decoration-accent-primary decoration-2 underline-offset-4 hover:text-accent-primary"
      {...props}
    />
  ),
  strong: (props: { children?: ReactNode }) => (
    <strong className="font-medium text-text" {...props} />
  ),
  code: (props: { children?: ReactNode }) => (
    <code
      className="border border-text/20 bg-text/5 px-1.5 py-0.5 text-[0.9em]"
      {...props}
    />
  ),
  hr: () => <hr className="my-16 border-t-2 border-text/20" />,
  img: (props: { src?: string; alt?: string }) => (
    <img
      loading="lazy"
      decoding="async"
      className="my-14 block h-auto w-full border-2 border-text"
      {...props}
    />
  ),
  table: (props: { children?: ReactNode }) => (
    <figure className="my-12">
      <div className="overflow-x-auto border-2 border-text">
        <table className="w-full border-collapse text-left" {...props} />
      </div>
    </figure>
  ),
  thead: (props: { children?: ReactNode }) => (
    <thead className="border-b-2 border-text bg-text text-bg" {...props} />
  ),
  th: (props: { children?: ReactNode }) => (
    <th scope="col" className="label px-4 py-3 font-medium" {...props} />
  ),
  tr: (props: { children?: ReactNode }) => (
    <tr className="border-b border-text/20 last:border-b-0" {...props} />
  ),
  td: (props: { children?: ReactNode }) => (
    <td className="px-4 py-3 text-base text-text" {...props} />
  ),
}

/**
 * Renders an article body. Shared by the French and English article routes.
 *
 * The component map is passed as a prop rather than through MDXProvider: the
 * context does not reach the compiled MDX component under the prerender pass,
 * which silently yields unstyled tags in the built HTML.
 */
export function MdxProse({
  corps: Corps,
  lang = 'fr',
}: {
  corps: ComponentType<{ components?: Record<string, unknown> }>
  lang?: 'fr' | 'en'
}) {
  const components =
    lang === 'en'
      ? {
          ...mdxComponents,
          Figure: (props: Parameters<typeof Figure>[0]) => (
            <Figure {...props} lang="en" />
          ),
        }
      : mdxComponents

  return (
    <div className="prose-editorial text-text/85">
      <Corps components={components} />
    </div>
  )
}
