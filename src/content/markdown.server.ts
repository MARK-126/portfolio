import { Marked } from 'marked'
import { parse } from 'yaml'

/** Content is written in Spanish unless its frontmatter sets `lang`. */
export const DEFAULT_CONTENT_LANG = 'es'

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

const escapeAttr = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const imageTag = (href: string, alt: string) =>
  `<img src="${escapeAttr(href)}" alt="${escapeAttr(alt)}" loading="lazy" decoding="async">`

const markdown = new Marked({
  gfm: true,
  renderer: {
    // Images load lazily so long pages stay fast
    image({ href, text }) {
      return imageTag(href, text)
    },
    // An image alone in its paragraph with a title becomes a figure with caption:
    // ![Alt text](/images/notes/diagram.png "Caption shown below the image")
    paragraph({ tokens }) {
      const [token] = tokens
      if (tokens.length !== 1 || token.type !== 'image' || !token.title) return false
      return `<figure>${imageTag(token.href, token.text)}<figcaption>${escapeAttr(token.title)}</figcaption></figure>\n`
    },
  },
})

/** Renders trusted, repo-owned Markdown to HTML (build time only). */
export function renderMarkdown(body: string): string {
  return markdown.parse(body, { async: false })
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
