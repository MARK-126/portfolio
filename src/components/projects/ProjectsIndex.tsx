import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { projectTypes, type ProjectSummary, type ProjectType } from '../../content/types'
import { EmptyState } from '../home/HomeSection'
import { FilterTabs } from '../FilterTabs'
import { ProjectIndex } from './ProjectIndex'

type Filter = 'all' | ProjectType

/** All projects, filterable by type. */
export function ProjectsIndex({ projects }: { projects: ProjectSummary[] }) {
  const { t } = useTranslation()
  const [filter, setFilter] = useState<Filter>('all')

  const visible = filter === 'all' ? projects : projects.filter(project => project.type === filter)
  const options = (['all', ...projectTypes] as Filter[]).map(value => ({
    value,
    label: t(`projects.filters.${value}`),
    count: value === 'all' ? projects.length : projects.filter(project => project.type === value).length,
  }))

  return (
    <>
      <FilterTabs label={t('projects.filter')} options={options} value={filter} onChange={setFilter} />
      {visible.length ? <ProjectIndex projects={visible} /> : <EmptyState>{t('projects.emptyFilter')}</EmptyState>}
    </>
  )
}
