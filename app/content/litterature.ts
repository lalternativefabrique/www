import type { Locale } from '@/lib/i18n'

export type Reference = { nom: string; role: Record<Locale, string>; url: string }
export type Rayon = { titre: Record<Locale, string>; references: ReadonlyArray<Reference> }

export const litterature: ReadonlyArray<Rayon> = [
  {
    titre: { fr: 'Contexte et mémoire des agents', en: 'Agent context and memory' },
    references: [
      { nom: 'Effective Context Engineering for AI Agents', role: { fr: 'Construire le contexte des agents', en: 'Building agent context' }, url: 'https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents' },
      { nom: 'Context Windows', role: { fr: 'La fenêtre de contexte et ses limites', en: 'The context window and its limits' }, url: 'https://platform.claude.com/docs/en/build-with-claude/context-windows' },
      { nom: 'Context Editing', role: { fr: 'Retirer ce qui ne sert plus', en: 'Dropping what is no longer useful' }, url: 'https://platform.claude.com/docs/en/build-with-claude/context-editing' },
      { nom: 'Compaction', role: { fr: 'Compresser les anciennes conversations', en: 'Compressing older conversations' }, url: 'https://platform.claude.com/docs/en/build-with-claude/compaction' },
      { nom: 'Memory Tool', role: { fr: "Une mémoire qui dure d'une session à l'autre", en: 'Memory that persists across sessions' }, url: 'https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool' },
      { nom: 'Prompt Caching', role: { fr: 'Réutiliser le contexte pour réduire les coûts', en: 'Reusing context to cut costs' }, url: 'https://platform.claude.com/docs/en/build-with-claude/prompt-caching' },
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
