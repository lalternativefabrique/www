import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { articleBySlug } from '@/content/articles'
import { Inscription } from '@/components/Inscription'
import {
  ORGANIZATION,
  SITE_URL,
  absoluteUrl,
  jsonLd,
  seo,
} from '@/lib/seo'

export const Route = createFileRoute('/blog/$slug')({
  component: BlogArticle,
  loader: ({ params }) => {
    const article = articleBySlug(params.slug)
    if (!article) throw notFound()
    return article
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {}

    const path = `/blog/${loaderData.slug}`
    const url = absoluteUrl(path)
    const base = seo({
      title: `${loaderData.titre} — L'Alternative Fabrique`,
      description: loaderData.chapeau,
      path,
      type: 'article',
      publishedTime: loaderData.date,
      modifiedTime: loaderData.dateRevision,
      section: loaderData.organe,
    })

    return {
      ...base,
      meta: [
        ...base.meta,
        // Article markup is what makes an editorial page eligible for the
        // richer result: it carries the headline, the date and the publisher.
        jsonLd({
          '@context': 'https://schema.org',
          '@type': 'Article',
          '@id': `${url}#article`,
          headline: loaderData.titre,
          description: loaderData.chapeau,
          datePublished: loaderData.date,
          dateModified: loaderData.dateRevision ?? loaderData.date,
          articleSection: loaderData.organe,
          inLanguage: 'fr-FR',
          mainEntityOfPage: { '@type': 'WebPage', '@id': url },
          author: { '@id': `${SITE_URL}/#organization` },
          publisher: ORGANIZATION,
        }),
      ],
    }
  },
})

function BlogArticle() {
  const article = Route.useLoaderData()

  return (
    <article>
      <header className="border-b-2 border-text">
        <div className="mx-auto w-full max-w-3xl px-6 py-20 sm:py-28">
          <p className="label text-accent-primary">Organe {article.organe}</p>
          <h1 className="font-heading mt-6 text-5xl uppercase leading-tight sm:text-7xl">
            {article.titre}
          </h1>
          <p className="chapeau mt-8 text-text/80">{article.chapeau}</p>
          <p className="label mt-8 text-text/50">
            {article.date} — {article.lecture} de lecture
          </p>
        </div>
      </header>

      <section>
        <div className="mx-auto w-full max-w-3xl px-6 py-16 sm:py-24">
          <div className="prose-editorial text-text/85">
            {article.blocs.map((bloc, i) => {
              if (bloc.type === 'h2') {
                return (
                  <h2
                    key={i}
                    className="font-heading mb-6 mt-16 text-3xl uppercase leading-tight sm:text-4xl"
                  >
                    {bloc.text}
                  </h2>
                )
              }
              if (bloc.type === 'quote') {
                return (
                  <blockquote
                    key={i}
                    className="my-14 border-l-4 border-accent-primary pl-6"
                  >
                    <p className="chapeau text-text">{bloc.text}</p>
                  </blockquote>
                )
              }
              if (bloc.type === 'tableau') {
                return (
                  <figure key={i} className="my-12">
                    {/* Wide tables scroll inside their own box, never the page. */}
                    <div className="overflow-x-auto border-2 border-text">
                      <table className="w-full border-collapse text-left">
                        <thead>
                          <tr className="border-b-2 border-text bg-text text-bg">
                            {bloc.colonnes.map((col, c) => (
                              <th
                                key={col}
                                scope="col"
                                className={`label px-4 py-3 font-medium ${
                                  c === bloc.accent ? 'text-warm' : ''
                                }`}
                              >
                                {col}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {bloc.lignes.map((ligne) => (
                            <tr
                              key={ligne[0]}
                              className="border-b border-text/20 last:border-b-0"
                            >
                              {ligne.map((cell, c) => (
                                <td
                                  key={c}
                                  className={`px-4 py-3 text-base ${
                                    c === 0 ? 'text-text/70' : 'text-text'
                                  } ${
                                    c === bloc.accent
                                      ? 'font-medium text-accent-primary'
                                      : ''
                                  }`}
                                >
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {bloc.note ? (
                      <figcaption className="label mt-3 text-text/50">
                        {bloc.note}
                      </figcaption>
                    ) : null}
                  </figure>
                )
              }
              if (bloc.type === 'liste') {
                return (
                  <ul key={i} className="my-8 space-y-3">
                    {bloc.items.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span aria-hidden className="text-accent-primary">
                          —
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )
              }
              return <p key={i}>{bloc.text}</p>
            })}
          </div>
        </div>
      </section>

      {/* Tool tie-in */}
      <section className="border-t-2 border-text bg-bg">
        <div className="mx-auto w-full max-w-3xl px-6 py-16 sm:py-20">
          <p className="label text-text/60">L'outil de cet organe</p>
          <h2 className="font-heading mt-4 text-4xl uppercase leading-none sm:text-5xl">
            {article.outil}
          </h2>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href={article.outilUrl}
              className="label inline-flex w-fit items-center gap-3 border-2 border-text px-6 py-3 hover:bg-text hover:text-bg"
            >
              Ouvrir {article.outil} <span aria-hidden>→</span>
            </a>
            <Link
              to="/outils"
              className="label inline-flex w-fit items-center gap-3 px-2 py-3 text-text/70 hover:text-accent-primary"
            >
              Tous les outils <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Sign-up */}
      <section className="border-t-2 border-text">
        <div className="mx-auto w-full max-w-3xl px-6 py-16 sm:py-20">
          <Inscription />
        </div>
      </section>
    </article>
  )
}
