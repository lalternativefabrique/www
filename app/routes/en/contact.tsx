import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/en/contact')({
  component: ContactPageEn,
  head: () =>
    seo({
      title: "Contact — L'Alternative Fabrique",
      description:
        'A question, or the urge to take part: write to us. One address, a real reply.',
      path: '/en/contact',
      locale: 'en',
      alternate: { fr: '/contact', en: '/en/contact' },
    }),
})

/**
 * The endpoint is injected at build time via VITE_CONTACT_URL so the form can
 * move to Spore (or any provider) without touching this component. With no
 * endpoint configured it degrades to a mailto: link rather than silently
 * dropping messages.
 */
const ENDPOINT = import.meta.env.VITE_CONTACT_URL as string | undefined
const CONTACT = 'contact@lalternativefabrique.org'

const motifs = [
  { value: 'participer', label: 'I want to take part' },
  { value: 'question', label: 'I have a question' },
] as const

type Etat = 'repos' | 'envoi' | 'ok' | 'erreur'

function ContactPageEn() {
  const [motif, setMotif] = useState<string>(motifs[0].value)
  const [nom, setNom] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [etat, setEtat] = useState<Etat>('repos')

  /**
   * With no endpoint configured, hand the filled-in message to the visitor's
   * mail client rather than hiding the form: nothing is silently dropped, and
   * setting VITE_CONTACT_URL later switches this to a direct POST.
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
    if (!ENDPOINT) {
      envoyerParMail()
      return
    }
    setEtat('envoi')
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ motif, nom, email, message }),
      })
      if (!res.ok) throw new Error(String(res.status))
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
          <p className="label text-text/60">Write</p>
          <h1 className="display-xl mt-6">Contact</h1>
          <p className="chapeau mt-8 max-w-2xl">
            A question about what we build, or the urge to get your hands in
            it. Either way, we read everything and we answer.
          </p>
        </div>
      </section>

      {/* Form */}
      <section>
        <div className="mx-auto w-full max-w-3xl px-6 py-16 sm:py-24">
          {etat === 'ok' ? (
            <div>
              <p className="font-heading text-4xl uppercase leading-tight text-accent-primary sm:text-5xl">
                Message received.
              </p>
              <p className="chapeau mt-6 text-text/80">
                {ENDPOINT
                  ? `We reply from ${CONTACT}. If nothing arrives within a few days, check your spam folder — then chase us.`
                  : `Your mail client has opened with the message ready. You still have to send it — otherwise it never reaches us.`}
              </p>
            </div>
          ) : (
            <>
              <form onSubmit={onSubmit} className="space-y-8">
                  <fieldset>
                    <legend className="label text-text/50">
                      You are writing to say
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
                        Your name
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
                        Your email
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className={`mt-3 ${champ}`}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="label text-text/50">
                      Your message
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={7}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={
                        motif === 'participer'
                          ? 'What you do, what draws you here, what you would like to bring.'
                          : 'Your question, as precise as you can make it.'
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
                      {etat === 'envoi' ? 'Sending…' : 'Send'}
                    </button>
                    {etat === 'erreur' ? (
                      <p className="text-base text-accent-primary">
                        Sending failed. Write to us directly at{' '}
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
              <p className="label opacity-70">Take part</p>
              <p className="font-heading mt-6 text-4xl uppercase leading-none sm:text-6xl">
                The door is open.
              </p>
            </div>
            <div className="sm:col-span-7">
              <ul className="space-y-4 text-base opacity-90">
                <li className="flex gap-3">
                  <span aria-hidden className="text-accent-primary">
                    —
                  </span>
                  <span>
                    You use one of the tools and something grates: say so, we
                    want to hear it
                  </span>
                </li>
                <li className="flex gap-3">
                  <span aria-hidden className="text-accent-primary">
                    —
                  </span>
                  <span>
                    You have a piece in mind for the review, even barely an
                    idea: pitch it
                  </span>
                </li>
                <li className="flex gap-3">
                  <span aria-hidden className="text-accent-primary">
                    —
                  </span>
                  <span>
                    An organ is missing, and you know how to build it or want
                    to learn: come along
                  </span>
                </li>
              </ul>
              <p className="mt-8 text-base opacity-70">
                And if your idea fits none of those three lines, write anyway.
                We answer everyone, and a good surprise beats a neatly ticked
                box.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
