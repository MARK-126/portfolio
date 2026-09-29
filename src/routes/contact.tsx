import type { Route } from './+types/contact'
import { SectionPlaceholder } from '../components/SectionPlaceholder'
import { pageMeta } from '../config/meta'

export const meta: Route.MetaFunction = () =>
  pageMeta({
    title: 'Contact',
    description: 'Get in touch with Marcos Rio about data engineering, analytics or AI projects.',
  })

export default function Contact() {
  return <SectionPlaceholder section="contact" />
}
