# Content

Notes and projects are Markdown files with YAML frontmatter. Add a file, commit, and it
appears on the site at the next build. The file name becomes the URL slug, so use lowercase words
joined by hyphens (e.g. `contratos-de-datos.md` → `/notes/contratos-de-datos`).

Files with `draft: true` are only visible when running `yarn dev`. Restart `yarn dev` after adding
a new file so its page is registered. Content is in Spanish by default; set `lang: en` on anything
written in English.

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
title: Ingesta en streaming para analítica de producto
date: 2026-08-01
type: practice # practice | experiment (filter on /projects)
summary: One or two sentences shown in lists.
status: prototipo # optional, e.g. en curso, archivado
role: Ingeniero de datos # optional
stack: [Kafka, Spark, dbt]
highlights: # optional, big figures on the project page
  - Frescura de 15 min → 2 min
  - −35% costo del warehouse
repo: https://github.com/... # optional
demo: https://... # optional
featured: true # shown on the home page
lang: es # optional, defaults to es
draft: true # optional
---
```

The body is the case study. Each project gets its own page at `/projects/<file-name>`.
Suggested structures:

- Practice project (`example-project.md`): Contexto → Problema → Enfoque → Resultados → Qué aprendí.
- Experiment (`example-experiment.md`): La pregunta → Qué probé → Resultado.

To add another type later (e.g. `professional`), add it to `projectTypes` in `src/content/types.ts`
and its labels in the locale files.

## Writing in Markdown

Headings (`##`), **bold**, _italic_, [links](https://...), lists, `code`, code blocks with
` ``` `, tables, quotes (`>`) and images are supported.

## Images

1. Save the image under `public/images/`, in a folder per page, e.g.
   `public/images/notes/contratos-de-datos/diagrama.png`.
2. Reference it from the Markdown with a path starting at `/images`:

```md
![What the image shows](/images/notes/contratos-de-datos/diagrama.png)
```

Add a title in quotes to show a caption below the image (only when the image is alone in its
paragraph):

```md
![What the image shows](/images/notes/contratos-de-datos/diagrama.png "Figura 1. Flujo del contrato")
```

Tips: always write the alt text (it describes the image for screen readers and search engines),
prefer `.webp` or `.png` under ~300 KB and about 1600 px wide. Images from other sites also work
with their full URL, but they can disappear if that site changes.
