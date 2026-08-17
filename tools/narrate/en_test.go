package main

import (
	"os"
	"strings"
	"testing"
)

func TestNarrationOfEnglishSource(t *testing.T) {
	b, err := os.ReadFile("../../app/content/articles/n8n-langchain-formulaire/index.en.mdx")
	if err != nil {
		t.Skip("no English source")
	}
	got := narrationOf(string(b))

	if !strings.HasPrefix(got, "n8n is LangChain with a form on top\n\nNo-code agents run on") {
		t.Errorf("unexpected opening: %q", got[:min(100, len(got))])
	}
	for _, unwanted := range []string{"---", "slug:", "organe:", "<Figure", "|"} {
		if strings.Contains(got, unwanted) {
			t.Errorf("narration should not contain %q", unwanted)
		}
	}
	if n := len([]rune(got)); n < 1000 {
		t.Errorf("suspiciously short narration: %d runes", n)
	}
}
