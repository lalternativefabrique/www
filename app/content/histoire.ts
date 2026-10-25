export type Etape = {
  app: string
  date: string
  commits?: number
  pourquoi?: string
  episode?: string
}

export const histoire: ReadonlyArray<Etape> = [
  { app: 'Synthiz', date: '2026-03-01', commits: 4356 },
  { app: 'Skalpai', date: '2026-03-09', commits: 3340 },
  { app: 'Spore', date: '2026-04-30', commits: 839 },
  { app: 'Lungor', date: '2026-05-22', commits: 2243 },
  { app: 'Partage', date: '2026-08-07', commits: 979 },
  { app: 'Messag', date: '2026-08-18', commits: 1738 },
  { app: "L'Alter", date: '2026-08-23', commits: 1622 },
  { app: 'Nakoda', date: '2026-09-26', commits: 309 },
  { app: 'Orbit', date: '2026-10-20' },
]
