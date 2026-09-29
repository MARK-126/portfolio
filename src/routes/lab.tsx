import type { Route } from './+types/lab'
import { SectionPlaceholder } from '../components/SectionPlaceholder'
import { pageMeta } from '../config/meta'

export const meta: Route.MetaFunction = () =>
  pageMeta({
    title: 'Lab',
    description: 'Data and AI experiments and proof-of-concepts by Marcos Rio.',
  })

export default function Lab() {
  return <SectionPlaceholder section="lab" />
}
