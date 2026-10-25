import { Link, createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { AppIcone } from '@/components/AppIcone'
import { applications, type Pilier } from '@/content/catalogue'
import { histoire } from '@/content/histoire'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/histoire')({
  component: HistoirePage,
  head: () =>
    seo({
      title: "Le carnet de la Fabrique — L'Alternative Fabrique",
      description:
        "Comment la Fabrique a construit ses applications, une par une, depuis janvier 2026 : pourquoi Synthiz d'abord, puis Skalpai, Spore, Lungor, Partage, Messag, L'Alter, Nakoda et Orbit.",
      path: '/histoire',
    }),
})

const jour = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long' })

const pistes: ReadonlyArray<{ pilier: Pilier; couleur: string }> = [
  { pilier: 'Connaissance', couleur: 'var(--color-accent-secondary)' },
  { pilier: 'Communication', couleur: 'var(--color-accent-primary)' },
  { pilier: 'Technique', couleur: 'var(--color-text)' },
  { pilier: 'Financement', couleur: '#c48a1a' },
]

const HAUTEUR_PISTE = 104
const JOUR = 1000 * 60 * 60 * 24
const MARGE_AVANT = 20 * JOUR
const MARGE_APRES = 25 * JOUR
const mois = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' })
const moisCourt = new Intl.DateTimeFormat('fr-FR', { month: 'short' })

function useMaintenant() {
  const [maintenant, setMaintenant] = useState<Date | null>(null)
  useEffect(() => setMaintenant(new Date()), [])
  return maintenant
}

