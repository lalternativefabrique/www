/**
 * Editorial articles for the revue.
 *
 * Every factual claim here must be backed by the product code or docs.
 * Prices and costs come from `synthiz/docs/strategy/pricing-abonnement.md`.
 */

export type Bloc =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'quote'; text: string }
  | {
      type: 'image'
      src: string
      alt: string
      altEn?: string
      caption?: string
      width: number
      height: number
    }
  | { type: 'liste'; items: string[] }
  /** Figures belong in a table, not in prose. `accent` highlights our column. */
  | {
      type: 'tableau'
      colonnes: string[]
      lignes: string[][]
      accent?: number
      note?: string
    }

/**
 * The English version of an article.
 *
 * Optional per article: a piece with no `en` simply does not exist under /en,
 * so the revue can be translated one text at a time without the site ever
 * advertising a page that is not written yet.
 *
 * Everything else — date, organe, outil, reading time — is shared with the
 * French version and never duplicated here.
 */
export type ArticleEn = {
  slug: string
  titre: string
  chapeau: string
  organe: string
  blocs: Bloc[]
}

export type Article = {
  slug: string
  titre: string
  chapeau: string
  organe: string
  outil: string
  outilUrl: string
  date: string
  /** Only when the text was actually revised. Absent means never touched. */
  dateRevision?: string
  lecture: string
  illustration?: {
    src: string
    alt: string
    altEn?: string
  }
  blocs: Bloc[]
  en?: ArticleEn
}

