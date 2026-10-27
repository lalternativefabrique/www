import { useState } from 'react'
import { useLocale } from '@/lib/i18n'

const libelles = {
  fr: { copier: 'Copier le lien de cette section', copie: 'Lien copié' },
  en: { copier: 'Copy the link to this section', copie: 'Link copied' },
}

export function LienSection({ ancre }: { ancre: string }) {
  const t = libelles[useLocale()]
  const [copie, setCopie] = useState(false)
  const libelle = copie ? t.copie : t.copier

  async function copier(event: React.MouseEvent<HTMLAnchorElement>) {
    if (!navigator.clipboard) return
    event.preventDefault()
    history.replaceState(null, '', `#${ancre}`)
    await navigator.clipboard.writeText(window.location.href)
    setCopie(true)
    setTimeout(() => setCopie(false), 2000)
  }

  return (
    <a
      href={`#${ancre}`}
      onClick={copier}
      aria-label={libelle}
      title={libelle}
      className="ml-3 inline-block align-middle text-[0.5em] leading-none no-underline opacity-40 transition-opacity hover:opacity-100 focus-visible:opacity-100"
    >
      {copie ? '✓' : '#'}
    </a>
  )
}
