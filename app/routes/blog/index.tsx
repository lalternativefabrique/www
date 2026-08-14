import { Link, createFileRoute } from '@tanstack/react-router'
import { Inscription } from '@/components/Inscription'
import { listArticles } from '@/server/article-list'
import { absoluteUrl, jsonLd, seo } from '@/lib/seo'

const blogSeo = seo({
  title: "La revue — L'Alternative Fabrique",
  description:
    "Des textes courts et denses sur les moyens de construire une alternative : garder la main sur son savoir, ses outils, sa parole.",
  path: '/blog',
})

export const Route = createFileRoute('/blog/')({
  component: BlogIndex,
  loader: () => listArticles({ data: { lang: 'fr' } }),
  head: ({ loaderData }) => ({
    ...blogSeo,
    meta: [
      ...blogSeo.meta,
      // Lists the articles so a crawler sees the collection without having to
      // follow every link first.
      jsonLd({
        '@context': 'https://schema.org',
        '@type': 'Blog',
        '@id': `${absoluteUrl('/blog')}#blog`,
        name: 'La revue',
        inLanguage: 'fr-FR',
        blogPost: (loaderData ?? []).map((a) => ({
          '@type': 'BlogPosting',
          headline: a.titre,
          datePublished: a.date,
          dateModified: a.dateRevision ?? a.date,
          url: absoluteUrl(`/blog/${a.slug}`),
        })),
      }),
    ],
  }),
})

function BlogIndex() {
  const articles = Route.useLoaderData()

  return (
    <div>
      <section className="border-b-2 border-text">
        <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:py-28">
          <p className="label text-text/60">La revue — № 01</p>
          <h1 className="display-xl mt-6">La revue</h1>
        </div>
      </section>

      <section className="bg-accent-primary text-bg">
        <div className="mx-auto w-full max-w-7xl px-6 py-24 sm:py-32">
          <div className="mx-auto max-w-4xl">
            <p className="label opacity-80">Le propos</p>
            <p className="font-heading mt-8 text-4xl uppercase leading-tight sm:text-6xl">
              « Le récit de ce que nous construisons, de nos choix et du
              chemin parcouru. »
            </p>
          </div>
        </div>
      </section>

      {/* Articles */}
      <section>
        <div className="mx-auto w-full max-w-7xl px-6 py-16 sm:py-24">
          <ul className="border-t-2 border-text">
            {articles.map((article) => (
              <li
                key={article.slug}
                className="border-b-2 border-text last:border-b-0"
              >
                <Link
                  to="/blog/$slug"
                  params={{ slug: article.slug }}
                  className="group grid gap-6 py-10 sm:grid-cols-12 sm:py-14"
                >
                  <div className="sm:col-span-3">
                    <p className="label text-accent-primary">
                      Organe {article.organe}
                    </p>
                    <p className="label mt-2 text-text/50">{article.lecture}</p>
                  </div>
                  <div className="sm:col-span-9">
                    <h2 className="font-heading text-3xl uppercase leading-tight group-hover:text-accent-primary sm:text-5xl">
                      {article.titre}
                    </h2>
                    <p className="mt-4 max-w-2xl text-base text-text/75">
                      {article.chapeau}
                    </p>
                    <p className="label mt-6 inline-flex items-center gap-2 text-text/60 group-hover:text-accent-primary">
                      Lire <span aria-hidden>→</span>
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Sign-up */}
      <section className="border-t-2 border-text">
        <div className="mx-auto w-full max-w-3xl px-6 py-16 sm:py-20">
          <Inscription />
        </div>
      </section>
    </div>
  )
}
