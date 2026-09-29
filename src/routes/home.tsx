import { useTranslation } from 'react-i18next'
import type { Route } from './+types/home'
import { getNotes } from '../content/notes.server'
import { getProjects } from '../content/projects.server'
import { Hero } from '../components/Hero'
import { EmptyState, HomeSection } from '../components/home/HomeSection'
import { ProjectList } from '../components/home/ProjectList'
import { NoteList } from '../components/home/NoteList'
import { ContactCta } from '../components/home/ContactCta'
import { pageMeta } from '../config/meta'

export const meta: Route.MetaFunction = () =>
  pageMeta({
    description:
      'Marcos Rio — Data Engineer with a background in psychology. Data pipelines, analytics and AI, built for the people behind the data.',
  })

// Runs at build time; the page ships with the data already rendered.
export function loader() {
  return {
    projects: getProjects()
      .filter(project => project.featured)
      .slice(0, 3),
    notes: getNotes().slice(0, 3),
  }
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { t } = useTranslation()
  const { projects, notes } = loaderData

  return (
    <>
      <Hero />
      <div id="home-content">
        <HomeSection index="01" title={t('home.work.title')} link={{ to: '/work', label: t('home.work.all') }}>
          {projects.length ? <ProjectList projects={projects} /> : <EmptyState>{t('home.work.empty')}</EmptyState>}
        </HomeSection>

        <HomeSection index="02" title={t('home.notes.title')} link={{ to: '/notes', label: t('home.notes.all') }}>
          {notes.length ? <NoteList notes={notes} /> : <EmptyState>{t('home.notes.empty')}</EmptyState>}
        </HomeSection>

        <ContactCta />
      </div>
    </>
  )
}
