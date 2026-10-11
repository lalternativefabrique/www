import { Link } from '@tanstack/react-router'
import { formatMois, formatMontant, type Couts } from '@/lib/couts'

const textes = {
  fr: {
    locale: 'fr-FR',
    surtitre: 'Transparence',
    titre: 'Ce que coûtent nos applications',
    chapeau:
      "Chaque mois, ce que la Fabrique dépense pour faire tourner ses applications : l'hébergement et les services du catalogue d'un côté, les modèles de langage de l'autre. Les chiffres viennent directement de Lungor.",
    mois: 'Mois',
    catalogue: 'Catalogue',
    llm: 'LLM',
    total: 'Total',
    application: 'Application',
    aucuneApp: 'Aucune dépense enregistrée ce mois-ci.',
    indisponible: 'Les coûts ne sont pas encore publiés.',
    indisponibleDetail: 'Revenez bientôt : cette page se remplira dès que Lungor les publiera.',
    retour: { to: '/paiement', label: 'Encaisser sans intermédiaire' },
    voir: 'Afficher',
  },
  en: {
    locale: 'en-GB',
    surtitre: 'Transparency',
    titre: 'What our apps cost',
    chapeau:
      'Each month, what the Fabrique spends to run its apps: hosting and catalogue services on one side, language models on the other. The figures come straight from Lungor.',
    mois: 'Month',
    catalogue: 'Catalogue',
    llm: 'LLM',
    total: 'Total',
    application: 'App',
    aucuneApp: 'No spending recorded this month.',
    indisponible: 'Costs are not published yet.',
    indisponibleDetail: 'Check back soon: this page fills in as soon as Lungor publishes them.',
    retour: { to: '/en/paiement', label: 'Payments without a middleman' },
    voir: 'Show',
  },
} as const

export function CoutsPage({ couts, lang }: { couts: Couts | null; lang: 'fr' | 'en' }) {
  const t = textes[lang]
  const montant = (cents: number) =>
    formatMontant(cents, couts?.currency ?? 'EUR', t.locale)

  return (
    <div>
      <section className="border-b-2 border-text">
        <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:py-28">
          <p className="label text-text/60">{t.surtitre}</p>
          <h1 className="display-xl mt-6">{t.titre}</h1>
          <p className="chapeau mt-10 max-w-2xl">{t.chapeau}</p>
          <div className="mt-10 flex flex-wrap gap-6">
            <Link
              to={t.retour.to}
              className="label inline-flex w-fit items-center gap-2 border-b-2 border-text pb-1 hover:opacity-70"
            >
              <span aria-hidden>←</span> {t.retour.label}
            </Link>
          </div>
        </div>
      </section>

      {couts ? (
        <section className="bg-warm">
          <div className="mx-auto w-full max-w-7xl px-6 py-16 sm:py-24">
            <form method="get" className="flex flex-wrap items-end gap-4">
              <label className="flex flex-col gap-2">
                <span className="label text-text/60">{t.mois}</span>
                <select
                  name="mois"
                  defaultValue={couts.month}
                  onChange={(e) => e.currentTarget.form?.requestSubmit()}
                  className="border-2 border-text bg-bg px-4 py-2"
                >
                  {(couts.months.length ? couts.months : [couts.month]).map((m) => (
                    <option key={m} value={m}>
                      {formatMois(m, t.locale)}
                    </option>
                  ))}
                </select>
              </label>
              <noscript>
                <button type="submit" className="label border-2 border-text px-4 py-2">
                  {t.voir}
                </button>
              </noscript>
            </form>

            <div className="mt-10 grid grid-cols-1 gap-px bg-text sm:grid-cols-3">
              {[
                [t.catalogue, couts.totals.catalog_cents],
                [t.llm, couts.totals.llm_cents],
                [t.total, couts.totals.total_cents],
              ].map(([label, cents]) => (
                <div key={label} className="bg-bg p-6 sm:p-8">
                  <p className="label text-accent-primary">{label}</p>
                  <p className="font-heading mt-6 whitespace-nowrap text-4xl leading-none">
                    {montant(cents as number)}
                  </p>
                </div>
              ))}
            </div>

            {couts.apps.length ? (
              <div className="mt-14 overflow-x-auto">
                <table className="w-full border-2 border-text bg-bg text-left">
                  <thead>
                    <tr className="border-b-2 border-text">
                      <th className="label p-4">{t.application}</th>
                      <th className="label p-4 text-right">{t.catalogue}</th>
                      <th className="label p-4 text-right">{t.llm}</th>
                      <th className="label p-4 text-right">{t.total}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {couts.apps.map((app) => (
                      <tr key={app.name} className="border-t border-text/20">
                        <td className="p-4">{app.name}</td>
                        <td className="p-4 text-right tabular-nums">{montant(app.catalog_cents)}</td>
                        <td className="p-4 text-right tabular-nums">{montant(app.llm_cents)}</td>
                        <td className="p-4 text-right font-medium tabular-nums">
                          {montant(app.total_cents)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="mt-14 text-text/70">{t.aucuneApp}</p>
            )}
          </div>
        </section>
      ) : (
        <section>
          <div className="mx-auto w-full max-w-3xl px-6 py-20 sm:py-28">
            <p className="font-heading text-3xl uppercase leading-tight">{t.indisponible}</p>
            <p className="chapeau mt-6 text-text/80">{t.indisponibleDetail}</p>
          </div>
        </section>
      )}
    </div>
  )
}
