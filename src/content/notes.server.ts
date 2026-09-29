import type { NoteSummary } from './types'
import { asString, asStringArray, byDateDesc, isPublished, parseMarkdown } from './markdown.server'

// Every Markdown file in /content/notes becomes a note. Runs at build time only.
const files = import.meta.glob<string>('/content/notes/*.md', { query: '?raw', import: 'default', eager: true })

export function getNotes(): NoteSummary[] {
  return Object.entries(files)
    .map(([path, raw]) => parseMarkdown(path, raw))
    .filter(({ data }) => isPublished(data))
    .map(({ slug, data }) => ({
      slug,
      title: asString(data.title, slug),
      date: asString(data.date),
      type: data.type === 'link' ? ('link' as const) : ('article' as const),
      summary: asString(data.summary),
      url: asString(data.url) || undefined,
      source: asString(data.source) || undefined,
      tags: asStringArray(data.tags),
    }))
    .sort(byDateDesc)
}
