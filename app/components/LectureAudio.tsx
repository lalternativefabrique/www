import { useEffect, useMemo, useRef } from 'react'
import { ArticlePlayer } from '@lalternative/editor/article'
import { readingAudio } from '@lalternative/vvaves-sdk-react'
import { signerLecture } from '@/server/lecture'

export function LectureAudio({ slug, lang = 'fr' }: { slug: string; lang?: 'fr' | 'en' }) {
  const place = useRef<HTMLDivElement>(null)
  const article = useRef<HTMLElement | null>(null)
  useEffect(() => {
    article.current = place.current?.closest('article') ?? null
  }, [])
  const audio = useMemo(
    () =>
      readingAudio(async () => {
        const lecture = await signerLecture({ data: { slug, lang } })
        if (!lecture) throw new Error('unavailable')
        return lecture
      }),
    [slug, lang],
  )
  return (
    <div ref={place} className="mt-10">
      <ArticlePlayer audio={audio} article={article} lang={lang} />
    </div>
  )
}
