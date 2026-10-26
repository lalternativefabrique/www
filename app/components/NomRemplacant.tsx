import type { Remplacement } from '@/content/remplacements'

export function NomRemplacant({ remplacement }: { remplacement: Remplacement }) {
  return remplacement.url ? (
    <a href={remplacement.url} className="underline decoration-accent-primary underline-offset-4 hover:text-accent-primary">
      {remplacement.apres}
    </a>
  ) : (
    <>{remplacement.apres}</>
  )
}
