# narrate

Reads the revue's articles aloud and files the audio in the bucket, beside the
prose it came from. The site then serves whatever is there: an article has a
player when a recording exists for it, and nothing when it does not.

This runs against the bucket, not against the site. Nothing in the running image
speaks to a TTS service — the Node server only reads object storage, as it does
for the prose — so a reading that fails, or a voice that is down, cannot hold up
an article that is ready to publish.

## Running it

```bash
# The site's own bucket credentials, plus a voice.
export S3_ENDPOINT=https://s3.gra.io.cloud.ovh.net
export S3_REGION=gra
export S3_BUCKET=lalternative-prod-content
export S3_ACCESS_KEY=… S3_SECRET_KEY=…
export TTS_URL=http://piper.ai.svc.cluster.local:5000
export TTS_VOICE=fr_FR-upmc-medium

go run .                       # French, whatever has no current audio
go run . --lang both           # both languages — what a scheduled run wants
go run . --lang en             # English only
go run . --dry-run             # report what would be read, call nothing
go run . --dir mon-article     # one article
go run . --force               # read again even when the audio is current
```

`TTS_URL` points at anything exposing `/v1/audio/speech`. In the cluster that is
the Piper container in the `ai` namespace, which costs nothing per article and
keeps the audio on infrastructure we run. Pointing at `https://api.openai.com`
with a `TTS_API_KEY` works identically and bills per character.

Reaching the in-cluster service from a workstation needs a port-forward:

```bash
kubectl -n ai port-forward svc/piper 5000:5000
export TTS_URL=http://127.0.0.1:5000
```

## What gets read

The title, the standfirst, then the prose. Figures, tables, code listings and
image captions are dropped: they are things to look at, and a voice reading
their contents produces a stretch a listener cannot act on. Links read as their
text, never their URL.

`narration.go` does this from the MDX source. The site does the same job from
the rendered HTML in `app/server/narration.ts` — same rules, different starting
point, because by then the components have become `<figure>` and `<table>`.

## Keys, and why they carry a hash

Audio is written to:

```
audio/articles/<dir>/<lang>-<sha256(text)[:16]>.mp3
```

The hash is of the narrated text, so a corrected article is read again under a
new name and a stale recording is never served. Re-running finds the audio for
an unchanged text already in place and calls nothing. Older recordings of the
same article are removed once the new one is written, leaving one per article
and language.

Because the bytes behind a name never change, the route serving them
(`app/routes/audio/articles/$dir/$file.tsx`) marks them `immutable` for a year.

## Both languages, one voice each

Pieces are written in French and English, and both are read — but never by the
same voice. A voice is trained on one language and reads another with its own
phonetics, so the language picks the voice:

| Language | Voice | Override |
| --- | --- | --- |
| `fr` | `fr_FR-upmc-medium` | `TTS_VOICE` |
| `en` | `en_GB-alba-medium` | `TTS_VOICE_EN` |

A piece translated into only one language is the normal case: the missing source
is skipped, not reported as a failure.

Keys are language-scoped (`fr-…`, `en-…`), and so is the cleanup of superseded
recordings — correcting the English text replaces the English audio and leaves
the French alone.

**Check the English voice is in the image before relying on it.** The Piper
deployment sets `DEFAULT_VOICE: fr_FR-upmc-medium`, which is only a default —
the voice travels per request — but a model that is not in the image will fail
the request rather than fall back. Confirm with:

```bash
kubectl -n ai port-forward svc/piper 5000:5000
curl -s http://127.0.0.1:5000/v1/audio/speech \
  -H 'Content-Type: application/json' \
  -d '{"model":"tts-1","voice":"en_GB-alba-medium","input":"Testing.","response_format":"mp3"}' \
  -o /tmp/en.mp3 && ffprobe -v error -show_entries format=duration -of csv=p=0 /tmp/en.mp3
```

If that fails, add the voice to the Piper deployment, or point `TTS_VOICE_EN` at
one the image does carry.
