import { createFileRoute } from '@tanstack/react-router'
import { LegalNotice, Section } from '@lalternative/legal'
import { seo } from '@/lib/seo'
import {
  HOSTS,
  LEGAL_CLASSNAMES,
  LEGAL_UPDATED_AT,
  PUBLISHER,
  SITE_EN,
} from '@/lib/legal-identity'

export const Route = createFileRoute('/en/mentions-legales')({
  component: LegalNoticePageEn,
  head: () =>
    seo({
      title: "Legal notice — L'Alternative Fabrique",
      description:
        'Publisher, hosting, intellectual property and personal data processing for lalternativefabrique.org.',
      path: '/en/mentions-legales',
      locale: 'en',
      alternate: { fr: '/mentions-legales', en: '/en/mentions-legales' },
    }),
})

function LegalNoticePageEn() {
  return (
    <LegalNotice
      publisher={PUBLISHER}
      site={SITE_EN}
      hosts={HOSTS}
      updatedAt={LEGAL_UPDATED_AT}
      locale="en"
      classNames={LEGAL_CLASSNAMES}
    >
      <Section title="This site" classNames={LEGAL_CLASSNAMES}>
        <p>
          lalternativefabrique.org introduces L'Alternative Fabrique, the tools
          it publishes and the review it edits. Each tool runs under its own
          name and its own domain, with its own terms: this notice covers this
          site, not the services described on it.
        </p>
      </Section>

      <Section title="Contributions to the common pot" classNames={LEGAL_CLASSNAMES}>
        <p>
          The "Common pot" page accepts a one-off contribution between €1 and
          €5,000. It is not a donation to a charity and no tax receipt is
          issued: the publisher is a sole trader. An invoice is sent by email.
          The payment happens once, never recurs and opens no subscription.
        </p>
        <p>
          Payment is handled by Lungor, on its own secure page. No card details
          pass through this site or are stored here; only the email address
          and, where given, the billing name are passed on.
        </p>
        <p>
          This site publishes no separate terms of sale and no separate privacy
          policy: this notice stands for both, and the links naming them
          elsewhere on the site point back here.
        </p>
      </Section>

      <Section title="Data collected by this site" classNames={LEGAL_CLASSNAMES}>
        <p>
          The publisher is the controller for the data collected here. This site
          collects only what you hand it: the email address given to receive the
          review, and the name, email address and message sent through the
          contact form when it carries an application to take part. A question
          sent through that same form is not stored: it is handed to your own
          mail client and reaches us as an email.
        </p>
        <p>
          That data serves only to answer you and to send you the review. It is
          never sold, shared or used for advertising, and is kept for as long as
          the relationship lasts, then deleted on request. Accounting records
          tied to a contribution are kept for ten years, as required by art.
          L.&nbsp;123-22 of the French commercial code.
        </p>
        <p>
          You have the right to access, rectify, erase, port, restrict and
          object to the processing of your data. To exercise it, write to{' '}
          <a
            className={LEGAL_CLASSNAMES.link}
            href={`mailto:${SITE_EN.contactEmail}`}
          >
            {SITE_EN.contactEmail}
          </a>
          . You may also lodge a complaint with the CNIL, the competent
          supervisory authority (cnil.fr).
        </p>
      </Section>
    </LegalNotice>
  )
}