export const articles: Article[] = [
  {
    slug: 'et-si-lia-etait-un-outil-democratique',
    titre: "Et si l'IA était un outil démocratique ?",
    chapeau:
      "Elle ne donne pas d'idées à ceux qui n'en ont pas. Elle permet à davantage de gens de transformer une intuition en projet — et c'est un déplacement plus profond qu'une révolution technique.",
    organe: 'Connaissance',
    outil: 'Synthiz',
    outilUrl: 'https://synthiz.com',
    date: '2026-07-30',
    lecture: '5 min',
    illustration: {
      src: '/images/articles/ia-outil-democratique.png',
      alt: "La concentration des moyens informatiques se fragmente progressivement pour devenir un accès partagé entre de nombreuses personnes.",
      altEn:
        'Concentrated computing resources gradually break apart to become shared access for many people.',
    },
    blocs: [
      {
        type: 'p',
        text: "L'intelligence artificielle est présentée comme une révolution technique. Elle pourrait être autre chose : un outil démocratique.",
      },
      {
        type: 'p',
        text: "Elle ne donne pas d'idées à ceux qui n'en ont pas. Elle permet à davantage de gens de transformer une intuition en projet, une ambition en action, une pensée imprécise en quelque chose de concret.",
      },
      { type: 'h2', text: 'Ce qui bloquait avant' },
      {
        type: 'p',
        text: "Longtemps, une idée restait bloquée par un manque de connaissances, de moyens ou de confiance. Il fallait savoir écrire, programmer, concevoir, structurer, communiquer — ou simplement connaître les bons codes. Beaucoup abandonnaient avant d'avoir commencé.",
      },
      {
        type: 'p',
        text: "L'IA abaisse une partie de ces barrières. Elle permet à qui ne programme pas de sortir un premier prototype. Elle aide qui doute de son écriture à formuler sa pensée. Elle accompagne qui a une vision sans savoir comment l'organiser.",
      },
      {
        type: 'quote',
        text: "Elle ne remplace pas le désir de faire. Elle lui donne un passage.",
      },
      {
        type: 'image',
        src: '/images/articles/ia-seuil-vers-prototype.png',
        alt: "Un mur de machines et de manuels se transforme progressivement en briques simples avec lesquelles plusieurs personnes construisent des prototypes.",
        altEn:
          'A wall of machines and manuals gradually becomes simple blocks that several people use to build prototypes.',
        caption: "Le seuil d'entrée se déplace : les outils deviennent manipulables, mais construire reste un travail.",
        width: 1536,
        height: 1024,
      },
      { type: 'h2', text: 'Ce que ça change, concrètement' },
      {
        type: 'p',
        text: "Les chiffres commencent à donner une idée de l'ampleur. Selon le baromètre semestriel de Bpifrance Le Lab publié en janvier 2026, 55 % des TPE et PME françaises déclarent recourir à l'IA générative, contre 31 % un an plus tôt et 15 % fin 2023. L'usage a plus que triplé en deux ans.",
      },
      {
        type: 'p',
        text: "Reste ce que ce total ne dit pas. Parmi les TPE et PME qui n'y recourent pas, 65 % déclarent simplement n'identifier aucun usage dans leur entreprise. Ni le prix, ni la technique : l'obstacle est de ne pas voir ce qu'on pourrait en faire. C'est exactement le mur dont il est question ici — celui qui arrête avant l'essai.",
      },
      {
        type: 'image',
        src: '/images/articles/ia-adoption-tpe-pme.svg',
        alt: "L'usage de l'IA générative dans les TPE et PME françaises passe de 15 % fin 2023 à 31 % en 2025 puis 55 % en janvier 2026. Parmi celles qui ne l'utilisent pas, 65 % disent ne pas identifier d'usage.",
        altEn:
          'Generative AI use among French small businesses rises from 15% at the end of 2023 to 31% in 2025 and 55% in January 2026. Among non-users, 65% say they cannot identify a use case.',
        caption: 'Source : Bpifrance Le Lab, baromètre semestriel, janvier 2026.',
        width: 1536,
        height: 900,
      },
      {
        type: 'p',
        text: "Ce déplacement ne se voit pas dans les cas spectaculaires qui circulent, mais dans des gestes ordinaires. L'artisan qui présente enfin correctement son activité. L'indépendant qui rédige ses propres documents. Le commerçant qui s'occupe de sa communication sans la sous-traiter.",
      },
      {
        type: 'p',
        text: "Aucun d'eux n'a acquis les compétences qui lui manquaient. Ils ont contourné un mur qui les arrêtait avant même l'essai.",
      },
      {
        type: 'p',
        text: "Il ne faut pas se mentir : une partie du travail disparaît vraiment. Ce qu'on payait cher hier — mettre en forme, traduire, rédiger, produire une première version — se fait aujourd'hui en quelques minutes. Ce n'est pas un travail transformé, c'est un travail supprimé.",
      },
      {
        type: 'p',
        text: "Ce qui s'ouvre à la place est une autre route. Le seuil d'entrée a baissé, les coûts avec lui : ce qui exigeait un budget se tente désormais pour presque rien. L'occasion n'est pas de faire pareil plus vite, mais de tenter ce qu'on s'interdisait.",
      },
      { type: 'h2', text: "Ce que ça ne change pas" },
      {
        type: 'p',
        text: "Ce qui disparaît, c'est l'exécution — pas le jugement. Créer un produit utile demande toujours de la persévérance et une compréhension réelle du problème. Écrire un bon texte demande une pensée. Construire exige des choix, des renoncements, du travail.",
      },
      {
        type: 'p',
        text: "Elle ne remplace pas les compétences : elle les démultiplie. Le corollaire est sévère. Sans expertise réelle, elle produit vite un travail passable. Le seuil qu'elle abaisse est celui de l'entrée, pas celui de l'excellence.",
      },
      {
        type: 'p',
        text: "Elle débloque en revanche quelque chose que personne n'avait : une capacité universelle à comprendre et à se faire comprendre. Lire un contrat, saisir un texte technique, formuler une demande dans les termes attendus, écrire dans une langue qu'on ne parle pas. Ce n'était pas une question de talent mais d'accès — et c'est cet accès qui vient de changer de main.",
      },
      {
        type: 'p',
        text: "L'IA déplace le point de départ, pas l'arrivée. Elle donne une prise à qui restait devant son idée sans savoir par où la saisir. Ce qui vient après reste entier.",
      },
      { type: 'h2', text: 'La réserve qui compte' },
      {
        type: 'p',
        text: "Rien de tout cela n'est acquis, parce que rien de tout cela ne nous appartient.",
      },
      {
        type: 'p',
        text: "Entraîner un modèle de fondation demande des capitaux, une puissance de calcul et une électricité que presque personne ne réunit. Le résultat est mécanique : une poignée d'acteurs décide de ce que ces outils savent faire, de ce qu'ils refusent, de leur prix et de leur disparition. Un instrument d'émancipation loué à un tiers qui peut en changer les règles du jour au lendemain reste un instrument de dépendance.",
      },
      {
        type: 'p',
        text: "Cette histoire a déjà eu lieu. Le logiciel libre n'a pas gagné en construisant des systèmes d'exploitation plus puissants que ceux des éditeurs — il a gagné en rendant les siens impossibles à confisquer. Personne ne peut retirer Linux du marché, ni en modifier la licence rétroactivement, ni décider qu'il coûtera le double l'an prochain.",
      },
      {
        type: 'p',
        text: "Le même partage se rejoue aujourd'hui, et il n'est pas perdu. Mistral publie les poids de Mistral Large 3 sous licence Apache 2.0 — un modèle de 675 milliards de paramètres, disponible sur Hugging Face, téléchargeable, exécutable chez soi, modifiable, sans redevance à l'usage. Ce ne sont pas des démonstrations : ce sont des modèles qu'on peut faire tourner sur sa propre infrastructure, et que personne ne peut reprendre.",
      },
      {
        type: 'p',
        text: "C'est la ligne de partage réelle. Pas entre l'IA et son absence, mais entre des outils qu'on utilise et des outils qu'on détient.",
      },
      { type: 'h2', text: "Ce qu'elle redonne" },
      {
        type: 'p',
        text: "Utilisée comme un outil d'émancipation, l'IA élargit le nombre de gens capables de produire, de comprendre et d'agir. Elle redonne de la valeur à l'idée elle-même.",
      },
      {
        type: 'p',
        text: "Pas l'idée parfaite, déjà maîtrisée et rentable. L'idée fragile, incomplète, maladroite — celle que son auteur n'aurait jamais osé poursuivre.",
      },
      {
        type: 'p',
        text: "L'IA est alors moins une machine qui remplace qu'un outil qui révèle. Elle ne fait pas disparaître nos limites. Elle aide à ne plus être seulement défini par elles.",
      },
      {
        type: 'p',
        text: "Peut-être est-ce le moyen qui manquait. Pas une arme contre quelqu'un — un outil que chacun peut prendre, à condition qu'il reste prenable. C'est toute la question, et elle ne se décide pas toute seule.",
      },
    ],
    en: {
      slug: 'what-if-ai-were-a-democratic-tool',
      titre: 'What if AI were a democratising force?',
      chapeau:
        'It does not create ideas where there are none. It lets more people turn an intuition into a project — and that shift runs deeper than any technical revolution.',
      organe: 'Knowledge',
      blocs: [
        {
          type: 'p',
          text: 'Artificial intelligence is sold as a technical revolution. It could be something else: a democratising force.',
        },
        {
          type: 'p',
          text: 'It does not create ideas where there are none. It lets more people turn an intuition into a project, an ambition into action, a vague thought into something concrete.',
        },
        { type: 'h2', text: 'What used to stand in the way' },
        {
          type: 'p',
          text: 'For a long time, an idea stalled for want of knowledge, means or confidence. You had to know how to write, code, design, structure, communicate — or simply know the right codes. Many gave up before starting.',
        },
        {
          type: 'p',
          text: 'AI lowers some of those barriers. It lets someone who cannot code ship a first prototype. It helps someone who doubts their writing put their thinking into words. It supports someone with a vision but no idea how to organise it.',
        },
        {
          type: 'quote',
          text: 'It does not replace the desire to make something. It gives that desire a way through.',
        },
        { type: 'h2', text: 'What it changes in practice' },
        {
          type: 'p',
          text: 'The figures are starting to show the scale. According to the half-yearly barometer from Bpifrance Le Lab published in January 2026, 55% of French micro-businesses and SMEs say they use generative AI, against 31% a year earlier and 15% at the end of 2023. Usage has more than tripled in two years.',
        },
        {
          type: 'p',
          text: 'What the headline number hides matters more. Among the micro-businesses and SMEs that do not use it, 65% simply say they see no use for it in their company. Not price, not technique: the obstacle is not seeing what you could do with it. That is precisely the wall in question here — the one that stops people before the attempt.',
        },
        {
          type: 'p',
          text: 'This shift is not visible in the spectacular cases doing the rounds, but in ordinary gestures. The craftsman who finally presents his trade properly. The freelancer who drafts her own documents. The shopkeeper who handles his own communication instead of farming it out.',
        },
        {
          type: 'p',
          text: 'None of them acquired the skills they lacked. They went around a wall that used to stop them before they even tried.',
        },
        {
          type: 'p',
          text: 'Let us not kid ourselves: some work really is disappearing. What cost a lot yesterday — formatting, translating, drafting, producing a first version — now takes minutes. That work is not transformed, it is deleted.',
        },
        {
          type: 'p',
          text: 'What opens up instead is another path. The barrier to entry has fallen, and costs with it: what once required a budget can now be attempted for almost nothing. The opportunity is not to do the same thing faster, but to try what you once ruled out.',
        },
        { type: 'h2', text: 'What it does not change' },
        {
          type: 'p',
          text: 'What disappears is execution — not judgement. Creating a useful product still takes persistence and a real grasp of the problem. Writing a good text takes thought. Building demands choices, sacrifices, work.',
        },
        {
          type: 'p',
          text: 'It does not replace skill: it multiplies it. The corollary is harsh. Without real expertise, it quickly produces passable work. The threshold it lowers is the one at the door, not the one at the top.',
        },
        {
          type: 'p',
          text: 'What it does unlock is something nobody had: a universal capacity to understand and to be understood. Reading a contract, grasping a technical text, framing a request in the expected terms, writing in a language you do not speak. That was never a matter of talent but of access — and access has just changed hands.',
        },
        {
          type: 'p',
          text: 'AI moves the starting point, not the finish. It gives a handhold to anyone left standing in front of their idea with no idea where to grip it. Everything that comes after remains untouched.',
        },
        { type: 'h2', text: 'The caveat that matters' },
        {
          type: 'p',
          text: 'None of this is secured, because none of this belongs to us.',
        },
        {
          type: 'p',
          text: 'Training a foundation model takes capital, computing power and electricity on a scale that almost nobody can muster. The result is inevitable: a handful of players decide what these tools can do, what they refuse to do, what they cost and when they disappear. An instrument of emancipation rented from a third party that can rewrite the rules overnight remains an instrument of dependence.',
        },
        {
          type: 'p',
          text: 'We have seen this story before. Free software did not win by building operating systems more powerful than the vendors’ — it won by making its own impossible to confiscate. Nobody can pull Linux off the market, or change its licence retroactively, or decide it will cost twice as much next year.',
        },
        {
          type: 'p',
          text: 'The same divide is playing out today, and it is not lost. Mistral publishes the weights of Mistral Large 3 under the Apache 2.0 licence — a 675-billion-parameter model, available on Hugging Face, downloadable, runnable at home, modifiable, with no usage fee. These are not demos: they are models you can run on your own infrastructure, and that nobody can take back.',
        },
        {
          type: 'p',
          text: 'That is the real dividing line. Not between AI and its absence, but between tools you use and tools you own.',
        },
        { type: 'h2', text: 'What it gives back' },
        {
          type: 'p',
          text: 'Used as a tool of emancipation, AI widens the circle of people able to produce, to understand and to act. It gives value back to the idea itself.',
        },
        {
          type: 'p',
          text: 'Not the perfect idea, already mastered and profitable. The fragile, unfinished, clumsy idea — the one its author would never have dared pursue.',
        },
        {
          type: 'p',
          text: 'AI is then less a machine that replaces than a tool that reveals. It does not make our limits disappear. It helps us stop being defined by them alone.',
        },
        {
          type: 'p',
          text: 'Perhaps this is what was missing. Not a weapon against anyone, but a tool anyone can pick up — provided it remains within reach. That is the whole question, and it will not answer itself.',
        },
      ],
    },
  },
  {
    slug: 'faire-de-lia-en-france-en-2026',
    titre: "Faire de l'IA en France, en 2026",
    chapeau:
      "On répète qu'il faut les modèles américains pour construire un produit sérieux. Nos outils tournent en France, du calcul au stockage — voici ce que ça permet, ce que ça coûte, et où ça bloque encore.",
    organe: 'Technique',
    outil: 'Techtuel',
    outilUrl: 'https://techtuel.com',
    date: '2026-07-29',
    lecture: '6 min',
    blocs: [
      {
        type: 'p',
        text: "Vous démarrez un produit qui a besoin d'IA. Vous ouvrez la documentation d'un des grands fournisseurs américains, vous branchez une clé, ça tourne en dix minutes. La question de l'hébergement ne se pose pas : elle a été tranchée avant que vous n'y pensiez.",
      },
      {
        type: 'p',
        text: "C'est le moment où l'on prend une décision d'architecture sans savoir qu'on la prend. Elle paraît réversible. Elle l'est de moins en moins à mesure que le produit grandit.",
      },
      {
        type: 'p',
        text: "Il y a pourtant une alternative, et elle fonctionne. Nous l'utilisons tous les jours.",
      },
      { type: 'h2', text: 'Ce que le catalogue français couvre' },
      {
        type: 'p',
        text: "Voici la chaîne complète sur laquelle tournent nos outils, sans exception :",
      },
      {
        type: 'liste',
        items: [
          'Reconnaissance vocale — Whisper large-v3-turbo, sur OVH AI Endpoints',
          'Modèles de langue — Mistral, hébergés en France',
          'Recherche sémantique — embeddings bge-m3, même infrastructure',
          'Stockage et calcul — OVH (Gravelines) et Scaleway (Paris)',
        ],
      },
      {
        type: 'p',
        text: "Transcription, traduction, synthèse, indexation sémantique. Ces quatre opérations composent l'essentiel de ce que font les produits réels — et elles sont toutes couvertes. Aucun appel ne sort de France, et ce n'est pas une feuille de route : c'est ce qui tourne pendant que vous lisez.",
      },
      { type: 'h2', text: 'Ce que ça coûte' },
      {
        type: 'p',
        text: "L'objection habituelle est le prix. Nos chiffres, mesurés en production : transcrire une heure d'audio coûte 0,046 €, la traduire 0,0047 €, une synthèse par modèle de langue une fraction de centime.",
      },
      {
        type: 'p',
        text: "À ces niveaux, l'écart entre fournisseurs ne décide de rien. Ce qui décide, c'est de connaître le coût réel d'une requête — et de pouvoir l'annoncer sans marge de sécurité.",
      },
      {
        type: 'p',
        text: "C'est un point qu'on sous-estime. Quand la facture d'infrastructure est opaque, le prix client se construit à l'aveugle, avec une provision pour l'incertitude. Quand elle est connue au centime, le tarif se calcule.",
      },
      { type: 'h2', text: 'Ce que ça rend possible' },
      {
        type: 'p',
        text: "Le point n'est pas de désigner un fournisseur plutôt qu'un autre. Il est qu'une option existe, ici, maintenant : on peut héberger ses services d'IA en France, faire tourner ses modèles de langue sur une infrastructure joignable, et construire un produit complet sans jamais sortir du pays.",
      },
      {
        type: 'p',
        text: "Ce n'était pas vrai il y a trois ans. Le catalogue était trop maigre, les modèles trop en retard, les endpoints trop instables. Aujourd'hui la chaîne tient de bout en bout, et elle tient en production.",
      },
      {
        type: 'p',
        text: "Cela change ce qu'on peut décider. Une entreprise qui traite des données sensibles n'a plus à choisir entre l'IA et sa conformité. Un éditeur qui veut savoir où partent les contenus de ses clients peut répondre précisément. Un indépendant peut monter un produit sans dépendre d'un fournisseur qu'il n'atteindra jamais.",
      },
      { type: 'h2', text: 'Où ça ne suffit pas' },
      {
        type: 'p',
        text: "Le catalogue disponible ici reste plus étroit. Les modèles les plus récents sortent ailleurs d'abord. Sur du raisonnement complexe, de la génération de code ou des tâches multimodales avancées, l'écart est réel et nous ne prétendons pas le contraire.",
      },
      {
        type: 'p',
        text: "Un bémol, tant qu'on y est : ce que vous utilisez pour travailler et ce qui tourne dans votre produit sont deux choses distinctes. Les meilleurs assistants de code sont américains, la plupart des développeurs les utilisent quotidiennement, et cet article n'y échappe pas. Ce choix-là n'engage que vous et se change en un après-midi.",
      },
      {
        type: 'p',
        text: "Ce qui tourne en production, à chaque requête de chaque utilisateur, engage votre architecture, vos coûts et vos données. C'est la seule décision qui mérite d'être prise consciemment.",
      },
      { type: 'h2', text: 'La question à se poser' },
      {
        type: 'p',
        text: "Avant de brancher une clé, une seule question : si ce fournisseur change ses règles demain, qu'est-ce qui s'arrête ?",
      },
      {
        type: 'p',
        text: "Si la réponse est « mon confort de travail », le sujet est mineur. Si c'est « mon produit », alors la décision méritait mieux qu'un réflexe. Construire en France n'est plus un sacrifice qu'on consent par principe : c'est un choix qui tient techniquement et économiquement. Encore faut-il l'examiner avant de le déclarer impossible.",
      },
    ],
    en: {
      slug: 'building-ai-in-france-in-2026',
      titre: 'Building AI in France in 2026',
      chapeau:
        'The received wisdom says you need American models to build a serious product. Our tools run in France, from compute to storage — here is what that allows, what it costs, and where it still falls short.',
      organe: 'Technique',
      blocs: [
        {
          type: 'p',
          text: 'You start a product that needs AI. You open the documentation of one of the big American providers, you plug in a key, it runs in ten minutes. The hosting question never comes up: it was settled before you thought to ask it.',
        },
        {
          type: 'p',
          text: 'That is the moment you make an architectural decision without knowing you are making one. It looks reversible. It becomes less and less so as the product grows.',
        },
        {
          type: 'p',
          text: 'There is an alternative, though, and it works. We use it every day.',
        },
        { type: 'h2', text: 'What the French catalogue covers' },
        {
          type: 'p',
          text: 'Here is the full chain our tools run on, without exception:',
        },
        {
          type: 'liste',
          items: [
            'Speech recognition — Whisper large-v3-turbo, on OVH AI Endpoints',
            'Language models — Mistral, hosted in France',
            'Semantic search — bge-m3 embeddings, same infrastructure',
            'Storage and compute — OVH (Gravelines) and Scaleway (Paris)',
          ],
        },
        {
          type: 'p',
          text: 'Transcription, translation, summarisation, semantic indexing. These four operations make up most of what real products actually do — and all four are covered. No call leaves France, and this is not a roadmap: it is what is running while you read.',
        },
        { type: 'h2', text: 'What it costs' },
        {
          type: 'p',
          text: 'The usual objection is price. Our figures, measured in production: transcribing an hour of audio costs €0.046, translating it €0.0047, a summary from a language model a fraction of a cent.',
        },
        {
          type: 'p',
          text: 'At those levels, the gap between providers is not what decides the matter. What matters is knowing the real cost of a request — and being able to quote it without a safety margin.',
        },
        {
          type: 'p',
          text: 'This point is underrated. When the infrastructure bill is opaque, customer pricing is guesswork, padded to cover uncertainty. When the cost is known to the cent, you can price the product precisely.',
        },
        { type: 'h2', text: 'What it makes possible' },
        {
          type: 'p',
          text: 'The point is not to crown one provider over another. It is that an option exists, here, now: you can host your AI services in France, run your language models on infrastructure you can actually reach, and build a complete product without ever leaving the country.',
        },
        {
          type: 'p',
          text: 'That was not true three years ago. The catalogue was too thin, the models too far behind, the endpoints too unstable. Today the chain holds end to end, and it holds in production.',
        },
        {
          type: 'p',
          text: 'That changes what you can decide. A company handling sensitive data no longer has to choose between AI and its compliance. A software vendor who wants to know where its customers’ content goes can answer precisely. An independent developer can build a product without depending on a provider they will never reach.',
        },
        { type: 'h2', text: 'Where it is not enough' },
        {
          type: 'p',
          text: 'The catalogue available here is still narrower. The newest models ship elsewhere first. On complex reasoning, code generation or advanced multimodal tasks, the gap is real and we will not pretend otherwise.',
        },
        {
          type: 'p',
          text: 'One caveat while we are at it: what you use in your own work and what runs inside your product are two different things. The best coding assistants are American, most developers use them daily, and this article is no exception. That choice affects only your own workflow and can be changed in an afternoon.',
        },
        {
          type: 'p',
          text: 'What runs in production, on every request from every user, binds your architecture, your costs and your data. It is the only decision that deserves to be made deliberately.',
        },
        { type: 'h2', text: 'The question to ask' },
        {
          type: 'p',
          text: 'Before you plug in a key, one question only: if this provider changes its rules tomorrow, what stops?',
        },
        {
          type: 'p',
          text: 'If the answer is “my working comfort”, the matter is minor. If it is “my product”, then the decision deserved better than a reflex. Building in France is no longer a sacrifice made on principle: it is a choice that holds up technically and economically. It just has to be examined before being declared impossible.',
        },
      ],
    },
  },
  {
    slug: 'attraper-les-mots-avant-quils-se-perdent',
    titre: "Attraper les mots avant qu'ils se perdent",
    chapeau:
      "Une conférence de deux heures, un podcast écouté en marchant, un rapport parcouru en diagonale. Tout a été dit, rien n'est retrouvable. Le son se dissipe ; le texte, lui, reste.",
    organe: 'Connaissance',
    outil: 'Synthiz',
    outilUrl: 'https://synthiz.com',
    date: '2026-07-30',
    lecture: '5 min',
    blocs: [
      {
        type: 'p',
        text: "Quelqu'un a dit exactement ce qu'il vous fallait. C'était dans une conférence, un podcast, une réunion enregistrée. Vous vous rappelez l'idée, à peu près. La phrase, non. Et vous n'allez pas réécouter deux heures d'audio pour retrouver quarante secondes.",
      },
      {
        type: 'p',
        text: "L'information a été produite, diffusée, entendue — et elle est perdue. Pas supprimée : inaccessible, ce qui revient au même.",
      },
      {
        type: 'p',
        text: "Ce n'est pas un défaut de mémoire. Ces contenus ne laissent aucune trace exploitable. Ils passent par des plateformes qui les gardent, les indexent pour elles, et ne vous rendent rien de réutilisable.",
      },
      { type: 'h2', text: 'Le son ne se cherche pas' },
      {
        type: 'p',
        text: "Un fichier audio est un bloc opaque. On ne peut pas le fouiller, en citer un passage, le recouper avec un autre document, ni vérifier qui a dit quoi. On peut seulement le réécouter, du début à la fin, à la vitesse où il a été enregistré.",
      },
      {
        type: 'p',
        text: "Le texte fait l'inverse. Il se cherche, s'annote, se cite, se relie. Il tient dans un index. Il survit à la disparition de la vidéo dont il est issu.",
      },
      {
        type: 'quote',
        text: "Transcrire n'est pas convertir un format. C'est faire passer une parole du statut de souvenir à celui de matière.",
      },
      { type: 'h2', text: 'Attraper ne suffit pas' },
      {
        type: 'p',
        text: "Un transcript isolé ne vaut pas grand-chose. Mille pages de texte brut posent le même problème que l'audio dont elles sortent : on ne sait pas où chercher.",
      },
      {
        type: 'p',
        text: "Ce qui rend une source utile, c'est ce qui vient après. Retrouver un passage sans se rappeler où on l'a lu. Rapprocher deux interventions qui disent la même chose autrement. Distinguer ce qu'on a soi-même noté de ce qu'on a seulement consulté.",
      },
      {
        type: 'p',
        text: "C'est ce que fait Synthiz : transformer ce que vous consultez en matière que vous possédez. Vos sources, vos notes, vos recoupements, organisés par vous plutôt que par l'algorithme d'une plateforme.",
      },
      { type: 'h2', text: 'Ce que ça change concrètement' },
      {
        type: 'liste',
        items: [
          'Retrouver une phrase entendue dans un podcast il y a six mois',
          'Recouper trois sources qui disent la même chose autrement',
          'Citer précisément au lieu de paraphraser de mémoire',
          'Garder ce qui compte quand la vidéo, elle, est supprimée',
        ],
      },
      {
        type: 'p',
        text: "Rien de spectaculaire. Simplement des idées qui ne se perdent plus.",
      },
      { type: 'h2', text: "Ce que ce n'est pas" },
      {
        type: 'p',
        text: "Ni un outil de veille automatique, ni un assistant qui lit à votre place. La lecture, le tri et le jugement restent votre travail. Synthiz garantit seulement que ce que vous avez lu reste atteignable.",
      },
      {
        type: 'p',
        text: "C'est le premier organe parce que c'est le préalable. On ne construit rien sur ce qu'on a oublié.",
      },
    ],
    en: {
      slug: 'catching-words-before-they-are-lost',
      titre: 'Catching words before they are lost',
      chapeau:
        "A two-hour conference, a podcast listened to while walking, a report skimmed in a hurry. Everything was captured, yet none of it can be found again. Sound disperses; text stays put.",
      organe: 'Knowledge',
      blocs: [
        {
          type: 'p',
          text: "Someone said exactly what you needed. It was in a talk, a podcast, a recorded meeting. You remember the idea, roughly. The sentence, no. And you are not going to sit through two hours of audio to recover forty seconds.",
        },
        {
          type: 'p',
          text: 'The information was produced, broadcast, heard — and it is lost. Not deleted: unreachable, which amounts to the same thing.',
        },
        {
          type: 'p',
          text: 'This is not a failure of memory. Such content leaves no usable trace. It runs through platforms that keep it, index it for themselves, and hand you back nothing you can reuse.',
        },
        { type: 'h2', text: 'Raw audio cannot be searched' },
        {
          type: 'p',
          text: 'An audio file is an opaque block. You cannot dig through it, quote a passage, cross-check it against another document, or verify who said what. You can only listen again, from start to finish, at the speed it was recorded.',
        },
        {
          type: 'p',
          text: 'Text does the opposite. It can be searched, annotated, quoted, linked. It fits in an index. It outlives the video it came from.',
        },
        {
          type: 'quote',
          text: 'Transcription does more than convert a format. It turns speech from something remembered into something you can work with.',
        },
        { type: 'h2', text: 'Catching is not enough' },
        {
          type: 'p',
          text: 'A transcript on its own is worth little. A thousand pages of raw text pose the same problem as the audio they came from: you do not know where to look.',
        },
        {
          type: 'p',
          text: 'What makes a source useful is what comes after. Finding a passage again without remembering where you read it. Bringing together two remarks that say the same thing differently. Telling apart what you noted yourself from what you merely skimmed.',
        },
        {
          type: 'p',
          text: 'That is what Synthiz does: it turns what you consult into material you own. Your sources, your notes, your cross-checks, organised by you rather than by a platform’s algorithm.',
        },
        { type: 'h2', text: 'What it changes in practice' },
        {
          type: 'liste',
          items: [
            'Finding a sentence heard in a podcast six months ago',
            'Cross-checking three sources that say the same thing differently',
            'Quoting precisely instead of paraphrasing from memory',
            'Keeping what matters when the video itself is taken down',
          ],
        },
        {
          type: 'p',
          text: 'Nothing spectacular. Simply ideas that no longer get lost.',
        },
        { type: 'h2', text: 'What it is not' },
        {
          type: 'p',
          text: 'Not a monitoring tool, not an assistant that reads on your behalf. Reading, sorting and judging remain your work. Synthiz only guarantees that what you have read stays within reach.',
        },
        {
          type: 'p',
          text: 'It is the first organ because it is the precondition. You build nothing on what you have forgotten.',
        },
      ],
    },
  },
  {
    slug: 'donner-a-vos-systemes-acces-a-ce-qui-se-dit',
    titre: "Donner à vos systèmes accès à ce qui se dit",
    chapeau:
      "Vos index, vos agents et vos analyses ne lisent que du texte. L'essentiel de ce qui se publie aujourd'hui est audio ou vidéo — et leur reste donc invisible.",
    organe: 'Connaissance',
    outil: 'Techtuel',
    outilUrl: 'https://techtuel.com',
    date: '2026-07-30',
    lecture: '5 min',
    blocs: [
      {
        type: 'p',
        text: "Vous construisez un système qui exploite de l'information : un moteur de recherche interne, un index sémantique, un agent qui répond à partir de vos sources, un outil de veille. Tout cela fonctionne sur du texte.",
      },
      {
        type: 'p',
        text: "Or une part croissante de ce qui compte dans votre domaine ne s'écrit plus. Elle se dit — en conférence, en podcast, en webinaire, en réunion enregistrée. Pour vos systèmes, cette matière n'existe pas.",
      },
      {
        type: 'p',
        text: "Ce n'est pas un problème de volume, mais d'angle mort. Vous indexez ce qui est facile à indexer, et vous concluez à partir de cet échantillon.",
      },
      { type: 'h2', text: 'Ce que ça coûte de ne pas les voir' },
      {
        type: 'p',
        text: "Un agent interne qui ignore les réunions enregistrées répondra à côté sur la moitié des décisions prises. Une veille qui ne suit que les articles manquera ce qui se dit en conférence six mois avant d'être écrit. Un index documentaire qui saute les formations vidéo renvoie l'utilisateur vers une documentation qu'il a déjà lue.",
      },
      {
        type: 'p',
        text: "Dans chaque cas, le système paraît fonctionner. C'est ce qui rend l'angle mort coûteux : il ne produit pas d'erreur visible, seulement des réponses incomplètes.",
      },
      {
        type: 'quote',
        text: "Un système ne peut raisonner que sur ce qu'il peut lire.",
      },
      { type: 'h2', text: "Pourquoi cette brique reste pénible" },
      {
        type: 'p',
        text: "Techniquement, le sujet est résolu : les modèles de reconnaissance vocale sont bons et disponibles. La difficulté est opérationnelle, et c'est elle qui décourage.",
      },
      {
        type: 'liste',
        items: [
          'Récupérer la source — formats multiples, plateformes changeantes, contenus supprimés',
          'Faire tourner le modèle — machines, files d\'attente, reprises après échec',
          'Absorber les erreurs — une source indisponible ne doit pas bloquer le lot',
          'Nettoyer le résultat — un transcript brut s\'indexe mal',
          'Maintenir tout cela dans le temps, sans que ce soit votre métier',
        ],
      },
      {
        type: 'p',
        text: "Chaque étape est faisable. C'est leur addition qui coûte, et surtout leur entretien : ce n'est pas au lancement qu'on paie, c'est six mois plus tard, quand une plateforme change ses règles.",
      },
      { type: 'h2', text: 'Ce que fait Techtuel' },
      {
        type: 'p',
        text: "Vous envoyez une URL. Vous récupérez du texte propre, prêt à découper, vectoriser ou indexer. Rien à héberger, aucun modèle à faire tourner, aucune file à surveiller.",
      },
      {
        type: 'p',
        text: "La traduction est incluse. Elle coûte 0,0047 € par heure de contenu contre 0,046 € pour la transcription — dix fois moins. Facturer un poste aussi marginal ajouterait un compteur sans ajouter de revenu, et transformerait le multilingue en variable de coût au moment précis où l'on veut élargir ses sources.",
      },
      {
        type: 'p',
        text: "Une vidéo déjà sous-titrée coûte un seul crédit, qu'elle dure six minutes ou trois heures. Sur un corpus de plusieurs centaines de sources, c'est ce détail qui décide du budget.",
      },
      {
        type: 'p',
        text: "Une API pour cesser de traiter l'accès aux sources parlées comme un projet, et le traiter comme un appel réseau.",
      },
      {
        type: 'p',
        text: "L'API est en production, servie par une infrastructure française.",
      },
    ],
    en: {
      slug: 'give-your-systems-access-to-what-is-being-said',
      titre: 'Give your systems access to what is being said',
      chapeau:
        'Your indexes, your agents and your analytics only read text. Most of what gets published today is audio or video — and stays invisible to them.',
      organe: 'Knowledge',
      blocs: [
        {
          type: 'p',
          text: 'You are building a system that runs on information: an internal search engine, a semantic index, an agent answering from your sources, a monitoring tool. All of it works on text.',
        },
        {
          type: 'p',
          text: "Yet a growing share of what matters in your field is no longer written down. It is spoken — at conferences, in podcasts, in webinars, in recorded meetings. To your systems, that material does not exist.",
        },
        {
          type: 'p',
          text: 'This is not a volume problem. It is a blind spot. You index what is easy to index, then draw conclusions from that sample.',
        },
        { type: 'h2', text: 'What the blind spot costs' },
        {
          type: 'p',
          text: 'An internal agent that ignores recorded meetings will miss the context behind half the decisions made. A monitoring setup that only tracks articles will miss what gets said on stage six months before anyone writes it down. A document index that skips video training sends the user back to documentation they have already read.',
        },
        {
          type: 'p',
          text: 'In each case, the system appears to work. That is what makes the blind spot expensive: it produces no visible error, only incomplete answers.',
        },
        {
          type: 'quote',
          text: 'A system can only reason about what it can read.',
        },
        { type: 'h2', text: 'Why this is still painful' },
        {
          type: 'p',
          text: 'Technically, the problem is solved: speech recognition models are good and readily available. The difficulty is operational, and that is what wears people down.',
        },
        {
          type: 'liste',
          items: [
            'Fetching the source — multiple formats, shifting platforms, deleted content',
            'Running the model — machines, queues, recovery after failure',
            'Absorbing errors — one unavailable source must not block the batch',
            'Cleaning the output — a raw transcript indexes badly',
            'Keeping all of it alive over time, when none of it is your job',
          ],
        },
        {
          type: 'p',
          text: 'Every step is doable. It is the sum that costs, and above all the upkeep: you do not pay at launch, you pay six months later, when a platform changes its rules.',
        },
        { type: 'h2', text: 'What Techtuel does' },
        {
          type: 'p',
          text: 'You send a URL. You get back clean text, ready to chunk, embed or index. Nothing to host, no model to run, no queue to watch.',
        },
        {
          type: 'p',
          text: 'Translation is included. It costs €0.0047 per hour of content against €0.046 for transcription — ten times less. Billing a line item that marginal would add a meter without adding revenue, and would turn multilingual work into a cost variable at the exact moment you want to widen your sources.',
        },
        {
          type: 'p',
          text: 'A video that already has subtitles costs a single credit, whether it runs six minutes or three hours. Across a corpus of several hundred sources, that detail is what decides the budget.',
        },
        {
          type: 'p',
          text: 'An API, so that access to spoken sources stops being a project and becomes a network call.',
        },
        {
          type: 'p',
          text: 'The API is in production, running on infrastructure hosted in France.',
        },
      ],
    },
  },
  {
    slug: 'un-service-demail-sobre-ethique-et-souverain',
    titre: "Un service d'email sobre, éthique et souverain",
    chapeau:
      "Les développeurs indépendants ont rarement besoin d'une immense plateforme marketing. Ils veulent envoyer une confirmation, une facture, un lien de connexion — et que ça parte.",
    organe: 'Communication',
    outil: 'Spore',
    outilUrl: 'https://sporee.fr',
    date: '2026-07-30',
    lecture: '4 min',
    blocs: [
      {
        type: 'p',
        text: "Les développeurs indépendants ont rarement besoin d'une immense plateforme marketing. Ils veulent envoyer une confirmation d'inscription, une facture, une alerte ou un lien de connexion. Il leur faut un service fiable, simple à intégrer, et assez abordable pour accompagner un projet qui débute.",
      },
      {
        type: 'p',
        text: "Spore a été conçu pour cela : envoyer les messages nécessaires au fonctionnement d'un service, sans ajouter une mécanique commerciale autour de chaque utilisateur.",
      },
      { type: 'h2', text: 'Une communication sobre' },
      {
        type: 'p',
        text: "Une adresse email ne devrait pas devenir automatiquement une opportunité marketing. Quand une personne crée un compte, effectue un achat ou demande une réinitialisation de mot de passe, elle attend l'information demandée. Rien d'autre.",
      },
      {
        type: 'p',
        text: "Les messages partent parce qu'ils ont une fonction précise. Ils confirment une action, transmettent une information, permettent à un service de fonctionner. Ils ne servent pas de prétexte à multiplier les relances.",
      },
      {
        type: 'quote',
        text: "Spore ne cherche pas à envoyer davantage de messages, mais à mieux envoyer ceux qui sont nécessaires.",
      },
      { type: 'h2', text: 'Une infrastructure maîtrisée' },
      {
        type: 'p',
        text: "L'infrastructure d'envoi nous appartient : le serveur, l'adresse IP, la signature des messages. Vos domaines restent les vôtres — vous les rattachez, vous gardez la main dessus, et vous partez avec si vous le décidez.",
      },
      {
        type: 'p',
        text: "Il ne s'agit pas de prétendre vivre sans aucun intermédiaire. Il s'agit de reprendre le contrôle sur une fonction essentielle, celle sans laquelle un service cesse simplement de communiquer avec ses utilisateurs.",
      },
      { type: 'h2', text: 'Une réalité économique' },
      {
        type: 'p',
        text: "Un freelance ou un petit éditeur ne devrait pas payer pour une suite marketing complète quand il cherche une infrastructure d'envoi. Spore se concentre sur l'essentiel : les domaines, les identités d'envoi, la délivrabilité, et une intégration simple dans une application.",
      },
      {
        type: 'p',
        text: "C'est aussi une limite assumée. Si vous cherchez des séquences automatisées, du scoring de contacts ou des campagnes segmentées, ce n'est pas ici. D'autres outils font cela très bien, et ce n'est pas ce que nous construisons.",
      },
      {
        type: 'p',
        text: "Reste ce qui compte pour un service qui démarre : que le message arrive, depuis une infrastructure sobre, éthique et maîtrisée.",
      },
    ],
    en: {
      slug: 'a-frugal-ethical-sovereign-email-service',
      titre: 'A frugal, ethical, sovereign email service',
      chapeau:
        'Independent developers rarely need a vast marketing platform. They want to send a confirmation, an invoice, a login link — and have it arrive.',
      organe: 'Communication',
      blocs: [
        {
          type: 'p',
          text: 'Independent developers rarely need a vast marketing platform. They want to send a signup confirmation, an invoice, an alert or a login link. What they need is a reliable service, simple to integrate, and cheap enough to carry a project through its early days.',
        },
        {
          type: 'p',
          text: 'Spore was built for that: sending the messages a service needs to function, without bolting a commercial machine onto every user.',
        },
        { type: 'h2', text: 'Frugal communication' },
        {
          type: 'p',
          text: 'An email address should not automatically become a marketing opportunity. When someone creates an account, makes a purchase or asks for a password reset, they expect the information they asked for. Nothing else.',
        },
        {
          type: 'p',
          text: 'Messages go out because they serve a precise purpose. They confirm an action, carry information, keep a service working. They are not a pretext for a stream of follow-ups.',
        },
        {
          type: 'quote',
          text: 'Spore is not trying to send more messages. It is trying to send the necessary ones better.',
        },
        { type: 'h2', text: 'Infrastructure we control' },
        {
          type: 'p',
          text: 'The sending infrastructure is ours: the server, the IP address, the message signing. Your domains stay yours — you attach them, you keep control of them, and you leave with them if you decide to.',
        },
        {
          type: 'p',
          text: 'This is not a claim to live without any intermediary. It is about taking back control of an essential function — the one without which a service simply stops talking to its users.',
        },
        { type: 'h2', text: 'An economic reality' },
        {
          type: 'p',
          text: 'A freelancer or a small software vendor should not pay for a full marketing suite when what they want is sending infrastructure. Spore focuses on the essentials: domains, sending identities, deliverability, and a simple integration into an application.',
        },
        {
          type: 'p',
          text: 'That is a limit we accept. If you want automated sequences, contact scoring or segmented campaigns, this is not the place. Other tools do that very well, and it is not what we are building.',
        },
        {
          type: 'p',
          text: 'For a service just starting out, what matters is simple: the message arrives through frugal, ethical infrastructure you control.',
        },
      ],
    },
  },
  {
    slug: 'n8n-cest-langchain-avec-un-formulaire',
    titre: "n8n, c'est LangChain avec un formulaire par-dessus",
    chapeau:
      "Les agents no-code reposent sur les mêmes bibliothèques que le code. La question n'est plus de savoir qui écrit le système — mais ce qu'on peut en faire ensuite.",
    organe: 'Technique',
    outil: 'Techtuel',
    outilUrl: 'https://techtuel.com',
    date: '2026-08-02',
    lecture: '6 min',
    blocs: [
      {
        type: 'p',
        text: "Un workflow n8n de quarante nœuds n'est pas simple. Il est illisible.",
      },
      {
        type: 'p',
        text: "Personne ne le relit. Personne ne le teste. Et le jour où il casse en production, il n'y a rien à ouvrir — juste un canevas et un onglet d'exécutions dans lequel on cherche le nœud rouge.",
      },
      {
        type: 'p',
        text: "Le réflexe reste pourtant compréhensible. Brancher un modèle de langage sur son application paraît lourd : un SDK à choisir, une boucle d'agent à écrire, des outils à décrire, des erreurs à gérer. L'interface visuelle paraît immédiate. C'était un arbitrage raisonnable.",
      },
      {
        type: 'p',
        text: "Sauf qu'il repose sur deux prémisses qui ont changé cette année, et que presque personne n'a refait le calcul.",
      },
      { type: 'h2', text: "« L'interface m'évite la bibliothèque d'agents »" },
      {
        type: 'p',
        text: "Elle est fausse, et le nommage du code le dit sans ambiguïté. Le paquet qui contient tous les nœuds IA de n8n s'appelle @n8n/n8n-nodes-langchain. Le nœud AI Agent, celui autour duquel tourne toute la documentation agentique, s'identifie littéralement comme n8n-nodes-langchain.agent.",
      },
      {
        type: 'p',
        text: "Ses dépendances déclarées ne laissent pas plus de doute : langchain, @langchain/core, @langchain/langgraph, @langchain/langgraph-checkpoint, puis une vingtaine d'adaptateurs — Anthropic, OpenAI, Mistral, Ollama, Groq, Pinecone, Qdrant, Weaviate. Ce n'est pas un détail qu'on découvre en fouillant : la documentation de n8n a une section « LangChain in n8n ».",
      },
      {
        type: 'quote',
        text: "Le débat n'est pas interface visuelle contre bibliothèque d'agents. C'est interface au-dessus d'une bibliothèque, contre la bibliothèque directement.",
      },
      {
        type: 'p',
        text: "Les deux camps utilisent une couche d'orchestration. La seule différence est le mode d'accès. Et cette différence coûte plus cher qu'elle ne rapporte, parce que la complexité conceptuelle ne disparaît pas : il faut toujours comprendre ce qu'est un agent, une chain, une memory, un retriever, un vector store. On les apprend simplement à travers des panneaux de configuration — sans types, sans la documentation de la bibliothèque sous-jacente, sans pouvoir lire ce qui s'exécute. On paie l'abstraction et le sous-jacent.",
      },
      {
        type: 'p',
        text: "C'est précisément pour cela qu'un gros workflow devient incompréhensible. Non parce que le problème est complexe — il l'est souvent, légitimement. Mais parce que l'interface a retiré tous les outils qui servent à dompter la complexité : nommage, typage, factorisation, tests, revue de code.",
      },
      { type: 'h2', text: '« Écrire ce code coûte trop cher »' },
      {
        type: 'p',
        text: "C'était l'argument fondateur du no-code, et il était juste. Mais n8n lui-même vient de le rendre caduc. Leur AI Workflow Builder génère un workflow complet — nœuds, logique, structure — à partir d'une description en langage naturel, puis le raffine par itérations. Chaque interaction consomme un crédit.",
      },
      {
        type: 'p',
        text: "C'est un aveu très utile. Il signifie que n8n considère désormais que la bonne façon de construire un système agentique, c'est de le décrire à un agent de code et de laisser celui-ci produire l'artefact. Sur ce point : d'accord. C'est effectivement devenu la bonne façon de faire.",
      },
      {
        type: 'quote',
        text: "Si l'on accepte qu'un agent écrive le système, pourquoi lui faire produire du JSON de canevas plutôt que du code ?",
      },
      {
        type: 'p',
        text: "Le débat n'est plus « visuel ou écrit à la main ». Les deux sont générés maintenant. Il porte sur une seule chose : ce que vous pouvez faire du résultat.",
      },
      { type: 'h2', text: "Ce que vous pouvez faire d'un résultat en code" },
      {
        type: 'p',
        text: "Un JSON de workflow se relit mal, se teste par exécution manuelle, et ne se factorise pas. Une intégration en code dans votre application vous rend quatre choses.",
      },
      {
        type: 'liste',
        items: [
          "Une surface d'API minuscule : un contrat d'outil bien conçu tient en quatre méthodes — un nom, une description, un schéma d'entrée, une exécution. C'est tout ce qu'un développeur doit apprendre pour exposer une capacité au modèle, à comparer avec la soixantaine de nœuds IA et leurs panneaux respectifs.",
          "Un schéma garanti par le compilateur : dans un langage typé, le schéma JSON envoyé au modèle se dérive du type d'entrée de l'outil, donc description et code exécuté ne peuvent pas diverger. Dans une interface, on le saisit à la main — et la documentation de n8n admet le point faible : la qualité des descriptions d'outils détermine directement la fiabilité de l'agent.",
          "Des prompts testables : un prompt est de la logique métier. Placé dans le domaine, à côté de ses tests, il se teste comme le reste du code — une entrée connue, une sortie attendue, une assertion qui casse la CI quand la sortie dérive.",
          "Un vrai levier sur les coûts : derrière une interface commune, changer de fournisseur devient une variable d'environnement. Basculer vers DeepSeek, Mistral ou un endpoint OVH pour les tâches où la différence de qualité ne se voit pas relève de la configuration, pas de la migration.",
        ],
      },
      {
        type: 'p',
        text: "À quoi s'ajoute la réutilisation. Une couche d'agents dans un dépôt sert plusieurs produits. Un workflow ne se factorise pas entre deux produits : il se duplique, et les deux copies divergent.",
      },
      { type: 'h2', text: 'Ce que n8n fait vraiment bien' },
      {
        type: 'p',
        text: "Un argumentaire honnête doit nommer les cas où l'autre camp gagne, et ils existent. Pour connecter six SaaS entre eux — un formulaire vers un CRM vers Slack vers une feuille de calcul — il n'y a pas plus rapide. Les centaines d'intégrations prêtes à l'emploi représentent un travail considérable que personne n'a envie de refaire. Webhooks, retries, ordonnancement, historique d'exécution : tout est là, sans rien installer.",
      },
      {
        type: 'p',
        text: "Surtout, n8n ne vend pas de la qualité technique. Il vend de l'autonomie vis-à-vis d'une équipe de développement. Une personne aux opérations qui monte son automatisation seule un vendredi soir n'a pas de « meilleur résultat » possible en code — sans n8n, elle n'a aucun résultat. Ce n'est pas un argument technique, c'est un argument organisationnel, et il est solide.",
      },
      {
        type: 'p',
        text: "Le problème n'est donc pas n8n. Le problème est le moment où l'on dépasse ce pour quoi il est bon.",
      },
      { type: 'h2', text: 'Le plafond, et où il vous laisse' },
      {
        type: 'p',
        text: "Tant que le besoin correspond à des nœuds existants, tout va bien. Dès qu'il en sort — une reprise sur erreur particulière, un enchaînement d'outils conditionnel, un format de sortie contraint — n8n vous rend la main. Concrètement, il vous renvoie vers le nœud Code, pour écrire du LangChain dans un champ texte de navigateur.",
      },
      {
        type: 'p',
        text: "Sans compilateur. Sans tests. Sans autocomplétion ni navigation vers la définition. Sans revue de code, sans diff lisible, sans historique exploitable.",
      },
      {
        type: 'quote',
        text: "Le moment où l'interface cesse de payer est exactement celui où elle vous restitue le code, dans le pire environnement possible pour l'écrire.",
      },
      {
        type: 'p',
        text: "Ce plafond arrive plus tôt qu'on ne l'imagine, parce qu'un système agentique qui atteint la production développe presque toujours ces besoins-là. Et pendant ce temps, le coût d'écrire cette couche proprement s'est effondré : les agents de code produisent ce type d'intégration bien plus vite qu'il y a dix-huit mois. C'est du code d'assemblage, avec un contrat clair et des types explicites — exactement ce que ces outils font le mieux.",
      },
      { type: 'h2', text: 'Ce que ça change dans votre semaine' },
      {
        type: 'p',
        text: "Plutôt que de passer vos soirées à comprendre pourquoi le nœud 34 ne reçoit pas le bon champ, mettez l'IA là où vit déjà votre métier : dans votre application, dans votre dépôt, dans votre pipeline.",
      },
      {
        type: 'p',
        text: "Un agent de code écrit la plomberie — adaptateurs de fournisseurs, boucle d'outils, gestion des erreurs, nouvelles tentatives. Il vous reste ce qui a réellement de la valeur, et que personne ne peut écrire à votre place : les prompts, les outils que vous exposez, et les tests qui prouvent que l'ensemble fait ce que vous croyez.",
      },
      {
        type: 'p',
        text: "Gardez n8n pour ce qu'il fait mieux que tout le monde : brancher des SaaS entre eux, vite, sans mobiliser un développeur. Mais votre produit n'est pas une intégration entre SaaS. Ne l'exportez pas dans un canevas.",
      },
    ],
    en: {
      slug: 'n8n-is-langchain-with-a-form-on-top',
      titre: 'n8n is LangChain with a form on top',
      chapeau:
        'No-code agents run on the same libraries as code. The question is no longer who writes the system — it’s what you can do with it afterwards.',
      organe: 'Technique',
      blocs: [
        {
          type: 'p',
          text: 'A forty-node n8n workflow isn’t simple. It’s unreadable.',
        },
        {
          type: 'p',
          text: 'Nobody reviews it. Nobody tests it. And the day it breaks in production, there’s nothing to open — just a canvas and an executions tab where you hunt for the red node.',
        },
        {
          type: 'p',
          text: 'The instinct is understandable all the same. Wiring a language model into your application looks heavy: an SDK to pick, an agent loop to write, tools to describe, errors to handle. The visual interface looks immediate. That was a reasonable trade.',
        },
        {
          type: 'p',
          text: 'Except it rests on two premises that changed this year, and almost nobody has redone the maths.',
        },
        { type: 'h2', text: '“The interface spares me the agent library”' },
        {
          type: 'p',
          text: 'False, and the code’s own naming says so without ambiguity. The package holding every one of n8n’s AI nodes is called @n8n/n8n-nodes-langchain. The AI Agent node, the one the entire agentic documentation revolves around, identifies itself literally as n8n-nodes-langchain.agent.',
        },
        {
          type: 'p',
          text: 'Its declared dependencies leave no more room for doubt: langchain, @langchain/core, @langchain/langgraph, @langchain/langgraph-checkpoint, then a couple of dozen adapters — Anthropic, OpenAI, Mistral, Ollama, Groq, Pinecone, Qdrant, Weaviate. This is not something you unearth by digging: n8n’s documentation has a section titled “LangChain in n8n”.',
        },
        {
          type: 'quote',
          text: 'The debate isn’t visual interface versus agent library. It’s an interface on top of a library, versus the library directly.',
        },
        {
          type: 'p',
          text: 'Both camps use an orchestration layer. The only difference is how you access it. And that difference costs more than it delivers, because the conceptual complexity doesn’t go away: you still have to understand what an agent is, a chain, a memory, a retriever, a vector store. You simply learn them through configuration panels — without types, without the underlying library’s documentation, without being able to read what actually runs. You pay for the abstraction and for what sits beneath it.',
        },
        {
          type: 'p',
          text: 'That is precisely why a large workflow becomes incomprehensible. Not because the problem is complex — it often legitimately is. But because the interface has stripped away every tool that exists to tame complexity: naming, typing, factoring, tests, code review.',
        },
        { type: 'h2', text: '“Writing that code costs too much”' },
        {
          type: 'p',
          text: 'That was no-code’s founding argument, and it was right. But n8n itself has just made it obsolete. Their AI Workflow Builder generates a complete workflow — nodes, logic, structure — from a natural-language description, then refines it through iterations. Each interaction burns a credit.',
        },
        {
          type: 'p',
          text: 'It’s a very useful admission. It means n8n now considers the right way to build an agentic system to be describing it to a coding agent and letting that agent produce the artefact. On that point: agreed. That has indeed become the right way to work.',
        },
        {
          type: 'quote',
          text: 'If we accept that an agent writes the system, why have it produce canvas JSON rather than code?',
        },
        {
          type: 'p',
          text: 'The debate is no longer “visual or hand-written”. Both are generated now. It comes down to one thing: what you can do with the result.',
        },
        { type: 'h2', text: 'What you can do with a result in code' },
        {
          type: 'p',
          text: 'Workflow JSON reads badly, is tested by manual execution, and is difficult to reuse. An integration built in code gives you four things back.',
        },
        {
          type: 'liste',
          items: [
            'A tiny API surface: a well-designed tool contract fits in four methods — a name, a description, an input schema, an execution. That is everything a developer must learn to expose a capability to the model, against some sixty AI nodes and their respective panels.',
            'A schema guaranteed by the compiler: in a typed language, the JSON schema sent to the model derives from the tool’s input type, so the description and the executed code cannot drift apart. In an interface, you type it by hand — and n8n’s documentation concedes the weak spot: the quality of tool descriptions directly determines the agent’s reliability.',
            'Testable prompts: a prompt is business logic. Put in the domain, next to its tests, it is tested like the rest of the code — a known input, an expected output, an assertion that breaks CI when the output drifts.',
            'Real leverage on cost: behind a common interface, switching provider becomes an environment variable. Moving to DeepSeek, Mistral or an OVH endpoint for the tasks where the quality gap is invisible is configuration, not migration.',
          ],
        },
        {
          type: 'p',
          text: 'Then there is reuse. An agent layer in a repository can serve several products. A workflow shared across two products gets duplicated, and the two copies diverge.',
        },
        { type: 'h2', text: 'What n8n does genuinely well' },
        {
          type: 'p',
          text: 'An honest case must name where the other camp wins, and those cases exist. To connect six SaaS products together — a form into a CRM into Slack into a spreadsheet — nothing is faster. The hundreds of ready-made integrations represent a considerable body of work nobody wants to redo. Webhooks, retries, scheduling, execution history: it’s all there, with nothing to install.',
        },
        {
          type: 'p',
          text: 'Above all, n8n isn’t selling technical quality. It sells independence from a development team. Someone in operations building their own automation alone on a Friday evening has no “better result” available in code — without n8n, they have no result at all. That isn’t a technical argument, it’s an organisational one, and it holds.',
        },
        {
          type: 'p',
          text: 'So the problem isn’t n8n. The problem is the moment you go past what it’s good for.',
        },
        { type: 'h2', text: 'The ceiling, and where it leaves you' },
        {
          type: 'p',
          text: 'As long as the need maps onto existing nodes, all is well. The moment it does not — a particular error-recovery path, a conditional chain of tools, a constrained output format — n8n hands you back the controls. Concretely, it sends you to the Code node to write LangChain in a browser text field.',
        },
        {
          type: 'p',
          text: 'No compiler. No tests. No autocompletion, no go-to-definition. No code review, no readable diff, no usable history.',
        },
        {
          type: 'quote',
          text: 'The moment the interface stops paying off is exactly the moment it hands the code back to you, in the worst possible environment for writing it.',
        },
        {
          type: 'p',
          text: 'That ceiling arrives sooner than you’d think, because an agentic system that reaches production almost always develops those needs. Meanwhile, the cost of writing that layer properly has collapsed: coding agents produce this kind of integration far faster than they did eighteen months ago. It’s glue code, with a clear contract and explicit types — exactly what those tools do best.',
        },
        { type: 'h2', text: 'What this changes in your week' },
        {
          type: 'p',
          text: 'Rather than spending your evenings working out why node 34 isn’t getting the right field, put the AI where your business logic already lives: in your application, in your repository, in your pipeline.',
        },
        {
          type: 'p',
          text: 'A coding agent writes the plumbing — provider adapters, tool loop, error handling, retries. What’s left to you is what actually carries value, and what nobody can write in your place: the prompts, the tools you expose, and the tests that prove the whole thing does what you think it does.',
        },
        {
          type: 'p',
          text: 'Keep n8n for what it does better than anyone: wiring SaaS products together, fast, without tying up a developer. But your product is not an integration between SaaS products. Don’t export it into a canvas.',
        },
      ],
    },
  },
  {
    slug: 'reputation-email-google-yahoo-microsoft',
    titre: "Le jour où Microsoft a bloqué tout notre sous-réseau",
    chapeau:
      "Notre réputation d'expéditeur était propre, notre configuration aussi. Pourtant, pendant trois jours, tous nos messages à destination de Microsoft ont été refusés avant même d'entrer. Récit d'un blocage, et surtout du temps perdu à comprendre pourquoi.",
    organe: 'Communication',
    outil: 'Spore',
    outilUrl: 'https://sporee.fr',
    date: '2026-08-10',
    lecture: '7 min',
    blocs: [
      {
        type: 'p',
        text: "Vous avez fait tout ce qu'on attend d'un expéditeur sérieux. Votre domaine indique quels serveurs ont le droit d'envoyer des courriers en son nom. Chaque message est signé. Votre serveur se présente sous une identité cohérente avec celle publiée dans le DNS.",
      },
      {
        type: 'p',
        text: "En clair : on sait qui vous êtes, et on peut le vérifier.",
      },
      {
        type: 'p',
        text: "Et malgré cela, vos messages n'arrivent pas chez Outlook.",
      },
      {
        type: 'p',
        text: "Pas dans les indésirables. Pas avec quelques minutes de retard. Ils sont refusés avant même d'être acceptés.",
      },
      {
        type: 'p',
        text: "C'est ce qui nous est arrivé les 7 et 8 août 2026 sur l'infrastructure d'envoi de Spore. À chaque tentative vers une adresse Microsoft, le même code revenait : S3140.",
      },
      {
        type: 'h2',
        text: "Ce que l'authentification garantit — et ce qu'elle ne garantit pas",
      },
      {
        type: 'p',
        text: "Dès qu'on commence à envoyer un peu sérieusement du courrier électronique, trois sigles reviennent partout : SPF, DKIM et DMARC.",
      },
      {
        type: 'p',
        text: "Autant les poser clairement.",
      },
      {
        type: 'liste',
        items: [
          "SPF indique, dans le DNS du domaine, quels serveurs sont autorisés à envoyer des messages en son nom.",
          "DKIM ajoute une signature cryptographique à chaque message. Le serveur qui le reçoit peut vérifier cette signature grâce à une clé publique publiée dans le DNS.",
          "DMARC définit la politique à appliquer lorsque les contrôles précédents échouent ou ne correspondent pas au domaine attendu.",
        ],
      },
      {
        type: 'p',
        text: "Ces mécanismes permettent de répondre à une question essentielle : l'expéditeur est-il bien celui qu'il prétend être ?",
      },
      {
        type: 'p',
        text: "Mais ils ne répondent pas à une autre question, tout aussi importante : est-ce que son courrier mérite d'être accepté ?",
      },
      {
        type: 'p',
        text: "Un spammeur peut parfaitement avoir un SPF propre, une signature DKIM valide et une politique DMARC correcte.",
      },
      {
        type: 'p',
        text: "L'authentification ne prouve pas qu'un message est souhaité. Elle prouve seulement que son origine peut être vérifiée.",
      },
      {
        type: 'quote',
        text: "L'authentification est un préalable, pas un laissez-passer. Elle permet de vous identifier, donc de vous tenir responsable.",
      },
      {
        type: 'p',
        text: "C'est ensuite que commence le vrai travail des filtres.",
      },
      {
        type: 'p',
        text: "Google, Yahoo ou Microsoft cherchent à savoir s'ils peuvent faire confiance à ce que vous envoyez. Pour cela, ils observent l'adresse IP d'origine, son ancienneté, le volume de messages envoyé, les plaintes reçues, les erreurs de livraison et parfois la réputation de toute la plage réseau à laquelle elle appartient.",
      },
      { type: 'h2', text: 'Le problème du voisinage' },
      {
        type: 'p',
        text: "Notre adresse IP n'avait pas forcément fait quoi que ce soit de répréhensible.",
      },
      {
        type: 'p',
        text: "Le problème venait de son voisinage.",
      },
      {
        type: 'p',
        text: "Une adresse IP n'est jamais vraiment isolée. Elle appartient à une plage détenue par un hébergeur et utilisée par de nombreux autres clients.",
      },
      {
        type: 'p',
        text: "Quand un opérateur estime qu'une partie de cette plage a été trop souvent utilisée pour envoyer du courrier indésirable, il peut décider de se méfier de l'ensemble.",
      },
      {
        type: 'p',
        text: "Vous pouvez donc avoir une adresse parfaitement propre et subir malgré tout les conséquences de ce qu'ont fait les autres.",
      },
      {
        type: 'p',
        text: "La logique se comprend.",
      },
      {
        type: 'p',
        text: "Si les filtres ne sanctionnaient qu'une adresse précise, il suffirait à un expéditeur malveillant d'en changer. Chez la plupart des hébergeurs, cela prend quelques minutes.",
      },
      {
        type: 'p',
        text: "Bloquer une plage entière rend ce jeu plus coûteux.",
      },
      {
        type: 'p',
        text: "Mais cette méthode a un effet secondaire évident : elle pénalise aussi les expéditeurs honnêtes qui ont simplement eu le malheur de s'installer au mauvais endroit.",
      },
      {
        type: 'p',
        text: "Ils n'ont rien fait de particulier, n'ont pratiquement aucun moyen de connaître la réputation de leur voisinage avant d'utiliser l'adresse, et découvrent le problème une fois le service en production.",
      },
      { type: 'h2', text: 'Trois opérateurs, trois manières de juger' },
      {
        type: 'p',
        text: "On met souvent Google, Yahoo et Microsoft dans le même panier. En pratique, leurs méthodes diffèrent beaucoup.",
      },
      {
        type: 'tableau',
        colonnes: ['', 'Google', 'Yahoo', 'Microsoft'],
        lignes: [
          [
            'Signal particulièrement surveillé',
            'Réputation générale et comportement des destinataires',
            'Plaintes et réputation',
            "Réputation de l'adresse IP et du réseau",
          ],
          [
            'Quand quelque chose va mal',
            'Le message peut finir en spam',
            'Limitation ou refus',
            'Refus explicite avec un code',
          ],
          [
            'Outils proposés',
            'Postmaster Tools',
            'Boucle de rétroaction',
            'SNDS et JMRP',
          ],
          [
            'Comment réagir',
            'Corriger et attendre',
            'Contacter le support',
            'Demander une levée de blocage',
          ],
        ],
        note: "Sources : documentation publique des trois opérateurs et observation de nos propres envois.",
      },
      {
        type: 'p',
        text: "Google est souvent le plus difficile à comprendre.",
      },
      {
        type: 'p',
        text: "Le serveur peut accepter votre message sans erreur, puis le ranger dans les indésirables. Dans vos journaux, tout semble donc s'être bien passé.",
      },
      {
        type: 'p',
        text: "Le message a été livré, techniquement.",
      },
      {
        type: 'p',
        text: "Il n'a simplement presque aucune chance d'être lu.",
      },
      {
        type: 'p',
        text: "Microsoft est plus brutal, mais aussi plus clair. Lorsque le message est refusé, le refus apparaît immédiatement dans les journaux, accompagné d'un code.",
      },
      {
        type: 'p',
        text: "Au moins, vous savez qu'il y a un problème.",
      },
      { type: 'h2', text: 'Le laissez-passer A38' },
      {
        type: 'p',
        text: "Une fois le blocage compris, encore faut-il savoir à qui parler.",
      },
      {
        type: 'p',
        text: "Et là, le problème technique devient un problème administratif.",
      },
      {
        type: 'p',
        text: "Les moteurs de recherche renvoient très vite vers un portail Microsoft destiné aux problèmes de délivrabilité. Seulement, celui que l'on trouve le plus facilement concerne surtout les boîtes professionnelles.",
      },
      {
        type: 'p',
        text: "Notre problème touchait les adresses grand public : Outlook.com et Hotmail.",
      },
      {
        type: 'p',
        text: "Ce n'est pas le même service. Ce n'est pas le même formulaire.",
      },
      {
        type: 'p',
        text: "Et rien ne vous l'explique vraiment.",
      },
      {
        type: 'p',
        text: "Vous remplissez le mauvais formulaire, vous envoyez votre demande, et il ne se passe rien.",
      },
      {
        type: 'p',
        text: "Personne ne vous répond pour vous dire que vous vous êtes trompé de porte.",
      },
      {
        type: 'p',
        text: "Il faut comprendre qu'un autre guichet existe, puis réussir à le trouver.",
      },
      {
        type: 'p',
        text: "Nous avons finalement déposé la demande auprès du support chargé de la délivrabilité des boîtes grand public, avec les adresses IP concernées, nos journaux d'envoi et les éléments de configuration.",
      },
      {
        type: 'p',
        text: "Demande envoyée le 9 août. Réponse le lendemain :",
      },
      {
        type: 'quote',
        text: "Mitigated. These IP(s) have been unblocked but may be subject to low daily email limits until they have established a good reputation.",
      },
      {
        type: 'p',
        text: "Autrement dit : les adresses ont été débloquées, mais Microsoft continuera à limiter leur volume tant qu'elles n'auront pas suffisamment d'historique.",
      },
      {
        type: 'p',
        text: "La levée du blocage ne remet donc pas les compteurs à zéro.",
      },
      {
        type: 'p',
        text: "Il faut ensuite envoyer progressivement, proprement, sans incident, jusqu'à ce que l'adresse inspire davantage confiance.",
      },
      {
        type: 'p',
        text: "Et la décision ne se propage pas forcément immédiatement à toute l'infrastructure Microsoft. Pendant plusieurs heures, voire davantage, certains serveurs peuvent encore refuser les messages.",
      },
      { type: 'h2', text: 'Ce que trois jours de blocage coûtent vraiment' },
      {
        type: 'p',
        text: "Entre le premier refus et la levée du blocage, trois jours se sont écoulés.",
      },
      {
        type: 'p',
        text: "Le plus frustrant, c'est que nous n'avons pratiquement rien eu à corriger.",
      },
      {
        type: 'p',
        text: "La configuration était correcte depuis le début. SPF, DKIM, DMARC, reverse DNS : tout était conforme. Vérifier tout cela a pris environ une heure.",
      },
      {
        type: 'p',
        text: "Le reste du temps a été consacré à comprendre le problème et à trouver la bonne personne.",
      },
      {
        type: 'p',
        text: 'Il a fallu :',
      },
      {
        type: 'liste',
        items: [
          "comprendre qu'un code de rejet inconnu ne désignait pas une erreur de configuration, mais un problème de réputation ;",
          'éliminer les différentes pistes DNS une par une ;',
          "comprendre que le premier formulaire trouvé n'était pas le bon ;",
          "retrouver le service qui s'occupe réellement des boîtes Outlook.com et Hotmail ;",
          'réunir les adresses IP, les journaux horodatés et les messages d’erreur bruts ;',
          'attendre la réponse, puis attendre encore que le déblocage se propage.',
        ],
      },
      {
        type: 'p',
        text: "Aucune fonctionnalité n'est sortie de ces heures de travail.",
      },
      {
        type: 'p',
        text: "Rien n'a été amélioré pour les utilisateurs.",
      },
      {
        type: 'p',
        text: "Nous avons simplement consacré trois jours à rétablir quelque chose qui aurait dû fonctionner dès le départ.",
      },
      {
        type: 'p',
        text: "C'est exactement le genre de travail qu'on ne veut pas voir surgir au milieu du développement d'un produit.",
      },
      { type: 'h2', text: 'Ce que nous avons changé depuis' },
      {
        type: 'p',
        text: "À ce moment-là, une seule adresse IP portait l'essentiel de notre trafic.",
      },
      {
        type: 'p',
        text: "Quand elle a été bloquée chez Microsoft, tous les messages destinés à Microsoft sont donc tombés avec elle, alors même que 84 autres messages continuaient à être distribués normalement chez les autres opérateurs.",
      },
      {
        type: 'p',
        text: "Un problème sur une seule adresse pouvait avoir des conséquences pour tous nos clients.",
      },
      {
        type: 'p',
        text: 'Nous avons changé cela.',
      },
      {
        type: 'p',
        text: "Les messages sont désormais répartis selon leur nature. Le courrier strictement transactionnel ne partage plus la même adresse que les envois plus volumineux. Un nouveau compte n'est pas immédiatement mélangé au trafic déjà établi.",
      },
      {
        type: 'p',
        text: "Le but est simple : éviter qu'un incident local se transforme en panne générale.",
      },
      {
        type: 'p',
        text: "Nous avons également branché la remontée automatique des accusés de livraison et des rejets.",
      },
      {
        type: 'p',
        text: "Lorsqu'un serveur distant refuse un message, l'information revient maintenant directement dans notre système.",
      },
      {
        type: 'p',
        text: "Elle ne termine plus dans une boîte électronique que personne ne pense à consulter.",
      },
      {
        type: 'p',
        text: "Et surtout, nous avons appris quelque chose qu'aucune documentation technique ne vous donne vraiment : comment fonctionne la partie administrative de ces grands opérateurs.",
      },
      {
        type: 'p',
        text: "Nous savons maintenant où frapper, quoi envoyer et quels éléments préparer.",
      },
      {
        type: 'p',
        text: "La prochaine fois, le diagnostic ne prendra pas trois jours.",
      },
      {
        type: 'p',
        text: "C'est aussi cela, le service que nous proposons.",
      },
      {
        type: 'p',
        text: "Nous exploitons nous-mêmes l'infrastructure d'envoi : les serveurs, les adresses IP, les signatures, les journaux.",
      },
      {
        type: 'p',
        text: "Et avec cette infrastructure viennent les problèmes de réputation, les demandes de déblocage et les échanges avec les opérateurs.",
      },
      {
        type: 'p',
        text: 'Nous les prenons en charge.',
      },
      {
        type: 'p',
        text: "La réputation d'un serveur ne se construit d'ailleurs pas uniquement au moment où un problème apparaît. Elle s'entretient à chaque message envoyé.",
      },
      {
        type: 'p',
        text: "Cela passe par des domaines vérifiés, des signatures correctes, le retrait automatique des adresses qui n'existent plus, l'analyse des rejets et la conservation d'un historique précis de chaque tentative.",
      },
      {
        type: 'p',
        text: "Nos serveurs sont en France. Vos domaines restent les vôtres. Et nous facturons les messages envoyés, pas le nombre de contacts stockés dans une base.",
      },
      {
        type: 'p',
        text: "Un expéditeur qui démarre seul rencontre aussi un autre problème : il n'a presque aucun historique.",
      },
      {
        type: 'p',
        text: "Avec quelques dizaines de messages par jour, une nouvelle adresse reste longtemps difficile à évaluer pour les filtres. Il faut du trafic régulier et un comportement stable pour construire progressivement une bonne réputation.",
      },
      {
        type: 'p',
        text: "C'est là que l'histoire se retourne.",
      },
      {
        type: 'p',
        text: "Un client de Spore n'arrive pas sur une adresse qui vient d'être créée le matin même.",
      },
      {
        type: 'p',
        text: "Il profite d'une infrastructure déjà en activité, entretenue au quotidien et surveillée.",
      },
      {
        type: 'p',
        text: 'Chaque message correctement délivré contribue à entretenir cette réputation commune.',
      },
      {
        type: 'p',
        text: 'Vous, pendant ce temps, vous envoyez votre message.',
      },
      {
        type: 'p',
        text: 'Une requête.',
      },
      {
        type: 'p',
        text: 'Et il part.',
      },
    ],
    en: {
      slug: 'the-day-microsoft-blocked-our-whole-subnet',
      titre: 'The day Microsoft blocked our whole subnet',
      chapeau:
        'Our sender reputation was clean, and so was our configuration. Yet for three days every message we sent to Microsoft was refused before it even got in. The story of a block — and of the time lost working out why.',
      organe: 'Communication',
      blocs: [
        {
          type: 'p',
          text: 'You have done everything a serious sender is asked to do. Your domain states which servers may send mail on its behalf. Every message is signed. Your server introduces itself under a name that matches what the DNS publishes.',
        },
        {
          type: 'p',
          text: 'In short, your identity is known and can be verified.',
        },
        {
          type: 'p',
          text: 'And still, your messages do not reach Outlook.',
        },
        {
          type: 'p',
          text: 'Not in the junk folder. Not a few minutes late. They are refused before they are ever accepted.',
        },
        {
          type: 'p',
          text: 'That is what happened to us on 7 and 8 August 2026, on the sending infrastructure behind Spore. Every attempt to reach a Microsoft address came back with the same code: S3140.',
        },
        {
          type: 'h2',
          text: 'What authentication guarantees — and what it does not',
        },
        {
          type: 'p',
          text: 'Send email in any volume and three acronyms turn up everywhere: SPF, DKIM and DMARC.',
        },
        {
          type: 'p',
          text: 'They are worth stating plainly.',
        },
        {
          type: 'liste',
          items: [
            'SPF lists, in the domain DNS, which servers are allowed to send on its behalf.',
            'DKIM adds a cryptographic signature to every message. The receiving server checks it against a public key published in the DNS.',
            'DMARC sets the policy to apply when the two checks above fail, or do not match the expected domain.',
          ],
        },
        {
          type: 'p',
          text: 'Together they answer one question: is the sender really who it claims to be?',
        },
        {
          type: 'p',
          text: 'They leave another one untouched, and it matters just as much: does this mail deserve to be accepted?',
        },
        {
          type: 'p',
          text: 'A spammer can hold a clean SPF record, a valid DKIM signature and a correct DMARC policy.',
        },
        {
          type: 'p',
          text: 'Authentication does not prove a message is wanted. It proves its origin can be checked.',
        },
        {
          type: 'quote',
          text: 'Authentication is a prerequisite, never a pass. It makes you identifiable, and therefore accountable.',
        },
        {
          type: 'p',
          text: 'The filters only start working after that.',
        },
        {
          type: 'p',
          text: 'Google, Yahoo and Microsoft are trying to decide whether they can trust what you send. To do it they look at the sending IP address, how long it has existed, how much it sends, the complaints it draws, its delivery failures — and sometimes the reputation of the entire network range it sits in.',
        },
        { type: 'h2', text: 'The neighbourhood problem' },
        {
          type: 'p',
          text: 'Our IP address had not necessarily done anything wrong.',
        },
        {
          type: 'p',
          text: 'The problem was its neighbourhood.',
        },
        {
          type: 'p',
          text: 'An IP address is never truly on its own. It belongs to a range held by a hosting provider and used by many other customers.',
        },
        {
          type: 'p',
          text: 'When an operator decides that part of that range has sent unwanted mail too often, it can choose to distrust the whole of it.',
        },
        {
          type: 'p',
          text: 'So you can hold a perfectly clean address and still carry the consequences of what others did.',
        },
        {
          type: 'p',
          text: 'The logic makes sense.',
        },
        {
          type: 'p',
          text: 'If filters only ever punished a single address, a malicious sender would simply move to another one. At most hosting providers that takes a few minutes.',
        },
        {
          type: 'p',
          text: 'Blocking a whole range makes that game more expensive.',
        },
        {
          type: 'p',
          text: 'The method has an obvious side effect: it also penalises honest senders who happened to settle in the wrong place.',
        },
        {
          type: 'p',
          text: 'They did nothing in particular, have almost no way of checking their neighbourhood before using the address, and find out once the service is already in production.',
        },
        { type: 'h2', text: 'Three operators, three ways of judging' },
        {
          type: 'p',
          text: 'Google, Yahoo and Microsoft are often lumped together. In practice their methods differ a great deal.',
        },
        {
          type: 'tableau',
          colonnes: ['', 'Google', 'Yahoo', 'Microsoft'],
          lignes: [
            [
              'Signal watched most closely',
              'Overall reputation and how recipients behave',
              'Complaints and reputation',
              'Reputation of the IP address and its network',
            ],
            [
              'When something goes wrong',
              'The message may land in spam',
              'Throttling or refusal',
              'Explicit refusal, with a code',
            ],
            [
              'Tools offered',
              'Postmaster Tools',
              'Feedback loop',
              'SNDS and JMRP',
            ],
            [
              'How to respond',
              'Fix it and wait',
              'Contact support',
              'Request a block removal',
            ],
          ],
          note: 'Sources: the three operators’ public documentation, and observation of our own sending.',
        },
        {
          type: 'p',
          text: 'Google is often the hardest to make sense of.',
        },
        {
          type: 'p',
          text: 'The server can accept your message without error, then file it as junk. As far as your logs are concerned, everything went fine.',
        },
        {
          type: 'p',
          text: 'The message was delivered, technically.',
        },
        {
          type: 'p',
          text: 'It simply stands almost no chance of being read.',
        },
        {
          type: 'p',
          text: 'Microsoft is blunter, and clearer for it. When a message is refused, the refusal shows up in the logs immediately, with a code attached.',
        },
        {
          type: 'p',
          text: 'At least you know there is a problem.',
        },
        { type: 'h2', text: 'The administrative maze' },
        {
          type: 'p',
          text: 'Once the block is understood, you still have to find someone to talk to.',
        },
        {
          type: 'p',
          text: 'And there the technical problem turns into an administrative one.',
        },
        {
          type: 'p',
          text: 'Search engines point very quickly to a Microsoft portal for deliverability problems. Except the one that surfaces first is mostly about business mailboxes.',
        },
        {
          type: 'p',
          text: 'Our problem concerned consumer addresses: Outlook.com and Hotmail.',
        },
        {
          type: 'p',
          text: 'Different service. Different form.',
        },
        {
          type: 'p',
          text: 'And nothing really tells you so.',
        },
        {
          type: 'p',
          text: 'You fill in the wrong form, you send your request, and nothing happens.',
        },
        {
          type: 'p',
          text: 'Nobody replies to say you knocked on the wrong door.',
        },
        {
          type: 'p',
          text: 'You have to work out that another desk exists, then manage to find it.',
        },
        {
          type: 'p',
          text: 'We eventually filed with the support team that handles deliverability for consumer mailboxes, with the IP addresses concerned, our sending logs and the configuration details.',
        },
        {
          type: 'p',
          text: 'Request sent on 9 August. Reply the next day:',
        },
        {
          type: 'quote',
          text: 'Mitigated. These IP(s) have been unblocked but may be subject to low daily email limits until they have established a good reputation.',
        },
        {
          type: 'p',
          text: 'In other words: the addresses were unblocked, but Microsoft will keep capping their volume until they have built up enough history.',
        },
        {
          type: 'p',
          text: 'Lifting the block does not reset the counters.',
        },
        {
          type: 'p',
          text: 'From there you have to send gradually, cleanly, without incident, until the address earns more trust.',
        },
        {
          type: 'p',
          text: 'And the decision does not necessarily reach every part of Microsoft’s infrastructure at once. For several hours, sometimes longer, some servers may still refuse your messages.',
        },
        { type: 'h2', text: 'What three days of blocking actually cost' },
        {
          type: 'p',
          text: 'Three days passed between the first refusal and the block being lifted.',
        },
        {
          type: 'p',
          text: 'The galling part is that there was almost nothing to fix.',
        },
        {
          type: 'p',
          text: 'The configuration had been correct from the start. SPF, DKIM, DMARC, reverse DNS: all of it conformant. Checking took about an hour.',
        },
        {
          type: 'p',
          text: 'The rest of the time went into understanding the problem and finding the right person.',
        },
        {
          type: 'p',
          text: 'It took:',
        },
        {
          type: 'liste',
          items: [
            'working out that an unfamiliar rejection code pointed at a reputation problem, not a configuration error;',
            'ruling out the DNS leads one by one;',
            'realising the first form we found was not the right one;',
            'tracking down the team that actually handles Outlook.com and Hotmail mailboxes;',
            'gathering the IP addresses, timestamped logs and raw error messages;',
            'waiting for the reply, then waiting again for the unblocking to propagate.',
          ],
        },
        {
          type: 'p',
          text: 'No feature came out of those hours.',
        },
        {
          type: 'p',
          text: 'Nothing was made better for anyone using the product.',
        },
        {
          type: 'p',
          text: 'We simply spent three days restoring something that should have worked from the outset.',
        },
        {
          type: 'p',
          text: 'That is exactly the kind of work you do not want surfacing in the middle of building a product.',
        },
        { type: 'h2', text: 'What we changed afterwards' },
        {
          type: 'p',
          text: 'At the time, a single IP address carried most of our traffic.',
        },
        {
          type: 'p',
          text: 'When it was blocked at Microsoft, every message bound for Microsoft went down with it — while 84 other messages were still being delivered normally to other operators.',
        },
        {
          type: 'p',
          text: 'A problem on one address could have consequences for every one of our customers.',
        },
        {
          type: 'p',
          text: 'We changed that.',
        },
        {
          type: 'p',
          text: 'Messages are now split by what they are. Strictly transactional mail no longer shares an address with heavier sending. A new account is not mixed straight into established traffic.',
        },
        {
          type: 'p',
          text: 'The aim is simple: stop a local incident turning into a general outage.',
        },
        {
          type: 'p',
          text: 'We also wired up automatic reporting of delivery receipts and rejections.',
        },
        {
          type: 'p',
          text: 'When a remote server refuses a message, that now comes straight back into our own system.',
        },
        {
          type: 'p',
          text: 'It no longer ends up in a mailbox nobody thinks to open.',
        },
        {
          type: 'p',
          text: 'Above all, we learned something no technical documentation really gives you: how the administrative side of these large operators works.',
        },
        {
          type: 'p',
          text: 'We now know who to contact, what to send and what to have ready.',
        },
        {
          type: 'p',
          text: 'Next time, the diagnosis will not take three days.',
        },
        {
          type: 'p',
          text: 'That is part of the service too.',
        },
        {
          type: 'p',
          text: 'We run the sending infrastructure ourselves: the servers, the IP addresses, the signatures, the logs.',
        },
        {
          type: 'p',
          text: 'And with that infrastructure come the reputation problems, the unblocking requests and the exchanges with operators.',
        },
        {
          type: 'p',
          text: 'We take those on.',
        },
        {
          type: 'p',
          text: 'A server’s reputation is not built at the moment something goes wrong, either. It is maintained with every message sent.',
        },
        {
          type: 'p',
          text: 'That means verified domains, correct signatures, addresses that no longer exist removed automatically, rejections analysed, and a precise history kept of every attempt.',
        },
        {
          type: 'p',
          text: 'Our servers are in France. Your domains stay yours. And we bill the messages you send, not the number of contacts sitting in a database.',
        },
        {
          type: 'p',
          text: 'A sender starting out faces another problem: almost no history.',
        },
        {
          type: 'p',
          text: 'At a few dozen messages a day, a new address stays hard for filters to judge for a long time. Building a good reputation takes steady traffic and stable behaviour.',
        },
        {
          type: 'p',
          text: 'This is where the story turns around.',
        },
        {
          type: 'p',
          text: 'A Spore customer does not land on an address created that morning.',
        },
        {
          type: 'p',
          text: 'They get infrastructure that is already in use, maintained daily and closely monitored.',
        },
        {
          type: 'p',
          text: 'Every message delivered properly helps keep that shared reputation up.',
        },
        {
          type: 'p',
          text: 'You, meanwhile, send your message.',
        },
        {
          type: 'p',
          text: 'One request.',
        },
        {
          type: 'p',
          text: 'And off it goes.',
        },
      ],
    },
  },
]

export function articleBySlug(slug: string) {
  return articles.find((a) => a.slug === slug)
}

/** Only the articles that have been translated. Drives /en/blog and its prerender. */
export const articlesEn = articles.flatMap((a) => (a.en ? [a.en] : []))

export function articleEnBySlug(slug: string) {
  return articlesEn.find((a) => a.slug === slug)
}

/**
 * The French counterpart of a translated article, for the hreflang pair.
 *
 * The English slug is its own — a translated title yields a different URL — so
 * the link back cannot be derived from the slug and is looked up here.
 */
export function articleFrByEnSlug(slug: string) {
  return articles.find((a) => a.en?.slug === slug)
}
