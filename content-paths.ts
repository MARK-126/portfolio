// Node-only helpers used by src/routes.ts to know which content entries exist at build time
// (the app itself reads content via src/content/*.server.ts).
import { readFileSync, readdirSync } from 'node:fs'
import { parse } from 'yaml'

type Frontmatter = Record<string, unknown>

// `react-router build` runs with NODE_ENV=production; drafts are only listed in development.
const includeDrafts = process.env.NODE_ENV !== 'production'

/** Slugs (file names) of the Markdown entries in a content folder. */
export function contentSlugs(folder: string, filter: (data: Frontmatter) => boolean = () => true) {
  const dir = new URL(`./content/${folder}/`, import.meta.url)
  return readdirSync(dir)
    .filter(file => file.endsWith('.md'))
    .filter(file => {
      const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---/.exec(readFileSync(new URL(file, dir), 'utf8'))?.[1]
      const data = ((frontmatter && parse(frontmatter)) ?? {}) as Frontmatter
      return (includeDrafts || data.draft !== true) && filter(data)
    })
    .map(file => file.replace(/\.md$/, ''))
}

export const workProjectSlugs = () => contentSlugs('projects', data => data.section !== 'lab')
