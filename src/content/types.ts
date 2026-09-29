export type NoteType = 'article' | 'link'

export type NoteSummary = {
  slug: string
  title: string
  date: string // ISO yyyy-mm-dd
  type: NoteType
  summary: string
  /** External URL for `link` notes. */
  url?: string
  /** Publication the link points to, e.g. "dbt Labs blog". */
  source?: string
  tags: string[]
}

export type ProjectSection = 'work' | 'lab'

export type ProjectSummary = {
  slug: string
  title: string
  date: string
  section: ProjectSection
  summary: string
  stack: string[]
  featured: boolean
}
