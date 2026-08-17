/**
 * The spoken version of an article, offered above the prose.
 *
 * The browser's own player, not a written one: it brings the progress bar, the
 * seek, the playback rate and the keyboard handling that a custom component
 * would have to earn back, and it costs no JavaScript on a site that ships
 * almost none. What is styled is the frame around it.
 *
 * Rendered only when the audio exists, so an article published before its
 * narration — or one whose reading failed — shows nothing rather than a control
 * that does not work.
 */
export function LectureAudio({
  src,
  lang = 'fr',
}: {
  src: string
  lang?: 'fr' | 'en'
}) {
  const t = lang === 'en' ? EN : FR

  return (
    <section className="mt-10 border-2 border-text p-5" aria-label={t.region}>
      <p className="label text-text/60">{t.kicker}</p>
      <audio
        controls
        preload="none"
        src={src}
        className="mt-4 w-full"
      >
        {t.fallback}
      </audio>
    </section>
  )
}

const FR = {
  region: "Lecture audio de l'article",
  kicker: 'Écouter cet article',
  fallback: "Votre navigateur ne permet pas d'écouter cet article.",
}

const EN = {
  region: 'Audio version of this article',
  kicker: 'Listen to this article',
  fallback: 'Your browser cannot play this article.',
}
