package main

import (
	"regexp"
	"strings"
)

// narrationOf turns an article source into what a voice should say.
//
// Read aloud, an article is not the page. A figure and a table are things to
// look at: their captions and cells read as a stretch of disconnected noise a
// listener cannot act on, so they are dropped rather than narrated. What is
// left is the title, the standfirst and the prose, which is what someone would
// read out if you handed them the piece.
//
// The source is MDX, so the components are JSX tags rather than markup, and
// they are removed by name. The site does the same job from the rendered HTML
// in app/server/narration.ts — same rules, different starting point, because
// there the components have already become <figure> and <table>.
var (
	frontmatterRe = regexp.MustCompile(`(?s)\A---\r?\n(.*?)\r?\n---\r?\n`)

	// Block components, with everything they contain.
	jsxBlockRe = regexp.MustCompile(`(?s)<(Figure|Tableau)\b.*?(/>|</(Figure|Tableau)>)`)

	fencedCodeRe = regexp.MustCompile("(?s)```.*?```")
	// A markdown table: consecutive lines that start and end on a pipe.
	tableRe = regexp.MustCompile(`(?m)^\|.*\|[ \t]*$\n?`)
	imageRe = regexp.MustCompile(`!\[[^\]]*\]\([^)]*\)`)
	// A link reads as its text, not its URL.
	linkRe    = regexp.MustCompile(`\[([^\]]+)\]\([^)]*\)`)
	headingRe = regexp.MustCompile(`(?m)^#{1,6}[ \t]+`)
	quoteRe   = regexp.MustCompile(`(?m)^>[ \t]?`)
	bulletRe  = regexp.MustCompile(`(?m)^[ \t]*[-*+][ \t]+`)
	orderedRe = regexp.MustCompile(`(?m)^[ \t]*\d+\.[ \t]+`)
	ruleRe    = regexp.MustCompile(`(?m)^[ \t]*(-{3,}|\*{3,}|_{3,})[ \t]*$\n?`)
	// Remaining tags, once the components are gone.
	tagRe        = regexp.MustCompile(`</?[A-Za-z][^>]*>`)
	inlineCodeRe = regexp.MustCompile("`([^`]*)`")
	// Emphasis reads as the words inside it. One pattern per marker, because
	// RE2 has no backreference to say "the same marker again".
	emphasisRes = []*regexp.Regexp{
		regexp.MustCompile(`\*\*\*([^*]+)\*\*\*`),
		regexp.MustCompile(`\*\*([^*]+)\*\*`),
		regexp.MustCompile(`\*([^*]+)\*`),
		regexp.MustCompile(`___([^_]+)___`),
		regexp.MustCompile(`__([^_]+)__`),
		regexp.MustCompile(`_([^_\s][^_]*)_`),
	}
	blankLinesRe = regexp.MustCompile(`\n{3,}`)
	spacesRe     = regexp.MustCompile(`[^\S\n]+`)
)

func narrationOf(source string) string {
	meta, body := splitFrontmatter(source)

	body = jsxBlockRe.ReplaceAllString(body, "\n\n")
	body = fencedCodeRe.ReplaceAllString(body, "\n\n")
	body = tableRe.ReplaceAllString(body, "")
	body = imageRe.ReplaceAllString(body, "")
	body = ruleRe.ReplaceAllString(body, "\n\n")
	body = linkRe.ReplaceAllString(body, "$1")
	body = headingRe.ReplaceAllString(body, "")
	body = quoteRe.ReplaceAllString(body, "")
	body = bulletRe.ReplaceAllString(body, "")
	body = orderedRe.ReplaceAllString(body, "")
	body = tagRe.ReplaceAllString(body, "")
	body = inlineCodeRe.ReplaceAllString(body, "$1")
	for _, re := range emphasisRes {
		body = re.ReplaceAllString(body, "$1")
	}

	// A blank line between parts is where Split prefers to cut, and cutting
	// between paragraphs is inaudible where cutting mid-sentence is not.
	parts := []string{meta["titre"], meta["chapeau"], body}
	var kept []string
	for _, p := range parts {
		if p = strings.TrimSpace(p); p != "" {
			kept = append(kept, p)
		}
	}
	return normalize(strings.Join(kept, "\n\n"))
}

// splitFrontmatter returns the frontmatter fields the narration needs and the
// body below them. It reads the two scalars it uses rather than the whole
// document: a YAML parser here would be a dependency for two strings.
func splitFrontmatter(source string) (map[string]string, string) {
	meta := map[string]string{}
	match := frontmatterRe.FindStringSubmatch(source)
	if match == nil {
		return meta, source
	}

	for _, line := range strings.Split(match[1], "\n") {
		key, value, found := strings.Cut(line, ":")
		if !found || strings.HasPrefix(strings.TrimSpace(key), "#") {
			continue
		}
		key = strings.TrimSpace(key)
		if key != "titre" && key != "chapeau" {
			continue
		}
		meta[key] = unquote(strings.TrimSpace(value))
	}
	return meta, source[len(match[0]):]
}

func unquote(s string) string {
	if len(s) >= 2 {
		if (s[0] == '"' && s[len(s)-1] == '"') || (s[0] == '\'' && s[len(s)-1] == '\'') {
			return s[1 : len(s)-1]
		}
	}
	return s
}

// normalize collapses the whitespace the stripping leaves behind, keeping
// paragraph breaks: they are the only whitespace a voice reads.
func normalize(s string) string {
	s = strings.ReplaceAll(s, "\r\n", "\n")
	s = spacesRe.ReplaceAllString(s, " ")
	var lines []string
	for _, line := range strings.Split(s, "\n") {
		lines = append(lines, strings.TrimSpace(line))
	}
	s = strings.Join(lines, "\n")
	s = blankLinesRe.ReplaceAllString(s, "\n\n")
	return strings.TrimSpace(s)
}
