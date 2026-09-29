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
  /** What you did on the project, e.g. "Data engineer". */
  role?: string
  /** Short results shown as big figures, e.g. "−40% pipeline runtime". */
  highlights: string[]
  repo?: string
  demo?: string
}

export type ProjectDetail = ProjectSummary & {
  /** Case study body rendered from Markdown to HTML at build time. */
  html: string
  previous?: Pick<ProjectSummary, 'slug' | 'title'>
  next?: Pick<ProjectSummary, 'slug' | 'title'>
}
