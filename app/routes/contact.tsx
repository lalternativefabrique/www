import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { apply } from '@/server/submissions'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/contact')({
  component: ContactPage,
  head: () =>
    seo({
      title: "Contact — L'Alternative Fabrique",
      description:
        "Une question, ou l'envie de participer : écrivez-nous. Une seule adresse, une vraie réponse.",
      path: '/contact',
    }),
})

/**
 * Two motives, two destinations. Wanting to take part is an application: it is
 * stored, and read from the admin. A question is not — nothing here holds one,
 * so it goes to the mailbox rather than into a form that pretends to keep it.
 */
const CONTACT = 'contact@lalternativefabrique.org'

const motifs = [
  { value: 'participer', label: 'Je veux participer' },
  { value: 'question', label: "J'ai une question" },
] as const

type Etat = 'repos' | 'envoi' | 'ok' | 'erreur'

function ContactPage() {
  const [motif, setMotif] = useState<string>(motifs[0].value)
  const [nom, setNom] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [etat, setEtat] = useState<Etat>('repos')

  /**
   * Hands the filled-in message to the visitor's mail client. Used for
   * questions, and as the fallback when storing an application fails — nothing
   * typed here is dropped without the person being able to send it themselves.
   */
  function envoyerParMail() {
    const libelle =
      motifs.find((m) => m.value === motif)?.label ?? 'Message'
    const corps = `${message}\n\n—\n${nom}\n${email}`
    window.location.href = `mailto:${CONTACT}?subject=${encodeURIComponent(
      `[L'Alternative Fabrique] ${libelle}`,
    )}&body=${encodeURIComponent(corps)}`
    setEtat('ok')
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (motif !== 'participer') {
      envoyerParMail()
      return
    }

    setEtat('envoi')
    try {
      const res = await apply({
        data: { email, name: nom, message, locale: 'fr' },
      })
      if (!res.ok) throw new Error(res.reason)
      setEtat('ok')
      setNom('')
      setEmail('')
      setMessage('')
    } catch {
      setEtat('erreur')
    }
  }

  const champ =
    'w-full border-2 border-text bg-bg px-4 py-3 text-base text-text placeholder:text-text/40 focus:outline-none focus:ring-2 focus:ring-accent-primary'

  return (
    <div>
      {/* Title block */}
      <section className="border-b-2 border-text">
        <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:py-28">
          <p className="label text-text/60">Écrire</p>
          <h1 className="display-xl mt-6">Contact</h1>
          <p className="chapeau mt-8 max-w-2xl">
            Une question sur ce qu'on fabrique, ou l'envie de mettre la main
            dedans. Dans les deux cas, on lit tout et on répond.
          </p>
        </div>
      </section>

      {/* Form */}
      <section>
        <div className="mx-auto w-full max-w-3xl px-6 py-16 sm:py-24">
          {etat === 'ok' ? (
            <div>
              <p className="font-heading text-4xl uppercase leading-tight text-accent-primary sm:text-5xl">
                Message reçu.
              </p>
              <p className="chapeau mt-6 text-text/80">
                {motif === 'participer'
                  ? `On vous répond depuis ${CONTACT}. Si rien n'arrive d'ici quelques jours, vérifiez vos indésirables — puis relancez-nous.`
                  : `Votre logiciel de messagerie s'est ouvert avec le message pré-rempli. Il reste à l'envoyer — sans quoi il ne nous parviendra pas.`}
              </p>
            </div>
          ) : (
            <>
              <form onSubmit={onSubmit} className="space-y-8">
                  <fieldset>
                    <legend className="label text-text/50">
                      Vous écrivez pour
                    </legend>
                    <div className="mt-4 flex flex-wrap gap-3">
                      {motifs.map((m) => (
                        <label
                          key={m.value}
                          className={`label cursor-pointer border-2 border-text px-5 py-3 ${
                            motif === m.value
                              ? 'bg-text text-bg'
                              : 'hover:bg-text/5'
                          }`}
                        >
                          <input
                            type="radio"
                            name="motif"
                            value={m.value}
                            checked={motif === m.value}
                            onChange={(e) => setMotif(e.target.value)}
                            className="sr-only"
                          />
                          {m.label}
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="nom" className="label text-text/50">
                        Votre nom
                      </label>
                      <input
                        id="nom"
                        type="text"
                        required
                        value={nom}
                        onChange={(e) => setNom(e.target.value)}
                        className={`mt-3 ${champ}`}
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="label text-text/50">
                        Votre email
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="vous@exemple.fr"
                        className={`mt-3 ${champ}`}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="label text-text/50">
                      Votre message
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={7}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={
                        motif === 'participer'
                          ? "Ce que vous faites, ce qui vous intéresse ici, ce que vous aimeriez y apporter."
                          : 'Votre question, aussi précise que possible.'
                      }
                      className={`mt-3 ${champ}`}
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-6">
                    <button
                      type="submit"
                      disabled={etat === 'envoi'}
                      className="label border-2 border-text px-8 py-4 hover:bg-text hover:text-bg disabled:opacity-50"
                    >
                      {etat === 'envoi' ? 'Envoi…' : 'Envoyer'}
                    </button>
                    {etat === 'erreur' ? (
                      <p className="text-base text-accent-primary">
                        L'envoi a échoué. Écrivez-nous directement à{' '}
                        <a href={`mailto:${CONTACT}`} className="underline">
                          {CONTACT}
                        </a>
                        .
                      </p>
                    ) : null}
                  </div>
              </form>

            </>
          )}
        </div>
      </section>

      {/* Participate */}
      <section className="bg-text text-bg">
        <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:py-28">
          <div className="grid gap-10 sm:grid-cols-12">
            <div className="sm:col-span-5">
              <p className="label opacity-70">Participer</p>
              <p className="font-heading mt-6 text-4xl uppercase leading-none sm:text-6xl">
                La porte est ouverte.
              </p>
            </div>
            <div className="sm:col-span-7">
              <ul className="space-y-4 text-base opacity-90">
                <li className="flex gap-3">
                  <span aria-hidden className="text-accent-primary">
                    —
                  </span>
                  <span>
                    Vous utilisez un des outils et quelque chose vous gêne :
                    dites-le, on veut l'entendre
                  </span>
                </li>
                <li className="flex gap-3">
                  <span aria-hidden className="text-accent-primary">
                    —
                  </span>
                  <span>
                    Vous avez un texte en tête pour la revue, même à l'état
                    d'idée : proposez-le
                  </span>
                </li>
                <li className="flex gap-3">
                  <span aria-hidden className="text-accent-primary">
                    —
                  </span>
                  <span>
                    Il manque un organe, vous savez le construire ou vous
                    voulez apprendre : venez
                  </span>
                </li>
              </ul>
              <p className="mt-8 text-base opacity-70">
                Et si votre idée n'entre dans aucune de ces trois lignes,
                écrivez quand même. On répond à tout le monde, et une bonne
                surprise vaut mieux qu'une case bien remplie.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
