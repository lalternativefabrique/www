/**
 * Reading an article aloud, over the /v1/audio/speech protocol.
 *
 * This is the TypeScript side of what packages/go/tts does for the narrate
 * tool: the same protocol, the same cutting rules, because the seams have to
 * land in the same places whichever one produced the file. The Go package is
 * the reference — this exists because a Go package cannot be imported into the
 * Node server, not because the problem is different.
 *
 * Server-only. The endpoint is reachable from inside the cluster and nowhere
 * else, and the app/server/ prefix is what keeps it out of the browser bundle.
 */

/** How much text /v1/audio/speech accepts at once. */
const MAX_CHARS = 4096

/** Pieces read at once. Four covers most articles in a single round. */
const CONCURRENCY = 4

export const VOICES = {
  fr: process.env.TTS_VOICE ?? 'fr_FR-upmc-medium',
  en: process.env.TTS_VOICE_EN ?? 'en_GB-alba-medium',
} as const

export type SpeechLang = keyof typeof VOICES

export const ttsConfigured = Boolean(
  process.env.TTS_URL || process.env.TTS_API_KEY,
)

/**
 * The finished audio, buffered rather than streamed so the caller can store it
 * and serve it with a Content-Length. Without one, browsers infer the duration
 * from the first MP3 frame header and stop playing at the first cut.
 */
export async function speak(
  text: string,
  lang: SpeechLang,
  signal?: AbortSignal,
): Promise<Uint8Array> {
  const pieces = splitForSpeech(text, MAX_CHARS)
  if (pieces.length === 0) throw new Error('tts: nothing to read')

  const spoken = new Array<Uint8Array>(pieces.length)
  let next = 0

  // Bounded workers rather than one fetch per piece: a long article is a dozen
  // requests, and firing them all at once would queue behind the same CPUs on
  // the other end while holding a dozen sockets open here.
  const workers = Array.from(
    { length: Math.min(CONCURRENCY, pieces.length) },
    async () => {
      for (;;) {
        const index = next++
        if (index >= pieces.length) return
        spoken[index] = await sayOne(pieces[index], lang, signal)
      }
    },
  )

  // The first rejection ends the reading: a partial article is unusable, so
  // there is no reason to pay for the remainder.
  await Promise.all(workers)

  // Joined as bytes, in reading order. That works for mp3 because the codec
  // settings are identical across requests for one (model, voice, format);
  // audio arriving out of order would be text read out of order.
  return concat(spoken)
}

async function sayOne(
  input: string,
  lang: SpeechLang,
  signal?: AbortSignal,
): Promise<Uint8Array> {
  const base = process.env.TTS_URL ?? 'https://api.openai.com'
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (process.env.TTS_API_KEY) {
    headers.Authorization = `Bearer ${process.env.TTS_API_KEY}`
  }

  const res = await fetch(`${base}/v1/audio/speech`, {
    method: 'POST',
    headers,
    signal,
    body: JSON.stringify({
      model: process.env.TTS_MODEL ?? 'tts-1',
      input,
      voice: VOICES[lang],
      response_format: 'mp3',
    }),
  })

  if (!res.ok) {
    const detail = (await res.text().catch(() => '')).slice(0, 500)
    throw new Error(`tts: status ${res.status}: ${detail}`)
  }

  const audio = new Uint8Array(await res.arrayBuffer())
  // A 200 carrying no bytes is a failure, not silence: joined with the rest it
  // would drop this piece's text with nothing reported, and the gap would
  // outlive the request in the bucket.
  if (audio.byteLength === 0) {
    throw new Error(`tts: no audio for a ${[...input].length}-character piece`)
  }
  return audio
}

/**
 * Cuts text into pieces of at most maxChars, preferring the boundaries a reader
 * would pause at anyway: paragraphs, then sentences, then words.
 *
 * Where a cut lands is not cosmetic. Each piece is read as a complete
 * utterance, so cutting mid-sentence gives the first half a falling final
 * intonation and the second half a fresh opening one, and the seam is plainly
 * audible.
 */
export function splitForSpeech(text: string, maxChars: number): string[] {
  if (maxChars <= 0) return [text]
  if ([...text].length <= maxChars) return text ? [text] : []

  const chunks: string[] = []
  for (const para of splitKeeping(text, '\n\n')) {
    if ([...para].length <= maxChars) {
      append(chunks, para, maxChars)
      continue
    }
    for (const sentence of splitSentences(para)) {
      if ([...sentence].length <= maxChars) {
        append(chunks, sentence, maxChars)
        continue
      }
      for (const part of splitWords(sentence, maxChars)) {
        append(chunks, part, maxChars)
      }
    }
  }
  return chunks
}

function append(chunks: string[], piece: string, maxChars: number) {
  const trimmed = piece.replace(/ +$/, '')
  if (!trimmed) return
  if (chunks.length === 0) {
    chunks.push(trimmed)
    return
  }
  const last = chunks[chunks.length - 1]
  const sep = /[\n ]$/.test(last) ? '' : ' '
  const combined = last + sep + trimmed
  if ([...combined].length <= maxChars) {
    chunks[chunks.length - 1] = combined
    return
  }
  chunks.push(trimmed)
}

function splitKeeping(s: string, delim: string): string[] {
  if (!s.includes(delim)) return s ? [s] : []
  const out: string[] = []
  let rest = s
  for (;;) {
    const i = rest.indexOf(delim)
    if (i < 0) {
      if (rest) out.push(rest)
      return out
    }
    out.push(rest.slice(0, i + delim.length))
    rest = rest.slice(i + delim.length)
  }
}

function splitSentences(s: string): string[] {
  const runes = [...s]
  const out: string[] = []
  let start = 0

  for (let i = 0; i < runes.length; i++) {
    if (!'.!?…'.includes(runes[i])) continue
    // Closing quotes and brackets belong to the sentence they end.
    let j = i + 1
    while (j < runes.length && `"')]»`.includes(runes[j])) j++
    if (j < runes.length && !' \n\t'.includes(runes[j])) continue

    out.push(runes.slice(start, j).join(''))
    while (j < runes.length && ' \n\t'.includes(runes[j])) j++
    start = j
    i = j - 1
  }
  if (start < runes.length) out.push(runes.slice(start).join(''))
  return out
}

function splitWords(s: string, maxChars: number): string[] {
  const out: string[] = []
  let current = ''

  for (const word of s.split(/\s+/).filter(Boolean)) {
    const length = [...word].length
    if (length > maxChars) {
      if (current) {
        out.push(current)
        current = ''
      }
      const runes = [...word]
      for (let i = 0; i < runes.length; i += maxChars) {
        out.push(runes.slice(i, i + maxChars).join(''))
      }
      continue
    }
    const extra = current ? length + 1 : length
    if ([...current].length + extra > maxChars) {
      out.push(current)
      current = word
      continue
    }
    current = current ? `${current} ${word}` : word
  }
  if (current) out.push(current)
  return out
}

function concat(parts: Uint8Array[]): Uint8Array {
  const total = parts.reduce((sum, p) => sum + p.byteLength, 0)
  const out = new Uint8Array(total)
  let at = 0
  for (const part of parts) {
    out.set(part, at)
    at += part.byteLength
  }
  return out
}
