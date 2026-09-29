import type { ProjectSummary } from './types'
import { asString, asStringArray, byDateDesc, isPublished, parseMarkdown } from './markdown.server'

// Every Markdown file in /content/projects becomes a project. Runs at build time only.
const files = import.meta.glob<string>('/content/projects/*.md', { query: '?raw', import: 'default', eager: true })

export function getProjects(): ProjectSummary[] {
  return Object.entries(files)
    .map(([path, raw]) => parseMarkdown(path, raw))
    .filter(({ data }) => isPublished(data))
    .map(({ slug, data }) => ({
      slug,
      title: asString(data.title, slug),
      date: asString(data.date),
      section: data.section === 'lab' ? ('lab' as const) : ('work' as const),
      summary: asString(data.summary),
      stack: asStringArray(data.stack),
      featured: data.featured === true,
    }))
    .sort(byDateDesc)
}
