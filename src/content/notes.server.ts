import type { NoteDetail, NoteSummary } from './types'
import {
  asString,
  asStringArray,
  byDateDesc,
  isPublished,
  parseMarkdown,
  renderMarkdown,
  type MarkdownFile,
} from './markdown.server'

// Every Markdown file in /content/notes becomes a note. Runs at build time only.
const files = import.meta.glob<string>('/content/notes/*.md', { query: '?raw', import: 'default', eager: true })

/** Notes are written in Spanish unless their frontmatter says otherwise. */
export const DEFAULT_NOTE_LANG = 'es'
const WORDS_PER_MINUTE = 220

function toSummary({ slug, data }: MarkdownFile): NoteSummary {
  return {
    slug,
    title: asString(data.title, slug),
    date: asString(data.date),
    type: data.type === 'link' ? 'link' : 'article',
    summary: asString(data.summary),
    url: asString(data.url) || undefined,
    source: asString(data.source) || undefined,
    tags: asStringArray(data.tags),
    lang: asString(data.lang) || DEFAULT_NOTE_LANG,
  }
}

function publishedFiles() {
  return Object.entries(files)
    .map(([path, raw]) => parseMarkdown(path, raw))
    .filter(({ data }) => isPublished(data))
}

export function getNotes(): NoteSummary[] {
  return publishedFiles().map(toSummary).sort(byDateDesc)
}

/** Full article with rendered body and its neighbouring articles. Link notes have no page. */
export function getArticle(slug: string): NoteDetail | undefined {
  const file = publishedFiles().find(file => file.slug === slug)
  if (!file) return undefined

  const note = toSummary(file)
  if (note.type !== 'article') return undefined

  const articles = getNotes().filter(item => item.type === 'article')
  const index = articles.findIndex(item => item.slug === slug)
  const link = (item?: NoteSummary) => item && { slug: item.slug, title: item.title }
  const words = file.body.split(/\s+/).filter(Boolean).length

  return {
    ...note,
    html: renderMarkdown(file.body),
    readingMinutes: Math.max(1, Math.round(words / WORDS_PER_MINUTE)),
    previous: link(articles[index - 1]),
    next: link(articles[index + 1]),
  }
}
