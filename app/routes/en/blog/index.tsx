import { Link, createFileRoute } from '@tanstack/react-router'
import { articles, articlesEn } from '@/content/articles'
import { Inscription } from '@/components/Inscription'
import { absoluteUrl, jsonLd, seo } from '@/lib/seo'

const blogEnSeo = seo({
  title: "The review — L'Alternative Fabrique",
  description:
    'Short, dense pieces on building an alternative: keeping hold of your knowledge, your tools and your voice.',
  path: '/en/blog',
  locale: 'en',
  alternate: { fr: '/blog', en: '/en/blog' },
})

export const Route = createFileRoute('/en/blog/')({
  component: BlogIndexEn,
  head: () => ({
    ...blogEnSeo,
    meta: [
      ...blogEnSeo.meta,
      jsonLd({
        '@context': 'https://schema.org',
        '@type': 'Blog',
        '@id': `${absoluteUrl('/en/blog')}#blog`,
        name: 'The review',
        inLanguage: 'en',
        blogPost: articlesEn.map((a) => {
          const fr = articles.find((f) => f.en?.slug === a.slug)
          return {
            '@type': 'BlogPosting',
            headline: a.titre,
            datePublished: fr?.date,
            dateModified: fr?.dateRevision ?? fr?.date,
            url: absoluteUrl(`/en/blog/${a.slug}`),
          }
        }),
      }),
    ],
  }),
})

function BlogIndexEn() {
  return (
    <div>
      <section className="border-b-2 border-text">
        <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:py-28">
          <p className="label text-text/60">The review</p>
          <h1 className="display-xl mt-6">The review</h1>
          <Link
            to="/blog"
            className="label mt-8 inline-flex items-center gap-2 text-text/60 hover:text-accent-primary"
          >
            Lire la revue en français <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      <section className="bg-accent-primary text-bg">
        <div className="mx-auto w-full max-w-7xl px-6 py-24 sm:py-32">
          <div className="mx-auto max-w-4xl">
            <p className="label opacity-80">The point</p>
            <p className="font-heading mt-8 text-4xl uppercase leading-tight sm:text-6xl">
              « The record of what we build, the choices behind it and the
              ground covered. »
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto w-full max-w-7xl px-6 py-16 sm:py-24">
          {articlesEn.length === 0 ? (
            <p className="text-text/70">
              No article has been translated yet.{' '}
              <Link to="/blog" className="underline hover:text-accent-primary">
                The French review
              </Link>{' '}
              is where everything is published.
            </p>
          ) : (
            <ul className="border-t-2 border-text">
              {articlesEn.map((article) => {
                const fr = articles.find((f) => f.en?.slug === article.slug)
                return (
                  <li
                    key={article.slug}
                    className="border-b-2 border-text last:border-b-0"
                  >
                    <Link
                      to="/en/blog/$slug"
                      params={{ slug: article.slug }}
                      className="group grid gap-6 py-10 sm:grid-cols-12 sm:py-14"
                    >
                      <div className="sm:col-span-3">
                        <p className="label text-accent-primary">
                          {article.organe}
                        </p>
                        <p className="label mt-2 text-text/50">{fr?.lecture}</p>
                      </div>
                      <div className="sm:col-span-9">
                        <h2 className="font-heading text-3xl uppercase leading-tight group-hover:text-accent-primary sm:text-5xl">
                          {article.titre}
                        </h2>
                        <p className="mt-4 max-w-2xl text-base text-text/75">
                          {article.chapeau}
                        </p>
                        <p className="label mt-6 inline-flex items-center gap-2 text-text/60 group-hover:text-accent-primary">
                          Read <span aria-hidden>→</span>
                        </p>
                      </div>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </section>

      <section className="border-t-2 border-text">
        <div className="mx-auto w-full max-w-3xl px-6 py-16 sm:py-20">
          <Inscription />
        </div>
      </section>
    </div>
  )
}
