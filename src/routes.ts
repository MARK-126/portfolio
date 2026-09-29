import { type RouteConfig, index, route } from '@react-router/dev/routes'
import { labProjectSlugs, noteArticleSlugs, workProjectSlugs } from '../content-paths.ts'

// Each content page gets its own static route (instead of a dynamic /work/:slug) so every page is
// prerendered and unknown URLs fall through to the 404 page. Restart `yarn dev` after adding a
// content file.
const contentRoutes = (section: string, slugs: string[], file: string) =>
  slugs.map(slug => route(`${section}/${slug}`, file, { id: `${section}/${slug}` }))

export default [
  index('routes/home.tsx'),
  route('work', 'routes/work.tsx'),
  ...contentRoutes('work', workProjectSlugs(), 'routes/project.tsx'),
  route('notes', 'routes/notes.tsx'),
  ...contentRoutes('notes', noteArticleSlugs(), 'routes/note-article.tsx'),
  route('lab', 'routes/lab.tsx'),
  ...contentRoutes('lab', labProjectSlugs(), 'routes/project.tsx'),
  route('contact', 'routes/contact.tsx'),
  route('*', 'routes/not-found.tsx'),
] satisfies RouteConfig