function HistoirePage() {
  const maintenant = useMaintenant()
  const [choisie, setChoisie] = useState(histoire[0].app)
  const debut = new Date(histoire[0].date)
  const fin = maintenant ?? new Date(histoire[histoire.length - 1].date)
  const origine = debut.getTime() - MARGE_AVANT
  const etendue = fin.getTime() + MARGE_APRES - origine
  const x = (date: Date) => ((date.getTime() - origine) / etendue) * 100
  const moisEcoules = Math.max(1, Math.round((fin.getTime() - debut.getTime()) / (JOUR * 30.4)))
  const decalages = new Map<string, number>()
  const dernierParPiste = new Map<string, { date: number; rang: number }>()
  for (const e of histoire) {
    const pilier = applications.find((a) => a.name === e.app)?.pilier ?? 'Technique'
    const date = new Date(e.date).getTime()
    const avant = dernierParPiste.get(pilier)
    const rang = avant && date - avant.date < 45 * JOUR ? (avant.rang + 1) % 2 : 0
    decalages.set(e.app, rang)
    dernierParPiste.set(pilier, { date, rang })
  }
  const commits = histoire.reduce((total, etape) => total + (etape.commits ?? 0), 0)
  const graduations: Date[] = []
  for (let d = new Date(debut.getFullYear(), debut.getMonth(), 1); d < fin; d = new Date(d.getFullYear(), d.getMonth() + 1, 1)) {
    if (d.getTime() > origine) graduations.push(d)
  }
  const etape = histoire.find((e) => e.app === choisie) ?? histoire[0]
  const rang = histoire.indexOf(etape)
  const application = applications.find((a) => a.name === etape.app)

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-28 sm:px-6">
      <section className="border-b-[3px] border-text pb-14 pt-16 sm:pt-20">
        <p className="label text-accent-primary">L'histoire</p>
        <h1 className="display-xl mt-6">
          Le carnet de
          <br />
          la Fabrique<span className="text-accent-primary">.</span>
        </h1>
        <p className="chapeau mt-8 max-w-2xl">
          Chaque application est née d'un manque. Voici dans quel ordre, et
          pourquoi celle-là, à ce moment-là.
        </p>
        <dl className="mt-10 flex flex-wrap gap-x-12 gap-y-4 font-mono text-sm">
          <div>
            <dt className="label text-text/60">Début</dt>
            <dd className="mt-1">{mois.format(debut)}</dd>
          </div>
          <div>
            <dt className="label text-text/60">Applications</dt>
            <dd className="mt-1">{histoire.length} en {moisEcoules} mois</dd>
          </div>
          <div>
            <dt className="label text-text/60">Commits</dt>
            <dd className="mt-1">{commits.toLocaleString('fr-FR')}</dd>
          </div>
          <div>
            <dt className="label text-text/60">Investisseurs</dt>
            <dd className="mt-1">0</dd>
          </div>
        </dl>
      </section>

      <section className="mt-14">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="label text-text/60">{mois.format(debut)} — aujourd'hui</p>
          <ul className="flex flex-wrap gap-2">
            {pistes.map((piste) => (
              <li
                key={piste.pilier}
                className="label flex items-center gap-2 rounded-full border border-text/25 px-3 py-1"
              >
                <span className="size-2 rounded-full" style={{ background: piste.couleur }} />
                {piste.pilier}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8">
          <div data-demo className="grid pt-8" style={{ gridTemplateColumns: '9rem 1fr' }}>
            <div className="relative" style={{ height: pistes.length * HAUTEUR_PISTE + 40 }}>
              {pistes.map((piste, i) => (
                <span
                  key={piste.pilier}
                  className="absolute left-0 text-sm text-text/60"
                  style={{ top: i * HAUTEUR_PISTE + 26 }}
                >
                  {piste.pilier}
                </span>
              ))}
            </div>
            <div className="relative" style={{ height: pistes.length * HAUTEUR_PISTE + 40 }}>
              {graduations.map((d) => (
                <span
                  key={d.toISOString()}
                  aria-hidden
                  className="absolute top-0 bottom-0 w-px bg-text/10"
                  style={{ left: `${x(d)}%` }}
                />
              ))}
              {maintenant ? (
                <>
                  <span
                    aria-hidden
                    className="absolute top-6 bottom-0 w-px bg-accent-primary"
                    style={{ left: `${x(maintenant)}%` }}
                  />
                  <span className="label absolute -top-6 -translate-x-full pr-2 text-accent-primary" style={{ left: `${x(maintenant)}%` }}>
                    maintenant
                  </span>
                </>
              ) : null}
              {histoire.map((e) => {
                const app = applications.find((a) => a.name === e.app)
                const piste = pistes.findIndex((p) => p.pilier === app?.pilier)
                const actif = e.app === choisie
                const position = x(new Date(e.date))
                const versLaFin = position > 70
                return (
                  <button
                    key={e.app}
                    type="button"
                    onClick={() => setChoisie(e.app)}
                    onMouseEnter={() => setChoisie(e.app)}
                    aria-pressed={actif}
                    className={`absolute flex items-center ${versLaFin ? '-translate-x-full' : ''} gap-2 rounded-lg border-2 bg-bg px-2 py-1.5 text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                      actif ? 'z-10 scale-110 shadow-[4px_4px_0_0_var(--color-text)]' : 'hover:-translate-y-0.5'
                    }`}
                    style={{
                      left: `${position}%`,
                      top: Math.max(0, piste) * HAUTEUR_PISTE + 16 + (decalages.get(e.app) ?? 0) * 44,
                      borderColor: pistes[Math.max(0, piste)].couleur,
                    }}
                  >
                    <span aria-hidden className={`absolute top-full h-2 w-[2px] bg-current ${versLaFin ? '-right-[2px]' : '-left-[2px]'}`} />
                    {app?.icone ? <img src={app.icone} alt="" className="size-6 rounded-md" /> : null}
                    {e.app}
                  </button>
                )
              })}
            </div>
            <div />
            <div className="relative h-8 border-t border-text">
              {graduations.map((d) => (
                <span
                  key={d.toISOString()}
                  className="absolute top-2 -translate-x-1/2 font-mono text-xs text-text/60"
                  style={{ left: `${x(d)}%` }}
                >
                  {moisCourt.format(d)}
                </span>
              ))}
            </div>
          </div>
        </div>
        <p className="mt-4 text-center text-sm text-text/50">
          Touchez une application pour lire son histoire
        </p>
      </section>

      <article key={etape.app} className="mt-12 grid animate-[carte_0.45s_cubic-bezier(0.2,0.7,0.2,1)] gap-8 border-t-[3px] border-text pt-10 md:grid-cols-12">
        <div className="md:col-span-4">
          <p className="label text-accent-primary">
            Épisode {String(rang + 1).padStart(2, '0')} · {jour.format(new Date(etape.date))}
          </p>
          <div className="mt-4 flex items-center gap-4">
            {application ? <AppIcone application={application} size="lg" /> : null}
            <h2 className="font-heading text-5xl font-extrabold uppercase tracking-tight">{etape.app}</h2>
          </div>
          {etape.commits ? (
            <p className="label mt-5 text-text/60">{etape.commits.toLocaleString('fr-FR')} commits</p>
          ) : null}
        </div>
        <div className="md:col-span-7 md:col-start-6">
          {application ? <p className="chapeau">{application.tagline}</p> : null}
          {etape.pourquoi ? (
            <p className="mt-6 text-lg text-text/80">{etape.pourquoi}</p>
          ) : (
            <p className="mt-6 border-l-2 border-dashed border-text/30 pl-4 italic text-text/50">
              Pourquoi {etape.app} à ce moment-là ? L'épisode arrive.
            </p>
          )}
          <div className="mt-8 flex flex-wrap items-center gap-6">
            {etape.episode ? (
              <Link
                to="/blog/$slug"
                params={{ slug: etape.episode }}
                className="inline-flex min-h-11 w-fit items-center gap-3 bg-text px-6 font-semibold text-bg hover:bg-accent-primary"
              >
                Lire l'épisode <span aria-hidden>→</span>
              </Link>
            ) : (
              <span className="label border border-text/30 px-1.5 text-text/50">À raconter</span>
            )}
            {rang < histoire.length - 1 ? (
              <button
                type="button"
                onClick={() => setChoisie(histoire[rang + 1].app)}
                className="label inline-flex items-center gap-2 border-b border-current pb-1 hover:text-accent-primary"
              >
                Ensuite : {histoire[rang + 1].app} <span aria-hidden>→</span>
              </button>
            ) : (
              <Link
                to="/projets"
                className="label inline-flex items-center gap-2 border-b border-current pb-1 hover:text-accent-primary"
              >
                La suite : les projets <span aria-hidden>→</span>
              </Link>
            )}
          </div>
        </div>
      </article>
    </div>
  )
}
