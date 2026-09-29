import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { NoteSummary, NoteType } from '../../content/types'
import { EmptyState } from '../home/HomeSection'
import { FilterTabs } from '../FilterTabs'
import { NoteList } from './NoteList'
import './NotesIndex.css'

type Filter = 'all' | NoteType

const filters: Filter[] = ['all', 'article', 'link']

/** All notes, filterable by type and grouped by year. */
export function NotesIndex({ notes }: { notes: NoteSummary[] }) {
  const { t } = useTranslation()
  const [filter, setFilter] = useState<Filter>('all')

  const visible = filter === 'all' ? notes : notes.filter(note => note.type === filter)
  const years = [...new Set(visible.map(note => note.date.slice(0, 4)))]
  const options = filters.map(value => ({
    value,
    label: t(`notes.filters.${value}`),
    count: value === 'all' ? notes.length : notes.filter(note => note.type === value).length,
  }))

  return (
    <>
      <FilterTabs label={t('notes.filter')} options={options} value={filter} onChange={setFilter} />

      {visible.length === 0 ? (
        <EmptyState>{t('notes.emptyFilter')}</EmptyState>
      ) : (
        years.map(year => (
          <section key={year} className="notes-year" aria-labelledby={`notes-${year}`}>
            <h2 id={`notes-${year}`} className="notes-year__title">
              {year}
            </h2>
            <NoteList notes={visible.filter(note => note.date.startsWith(year))} />
          </section>
        ))
      )}
    </>
  )
}
