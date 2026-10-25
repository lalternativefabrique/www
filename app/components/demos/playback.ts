import { useEffect, useState, type RefObject } from 'react'

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return reduced
}

export function useOnScreen(ref: RefObject<HTMLElement | null>): boolean {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.3 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref])
  return visible
}

export type Waiter = (ms: number) => Promise<void>

export function useLoop(
  playing: boolean,
  script: (wait: Waiter, isCancelled: () => boolean) => Promise<void>,
) {
  useEffect(() => {
    if (!playing) return
    let cancelled = false
    const timers: Array<ReturnType<typeof setTimeout>> = []
    const wait: Waiter = (ms) =>
      new Promise((resolve) => timers.push(setTimeout(resolve, ms)))
    const run = async () => {
      while (!cancelled) await script(wait, () => cancelled)
    }
    void run()
    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
    }
  }, [playing, script])
}

// A steady word cadence reads like a teleprompter; pausing after punctuation
// is what makes it read like something composing a sentence.
export function pauseAfter(word: string, base: number): number {
  if (/[.;:—]$/.test(word)) return base * 6
  if (/,$/.test(word)) return base * 3
  return base
}
