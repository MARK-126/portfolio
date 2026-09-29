import { projectTypes, type ProjectDetail, type ProjectSummary, type ProjectType } from './types'
import {
  DEFAULT_CONTENT_LANG,
  asString,
  asStringArray,
  byDateDesc,
  isPublished,
  parseMarkdown,
  renderMarkdown,
  type MarkdownFile,
} from './markdown.server'

// Every Markdown file in /content/projects becomes a project. Runs at build time only.
const files = import.meta.glob<string>('/content/projects/*.md', { query: '?raw', import: 'default', eager: true })

function toSummary({ slug, data }: MarkdownFile): ProjectSummary {
  return {
    slug,
    title: asString(data.title, slug),
    date: asString(data.date),
    type: projectTypes.includes(data.type as ProjectType) ? (data.type as ProjectType) : 'practice',
    summary: asString(data.summary),
    stack: asStringArray(data.stack),
    featured: data.featured === true,
    role: asString(data.role) || undefined,
    highlights: asStringArray(data.highlights),
    repo: asString(data.repo) || undefined,
    demo: asString(data.demo) || undefined,
    status: asString(data.status) || undefined,
    lang: asString(data.lang) || DEFAULT_CONTENT_LANG,
  }
}

function publishedFiles() {
  return Object.entries(files)
    .map(([path, raw]) => parseMarkdown(path, raw))
    .filter(({ data }) => isPublished(data))
}

export function getProjects(): ProjectSummary[] {
  return publishedFiles().map(toSummary).sort(byDateDesc)
}

/** Full project with rendered body and its neighbouring projects. */
export function getProject(slug: string): ProjectDetail | undefined {
  const file = publishedFiles().find(file => file.slug === slug)
  if (!file) return undefined

  const projects = getProjects()
  const index = projects.findIndex(item => item.slug === slug)
  const link = (item?: ProjectSummary) => item && { slug: item.slug, title: item.title }

  return {
    ...toSummary(file),
    html: renderMarkdown(file.body),
    previous: link(projects[index - 1]),
    next: link(projects[index + 1]),
  }
}
