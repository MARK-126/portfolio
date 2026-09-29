import type { Route } from './+types/work'
import { SectionPlaceholder } from '../components/SectionPlaceholder'
import { pageMeta } from '../config/meta'

export const meta: Route.MetaFunction = () =>
  pageMeta({
    title: 'Work',
    description: 'Data platforms, pipelines and analytics projects by Marcos Rio.',
  })

export default function Work() {
  return <SectionPlaceholder section="work" />
}
