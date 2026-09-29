import { parse } from 'yaml'

export type MarkdownFile = {
  slug: string
  data: Record<string, unknown>
  body: string
}

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/

/** Splits a Markdown file into its YAML frontmatter and body. */
export function parseMarkdown(path: string, raw: string): MarkdownFile {
  const slug = path.split('/').pop()!.replace(/\.md$/, '')
  const match = FRONTMATTER.exec(raw)
  if (!match) return { slug, data: {}, body: raw }
  return { slug, data: (parse(match[1]) ?? {}) as Record<string, unknown>, body: match[2] }
}

export function asString(value: unknown, fallback = ''): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  return typeof value === 'string' ? value : fallback
}

export function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []
}

/** Drafts are visible in development only. */
export function isPublished(data: Record<string, unknown>) {
  return data.draft !== true || import.meta.env.DEV
}

export function byDateDesc<T extends { date: string }>(a: T, b: T) {
  return b.date.localeCompare(a.date)
}
