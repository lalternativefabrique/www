import { useState } from 'react'
import { useLocale } from '@/lib/i18n'
import { bornes, creerDon } from '@/server/don'

const CONTACT = 'contact@lalternativefabrique.org'

const MONTANTS = [500, 1000, 2500, 5000]
const DEFAUT = 2500

type Etat = 'repos' | 'envoi' | 'erreur'
type Champ = 'montant' | 'email' | null

/**
 * Reads a typed amount as cents. Accepts the comma French keyboards produce,
 * and the spaces pasted from a formatted figure. Null when it is not a number.
 */
function centimes(saisie: string): number | null {
  const brut = saisie.replace(/\s/g, '').replace(',', '.')
  if (brut === '') return null
  const n = Number(brut)
  return Number.isFinite(n) ? Math.round(n * 100) : null
}

function euros(cents: number, locale: 'fr' | 'en'): string {
  return new Intl.NumberFormat(locale === 'en' ? 'en-IE' : 'fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100)
}

const copy = {
  fr: {
    kicker: 'Participer',
    titre: 'Mettre au pot.',
    chapeau:
      "Le pot est ouvert. On peut y mettre directement, sans acheter un outil dont on n'a pas l'usage. Ce n'est pas un don à une cause : c'est une avance sur le mécanisme, qui le fait aller plus vite.",
    entrees: [
      {
        dt: 'Ce que ça paie',
        dd: "La même liste que le reste du pot, dans le même ordre. Aujourd'hui : le dossier d'agrément du chantier 01.",
      },
      {
        dt: 'Ce que vous recevez',
        dd: "Une facture, envoyée par email. Ce n'est pas un reçu fiscal : nous sommes une société, pas une association.",
      },
      {
        dt: 'Paiement unique',
        dd: "Une fois, et c'est tout. Rien ne se reconduit, aucune carte n'est enregistrée chez nous.",
      },
    ],
    combien: 'Combien',
    montantLabel: 'Montant en euros',
    montantAide: 'De 1 € à 5 000 €. Modifiable librement.',
    emailLabel: 'Votre adresse email',
    emailPlaceholder: 'vous@exemple.fr',
    emailAide: "Pour la facture, et rien d'autre.",
    nomLabel: 'Nom (facultatif)',
    nomPlaceholder: 'Pour la facture',
    nomAide: 'Personne ou société, tel que ça doit apparaître sur la facture.',
    soumettre: (m: string) => `Mettre ${m} au pot`,
    redirection: 'Redirection…',
    redirectionAnnonce: 'Redirection vers la page de paiement.',
    mentionPsp:
      'Le paiement se fait sur la page sécurisée de notre prestataire. Nous ne voyons jamais votre numéro de carte.',
    erreurs: {
      montantVide: 'Indiquez un montant.',
      montantIllisible:
        'Ce montant ne se lit pas. Des chiffres, avec une virgule si besoin.',
      montantMin: 'Le minimum est de 1 €.',
      montantMax: `Le maximum en ligne est de 5 000 €. Au-delà, écrivez-nous à ${CONTACT}.`,
      emailVide: 'Indiquez une adresse email : la facture y sera envoyée.',
      emailInvalide: 'Cette adresse ne semble pas valide.',
      serveur: `Le paiement n'est pas joignable pour le moment. Réessayez dans un instant, ou écrivez-nous à ${CONTACT}.`,
      refuse:
        'Ce montant a été refusé. Il doit être compris entre 1 € et 5 000 €.',
    },
  },
  en: {
    kicker: 'Chip in',
    titre: 'Put something in.',
    chapeau:
      'The pot is open. You can put in directly, without buying a tool you have no use for. This is not a donation to a cause: it is an advance on the mechanism, and it makes it move faster.',
    entrees: [
      {
        dt: 'What it pays for',
        dd: 'The same list as the rest of the pot, in the same order. Today: the authorisation dossier for work 01.',
      },
      {
        dt: 'What you get',
        dd: 'An invoice, sent by email. It is not a tax receipt: we are a company, not a charity.',
      },
      {
        dt: 'One-off payment',
        dd: 'Once, and that is all. Nothing recurs, no card is stored with us.',
      },
    ],
    combien: 'How much',
    montantLabel: 'Amount in euros',
    montantAide: 'From €1 to €5,000. Change it freely.',
    emailLabel: 'Your email address',
    emailPlaceholder: 'you@example.com',
    emailAide: 'For the invoice, and nothing else.',
    nomLabel: 'Name (optional)',
    nomPlaceholder: 'For the invoice',
    nomAide: 'Person or company, as it should appear on the invoice.',
    soumettre: (m: string) => `Put in ${m}`,
    redirection: 'Redirecting…',
    redirectionAnnonce: 'Redirecting to the payment page.',
    mentionPsp:
      "Payment happens on our provider's secure page. We never see your card number.",
    erreurs: {
      montantVide: 'Enter an amount.',
      montantIllisible:
        'That amount cannot be read. Digits only, with a decimal point if needed.',
      montantMin: 'The minimum is €1.',
      montantMax: `The online maximum is €5,000. Above that, write to us at ${CONTACT}.`,
      emailVide: 'Enter an email address: the invoice goes there.',
      emailInvalide: 'That address does not look valid.',
      serveur: `Payment is unreachable right now. Try again in a moment, or write to us at ${CONTACT}.`,
      refuse: 'That amount was refused. It must be between €1 and €5,000.',
    },
  },
} as const

export function Participation() {
  const locale = useLocale()
  const t = copy[locale]

  const [montant, setMontant] = useState(String(DEFAUT / 100))
  const [email, setEmail] = useState('')
  const [nom, setNom] = useState('')
  const [etat, setEtat] = useState<Etat>('repos')
  const [soumis, setSoumis] = useState(false)
  const [erreurGlobale, setErreurGlobale] = useState('')

  const cents = centimes(montant)
  const enCours = etat === 'envoi'

  function erreurDe(champ: Exclude<Champ, null>): string {
    if (!soumis) return ''
    if (champ === 'montant') {
      if (montant.trim() === '') return t.erreurs.montantVide
      if (cents === null) return t.erreurs.montantIllisible
      if (cents < bornes.minCents) return t.erreurs.montantMin
      if (cents > bornes.maxCents) return t.erreurs.montantMax
      return ''
    }
    if (email.trim() === '') return t.erreurs.emailVide
    if (!email.includes('@')) return t.erreurs.emailInvalide
    return ''
  }

  const erreurMontant = erreurDe('montant')
  const erreurEmail = erreurDe('email')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSoumis(true)
    setErreurGlobale('')

    const valeur = centimes(montant)
    if (
      valeur === null ||
      valeur < bornes.minCents ||
      valeur > bornes.maxCents ||
      !email.includes('@')
    ) {
      return
    }

    setEtat('envoi')
    try {
      const res = await creerDon({
        data: { amountCents: valeur, email, name: nom, locale },
      })
      if (!res.ok) {
        setErreurGlobale(
          res.reason === 'invalid-amount' ? t.erreurs.refuse : t.erreurs.serveur,
        )
        setEtat('erreur')
        return
      }
      // The browser is leaving. The button stays disabled: re-enabling it here
      // is what lets a second click open a second payment.
      window.location.href = res.redirectURL
    } catch {
      setErreurGlobale(t.erreurs.serveur)
      setEtat('erreur')
    }
  }

  const champClass =
    'w-full border-2 border-current bg-transparent px-4 py-3 text-base placeholder:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bg focus-visible:ring-offset-2 focus-visible:ring-offset-accent-secondary'

  return (
    <div className="grid gap-10 sm:grid-cols-12">
      <div className="sm:col-span-5">
        <p className="chapeau opacity-90">{t.chapeau}</p>
        <dl className="mt-10 space-y-6 border-t-2 border-current pt-8">
          {t.entrees.map((e) => (
            <div key={e.dt}>
              <dt className="label opacity-70">{e.dt}</dt>
              <dd className="mt-2 text-base opacity-90">{e.dd}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="sm:col-span-6 sm:col-start-7">
        <form
          onSubmit={onSubmit}
          aria-busy={enCours}
          className="border-2 border-current p-6 sm:p-8"
        >
          <fieldset disabled={enCours} className="border-0 p-0">
            <legend className="label opacity-70">{t.combien}</legend>

            <div className="mt-4 grid grid-cols-4 gap-px bg-current">
              {MONTANTS.map((m) => (
                <button
                  key={m}
                  type="button"
                  aria-pressed={cents === m}
                  onClick={() => setMontant(String(m / 100))}
                  className={`label bg-accent-secondary py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bg focus-visible:ring-inset ${
                    cents === m ? 'bg-bg text-accent-secondary' : 'hover:opacity-70'
                  }`}
                >
                  {euros(m, locale)}
                </button>
              ))}
            </div>

            <label htmlFor="don-montant" className="label mt-6 block opacity-70">
              {t.montantLabel}
            </label>
            <div className="relative mt-2">
              <input
                id="don-montant"
                type="text"
                inputMode="decimal"
                value={montant}
                onChange={(e) =>
                  setMontant(e.target.value.replace(/[^0-9., ]/g, ''))
                }
                aria-invalid={Boolean(erreurMontant)}
                aria-describedby={`don-montant-aide${erreurMontant ? ' don-montant-erreur' : ''}`}
                className={`${champClass} pr-10 ${erreurMontant ? 'border-warm' : ''}`}
              />
              <span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-base opacity-60"
              >
                €
              </span>
            </div>
            <p id="don-montant-aide" className="mt-2 text-sm opacity-90">
              {t.montantAide}
            </p>
            {erreurMontant ? (
              <p id="don-montant-erreur" className="mt-2 text-sm text-warm">
                {erreurMontant}
              </p>
            ) : null}

            <label htmlFor="don-email" className="label mt-8 block opacity-70">
              {t.emailLabel}
            </label>
            <input
              id="don-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.emailPlaceholder}
              aria-invalid={Boolean(erreurEmail)}
              aria-describedby={`don-email-aide${erreurEmail ? ' don-email-erreur' : ''}`}
              className={`${champClass} mt-2 ${erreurEmail ? 'border-warm' : ''}`}
            />
            <p id="don-email-aide" className="mt-2 text-sm opacity-90">
              {t.emailAide}
            </p>
            {erreurEmail ? (
              <p id="don-email-erreur" className="mt-2 text-sm text-warm">
                {erreurEmail}
              </p>
            ) : null}

            <label htmlFor="don-nom" className="label mt-8 block opacity-70">
              {t.nomLabel}
            </label>
            <input
              id="don-nom"
              type="text"
              autoComplete="name"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder={t.nomPlaceholder}
              aria-describedby="don-nom-aide"
              className={`${champClass} mt-2`}
            />
            <p id="don-nom-aide" className="mt-2 text-sm opacity-90">
              {t.nomAide}
            </p>
          </fieldset>

          <button
            type="submit"
            disabled={enCours}
            className="label mt-8 w-full border-2 border-current px-6 py-4 hover:bg-bg hover:text-accent-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bg focus-visible:ring-offset-2 focus-visible:ring-offset-accent-secondary disabled:opacity-50"
          >
            {enCours
              ? t.redirection
              : t.soumettre(euros(cents ?? DEFAUT, locale))}
          </button>

          <p aria-live="polite" className="sr-only">
            {enCours ? t.redirectionAnnonce : ''}
          </p>

          <p className="mt-4 text-sm opacity-90">{t.mentionPsp}</p>

          {erreurGlobale ? (
            <p role="alert" className="mt-6 border-2 border-warm p-4 text-sm">
              {erreurGlobale}
            </p>
          ) : null}
        </form>
      </div>
    </div>
  )
}
