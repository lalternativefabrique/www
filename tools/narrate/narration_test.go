package main

import "strings"
import "testing"

const source = `---
slug: article-de-test
titre: "n8n, c'est LangChain avec un formulaire"
chapeau: "Les agents no-code reposent sur les mêmes bibliothèques."
organe: Technique
date: 2026-08-02
lecture: 6 min
---

Un workflow n8n de quarante nœuds n'est pas simple. Il est **illisible**.

## « L'interface m'évite la bibliothèque »

<Figure src="/images/articles/x.png" alt="Un schéma" caption="À ne pas lire" width="1536" height="1024" />

Le paquet s'appelle ` + "`@n8n/n8n-nodes-langchain`" + ` et la [documentation](https://n8n.io) le dit.

> Le débat n'est pas interface contre bibliothèque.

- Premier point
- Second point

<Tableau colonnes={['A','B']} lignes={[['1','2']]} note="Une note" />

| Col | Val |
| --- | --- |
| a   | 1   |

` + "```go\nfunc main() {}\n```" + `

---

Le dernier paragraphe.
`

func TestNarrationDropsWhatIsSeenNotHeard(t *testing.T) {
	got := narrationOf(source)

	for _, unwanted := range []string{
		"À ne pas lire", "Une note", "func main", "images/articles",
		"https://n8n.io", "Figure", "Tableau", "##", "**", "|",
	} {
		if strings.Contains(got, unwanted) {
			t.Errorf("narration should not contain %q:\n%s", unwanted, got)
		}
	}

	for _, wanted := range []string{
		"n8n, c'est LangChain avec un formulaire",
		"Les agents no-code reposent",
		"Un workflow n8n de quarante nœuds",
		"illisible",
		"L'interface m'évite la bibliothèque",
		"@n8n/n8n-nodes-langchain",
		"documentation",
		"Premier point",
		"Le dernier paragraphe.",
	} {
		if !strings.Contains(got, wanted) {
			t.Errorf("narration should contain %q:\n%s", wanted, got)
		}
	}
}

func TestNarrationStartsWithTitleThenStandfirst(t *testing.T) {
	got := narrationOf(source)
	if !strings.HasPrefix(got, "n8n, c'est LangChain avec un formulaire\n\nLes agents no-code") {
		t.Errorf("unexpected opening:\n%q", got[:min(120, len(got))])
	}
}

func TestNarrationHasNoRunTogetherParagraphs(t *testing.T) {
	got := narrationOf(source)
	if strings.Contains(got, "\n\n\n") {
		t.Error("blank lines should be collapsed to one")
	}
	if strings.Contains(got, "  ") {
		t.Error("runs of spaces should be collapsed")
	}
}

func min(a, b int) int { if a < b { return a }; return b }
