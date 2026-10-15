import { Link } from '@tanstack/react-router'
import { formatMois, formatMontant, type Couts } from '@/lib/couts'

const textes = {
  fr: {
    locale: 'fr-FR',
    surtitre: '§ 01 — Nos coûts, à livre ouvert',
    titre: 'Ce que coûte la Fabrique.',
    chapeau:
      "Chaque mois, nous publions ce que coûtent nos applications pour tourner : serveurs, services payants, appels aux modèles d'IA, et les personnes que nous rémunérons pour tenir une fonction. Ligne par ligne, sans arrondi flatteur.",
    precision:
      "Pas de chiffre d'affaires ici, pas de bénéfice : seulement le prix réel de l'outil. Les chiffres viennent directement de Lungor.",
    mois: 'Période',
    catalogue: 'A — Infrastructure & services',
    llm: 'B — Intelligence artificielle',
    staff: 'C — Intervenants',
    total: 'A + B + C — Coût du mois',
    totalCourt: 'Total',
    explication:
      "A. Hébergement et services payants, comptés au prix catalogue du fournisseur. B. Les appels aux modèles d'IA faits par nos applications, facturés à l'usage, regroupés par application. C. Les intervenants rémunérés, par fonction, sans nom.",
    poste: 'Le détail, poste par poste',
    montant: 'Montant',
    parApplication: 'Par application',
    application: 'Application',
    aucuneApp: 'Aucune dépense enregistrée ce mois-ci.',
    indisponible: 'Les coûts ne sont pas encore publiés.',
    indisponibleDetail: 'Revenez bientôt : cette page se remplira dès que Lungor les publiera.',
    retour: { to: '/paiement', label: 'Encaisser sans intermédiaire' },
    participer: {
      to: '/participer',
      texte: "Ce tableau compte ce que nous payons. Le reste, ce sont des métiers que nous n'avons pas tous.",
      label: 'Nos besoins, en argent et en compétences',
    },
    voir: 'Afficher',
  },
  en: {
    locale: 'en-GB',
    surtitre: '§ 01 — Our costs, in the open',
    titre: 'What the Fabrique costs.',
    chapeau:
      'Each month we publish what it takes to run our apps: servers, paid services, AI model calls, and the people we pay to hold a function. Line by line, no flattering rounding.',
    precision:
      'No revenue here, no profit: only the real cost of the tools. The figures come straight from Lungor.',
    mois: 'Period',
    catalogue: 'A — Infrastructure & services',
    llm: 'B — Artificial intelligence',
    staff: 'C — Paid contributors',
    total: 'A + B + C — Monthly cost',
    totalCourt: 'Total',
    explication:
      'A. Hosting and paid services, counted at the provider’s catalogue price. B. The AI model calls made by our apps, billed by use, grouped by app. C. Paid contributors, by function, never by name.',
    poste: 'Line by line',
    montant: 'Amount',
    parApplication: 'By app',
    application: 'App',
    aucuneApp: 'No spending recorded this month.',
    indisponible: 'Costs are not published yet.',
    indisponibleDetail: 'Check back soon: this page fills in as soon as Lungor publishes them.',
    retour: { to: '/en/paiement', label: 'Payments without a middleman' },
    participer: {
      to: '/en/take-part',
      texte: 'This table counts what we pay for. The rest are trades we do not all have.',
      label: 'Our needs, in money and in skills',
    },
    voir: 'Show',
  },
} as const

