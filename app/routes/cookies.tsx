import { createFileRoute } from '@tanstack/react-router'
import { CookiesPage } from '@lalternative/legal'
import { seo } from '@/lib/seo'
import { COOKIES_FR } from '@/lib/legal-cookies'
import {
  HOSTS,
  LEGAL_CLASSNAMES,
  LEGAL_UPDATED_AT,
  PUBLISHER,
  SITE_FR,
} from '@/lib/legal-identity'

export const Route = createFileRoute('/cookies')({
  component: CookiesRoute,
  head: () =>
    seo({
      title: "Politique cookies — L'Alternative Fabrique",
      description:
        "Uniquement des cookies de session sur la rédaction du site, aucun traceur ni mesure d'audience, donc aucun bandeau de consentement.",
      path: '/cookies',
      alternate: { fr: '/cookies', en: '/en/cookies' },
    }),
})

function CookiesRoute() {
  return (
    <CookiesPage
      publisher={PUBLISHER}
      site={SITE_FR}
      hosts={HOSTS}
      updatedAt={LEGAL_UPDATED_AT}
      locale="fr"
      cookies={COOKIES_FR}
      strictlyNecessaryOnly
      classNames={LEGAL_CLASSNAMES}
    />
  )
}
