import { type RouteConfig, index, route } from '@react-router/dev/routes'
import { noteArticleSlugs, workProjectSlugs } from '../content-paths.ts'

// Each content page gets its own static route (instead of a dynamic /work/:slug) so every page is
// prerendered and unknown URLs fall through to the 404 page. Restart `yarn dev` after adding a
// content file.
const workProjects = workProjectSlugs().map(slug =>
  route(`work/${slug}`, 'routes/work-project.tsx', { id: `work-project/${slug}` }),
)
const noteArticles = noteArticleSlugs().map(slug =>
  route(`notes/${slug}`, 'routes/note-article.tsx', { id: `note-article/${slug}` }),
)

export default [
  index('routes/home.tsx'),
  route('work', 'routes/work.tsx'),
  ...workProjects,
  route('notes', 'routes/notes.tsx'),
  ...noteArticles,
  route('lab', 'routes/lab.tsx'),
  route('contact', 'routes/contact.tsx'),
  route('*', 'routes/not-found.tsx'),
] satisfies RouteConfig
