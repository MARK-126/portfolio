import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import type { ProjectSummary } from '../../content/types'
import './ProjectIndex.css'

/** Full-width project rows for the /projects page. */
export function ProjectIndex({ projects }: { projects: ProjectSummary[] }) {
  const { t } = useTranslation()

  return (
    <ol className="project-index">
      {projects.map((project, index) => (
        <li key={project.slug}>
          <Link to={`/projects/${project.slug}`} className="project-row">
            <span className="project-row__index">{String(index + 1).padStart(2, '0')}</span>
            <span className="project-row__main" lang={project.lang}>
              <span className="project-row__title">{project.title}</span>
              <span className="project-row__summary">{project.summary}</span>
            </span>
            <span className="project-row__meta">
              <span className="project-row__type">
                {t(`projects.types.${project.type}`)}
                {project.status && ` · ${project.status}`}
              </span>
              <span>{project.stack.join(' · ')}</span>
            </span>
            <span className="project-row__year">
              {project.date.slice(0, 4)} <span aria-hidden="true">→</span>
            </span>
          </Link>
        </li>
      ))}
    </ol>
  )
}
