import { type RouteConfig, index, route } from '@react-router/dev/routes'

export default [
  index('routes/home.tsx'),
  route('work', 'routes/work.tsx'),
  route('notes', 'routes/notes.tsx'),
  route('lab', 'routes/lab.tsx'),
  route('contact', 'routes/contact.tsx'),
] satisfies RouteConfig
