import { useEffect, useState } from 'react'
import { lireStatutDon, type StatutDon } from '@/server/don'

const POLL_MS = 2000
const POLL_MAX = 15

const textes = {
  fr: {
    paid: {
      label: 'Paiement réussi',
      titre: 'Merci infiniment.',
      corps: [
        'Votre don est bien arrivé. Il va nous aider énormément : il paie d’abord ce qui fait tourner les applications, serveurs, stockage, envoi des e-mails, puis les compétences dont le projet a besoin.',
        'Rien n’est caché : nos dépenses sont publiées chaque mois, chiffre par chiffre. Vous pourrez voir où va votre contribution.',
      ],
    },
    pending: {
      label: 'Un instant',
      titre: 'Nous attendons la confirmation de votre banque.',
      corps: [
        'Cela prend en général quelques secondes. Cette page se met à jour toute seule.',
      ],
    },
    failed: {
      label: 'Paiement non abouti',
      titre: 'Votre don n’a pas pu être encaissé.',
      corps: [
        'Aucun montant n’a été prélevé. Vous pouvez réessayer, avec la même carte ou un autre moyen de paiement.',
      ],
    },
    unknown: {
      label: 'Merci',
      titre: 'Merci pour votre contribution.',
      corps: [
        'Si votre paiement a abouti, il est enregistré et une facture est établie : écrivez-nous si vous souhaitez la recevoir.',
      ],
    },
    voirCouts: 'Voir où va l’argent',
    reessayer: 'Réessayer',
    projets: 'Voir les projets',
    couts: '/couts',
    pot: '/pot',
  },
  en: {
    paid: {
      label: 'Payment successful',
      titre: 'Thank you so much.',
      corps: [
        'Your donation has arrived. It will help us enormously: it first pays for what keeps the applications running, servers, storage, email delivery, then for the skills the project needs.',
        'Nothing is hidden: our spending is published every month, figure by figure. You will be able to see where your contribution goes.',
      ],
    },
    pending: {
      label: 'One moment',
      titre: 'We are waiting for your bank to confirm.',
      corps: ['This usually takes a few seconds. This page updates by itself.'],
    },
    failed: {
      label: 'Payment not completed',
      titre: 'Your donation could not be collected.',
      corps: [
        'Nothing was charged. You can try again, with the same card or another payment method.',
      ],
    },
    unknown: {
      label: 'Thank you',
      titre: 'Thank you for contributing.',
      corps: [
        'If your payment went through, it is recorded and an invoice is issued: write to us if you would like to receive it.',
      ],
    },
    voirCouts: 'See where the money goes',
    reessayer: 'Try again',
    projets: 'See the projects',
    couts: '/en/costs',
    pot: '/en/pot',
  },
} as const

export function MerciDon({ locale }: { locale: 'fr' | 'en' }) {
  const t = textes[locale]
  const [statut, setStatut] = useState<StatutDon>('pending')

  useEffect(() => {
    let annule = false
    let essais = 0
    let minuteur: ReturnType<typeof setTimeout> | undefined

    const lire = async () => {
      essais += 1
      let s: StatutDon = 'unknown'
      try {
        s = await lireStatutDon()
      } catch {}
      if (annule) return
      if (s === 'pending' && essais >= POLL_MAX) s = 'unknown'
      setStatut(s)
      if (s === 'pending') minuteur = setTimeout(lire, POLL_MS)
    }
    lire()

    return () => {
      annule = true
      clearTimeout(minuteur)
    }
  }, [])

  const bloc = t[statut]
  const bouton =
    'label inline-flex w-fit items-center gap-3 border-2 border-current px-6 py-3 hover:bg-bg hover:text-accent-secondary'
  const lien =
    'label inline-flex w-fit items-center gap-2 self-center border-b-2 border-current pb-1 hover:opacity-70'

  return (
    <section className="bg-accent-secondary text-bg">
      <div
        className="mx-auto w-full max-w-3xl px-6 py-20 sm:py-28"
        aria-live="polite"
        aria-busy={statut === 'pending'}
      >
        <p className="label opacity-70">{bloc.label}</p>
        <h1 tabIndex={-1} className="display-xl mt-6 focus:outline-none">
          {bloc.titre}
        </h1>
        <div className="prose-editorial mt-10 opacity-90">
          {bloc.corps.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        {statut !== 'pending' && (
          <div className="mt-12 flex flex-wrap gap-4">
            {statut === 'failed' ? (
              <a href={t.pot} className={bouton}>
                {t.reessayer} <span aria-hidden>→</span>
              </a>
            ) : (
              <>
                <a href={t.couts} className={bouton}>
                  {t.voirCouts} <span aria-hidden>→</span>
                </a>
                <a href={t.pot} className={lien}>
                  {t.projets} <span aria-hidden>→</span>
                </a>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
