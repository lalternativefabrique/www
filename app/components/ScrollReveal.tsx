import { useEffect } from 'react'

const cibles = [
  'main section h1',
  'main section h2',
  'main section h3',
  'main section p',
  'main section dl',
  'main section ul > li',
  'main section ol > li',
  'main section .grid > *',
].join(',')

export function ScrollReveal({ chemin }: { chemin: string }) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const elements = Array.from(document.querySelectorAll<HTMLElement>(cibles)).filter(
      (el) => !el.closest('aside, [data-demo], .reveal') && el.getBoundingClientRect().top > window.innerHeight,
    )
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('is-visible')
          io.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -12% 0px' },
    )
    for (const el of elements) {
      const rang = el.parentElement ? Array.from(el.parentElement.children).indexOf(el) : 0
      el.style.transitionDelay = `${Math.min(rang, 5) * 70}ms`
      el.classList.add('reveal')
      io.observe(el)
    }
    return () => io.disconnect()
  }, [chemin])
  return null
}