export function CoutsPage({ couts, lang }: { couts: Couts | null; lang: 'fr' | 'en' }) {
  const t = textes[lang]
  const montant = (cents: number) =>
    formatMontant(cents, couts?.currency ?? 'EUR', t.locale)

  return (
    <div>
      <section className="border-b-[3px] border-text">
        <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:py-28">
          <p className="label text-accent-primary">{t.surtitre}</p>
          <h1 className="display-xl mt-6">{t.titre}</h1>
          <p className="chapeau mt-10 max-w-2xl">{t.chapeau}</p>
          <p className="mt-5 max-w-2xl text-text/70">{t.precision}</p>
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
        <section>
          <div className="mx-auto w-full max-w-7xl px-6 py-16 sm:py-24">
            <form method="get" className="flex flex-wrap items-end gap-4">
              <label className="flex flex-col gap-2">
                <span className="label text-text/60">{t.mois}</span>
                <select
                  name="mois"
                  defaultValue={couts.month}
                  onChange={(e) => e.currentTarget.form?.requestSubmit()}
                  className="min-h-11 border-0 border-b-2 border-text bg-transparent py-2 pr-8 text-lg font-medium"
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

            <div className="mt-10 grid grid-cols-1 border-y border-text sm:grid-cols-2 lg:grid-cols-4">
              {[
                [t.catalogue, couts.totals.catalog_cents],
                [t.llm, couts.totals.llm_cents],
                [t.staff, couts.totals.staff_cents],
                [t.total, couts.totals.total_cents],
              ].map(([label, cents], index) => (
                <div
                  key={label}
                  className={`flex flex-col gap-10 py-7 sm:px-6 sm:first:pl-0 ${
                    index === 3 ? 'bg-text px-6 text-bg' : ''
                  } ${index > 0 ? 'border-t border-text lg:border-l lg:border-t-0' : ''}`}
                >
                  <p className="label">{label}</p>
                  <p className="whitespace-nowrap font-mono text-4xl font-medium leading-none tracking-tight">
                    {montant(cents as number)}
                  </p>
                </div>
              ))}
            </div>

            <p className="mt-5 max-w-3xl text-sm text-text/70">{t.explication}</p>

            {couts.items.length ? (
              <div className="mt-14 overflow-x-auto">
                <table className="w-full border-t-[3px] border-text text-left">
                  <thead>
                    <tr className="border-b border-text">
                      <th className="label p-4 pl-0">{t.poste}</th>
                      <th className="label p-4 pr-0 text-right">{t.montant}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {couts.items.map((item) => (
                      <tr key={`${item.name}|${item.category}|${item.app}`} className="border-t border-text/20">
                        <td className="p-4 pl-0">
                          <span className="block">{item.name}</span>
                          <span className="block text-sm text-text/60">
                            {item.category} · {item.app}
                          </span>
                        </td>
                        <td className="p-4 pr-0 text-right font-mono font-medium">
                          {montant(item.total_cents)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}

            {couts.apps.length ? (
              <div className={couts.items.length ? 'mt-10 overflow-x-auto' : 'mt-14 overflow-x-auto'}>
                {couts.items.length ? (
                  <p className="label mb-4">{t.parApplication}</p>
                ) : null}
                <table className="w-full border-t-[3px] border-text text-left">
                  <thead>
                    <tr className="border-b border-text">
                      <th className="label p-4 pl-0">{t.application}</th>
                      <th className="label p-4 text-right">{t.catalogue}</th>
                      <th className="label p-4 text-right">{t.llm}</th>
                      <th className="label p-4 text-right">{t.staff}</th>
                      <th className="label p-4 pr-0 text-right">{t.totalCourt}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {couts.apps.map((app) => (
                      <tr key={app.name} className="border-t border-text/20">
                        <td className="p-4 pl-0">{app.name}</td>
                        <td className="p-4 text-right font-mono">{montant(app.catalog_cents)}</td>
                        <td className="p-4 text-right font-mono">{montant(app.llm_cents)}</td>
                        <td className="p-4 text-right font-mono">{montant(app.staff_cents)}</td>
                        <td className="p-4 pr-0 text-right font-mono font-medium">
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

            <div className="mt-16 border-t-2 border-text pt-10">
              <p className="max-w-2xl text-text/80">{t.participer.texte}</p>
              <Link
                to={t.participer.to}
                className="label mt-6 inline-flex w-fit items-center gap-2 border-b-2 border-text pb-1 hover:opacity-70"
              >
                {t.participer.label} <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <section>
          <div className="mx-auto w-full max-w-3xl px-6 py-20 sm:py-28">
            <p className="font-heading text-3xl leading-tight">{t.indisponible}</p>
            <p className="chapeau mt-6 text-text/80">{t.indisponibleDetail}</p>
          </div>
        </section>
      )}
    </div>
  )
}
