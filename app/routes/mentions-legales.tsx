import { createFileRoute } from '@tanstack/react-router'
import { LegalNotice, Section } from '@lalternative/legal'
import { seo } from '@/lib/seo'
import {
  HOSTS,
  LEGAL_CLASSNAMES,
  LEGAL_UPDATED_AT,
  PUBLISHER,
  SITE_FR,
} from '@/lib/legal-identity'

export const Route = createFileRoute('/mentions-legales')({
  component: MentionsLegalesPage,
  head: () =>
    seo({
      title: "Mentions légales — L'Alternative Fabrique",
      description:
        "Éditeur, hébergement, propriété intellectuelle et traitement des données personnelles du site lalternativefabrique.org.",
      path: '/mentions-legales',
      alternate: { fr: '/mentions-legales', en: '/en/mentions-legales' },
    }),
})

function MentionsLegalesPage() {
  return (
    <LegalNotice
      publisher={PUBLISHER}
      site={SITE_FR}
      hosts={HOSTS}
      updatedAt={LEGAL_UPDATED_AT}
      locale="fr"
      classNames={LEGAL_CLASSNAMES}
    >
      <Section title="Le site" classNames={LEGAL_CLASSNAMES}>
        <p>
          lalternativefabrique.org présente L'Alternative Fabrique, les outils
          qu'elle édite et la revue qu'elle publie. Chaque outil est exploité
          sous son propre nom et son propre domaine, avec ses propres
          conditions&nbsp;: les présentes mentions couvrent ce site, pas les
          services qui y sont décrits.
        </p>
      </Section>

      <Section
        title="Contributions au pot commun"
        classNames={LEGAL_CLASSNAMES}
      >
        <p>
          La page « Pot commun » permet de verser une contribution unique, d'un
          montant compris entre 1&nbsp;€ et 5&nbsp;000&nbsp;€. Il ne s'agit pas
          d'un don à une association et aucun reçu fiscal n'est délivré&nbsp;:
          l'éditeur est une entreprise individuelle. Une facture est adressée
          par courriel. Le versement est unique, ne se reconduit pas et
          n'ouvre aucun abonnement.
        </p>
        <p>
          Le paiement est opéré par Lungor, sur sa propre page sécurisée. Aucune
          donnée de carte bancaire ne transite par ce site ni n'y est
          conservée&nbsp;; seules l'adresse électronique et, le cas échéant, la
          raison sociale nécessaires à la facturation lui sont transmises.
        </p>
        <p>
          Ce site ne publie pas de conditions générales de vente distinctes ni
          de politique de confidentialité séparée&nbsp;: les présentes mentions
          tiennent lieu des deux, et les liens qui les mentionnent ailleurs sur
          le site renvoient ici.
        </p>
      </Section>

      <Section
        title="Données collectées par ce site"
        classNames={LEGAL_CLASSNAMES}
      >
        <p>
          L'éditeur est responsable du traitement des données collectées ici. Ce
          site ne collecte que ce que vous lui remettez&nbsp;: l'adresse
          électronique confiée pour recevoir la revue, ainsi que les nom,
          adresse électronique et message envoyés par le formulaire de contact
          lorsqu'il s'agit d'une candidature à participer. Une question posée
          par ce même formulaire n'est pas enregistrée&nbsp;: elle est remise à
          votre logiciel de messagerie et nous parvient par courriel.
        </p>
        <p>
          Ces données servent exclusivement à vous répondre et à vous adresser
          les numéros de la revue. Elles ne sont ni vendues, ni cédées, ni
          utilisées à des fins publicitaires, et sont conservées le temps de la
          relation, puis supprimées sur simple demande. Les pièces comptables
          liées à une contribution sont conservées dix ans, conformément à
          l'article L.&nbsp;123-22 du Code de commerce.
        </p>
        <p>
          Vous disposez d'un droit d'accès, de rectification, d'effacement, de
          portabilité, de limitation et d'opposition sur vos données. Pour
          l'exercer, écrivez à{' '}
          <a
            className={LEGAL_CLASSNAMES.link}
            href={`mailto:${SITE_FR.contactEmail}`}
          >
            {SITE_FR.contactEmail}
          </a>
          . Vous pouvez également saisir la CNIL, autorité de contrôle
          compétente (cnil.fr).
        </p>
      </Section>
    </LegalNotice>
  )
}
