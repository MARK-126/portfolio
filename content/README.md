# Content

Notes and projects are Markdown files with YAML frontmatter. Add a file, commit, and it
appears on the site at the next build. The file name becomes the URL slug.

Files with `draft: true` are only visible when running `yarn dev`.

## Notes (`content/notes/*.md`)

Two types:

- `article` — your own writing. The body is the article, published at `/notes/<file-name>`.
- `link` — your summary of someone else's piece. It links straight to `url`; the body is not published.

```yaml
---
title: Por qué cada pipeline de datos necesita un contrato
date: 2026-09-20 # yyyy-mm-dd
type: article # article | link
lang: es # optional, defaults to es; shows a language tag when it differs from the UI language
summary: One or two sentences shown in lists (for links, your take on the piece).
url: https://... # link notes only
source: dbt Labs blog # link notes only
tags: [ingeniería de datos]
draft: true # optional
---
```

Notes are grouped by year on `/notes`. Articles show an estimated reading time.

## Projects (`content/projects/*.md`)

```yaml
---
title: Streaming ingestion for product analytics
date: 2026-08-01
section: work # work = real projects, lab = experiments
summary: One or two sentences shown in lists.
role: Data engineer # optional
stack: [Kafka, Spark, dbt]
highlights: # optional, big figures on the case study page
  - 15 min → 2 min data freshness
  - −35% warehouse cost
repo: https://github.com/... # optional
demo: https://... # optional
featured: true # shown on the home page
draft: true # optional
---
```

The body is the case study, written in Markdown (headings, lists, code blocks, tables, images).
Each `work` project gets its own page at `/work/<file-name>`. See `example-project.md` for a
suggested structure: Context → Problem → Approach → Results → What I learned.
