import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { articleBySlug } from '@/content/articles'
import { Inscription } from '@/components/Inscription'
import { Blocs } from '@/components/Blocs'
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
      image: loaderData.illustration
        ? absoluteUrl(loaderData.illustration.src)
        : undefined,
      type: 'article',
      publishedTime: loaderData.date,
      modifiedTime: loaderData.dateRevision,
      section: loaderData.organe,
      alternate: loaderData.en
        ? { fr: path, en: `/en/blog/${loaderData.en.slug}` }
        : undefined,
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
          ...(loaderData.illustration
            ? { image: absoluteUrl(loaderData.illustration.src) }
            : {}),
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
          {article.en ? (
            <Link
              to="/en/blog/$slug"
              params={{ slug: article.en.slug }}
              className="label mt-6 inline-flex items-center gap-2 text-text/60 hover:text-accent-primary"
            >
              Read in English <span aria-hidden>→</span>
            </Link>
          ) : null}
        </div>
      </header>

      {article.illustration ? (
        <figure className="mx-auto w-full max-w-5xl px-6 pt-8 sm:pt-12">
          <img
            src={article.illustration.src}
            alt={article.illustration.alt}
            width="1536"
            height="1024"
            decoding="async"
            className="block h-auto w-full border-2 border-text"
          />
        </figure>
      ) : null}

      <section>
        <div className="mx-auto w-full max-w-3xl px-6 py-16 sm:py-24">
          <Blocs blocs={article.blocs} />
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
