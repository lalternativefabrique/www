export type CoutsLigne = {
  name: string
  catalog_cents: number
  llm_cents: number
  staff_cents: number
  total_cents: number
}

export type CoutsPoste = CoutsLigne & { category: string; app: string }

export type Couts = {
  tenant: { name: string; slug: string }
  month: string
  months: string[]
  currency: string
  totals: { catalog_cents: number; llm_cents: number; staff_cents: number; total_cents: number }
  apps: CoutsLigne[]
  items: CoutsPoste[]
}

const MOIS = /^\d{4}-(0[1-9]|1[0-2])$/

export function moisValide(value: unknown): string | undefined {
  return typeof value === 'string' && MOIS.test(value) ? value : undefined
}

function cents(value: unknown): number | null {
  return typeof value === 'number' && Number.isInteger(value) ? value : null
}

function ligne(value: unknown): CoutsLigne | null {
  if (!value || typeof value !== 'object') return null
  const v = value as Record<string, unknown>
  const catalog = cents(v.catalog_cents)
  const llm = cents(v.llm_cents)
  const staff = v.staff_cents === undefined ? 0 : cents(v.staff_cents)
  const total = cents(v.total_cents)
  if (typeof v.name !== 'string' || catalog === null || llm === null || staff === null || total === null) {
    return null
  }
  return { name: v.name, catalog_cents: catalog, llm_cents: llm, staff_cents: staff, total_cents: total }
}

function poste(value: unknown): CoutsPoste | null {
  const base = ligne(value)
  if (!base) return null
  const v = value as Record<string, unknown>
  if (typeof v.category !== 'string' || typeof v.app !== 'string') return null
  return { ...base, category: v.category, app: v.app }
}

export function parseCouts(value: unknown): Couts | null {
  if (!value || typeof value !== 'object') return null
  const v = value as Record<string, unknown>
  const tenant = v.tenant as Record<string, unknown> | undefined
  const month = moisValide(v.month)
  if (
    !tenant ||
    typeof tenant.name !== 'string' ||
    typeof tenant.slug !== 'string' ||
    !month ||
    !Array.isArray(v.months) ||
    !Array.isArray(v.apps) ||
    typeof v.currency !== 'string'
  ) {
    return null
  }
  const totals = ligne({ name: '', ...(v.totals as object) })
  const apps = v.apps.map(ligne)
  const items = Array.isArray(v.items) ? v.items.map(poste) : []
  if (!totals || apps.some((a) => a === null) || items.some((i) => i === null)) return null
  return {
    tenant: { name: tenant.name, slug: tenant.slug },
    month,
    months: v.months.filter((m): m is string => moisValide(m) !== undefined),
    currency: v.currency,
    totals: {
      catalog_cents: totals.catalog_cents,
      llm_cents: totals.llm_cents,
      staff_cents: totals.staff_cents,
      total_cents: totals.total_cents,
    },
    apps: apps as CoutsLigne[],
    items: items as CoutsPoste[],
  }
}

export function formatMontant(cents: number, currency: string, locale: string): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(cents / 100)
}

export function formatMois(month: string, locale: string): string {
  const [y, m] = month.split('-').map(Number)
  return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(Date.UTC(y, m - 1, 1)),
  )
}

export type Besoin = { function: string; covers: string; expects: string }

export function parseBesoins(value: unknown): Besoin[] | null {
  if (!value || typeof value !== 'object') return null
  const needs = (value as Record<string, unknown>).needs
  if (!Array.isArray(needs)) return null
  const out: Besoin[] = []
  for (const n of needs) {
    if (!n || typeof n !== 'object') return null
    const { function: fn, covers, expects } = n as Record<string, unknown>
    if (typeof fn !== 'string' || typeof covers !== 'string' || typeof expects !== 'string') return null
    out.push({ function: fn, covers, expects })
  }
  return out
}
