import { useTranslation } from 'react-i18next'
import type { Route } from './+types/lab'
import { getProjects } from '../content/projects.server'
import { PageIntro } from '../components/PageIntro'
import { EmptyState } from '../components/home/HomeSection'
import { ProjectList } from '../components/home/ProjectList'
import { pageMeta } from '../config/meta'

export const meta: Route.MetaFunction = () =>
  pageMeta({
    title: 'Lab',
    description: 'Data and AI experiments and proof-of-concepts by Marcos Rio.',
  })

// Runs at build time.
export function loader() {
  return { projects: getProjects('lab') }
}

export default function Lab({ loaderData }: Route.ComponentProps) {
  const { t } = useTranslation()
  const { projects } = loaderData

  return (
    <>
      <PageIntro tag={t('pages.lab.tag')} title={t('pages.lab.title')} intro={t('pages.lab.intro')} />
      <section className="container page-section">
        {projects.length ? <ProjectList projects={projects} /> : <EmptyState>{t('lab.empty')}</EmptyState>}
      </section>
    </>
  )
}
