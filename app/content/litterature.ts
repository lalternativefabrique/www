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
  {
    titre: { fr: "Délivrabilité — codes et retours SMTP", en: "Deliverability — SMTP status and bounces" },
    references: [
      { nom: "RFC 3463 — Enhanced Status Codes", role: { fr: "Les codes d'état détaillés", en: "Detailed status codes" }, url: 'https://www.rfc-editor.org/rfc/rfc3463.html' },
      { nom: "RFC 3464 — DSN", role: { fr: "Les avis de non-remise", en: "Delivery status notifications" }, url: 'https://www.rfc-editor.org/rfc/rfc3464.html' },
    ],
  },
  {
    titre: { fr: "Délivrabilité — authentification", en: "Deliverability — authentication" },
    references: [
      { nom: "RFC 7208 — SPF", role: { fr: "Les serveurs autorisés à envoyer", en: "Servers allowed to send" }, url: 'https://www.rfc-editor.org/rfc/rfc7208.html' },
      { nom: "RFC 6376 — DKIM", role: { fr: "La signature des messages", en: "Message signing" }, url: 'https://www.rfc-editor.org/rfc/rfc6376.html' },
      { nom: "RFC 7489 — DMARC", role: { fr: "La politique et les rapports", en: "Policy and reporting" }, url: 'https://www.rfc-editor.org/rfc/rfc7489.html' },
      { nom: "RFC 8601 — Authentication-Results", role: { fr: "Le résultat des vérifications", en: "Verification results" }, url: 'https://www.rfc-editor.org/rfc/rfc8601.html' },
      { nom: "RFC 8617 — ARC", role: { fr: "L'authentification à travers les relais", en: "Authentication across forwarders" }, url: 'https://www.rfc-editor.org/rfc/rfc8617.html' },
    ],
  },
  {
    titre: { fr: "Délivrabilité — DNS", en: "Deliverability — DNS" },
    references: [
      { nom: "RFC 1034", role: { fr: "Les concepts du DNS", en: "DNS concepts" }, url: 'https://www.rfc-editor.org/rfc/rfc1034.html' },
      { nom: "RFC 1035", role: { fr: "L'implémentation du DNS", en: "DNS implementation" }, url: 'https://www.rfc-editor.org/rfc/rfc1035.html' },
      { nom: "RFC 1912", role: { fr: "Les erreurs de configuration courantes", en: "Common configuration errors" }, url: 'https://www.rfc-editor.org/rfc/rfc1912.html' },
      { nom: "RFC 2181", role: { fr: "Les clarifications", en: "Clarifications" }, url: 'https://www.rfc-editor.org/rfc/rfc2181.html' },
    ],
  },
  {
    titre: { fr: "Délivrabilité — transport chiffré", en: "Deliverability — encrypted transport" },
    references: [
      { nom: "RFC 3207 — STARTTLS", role: { fr: "Chiffrer entre serveurs", en: "Encrypting between servers" }, url: 'https://www.rfc-editor.org/rfc/rfc3207.html' },
      { nom: "RFC 8461 — MTA-STS", role: { fr: "Imposer le chiffrement", en: "Enforcing encryption" }, url: 'https://www.rfc-editor.org/rfc/rfc8461.html' },
      { nom: "RFC 8460 — TLS-RPT", role: { fr: "Les rapports de chiffrement", en: "Encryption reports" }, url: 'https://www.rfc-editor.org/rfc/rfc8460.html' },
      { nom: "RFC 7672 — DANE", role: { fr: "Le chiffrement ancré dans le DNS", en: "DNS-anchored encryption" }, url: 'https://www.rfc-editor.org/rfc/rfc7672.html' },
    ],
  },
  {
    titre: { fr: "Délivrabilité — Gmail", en: "Deliverability — Gmail" },
    references: [
      { nom: "Google — Email Sender Guidelines", role: { fr: "Les règles des expéditeurs", en: "Sender rules" }, url: 'https://support.google.com/mail/answer/81126?hl=fr' },
      { nom: "Google — FAQ expéditeurs", role: { fr: "Les questions fréquentes", en: "Frequently asked questions" }, url: 'https://support.google.com/mail/answer/14229414?hl=fr' },
      { nom: "Google — Postmaster Tools", role: { fr: "Suivre sa réputation", en: "Tracking your reputation" }, url: 'https://postmaster.google.com/' },
      { nom: "Google — Documentation Postmaster", role: { fr: "Lire les indicateurs", en: "Reading the metrics" }, url: 'https://support.google.com/mail/answer/9981691?hl=fr' },
    ],
  },
  {
    titre: { fr: "Délivrabilité — Outlook", en: "Deliverability — Outlook" },
    references: [
      { nom: "Microsoft — gros volumes", role: { fr: "Les exigences pour les gros expéditeurs", en: "Requirements for high-volume senders" }, url: 'https://techcommunity.microsoft.com/blog/microsoftdefenderforoffice365blog/strengthening-email-ecosystem-outlook%E2%80%99s-new-requirements-for-high%E2%80%90volume-senders/4399730' },
      { nom: "Microsoft — Sender Support", role: { fr: "Le support des expéditeurs", en: "Sender support" }, url: 'https://sendersupport.olc.protection.outlook.com/' },
      { nom: "Microsoft — SNDS", role: { fr: "Les données de réputation", en: "Reputation data" }, url: 'https://sendersupport.olc.protection.outlook.com/snds/' },
      { nom: "Microsoft — JMRP", role: { fr: "Le retour des plaintes", en: "Complaint feedback" }, url: 'https://sendersupport.olc.protection.outlook.com/snds/JMRP.aspx' },
    ],
  },
  {
    titre: { fr: "Délivrabilité — Yahoo", en: "Deliverability — Yahoo" },
    references: [
      { nom: "Yahoo — Sender Hub", role: { fr: "L'espace expéditeurs", en: "The sender hub" }, url: 'https://senders.yahooinc.com/' },
      { nom: "Yahoo — Best Practices", role: { fr: "Les bonnes pratiques", en: "Best practices" }, url: 'https://senders.yahooinc.com/best-practices/' },
      { nom: "Yahoo — FAQ", role: { fr: "Les questions fréquentes", en: "Frequently asked questions" }, url: 'https://senders.yahooinc.com/faqs/' },
    ],
  },
  {
    titre: { fr: "Délivrabilité — réputation et abus", en: "Deliverability — reputation and abuse" },
    references: [
      { nom: "Spamhaus", role: { fr: "Documentation officielle", en: "Official documentation" }, url: 'https://docs.spamhaus.com/' },
      { nom: "Spamhaus — Removal Center", role: { fr: "Sortir d'une liste de blocage", en: "Getting off a blocklist" }, url: 'https://check.spamhaus.org/' },
      { nom: "AbuseIPDB", role: { fr: "Les signalements d'adresses IP", en: "IP address reports" }, url: 'https://www.abuseipdb.com/' },
      { nom: "RFC 6647 — Greylisting", role: { fr: "Le rejet temporaire", en: "Temporary rejection" }, url: 'https://www.rfc-editor.org/rfc/rfc6647.html' },
      { nom: "RFC 5965 — ARF", role: { fr: "Le format des signalements", en: "Abuse report format" }, url: 'https://www.rfc-editor.org/rfc/rfc5965.html' },
      { nom: "RFC 6650 — Feedback Reports", role: { fr: "Les retours de plaintes", en: "Complaint feedback" }, url: 'https://www.rfc-editor.org/rfc/rfc6650.html' },
    ],
  },
  {
    titre: { fr: "Délivrabilité — désabonnement et listes", en: "Deliverability — unsubscribe and lists" },
    references: [
      { nom: "RFC 8058 — One-Click Unsubscribe", role: { fr: "Le désabonnement en un clic", en: "One-click unsubscribe" }, url: 'https://www.rfc-editor.org/rfc/rfc8058.html' },
      { nom: "RFC 2369 — List commands", role: { fr: "Les commandes de liste", en: "List commands" }, url: 'https://www.rfc-editor.org/rfc/rfc2369.html' },
      { nom: "RFC 2919 — List-ID", role: { fr: "L'identifiant de liste", en: "List identifier" }, url: 'https://www.rfc-editor.org/rfc/rfc2919.html' },
      { nom: "RFC 3834 — Réponses automatiques", role: { fr: "Les réponses automatiques", en: "Automatic responses" }, url: 'https://www.rfc-editor.org/rfc/rfc3834.html' },
    ],
  },
  {
    titre: { fr: "Délivrabilité — serveurs SMTP", en: "Deliverability — SMTP servers" },
    references: [
      { nom: "Postfix", role: { fr: "Documentation officielle", en: "Official documentation" }, url: 'https://www.postfix.org/documentation.html' },
      { nom: "Exim", role: { fr: "Documentation officielle", en: "Official documentation" }, url: 'https://www.exim.org/docs.html' },
      { nom: "OpenSMTPD", role: { fr: "Documentation officielle", en: "Official documentation" }, url: 'https://www.opensmtpd.org/' },
      { nom: "Stalwart Mail Server", role: { fr: "Documentation officielle", en: "Official documentation" }, url: 'https://stalw.art/docs/' },
      { nom: "Rspamd", role: { fr: "Le filtrage du spam", en: "Spam filtering" }, url: 'https://docs.rspamd.com/' },
    ],
  },
  {
    titre: { fr: "Paiement — statut du prestataire", en: "Payments — provider status" },
    references: [
      { nom: "DSP2 — Directive (UE) 2015/2366", role: { fr: "La directive sur les services de paiement", en: "The payment services directive" }, url: 'https://eur-lex.europa.eu/eli/dir/2015/2366/oj?locale=fr' },
      { nom: "Code monétaire et financier", role: { fr: "Services et établissements de paiement (L.314-1, L.522-1)", en: "Payment services and institutions (L.314-1, L.522-1)" }, url: 'https://www.legifrance.gouv.fr/codes/texte_lc/LEGITEXT000006072026/' },
    ],
  },
  {
    titre: { fr: "Paiement — agrément", en: "Payments — authorisation" },
    references: [
      { nom: "ACPR — Établissement de paiement", role: { fr: "La procédure d'agrément", en: "The authorisation procedure" }, url: 'https://acpr.banque-france.fr/fr/professionnels/lacpr-vous-accompagne/banque/creer-ma-societe/mes-procedures/etablissement-de-paiement-et-prestataire-de-service-dinformation-sur-les-comptes' },
      { nom: "ACPR — Parcours Fintech", role: { fr: "L'accompagnement des projets", en: "Support for fintech projects" }, url: 'https://acpr.banque-france.fr/fr/professionnels/lacpr-vous-accompagne/parcours-fintech' },
      { nom: "EBA/GL/2017/09", role: { fr: "Les lignes directrices européennes d'agrément", en: "The European authorisation guidelines" }, url: 'https://www.eba.europa.eu/activities/single-rulebook/regulatory-activities/payment-services-and-electronic-money/guidelines-authorisation-and-registration-under-psd2' },
      { nom: "ACPR — Portail", role: { fr: "Le dépôt des dossiers", en: "Filing applications" }, url: 'https://acpr.banque-france.fr/fr/professionnels/vos-outils-et-services/portail-acpr' },
      { nom: "REGAFI", role: { fr: "Le registre des établissements autorisés", en: "The register of authorised institutions" }, url: 'https://www.regafi.fr/' },
    ],
  },
  {
    titre: { fr: "Paiement — fonds propres", en: "Payments — capital requirements" },
    references: [
      { nom: "Arrêté du 29 octobre 2009", role: { fr: "La réglementation prudentielle", en: "Prudential rules" }, url: 'https://www.legifrance.gouv.fr/loda/id/JORFTEXT000021218007' },
      { nom: "ACPR — Établissements de paiement", role: { fr: "Ce que le statut impose", en: "What the status requires" }, url: 'https://acpr.banque-france.fr/fr/professionnels/lacpr-vous-accompagne/parcours-fintech/contenus-pedagogiques/de-quel-statut-releve-mon-activite/en-savoir-plus-sur-les-etablissements-de-paiement' },
    ],
  },
  {
    titre: { fr: "Paiement — exécution", en: "Payments — execution" },
    references: [
      { nom: "Règlement (UE) 260/2012", role: { fr: "Virements et prélèvements SEPA", en: "SEPA credit transfers and direct debits" }, url: 'https://eur-lex.europa.eu/eli/reg/2012/260/oj?locale=fr' },
      { nom: "Règlement (UE) 2024/886", role: { fr: "Les virements instantanés", en: "Instant credit transfers" }, url: 'https://eur-lex.europa.eu/eli/reg/2024/886/oj?locale=fr' },
      { nom: "European Payments Council", role: { fr: "Les règles SEPA officielles", en: "The official SEPA rulebooks" }, url: 'https://www.europeanpaymentscouncil.eu/' },
    ],
  },
  {
    titre: { fr: "Paiement — sécurité et conformité", en: "Payments — security and compliance" },
    references: [
      { nom: "Règlement délégué (UE) 2018/389", role: { fr: "L'authentification forte", en: "Strong customer authentication" }, url: 'https://eur-lex.europa.eu/eli/reg_del/2018/389/oj?locale=fr' },
      { nom: "DORA — Règlement (UE) 2022/2554", role: { fr: "La résilience opérationnelle numérique", en: "Digital operational resilience" }, url: 'https://eur-lex.europa.eu/eli/reg/2022/2554/oj?locale=fr' },
      { nom: "Directive (UE) 2015/849", role: { fr: "La lutte contre le blanchiment", en: "Anti-money laundering" }, url: 'https://eur-lex.europa.eu/eli/dir/2015/849/oj?locale=fr' },
      { nom: "Règlement (UE) 2024/1624", role: { fr: "Blanchiment et financement du terrorisme", en: "Money laundering and terrorist financing" }, url: 'https://eur-lex.europa.eu/eli/reg/2024/1624/oj?locale=fr' },
      { nom: "RGPD — Règlement (UE) 2016/679", role: { fr: "La protection des données", en: "Data protection" }, url: 'https://eur-lex.europa.eu/eli/reg/2016/679/oj?locale=fr' },
    ],
  },
  {
    titre: { fr: "Paiement — normes des moyens de paiement", en: "Payments — payment standards" },
    references: [
      { nom: "PCI DSS", role: { fr: "La sécurité des données de carte", en: "Card data security" }, url: 'https://www.pcisecuritystandards.org/document_library/' },
      { nom: "EMVCo", role: { fr: "Les normes du paiement par carte", en: "Card payment standards" }, url: 'https://www.emvco.com/' },
      { nom: "ISO 20022", role: { fr: "La messagerie financière", en: "Financial messaging" }, url: 'https://www.iso20022.org/' },
    ],
  },
  {
    titre: { fr: "Plateforme — standards des conteneurs", en: "Platform — container standards" },
    references: [
      { nom: "Open Container Initiative", role: { fr: "Les spécifications officielles", en: "The official specifications" }, url: 'https://opencontainers.org/' },
      { nom: "OCI Runtime Specification", role: { fr: "L'exécution d'un conteneur", en: "Running a container" }, url: 'https://github.com/opencontainers/runtime-spec' },
      { nom: "OCI Image Specification", role: { fr: "Le format d'image", en: "The image format" }, url: 'https://github.com/opencontainers/image-spec' },
      { nom: "OCI Distribution Specification", role: { fr: "Les registres", en: "Registries" }, url: 'https://github.com/opencontainers/distribution-spec' },
      { nom: "OCI Runtime Tools", role: { fr: "Tester la conformité", en: "Conformance testing" }, url: 'https://github.com/opencontainers/runtime-tools' },
    ],
  },
  {
    titre: { fr: "Plateforme — exécution des conteneurs", en: "Platform — container runtime" },
    references: [
      { nom: "containerd", role: { fr: "Documentation officielle", en: "Official documentation" }, url: 'https://containerd.io/docs/' },
      { nom: "containerd — code source", role: { fr: "Le dépôt", en: "The repository" }, url: 'https://github.com/containerd/containerd' },
      { nom: "containerd — architecture", role: { fr: "Le fonctionnement interne", en: "Internal design" }, url: 'https://github.com/containerd/containerd/blob/main/docs/historical/design/architecture.md' },
      { nom: "containerd — Runtime V2", role: { fr: "Les shims", en: "Runtime shims" }, url: 'https://github.com/containerd/containerd/blob/main/docs/runtime-v2.md' },
      { nom: "containerd — API gRPC", role: { fr: "L'interface de contrôle", en: "The control API" }, url: 'https://github.com/containerd/containerd/tree/main/api' },
      { nom: "runc", role: { fr: "Le runtime OCI de référence", en: "The reference OCI runtime" }, url: 'https://github.com/opencontainers/runc' },
      { nom: "crun", role: { fr: "Un runtime OCI léger", en: "A lightweight OCI runtime" }, url: 'https://github.com/containers/crun' },
      { nom: "nerdctl", role: { fr: "Un client pour containerd", en: "A containerd client" }, url: 'https://github.com/containerd/nerdctl' },
    ],
  },
  {
    titre: { fr: "Plateforme — isolation Linux", en: "Platform — Linux isolation" },
    references: [
      { nom: "cgroups v2", role: { fr: "Limiter les ressources", en: "Limiting resources" }, url: 'https://docs.kernel.org/admin-guide/cgroup-v2.html' },
      { nom: "Namespaces", role: { fr: "Isoler les processus", en: "Isolating processes" }, url: 'https://man7.org/linux/man-pages/man7/namespaces.7.html' },
      { nom: "Seccomp", role: { fr: "Filtrer les appels système", en: "Filtering system calls" }, url: 'https://docs.kernel.org/userspace-api/seccomp_filter.html' },
      { nom: "Capabilities", role: { fr: "Découper les privilèges", en: "Splitting privileges" }, url: 'https://man7.org/linux/man-pages/man7/capabilities.7.html' },
      { nom: "OverlayFS", role: { fr: "Superposer les systèmes de fichiers", en: "Layering file systems" }, url: 'https://docs.kernel.org/filesystems/overlayfs.html' },
    ],
  },
  {
    titre: { fr: "Plateforme — construction des images", en: "Platform — building images" },
    references: [
      { nom: "BuildKit", role: { fr: "Le moteur de construction", en: "The build engine" }, url: 'https://github.com/moby/buildkit' },
      { nom: "Dockerfile", role: { fr: "La référence officielle", en: "The official reference" }, url: 'https://docs.docker.com/reference/dockerfile/' },
      { nom: "Buildx", role: { fr: "La construction avancée", en: "Advanced builds" }, url: 'https://docs.docker.com/build/' },
      { nom: "Buildpacks", role: { fr: "Construire sans Dockerfile", en: "Building without a Dockerfile" }, url: 'https://buildpacks.io/docs/' },
      { nom: "Buildah", role: { fr: "Construire des images OCI", en: "Building OCI images" }, url: 'https://github.com/containers/buildah' },
      { nom: "Skopeo", role: { fr: "Manipuler images et registres", en: "Handling images and registries" }, url: 'https://github.com/containers/skopeo' },
    ],
  },
  {
    titre: { fr: "Plateforme — orchestration", en: "Platform — orchestration" },
    references: [
      { nom: "Kubernetes", role: { fr: "Documentation officielle", en: "Official documentation" }, url: 'https://kubernetes.io/docs/' },
      { nom: "Kubernetes — API", role: { fr: "La référence de l'API", en: "API reference" }, url: 'https://kubernetes.io/docs/reference/kubernetes-api/' },
      { nom: "Kubernetes — CRI", role: { fr: "L'interface des runtimes", en: "The runtime interface" }, url: 'https://kubernetes.io/docs/concepts/containers/cri/' },
      { nom: "Kubernetes — Container Runtimes", role: { fr: "Les runtimes en production", en: "Runtimes in production" }, url: 'https://kubernetes.io/docs/setup/production-environment/container-runtimes/' },
      { nom: "Kubernetes — Controllers", role: { fr: "Les boucles de réconciliation", en: "Reconciliation loops" }, url: 'https://kubernetes.io/docs/concepts/architecture/controller/' },
      { nom: "Kubernetes — Jobs", role: { fr: "Les tâches ponctuelles", en: "One-off tasks" }, url: 'https://kubernetes.io/docs/concepts/workloads/controllers/job/' },
      { nom: "Kubernetes — RBAC", role: { fr: "Le contrôle d'accès", en: "Access control" }, url: 'https://kubernetes.io/docs/reference/access-authn-authz/rbac/' },
      { nom: "Helm", role: { fr: "Les déploiements empaquetés", en: "Packaged deployments" }, url: 'https://helm.sh/docs/' },
    ],
  },
  {
    titre: { fr: "Plateforme — CI/CD", en: "Platform — CI/CD" },
    references: [
      { nom: "Dagger", role: { fr: "Les pipelines en code", en: "Pipelines as code" }, url: 'https://docs.dagger.io/' },
      { nom: "Dagger — code source", role: { fr: "Le dépôt", en: "The repository" }, url: 'https://github.com/dagger/dagger' },
      { nom: "Tekton", role: { fr: "Les pipelines Kubernetes", en: "Kubernetes pipelines" }, url: 'https://tekton.dev/docs/' },
      { nom: "Argo Workflows", role: { fr: "Les workflows", en: "Workflows" }, url: 'https://argo-workflows.readthedocs.io/' },
      { nom: "Argo CD", role: { fr: "Le déploiement GitOps", en: "GitOps deployment" }, url: 'https://argo-cd.readthedocs.io/' },
      { nom: "GitHub Actions", role: { fr: "Documentation", en: "Documentation" }, url: 'https://docs.github.com/en/actions' },
      { nom: "OpenGitOps", role: { fr: "Les principes GitOps", en: "GitOps principles" }, url: 'https://opengitops.dev/' },
    ],
  },
  {
    titre: { fr: "Plateforme — OpenTelemetry", en: "Platform — OpenTelemetry" },
    references: [
      { nom: "OpenTelemetry", role: { fr: "Documentation officielle", en: "Official documentation" }, url: 'https://opentelemetry.io/docs/' },
      { nom: "Spécification", role: { fr: "Le standard", en: "The standard" }, url: 'https://opentelemetry.io/docs/specs/otel/' },
      { nom: "Logs", role: { fr: "Les journaux", en: "Logs" }, url: 'https://opentelemetry.io/docs/specs/otel/logs/' },
      { nom: "Metrics", role: { fr: "Les métriques", en: "Metrics" }, url: 'https://opentelemetry.io/docs/specs/otel/metrics/' },
      { nom: "Traces", role: { fr: "Les traces", en: "Traces" }, url: 'https://opentelemetry.io/docs/concepts/signals/traces/' },
      { nom: "Collector", role: { fr: "Collecter et router", en: "Collecting and routing" }, url: 'https://opentelemetry.io/docs/collector/' },
      { nom: "OTLP", role: { fr: "Le protocole", en: "The protocol" }, url: 'https://opentelemetry.io/docs/specs/otlp/' },
      { nom: "Semantic Conventions", role: { fr: "Nommer les données", en: "Naming the data" }, url: 'https://opentelemetry.io/docs/specs/semconv/' },
    ],
  },
  {
    titre: { fr: "Plateforme — logs, métriques et traces", en: "Platform — logs, metrics and traces" },
    references: [
      { nom: "Prometheus", role: { fr: "Les métriques", en: "Metrics" }, url: 'https://prometheus.io/docs/' },
      { nom: "Prometheus — formats", role: { fr: "L'exposition des métriques", en: "Exposition formats" }, url: 'https://prometheus.io/docs/instrumenting/exposition_formats/' },
      { nom: "Grafana Loki", role: { fr: "Les journaux", en: "Logs" }, url: 'https://grafana.com/docs/loki/latest/' },
      { nom: "Grafana Tempo", role: { fr: "Les traces distribuées", en: "Distributed traces" }, url: 'https://grafana.com/docs/tempo/latest/' },
      { nom: "Jaeger", role: { fr: "Le tracing distribué", en: "Distributed tracing" }, url: 'https://www.jaegertracing.io/docs/' },
      { nom: "Fluent Bit", role: { fr: "Collecter les journaux", en: "Collecting logs" }, url: 'https://docs.fluentbit.io/manual' },
      { nom: "Vector", role: { fr: "Le pipeline d'observabilité", en: "The observability pipeline" }, url: 'https://vector.dev/docs/' },
    ],
  },
  {
    titre: { fr: "Plateforme — eBPF", en: "Platform — eBPF" },
    references: [
      { nom: "eBPF", role: { fr: "Documentation officielle", en: "Official documentation" }, url: 'https://docs.ebpf.io/' },
      { nom: "Cilium", role: { fr: "Réseau et sécurité", en: "Networking and security" }, url: 'https://docs.cilium.io/' },
      { nom: "Hubble", role: { fr: "L'observabilité réseau", en: "Network observability" }, url: 'https://docs.cilium.io/en/stable/observability/hubble/' },
      { nom: "Pixie", role: { fr: "L'observabilité Kubernetes", en: "Kubernetes observability" }, url: 'https://docs.px.dev/' },
      { nom: "Inspektor Gadget", role: { fr: "Inspecter les conteneurs", en: "Inspecting containers" }, url: 'https://inspektor-gadget.io/docs/latest/' },
    ],
  },
  {
    titre: { fr: "Plateforme — sécurité et chaîne logicielle", en: "Platform — security and supply chain" },
    references: [
      { nom: "NIST SP 800-190", role: { fr: "La sécurité des conteneurs", en: "Container security" }, url: 'https://csrc.nist.gov/pubs/sp/800/190/final' },
      { nom: "SLSA", role: { fr: "Les niveaux de la chaîne logicielle", en: "Supply-chain levels" }, url: 'https://slsa.dev/spec/' },
      { nom: "Sigstore", role: { fr: "Signer et vérifier", en: "Signing and verifying" }, url: 'https://docs.sigstore.dev/' },
      { nom: "SPDX", role: { fr: "La nomenclature logicielle", en: "Software bill of materials" }, url: 'https://spdx.dev/specifications/' },
      { nom: "CycloneDX", role: { fr: "Le standard SBOM", en: "The SBOM standard" }, url: 'https://cyclonedx.org/specification/overview/' },
      { nom: "Trivy", role: { fr: "Les vulnérabilités", en: "Vulnerabilities" }, url: 'https://trivy.dev/docs/' },
      { nom: "Falco", role: { fr: "Les comportements suspects", en: "Suspicious behaviour" }, url: 'https://falco.org/docs/' },
      { nom: "Pod Security Standards", role: { fr: "La sécurité des pods", en: "Pod security" }, url: 'https://kubernetes.io/docs/concepts/security/pod-security-standards/' },
    ],
  },
  {
    titre: { fr: "Plateforme — réseau", en: "Platform — networking" },
    references: [
      { nom: "CNI", role: { fr: "Le réseau des conteneurs", en: "Container networking" }, url: 'https://www.cni.dev/docs/' },
      { nom: "CNI — spécification", role: { fr: "Le standard", en: "The standard" }, url: 'https://github.com/containernetworking/cni/blob/main/SPEC.md' },
      { nom: "Gateway API", role: { fr: "L'entrée du trafic", en: "Traffic ingress" }, url: 'https://gateway-api.sigs.k8s.io/' },
      { nom: "Envoy", role: { fr: "Le proxy réseau", en: "The network proxy" }, url: 'https://www.envoyproxy.io/docs/' },
    ],
  },
  {
    titre: { fr: "Plateforme — fiabilité", en: "Platform — reliability" },
    references: [
      { nom: "Site Reliability Engineering", role: { fr: "Le livre de Google", en: "The Google book" }, url: 'https://sre.google/sre-book/table-of-contents/' },
      { nom: "The Site Reliability Workbook", role: { fr: "La mise en pratique", en: "Putting it into practice" }, url: 'https://sre.google/workbook/table-of-contents/' },
      { nom: "Observability primer", role: { fr: "Les concepts de l'observabilité", en: "Observability concepts" }, url: 'https://opentelemetry.io/docs/concepts/observability-primer/' },
      { nom: "Resource Management", role: { fr: "Gérer les ressources", en: "Managing resources" }, url: 'https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/' },
    ],
  },
  {
    titre: { fr: 'Commercialisation — du produit au marché', en: 'Go-to-market — from product to market' },
    references: [
      { nom: "Do Things That Don't Scale — Paul Graham", role: { fr: 'Aller chercher les premiers utilisateurs un par un', en: 'Finding the first users one by one' }, url: 'https://paulgraham.com/ds.html' },
      { nom: 'The Mom Test — Rob Fitzpatrick', role: { fr: 'Parler des problèmes réels sans faire confirmer son idée', en: 'Talking about real problems without fishing for approval' }, url: 'https://www.momtestbook.com/' },
      { nom: 'Traction — Gabriel Weinberg et Justin Mares', role: { fr: "Tester les canaux d'acquisition avec méthode", en: 'Testing acquisition channels methodically' }, url: 'https://www.goodreads.com/book/show/22091581-traction' },
      { nom: 'Obviously Awesome — April Dunford', role: { fr: 'Situer un produit face aux solutions existantes', en: 'Positioning a product against existing solutions' }, url: 'https://www.aprildunford.com/books' },
      { nom: 'Pricing Low-Touch SaaS — Patrick McKenzie', role: { fr: "Construire des offres et des prix soutenables", en: 'Building sustainable plans and prices' }, url: 'https://stripe.com/guides/atlas/saas-pricing' },
    ],
  },
]
