// Command narrate reads the revue's articles aloud and files the audio beside
// the prose it came from.
//
// It runs against the bucket, not the site: the article sources are there, the
// audio belongs there, and the running image stays what the ADR says it is — a
// Node server with no second language in it. Publishing an article and
// narrating it are separate acts, so a reading that fails, or a voice that is
// down, cannot hold up a text that is ready.
//
//	narrate                      # French, whatever has no current audio
//	narrate --lang both          # both languages, each in its own voice
//	narrate --dir mon-article    # one article
//	narrate --force              # read again even if audio is current
//	narrate --dry-run            # say what would be read, call nothing
//
// Configuration is the site's own S3_* variables plus TTS_URL, so it runs with
// the environment the site already has.
package main

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"flag"
	"fmt"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"

	"github.com/lalternative/packages/go/tts"
)

// Pieces are written in both languages, so both can be read — but not by the
// same voice. A voice is trained on one language and reads another with its own
// phonetics, which is bad enough to be worse than offering no audio at all, so
// the language picks the voice rather than inheriting whatever is configured.
//
// TTS_VOICE and TTS_VOICE_EN override these, for trying a different one without
// a rebuild.
var voiceFor = map[string]string{
	"fr": env("TTS_VOICE", "fr_FR-upmc-medium"),
	"en": env("TTS_VOICE_EN", "en_GB-alba-medium"),
}

func main() {
	var (
		dir    = flag.String("dir", "", "narrate this article only")
		lang   = flag.String("lang", "fr", "language to read: fr, en, or both")
		force  = flag.Bool("force", false, "read again even when the audio is current")
		dryRun = flag.Bool("dry-run", false, "report what would be read, call nothing")
	)
	flag.Parse()

	langs, err := languages(*lang)
	if err != nil {
		fail("%v", err)
	}

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	store, err := newBucketFromEnv()
	if err != nil {
		fail("%v", err)
	}

	// No voice configured is a reason to stop, not to write silence: this
	// command exists to produce audio.
	ttsURL := os.Getenv("TTS_URL")
	if ttsURL == "" && os.Getenv("TTS_API_KEY") == "" {
		fail("set TTS_URL (a Piper service) or TTS_API_KEY (OpenAI)")
	}
	voices := map[string]*tts.OpenAIVoice{}
	for _, l := range langs {
		voices[l] = tts.NewOpenAIVoice(tts.Config{
			BaseURL: ttsURL,
			APIKey:  os.Getenv("TTS_API_KEY"),
			Model:   env("TTS_MODEL", "tts-1"),
			VoiceID: voiceFor[l],
			Format:  "mp3",
			OnUsage: func(chars int) {
				fmt.Printf("  %d characters\n", chars)
			},
		})
	}

	dirs, err := listArticleDirs(ctx, store, *dir)
	if err != nil {
		fail("list articles: %v", err)
	}
	if len(dirs) == 0 {
		fmt.Println("No articles found.")
		return
	}

	job := runner{
		store:  store,
		voices: voices,
		force:  *force,
		dryRun: *dryRun,
	}

	for _, d := range dirs {
		for _, l := range langs {
			job.narrate(ctx, d, l)
			if ctx.Err() != nil {
				break
			}
		}
		if ctx.Err() != nil {
			break
		}
	}

	fmt.Printf("\n%d read, %d already current, %d failed\n", job.read, job.skipped, job.failed)
	if job.failed > 0 {
		os.Exit(1)
	}
}

type runner struct {
	store  *bucket
	voices map[string]*tts.OpenAIVoice
	force  bool
	dryRun bool

	read    int
	skipped int
	failed  int
}

// narrate reads one article in one language. A failure is counted and reported
// rather than returned: the other articles are independent of this one, and a
// partial run is resumed by running again.
func (r *runner) narrate(ctx context.Context, dir, lang string) {
	source, err := r.store.get(ctx, fmt.Sprintf("articles/%s/index.%s.mdx", dir, lang))
	// A piece translated into only one language is the normal case, not an
	// error: /en carries whatever has been translated, and no more.
	if err != nil || source == nil {
		return
	}

	text := narrationOf(string(source))
	if strings.TrimSpace(text) == "" {
		fmt.Printf("%s (%s): nothing to read\n", dir, lang)
		return
	}

	key := fmt.Sprintf("audio/articles/%s/%s-%s.mp3", dir, lang, fingerprint(text))
	existing, err := r.store.list(ctx, fmt.Sprintf("audio/articles/%s/%s-", dir, lang))
	if err != nil {
		fmt.Fprintf(os.Stderr, "%s (%s): list audio: %v\n", dir, lang, err)
		r.failed++
		return
	}
	if !r.force && contains(existing, key) {
		r.skipped++
		return
	}

	fmt.Printf("%s (%s, %s)\n", dir, lang, voiceFor[lang])
	if r.dryRun {
		fmt.Printf("  would write %s\n", key)
		r.read++
		return
	}

	started := time.Now()
	audio, mime, err := r.voices[lang].Speak(ctx, text)
	if err != nil {
		fmt.Fprintf(os.Stderr, "  failed: %v\n", err)
		r.failed++
		return
	}

	if err := r.store.put(ctx, key, audio, mime); err != nil {
		fmt.Fprintf(os.Stderr, "  upload failed: %v\n", err)
		r.failed++
		return
	}
	fmt.Printf("  %s — %.1f KiB in %s\n", key, float64(len(audio))/1024, time.Since(started).Round(time.Millisecond))
	r.read++

	// The old readings of this article are what a listener would still be served
	// from a stale page. Removing them here keeps one recording per article and
	// language — and the prefix is language-scoped, so the other language's
	// audio is never in this list.
	for _, old := range existing {
		if old == key {
			continue
		}
		if err := r.store.delete(ctx, old); err != nil {
			fmt.Fprintf(os.Stderr, "  could not remove %s: %v\n", old, err)
		}
	}
}

// languages resolves the --lang flag. "both" is what a scheduled run wants:
// every article, in whatever languages it exists in.
func languages(flag string) ([]string, error) {
	switch flag {
	case "fr", "en":
		return []string{flag}, nil
	case "both":
		return []string{"fr", "en"}, nil
	default:
		return nil, fmt.Errorf("lang must be fr, en or both, got %q", flag)
	}
}

func fingerprint(text string) string {
	sum := sha256.Sum256([]byte(text))
	return hex.EncodeToString(sum[:])[:16]
}

func contains(keys []string, want string) bool {
	for _, k := range keys {
		if k == want {
			return true
		}
	}
	return false
}

func env(name, fallback string) string {
	if v := os.Getenv(name); v != "" {
		return v
	}
	return fallback
}

func fail(format string, args ...any) {
	fmt.Fprintf(os.Stderr, format+"\n", args...)
	os.Exit(1)
}
