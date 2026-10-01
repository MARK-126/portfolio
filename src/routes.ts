import { type RouteConfig, index, route } from '@react-router/dev/routes'
import { noteArticleSlugs, projectSlugs } from '../content-paths.ts'

// Each content page gets its own static route (instead of a dynamic /projects/:slug) so every page
// is prerendered and unknown URLs fall through to the 404 page. Restart `yarn dev` after adding a
// content file.
const contentRoutes = (section: string, slugs: string[], file: string) =>
  slugs.map(slug => route(`${section}/${slug}`, file, { id: `${section}/${slug}` }))

export default [
  index('routes/home.tsx'),
  route('projects', 'routes/projects.tsx'),
  ...contentRoutes('projects', projectSlugs(), 'routes/project.tsx'),
  route('notes', 'routes/notes.tsx'),
  ...contentRoutes('notes', noteArticleSlugs(), 'routes/note-article.tsx'),
  route('about', 'routes/about.tsx'),
  route('contact', 'routes/contact.tsx'),
  route('*', 'routes/not-found.tsx'),
] satisfies RouteConfig
