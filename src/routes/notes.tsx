import type { Route } from './+types/notes'
import { SectionPlaceholder } from '../components/SectionPlaceholder'
import { pageMeta } from '../config/meta'

export const meta: Route.MetaFunction = () =>
  pageMeta({
    title: 'Notes',
    description: 'Writing and curated reads on data engineering, AI and the human side of data.',
  })

export default function Notes() {
  return <SectionPlaceholder section="notes" />
}
