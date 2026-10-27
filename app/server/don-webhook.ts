import { createHmac, timingSafeEqual } from 'node:crypto'

const TOLERANCE_S = 5 * 60
const DON_PREFIX = 'don:'

export type Delivery = { type: string; sourceEventID: string; body: string }

/** Mirrors VerifyWebhookAt in packages/lungor/sdk-go/webhook.go. */
export function verifierLivraison(
  secret: string,
  headers: Headers,
  body: string,
  nowS = Math.floor(Date.now() / 1000),
): Delivery | null {
  if (!secret) return null

  const rawTS = headers.get('Lungor-Timestamp') ?? ''
  if (!/^\d+$/.test(rawTS)) return null
  if (Math.abs(nowS - Number(rawTS)) > TOLERANCE_S) return null

  const expected = Buffer.from(
    createHmac('sha256', secret).update(`${rawTS}.${body}`).digest('hex'),
  )
  const valide = (headers.get('Lungor-Signature') ?? '')
    .split(/\s+/)
    .some((candidate) => {
      const [version, digest] = candidate.split('=', 2)
      if (version !== 'v1' || !digest) return false
      const presented = Buffer.from(digest)
      return (
        presented.length === expected.length &&
        timingSafeEqual(presented, expected)
      )
    })
  if (!valide) return null

  return {
    type: headers.get('Lungor-Event') ?? '',
    sourceEventID: headers.get('Lungor-Source-Event-ID') ?? '',
    body,
  }
}

export function emailDuDonateur(d: Delivery): string | null {
  if (d.type !== 'subscription.activated') return null
  let externalUserID = ''
  try {
    externalUserID =
      (JSON.parse(d.body) as { data?: { ExternalUserID?: string } }).data
        ?.ExternalUserID ?? ''
  } catch {
    return null
  }
  if (!externalUserID.startsWith(DON_PREFIX)) return null
  return externalUserID.slice(DON_PREFIX.length) || null
}

const SUJET = 'Merci infiniment pour votre don 💛'

function corpsMerci(siteURL: string): string {
  const base = siteURL.replace(/\/$/, '')
  return `<!doctype html>
<html lang="fr"><body style="margin:0;background:#f6f3ee;font-family:Georgia,serif;color:#1d1d1b">
<div style="max-width:560px;margin:0 auto;padding:40px 24px">
<p style="font:600 12px/1 system-ui,sans-serif;letter-spacing:.08em;text-transform:uppercase;opacity:.7">Paiement réussi</p>
<h1 style="font-size:32px;line-height:1.15;margin:16px 0 24px">Merci infiniment.</h1>
<p style="font-size:17px;line-height:1.6">Bonjour,</p>
<p style="font-size:17px;line-height:1.6">Votre don est bien arrivé, et il va nous aider énormément.</p>
<p style="font-size:17px;line-height:1.6"><strong>Ce que votre geste rend possible.</strong> L'Alternative Fabrique fait tourner des applications sobres, éthiques et hébergées en Europe, sans publicité ni revente de données. Votre don paie d'abord ce qui les fait vivre : serveurs, stockage, envoi des e-mails. Au-delà, il nous permet de faire appel aux compétences dont le projet a besoin.</p>
<p style="font-size:17px;line-height:1.6"><strong>Rien n'est caché.</strong> Nos dépenses sont publiées chaque mois, chiffre par chiffre : vous pourrez voir où va votre contribution.</p>
<p style="margin:32px 0"><a href="${base}/couts" style="display:inline-block;border:2px solid #1d1d1b;padding:12px 24px;color:#1d1d1b;text-decoration:none;font:600 14px system-ui,sans-serif">Voir où va l'argent →</a></p>
<p style="font-size:17px;line-height:1.6">Chaque don, petit ou grand, nous rend un peu plus indépendants. Vous en faites partie désormais.</p>
<p style="font-size:17px;line-height:1.6">Avec toute notre gratitude,<br>L'équipe de L'Alternative Fabrique</p>
<hr style="border:0;border-top:1px solid #1d1d1b33;margin:32px 0">
<p style="font-size:14px;line-height:1.6;opacity:.8">Envie d'aller plus loin ? Vous pouvez aussi donner un peu de votre temps ou de votre savoir-faire : <a href="${base}/participer" style="color:#1d1d1b">participer au projet</a>.</p>
</div></body></html>`
}

export async function envoyerMerci(email: string, sourceEventID: string) {
  const apiKey = process.env.SPORE_API_KEY
  if (!apiKey) throw new Error('SPORE_API_KEY is not set: no thank-you mail can be sent.')

  const res = await fetch(
    `${(process.env.SPORE_API_URL ?? 'https://api.sporee.fr').replace(/\/$/, '')}/emails`,
    {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${apiKey}`,
        // Lungor delivers at least once; Spore replays its stored answer for a
        // key it has seen in the last 24h instead of sending a second mail.
        ...(sourceEventID ? { 'idempotency-key': `don-merci:${sourceEventID}` } : {}),
      },
      body: JSON.stringify({
        from: process.env.SPORE_FROM ?? 'noreply@lalter.org',
        to: [email],
        subject: SUJET,
        html: corpsMerci(process.env.PUBLIC_SITE_URL ?? 'https://lalter.org'),
      }),
    },
  )
  if (!res.ok) {
    throw new Error(`Spore refused the thank-you mail (${res.status}): ${await res.text()}`)
  }
}
