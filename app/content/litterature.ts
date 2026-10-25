import type { Locale } from '@/lib/i18n'

export type Reference = { nom: string; role: Record<Locale, string>; url: string }
export type Rayon = { titre: Record<Locale, string>; references: ReadonlyArray<Reference> }

export const litterature: ReadonlyArray<Rayon> = [
  {
    titre: { fr: 'Mémoire des agents', en: 'Agent memory' },
    references: [
      { nom: 'Mem0', role: { fr: 'Mémoire pour agents IA', en: 'Memory for AI agents' }, url: 'https://docs.mem0.ai/' },
      { nom: 'Supermemory', role: { fr: 'Infrastructure de mémoire', en: 'Memory infrastructure' }, url: 'https://supermemory.ai/' },
      { nom: 'Hindsight', role: { fr: 'Mémoire agentique', en: 'Agentic memory' }, url: 'https://github.com/vectorize-io/hindsight' },
      { nom: 'OpenViking', role: { fr: 'Gestion du contexte agentique', en: 'Agentic context management' }, url: 'https://github.com/volcengine/OpenViking' },
      { nom: 'Honcho', role: { fr: 'Mémoire et modélisation des utilisateurs', en: 'Memory and user modelling' }, url: 'https://github.com/plastic-labs/honcho' },
      { nom: 'LangChain Deep Agents', role: { fr: "Architecture d'agents", en: 'Agent architecture' }, url: 'https://docs.langchain.com/oss/python/deepagents/overview' },
    ],
  },
  {
    titre: { fr: 'Protocoles et sécurité des agents', en: 'Agent protocols and security' },
    references: [
      { nom: 'A2A', role: { fr: 'Protocole agent à agent', en: 'Agent-to-Agent protocol' }, url: 'https://a2a-protocol.org/dev/specification/' },
      { nom: 'OpenFGA', role: { fr: 'Autorisations', en: 'Authorization' }, url: 'https://openfga.dev/docs/concepts' },
      { nom: 'Open Policy Agent', role: { fr: 'Politiques de sécurité', en: 'Security policies' }, url: 'https://www.openpolicyagent.org/docs' },
      { nom: 'SPIFFE', role: { fr: 'Identité des agents et services', en: 'Agent and service identity' }, url: 'https://spiffe.io/docs/latest/spiffe-specs/' },
      { nom: 'Biscuit', role: { fr: "Jetons d'autorisation", en: 'Authorization tokens' }, url: 'https://doc.biscuitsec.org/reference/specifications' },
      { nom: 'AuthZEN', role: { fr: 'Standardisation des autorisations', en: 'Authorization standard' }, url: 'https://openid.net/wg/authzen/specifications/' },
    ],
  },
]
