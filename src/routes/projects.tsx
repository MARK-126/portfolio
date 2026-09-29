import { useTranslation } from 'react-i18next'
import type { Route } from './+types/projects'
import { getProjects } from '../content/projects.server'
import { PageIntro } from '../components/PageIntro'
import { EmptyState } from '../components/home/HomeSection'
import { ProjectsIndex } from '../components/projects/ProjectsIndex'
import { pageMeta } from '../config/meta'

export const meta: Route.MetaFunction = () =>
  pageMeta({
    title: 'Projects',
    description: 'Data engineering, data science and AI projects and experiments by Marcos Rio.',
  })

// Runs at build time.
export function loader() {
  return { projects: getProjects() }
}

export default function Projects({ loaderData }: Route.ComponentProps) {
  const { t } = useTranslation()
  const { projects } = loaderData

  return (
    <>
      <PageIntro tag={t('pages.projects.tag')} title={t('pages.projects.title')} intro={t('pages.projects.intro')} />
      <section className="container page-section">
        {projects.length ? <ProjectsIndex projects={projects} /> : <EmptyState>{t('home.projects.empty')}</EmptyState>}
      </section>
    </>
  )
}
