# Content

Notes and projects are Markdown files with YAML frontmatter. Add a file, commit, and it
appears on the site at the next build. The file name becomes the URL slug.

Files with `draft: true` are only visible when running `yarn dev`.

## Notes (`content/notes/*.md`)

Two types:

- `article` — your own writing. The body is the article.
- `link` — a summary of someone else's piece, pointing to it with `url` and `source`.

```yaml
---
title: Why every data pipeline needs a contract
date: 2026-09-20 # yyyy-mm-dd
type: article # article | link
summary: One or two sentences shown in lists.
url: https://... # link notes only
source: dbt Labs blog # link notes only
tags: [data engineering]
draft: true # optional
---
```

## Projects (`content/projects/*.md`)

```yaml
---
title: Streaming ingestion for product analytics
date: 2026-08-01
section: work # work = real projects, lab = experiments
summary: One or two sentences shown in lists.
stack: [Kafka, Spark, dbt]
featured: true # shown on the home page
draft: true # optional
---
```
