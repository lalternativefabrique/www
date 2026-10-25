export const utilise: Record<string, ReadonlyArray<string>> = {
  Synthiz: ['Cortext', 'Spore', 'Skalpai', 'Lungor'],
  Spore: ['Skalpai'],
  Partage: ['Cortext', 'Spore', 'Skalpai', 'Lungor'],
  Messag: ['Spore', 'Skalpai'],
  "L'Alter": ['Cortext', 'Spore', 'Skalpai', 'Lungor'],
  Orbit: ["L'Alter", 'Messag', 'Spore'],
  Cortext: ['Spore', 'Skalpai'],
  Lungor: ['Spore', 'Skalpai'],
  Skalpai: ['Cortext', 'Spore'],
  Nakoda: ['Skalpai', 'Spore'],
  ark: ["L'Alter"],
}

export function utilisateursDe(nom: string): ReadonlyArray<string> {
  return Object.keys(utilise).filter((app) => utilise[app].includes(nom))
}
