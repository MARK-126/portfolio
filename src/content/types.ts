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
  /** Language the note is written in (BCP 47, e.g. "es"). */
  lang: string
}

export type NoteDetail = NoteSummary & {
  /** Article body rendered from Markdown to HTML at build time. */
  html: string
  readingMinutes: number
  previous?: Pick<NoteSummary, 'slug' | 'title'>
  next?: Pick<NoteSummary, 'slug' | 'title'>
}

/** Practice projects and quick experiments; a "professional" type can be added later. */
export type ProjectType = 'practice' | 'experiment'

export const projectTypes: ProjectType[] = ['practice', 'experiment']

export type ProjectSummary = {
  slug: string
  title: string
  date: string
  type: ProjectType
  summary: string
  stack: string[]
  featured: boolean
  /** What you did on the project, e.g. "Data engineer". */
  role?: string
  /** Short results shown as big figures, e.g. "−40% pipeline runtime". */
  highlights: string[]
  repo?: string
  demo?: string
  /** Free text, e.g. "prototipo", "en curso", "archivado". */
  status?: string
  /** Language the project is written in (BCP 47, e.g. "es"). */
  lang: string
}

export type ProjectDetail = ProjectSummary & {
  /** Case study body rendered from Markdown to HTML at build time. */
  html: string
  previous?: Pick<ProjectSummary, 'slug' | 'title'>
  next?: Pick<ProjectSummary, 'slug' | 'title'>
}
