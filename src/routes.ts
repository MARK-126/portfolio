import { type RouteConfig, index, route } from '@react-router/dev/routes'
import { workProjectSlugs } from '../content-paths.ts'

// Each project gets its own static route (instead of a dynamic /work/:slug) so every case study
// is prerendered and unknown URLs fall through to the 404 page. Restart `yarn dev` after adding a
// project file.
const workProjects = workProjectSlugs().map(slug =>
  route(`work/${slug}`, 'routes/work-project.tsx', { id: `work-project/${slug}` }),
)

export default [
  index('routes/home.tsx'),
  route('work', 'routes/work.tsx'),
  ...workProjects,
  route('notes', 'routes/notes.tsx'),
  route('lab', 'routes/lab.tsx'),
  route('contact', 'routes/contact.tsx'),
  route('*', 'routes/not-found.tsx'),
] satisfies RouteConfig
