import { useState } from 'react'
import { useRouter } from '@tanstack/react-router'
import { publishArticle } from '@/server/publish'
import { previewMarkdown } from '@/server/preview'

/**
 * The publishing screen: paste or load markdown, fill in what the frontmatter
 * needs, publish.
 *
 * Publishing writes the sources to the bucket and nothing else — the article is
 * live as soon as the write returns. There is no editor state to keep: the
 * source in the textarea is what gets written, verbatim.
 */

const ORGANES = ['Connaissance', 'Technique', 'Création', 'Financement', 'Communication']

export type EditeurProps = {
  /** Bucket directory. Fixed when editing, derived from the slug when new. */
  dir?: string
  fr?: string
  en?: string
}

export function EditeurArticle({ dir: dirInitial, fr: frInitial = '', en: enInitial = '' }: EditeurProps) {
  const router = useRouter()
  const [dir, setDir] = useState(dirInitial ?? '')
  const [fr, setFr] = useState(frInitial)
  const [en, setEn] = useState(enInitial)
  const [langue, setLangue] = useState<'fr' | 'en'>('fr')
  const [apercu, setApercu] = useState('')
  const [erreur, setErreur] = useState('')
  const [busy, setBusy] = useState(false)

  const source = langue === 'fr' ? fr : en
  const setSource = langue === 'fr' ? setFr : setEn

  async function charger(file: File) {
    setSource(await file.text())
    setErreur('')
  }

  async function voirApercu() {
    setBusy(true)
    setErreur('')
    try {
      const res = await previewMarkdown({ data: { source, lang: langue } })
      if (!res.ok) {
        setErreur(res.error)
        setApercu('')
      } else {
        setApercu(res.html)
      }
    } finally {
      setBusy(false)
    }
  }

  async function publier() {
    setBusy(true)
    setErreur('')
    try {
      const res = await publishArticle({ data: { dir, fr, en: en.trim() || undefined } })
      if (!res.ok) {
        setErreur(res.reason)
        return
      }
      await router.invalidate()
      await router.navigate({ to: '/admin/articles' })
    } catch (err) {
      setErreur(err instanceof Error ? err.message : String(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-white">
            {dirInitial ? 'Modifier un article' : 'Publier un article'}
          </h1>
          <p className="mt-1 text-sm text-white/50">
            Collez du markdown ou chargez un fichier. Le frontmatter en tête est
            lu tel quel.
          </p>
        </div>
        <div className="flex gap-2">
          {(['fr', 'en'] as const).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => {
                setLangue(l)
                setApercu('')
              }}
              className={`rounded-md px-3 py-1.5 text-sm ${
                langue === l
                  ? 'bg-white text-neutral-900'
                  : 'border border-white/20 text-white/70 hover:bg-white/10'
              }`}
            >
              {l.toUpperCase()}
              {l === 'en' && !en.trim() ? ' —' : ''}
            </button>
          ))}
        </div>
      </div>

      <label className="block">
        <span className="text-sm text-white/60">Dossier dans le bucket</span>
        <input
          value={dir}
          onChange={(e) => setDir(e.target.value)}
          disabled={Boolean(dirInitial)}
          placeholder="independance-productive"
          className="mt-1 w-full max-w-sm rounded-md border border-white/20 bg-transparent px-3 py-2 text-sm text-white placeholder:text-white/30 disabled:opacity-50"
        />
        <span className="mt-1 block text-xs text-white/40">
          Minuscules et tirets. Reste stable si le titre change.
        </span>
      </label>

      <div className="flex flex-wrap items-center gap-3">
        <label className="cursor-pointer rounded-md border border-white/20 px-3 py-1.5 text-sm text-white hover:bg-white/10">
          Charger un fichier
          <input
            type="file"
            accept=".md,.mdx,text/markdown"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) void charger(file)
            }}
          />
        </label>
        <button
          type="button"
          onClick={voirApercu}
          disabled={busy || !source.trim()}
          className="rounded-md border border-white/20 px-3 py-1.5 text-sm text-white hover:bg-white/10 disabled:opacity-50"
        >
          Aperçu
        </button>
        <button
          type="button"
          onClick={publier}
          disabled={busy || !fr.trim() || !dir.trim()}
          className="rounded-md bg-white px-4 py-1.5 text-sm font-medium text-neutral-900 hover:bg-white/90 disabled:opacity-50"
        >
          {busy ? 'Publication…' : 'Publier'}
        </button>
        <span className="text-xs text-white/40">
          Organes : {ORGANES.join(', ')}
        </span>
      </div>

      {erreur ? (
        <p className="rounded-md border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {erreur}
        </p>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <textarea
          value={source}
          onChange={(e) => {
            setSource(e.target.value)
            setApercu('')
          }}
          spellCheck={false}
          placeholder={`---\nslug: mon-article\ntitre: "Le titre"\nchapeau: "Le résumé."\norgane: Technique\noutil: Spore\noutilUrl: https://sporee.fr\ndate: 2026-08-14\nlecture: 5 min\n---\n\nLe premier paragraphe.`}
          className="h-[32rem] w-full rounded-lg border border-white/15 bg-neutral-950/60 p-4 font-mono text-sm leading-relaxed text-white/90 placeholder:text-white/25"
        />

        <div className="h-[32rem] overflow-y-auto rounded-lg border border-white/15 bg-white p-6">
          {apercu ? (
            <div dangerouslySetInnerHTML={{ __html: apercu }} />
          ) : (
            <p className="text-sm text-neutral-400">
              L'aperçu s'affiche ici. Il compile la source exactement comme le
              site le fera.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
