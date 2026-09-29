import { useTranslation } from 'react-i18next'
import type { Route } from './+types/work'
import { getProjects } from '../content/projects.server'
import { PageIntro } from '../components/PageIntro'
import { EmptyState } from '../components/home/HomeSection'
import { ProjectIndex } from '../components/work/ProjectIndex'
import { pageMeta } from '../config/meta'

export const meta: Route.MetaFunction = () =>
  pageMeta({
    title: 'Work',
    description: 'Data platforms, pipelines and analytics projects by Marcos Rio.',
  })

// Runs at build time.
export function loader() {
  return { projects: getProjects('work') }
}

export default function Work({ loaderData }: Route.ComponentProps) {
  const { t } = useTranslation()
  const { projects } = loaderData

  return (
    <>
      <PageIntro tag={t('pages.work.tag')} title={t('pages.work.title')} intro={t('pages.work.intro')} />
      <section className="container page-section">
        {projects.length ? <ProjectIndex projects={projects} /> : <EmptyState>{t('home.work.empty')}</EmptyState>}
      </section>
    </>
  )
}
