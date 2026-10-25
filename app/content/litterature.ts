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
  {
    titre: { fr: "Messagerie — le protocole IMAP", en: "Email — the IMAP protocol" },
    references: [
      { nom: "RFC 9051 — IMAP4rev2", role: { fr: "Le standard actuel d'IMAP", en: "The current IMAP standard" }, url: 'https://www.rfc-editor.org/rfc/rfc9051.html' },
      { nom: "RFC 3501 — IMAP4rev1", role: { fr: "La version historique, pour la compatibilité", en: "The historic version, for compatibility" }, url: 'https://www.rfc-editor.org/rfc/rfc3501.html' },
      { nom: "IANA — Capacités IMAP", role: { fr: "Le registre des extensions annoncées", en: "The registry of announced extensions" }, url: 'https://www.iana.org/assignments/imap-capabilities/' },
    ],
  },
  {
    titre: { fr: "Messagerie — synchronisation", en: "Email — synchronisation" },
    references: [
      { nom: "RFC 2177 — IDLE", role: { fr: "Être prévenu des changements sans interroger", en: "Being told of changes without polling" }, url: 'https://www.rfc-editor.org/rfc/rfc2177.html' },
      { nom: "RFC 7162 — CONDSTORE et QRESYNC", role: { fr: "Synchroniser par incréments après une coupure", en: "Incremental resync after a disconnect" }, url: 'https://www.rfc-editor.org/rfc/rfc7162.html' },
      { nom: "RFC 4315 — UIDPLUS", role: { fr: "Manipuler les messages par identifiant", en: "Handling messages by identifier" }, url: 'https://www.rfc-editor.org/rfc/rfc4315.html' },
      { nom: "RFC 6851 — MOVE", role: { fr: "Déplacer les messages entre dossiers", en: "Moving messages between folders" }, url: 'https://www.rfc-editor.org/rfc/rfc6851.html' },
    ],
  },
  {
    titre: { fr: "Messagerie — dossiers et recherche", en: "Email — folders and search" },
    references: [
      { nom: "RFC 6154 — SPECIAL-USE", role: { fr: "Reconnaître envoyés, brouillons, corbeille", en: "Recognising sent, drafts, trash" }, url: 'https://www.rfc-editor.org/rfc/rfc6154.html' },
      { nom: "RFC 5258 — LIST-EXTENDED", role: { fr: "Découvrir les dossiers et leurs propriétés", en: "Discovering folders and their properties" }, url: 'https://www.rfc-editor.org/rfc/rfc5258.html' },
      { nom: "RFC 5256 — SORT et THREAD", role: { fr: "Trier et regrouper les conversations", en: "Sorting and threading conversations" }, url: 'https://www.rfc-editor.org/rfc/rfc5256.html' },
      { nom: "RFC 5464 — METADATA", role: { fr: "Des métadonnées sur les dossiers", en: "Metadata on folders" }, url: 'https://www.rfc-editor.org/rfc/rfc5464.html' },
    ],
  },
  {
    titre: { fr: "Messagerie — authentification et sécurité", en: "Email — authentication and security" },
    references: [
      { nom: "RFC 7628 — OAuth pour SASL", role: { fr: "L'authentification moderne", en: "Modern authentication" }, url: 'https://www.rfc-editor.org/rfc/rfc7628.html' },
      { nom: "RFC 8314 — TLS", role: { fr: "Chiffrer les connexions de messagerie", en: "Encrypting mail connections" }, url: 'https://www.rfc-editor.org/rfc/rfc8314.html' },
      { nom: "RFC 4422 — SASL", role: { fr: "Le cadre d'authentification", en: "The authentication framework" }, url: 'https://www.rfc-editor.org/rfc/rfc4422.html' },
    ],
  },
  {
    titre: { fr: "Messagerie — format des e-mails", en: "Email — message format" },
    references: [
      { nom: "RFC 5322 — Internet Message Format", role: { fr: "La structure d'un e-mail", en: "The structure of an email" }, url: 'https://www.rfc-editor.org/rfc/rfc5322.html' },
      { nom: "RFC 2045 — MIME", role: { fr: "Encodage et pièces jointes", en: "Encoding and attachments" }, url: 'https://www.rfc-editor.org/rfc/rfc2045.html' },
      { nom: "RFC 2046 — Types MIME", role: { fr: "Texte, HTML, images et fichiers", en: "Text, HTML, images and files" }, url: 'https://www.rfc-editor.org/rfc/rfc2046.html' },
      { nom: "RFC 9755 — UTF-8 pour IMAP", role: { fr: "Les caractères internationaux", en: "International characters" }, url: 'https://www.rfc-editor.org/rfc/rfc9755.html' },
    ],
  },
  {
    titre: { fr: "Messagerie — envoi (SMTP)", en: "Email — sending (SMTP)" },
    references: [
      { nom: "RFC 5321 — SMTP", role: { fr: "Le transport entre serveurs", en: "Transport between servers" }, url: 'https://www.rfc-editor.org/rfc/rfc5321.html' },
      { nom: "RFC 6409 — Message Submission", role: { fr: "L'envoi depuis un client", en: "Sending from a client" }, url: 'https://www.rfc-editor.org/rfc/rfc6409.html' },
      { nom: "RFC 6531 — SMTPUTF8", role: { fr: "Les adresses internationales", en: "International addresses" }, url: 'https://www.rfc-editor.org/rfc/rfc6531.html' },
    ],
  },
  {
    titre: { fr: "Messagerie — pour aller plus loin", en: "Email — further reading" },
    references: [
      { nom: "IMAP.org", role: { fr: "La bibliothèque des standards", en: "The standards library" }, url: 'https://imap.org/library/' },
      { nom: "RFC Editor", role: { fr: "Le catalogue des RFC", en: "The RFC catalogue" }, url: 'https://www.rfc-editor.org/' },
      { nom: "Dovecot", role: { fr: "Serveur IMAP libre", en: "Open source IMAP server" }, url: 'https://doc.dovecot.org/' },
      { nom: "Cyrus IMAP", role: { fr: "Serveur de messagerie", en: "Mail server" }, url: 'https://www.cyrusimap.org/' },
    ],
  },
]
