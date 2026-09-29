import { useTranslation } from 'react-i18next'
import type { Route } from './+types/notes'
import { getNotes } from '../content/notes.server'
import { PageIntro } from '../components/PageIntro'
import { EmptyState } from '../components/home/HomeSection'
import { NotesIndex } from '../components/notes/NotesIndex'
import { pageMeta } from '../config/meta'

export const meta: Route.MetaFunction = () =>
  pageMeta({
    title: 'Notes',
    description: 'Writing and curated reads on data engineering, AI and the human side of data.',
  })

// Runs at build time.
export function loader() {
  return { notes: getNotes() }
}

export default function Notes({ loaderData }: Route.ComponentProps) {
  const { t } = useTranslation()
  const { notes } = loaderData

  return (
    <>
      <PageIntro tag={t('pages.notes.tag')} title={t('pages.notes.title')} intro={t('pages.notes.intro')} />
      <section className="container page-section">
        {notes.length ? <NotesIndex notes={notes} /> : <EmptyState>{t('home.notes.empty')}</EmptyState>}
      </section>
    </>
  )
}
