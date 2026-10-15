import { createServerFn } from '@tanstack/react-start'
import { moisValide, parseBesoins, parseCouts, type Besoin, type Couts } from '@/lib/couts'

const apiURL = process.env.LUNGOR_API_URL
const slug = process.env.LUNGOR_COSTS_SLUG

const TTL_MS = 5 * 60 * 1000
const cache = new Map<string, { at: number; value: Couts | null }>()

async function charger(month: string | undefined): Promise<Couts | null> {
  if (!apiURL || !slug) return null
  const url = new URL(`${apiURL.replace(/\/$/, '')}/public/costs/${encodeURIComponent(slug)}`)
  if (month) url.searchParams.set('month', month)
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) })
    if (res.status === 404) return null
    if (!res.ok) {
      console.error('lungor public costs failed', res.status)
      return null
    }
    const parsed = parseCouts(await res.json())
    if (!parsed) console.error('lungor public costs: unexpected payload')
    return parsed
  } catch (err) {
    console.error('lungor public costs unreachable', err)
    return null
  }
}

export const lireCouts = createServerFn({ method: 'GET' })
  .inputValidator((d: { mois?: string }) => ({ mois: moisValide(d.mois) }))
  .handler(async ({ data }): Promise<Couts | null> => {
    const key = data.mois ?? ''
    const hit = cache.get(key)
    if (hit && Date.now() - hit.at < TTL_MS) return hit.value
    const value = await charger(data.mois)
    cache.set(key, { at: Date.now(), value })
    return value
  })

const besoinsCache = new Map<string, { at: number; value: Besoin[] | null }>()

async function chargerBesoins(lang: 'fr' | 'en'): Promise<Besoin[] | null> {
  if (!apiURL || !slug) return null
  const url = new URL(`${apiURL.replace(/\/$/, '')}/public/needs/${encodeURIComponent(slug)}`)
  url.searchParams.set('lang', lang)
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) })
    if (res.status === 404) return null
    if (!res.ok) {
      console.error('lungor public needs failed', res.status)
      return null
    }
    const parsed = parseBesoins(await res.json())
    if (!parsed) console.error('lungor public needs: unexpected payload')
    return parsed
  } catch (err) {
    console.error('lungor public needs unreachable', err)
    return null
  }
}

export const lireBesoins = createServerFn({ method: 'GET' })
  .inputValidator((d: { lang?: string }) => ({ lang: d.lang === 'en' ? ('en' as const) : ('fr' as const) }))
  .handler(async ({ data }): Promise<Besoin[] | null> => {
    const hit = besoinsCache.get(data.lang)
    if (hit && Date.now() - hit.at < TTL_MS) return hit.value
    const value = await chargerBesoins(data.lang)
    besoinsCache.set(data.lang, { at: Date.now(), value })
    return value
  })
