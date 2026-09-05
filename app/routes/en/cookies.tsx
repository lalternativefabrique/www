import { createFileRoute } from '@tanstack/react-router'
import { CookiesPage } from '@lalternative/legal'
import { seo } from '@/lib/seo'
import { COOKIES_EN } from '@/lib/legal-cookies'
import {
  HOSTS,
  LEGAL_CLASSNAMES,
  LEGAL_UPDATED_AT,
  PUBLISHER,
  SITE_EN,
} from '@/lib/legal-identity'

export const Route = createFileRoute('/en/cookies')({
  component: CookiesRouteEn,
  head: () =>
    seo({
      title: "Cookie policy — L'Alternative Fabrique",
      description:
        'Session cookies on the back-office only, no tracker and no analytics, hence no consent banner.',
      path: '/en/cookies',
      locale: 'en',
      alternate: { fr: '/cookies', en: '/en/cookies' },
    }),
})

function CookiesRouteEn() {
  return (
    <CookiesPage
      publisher={PUBLISHER}
      site={SITE_EN}
      hosts={HOSTS}
      updatedAt={LEGAL_UPDATED_AT}
      locale="en"
      cookies={COOKIES_EN}
      strictlyNecessaryOnly
      classNames={LEGAL_CLASSNAMES}
    />
  )
}
