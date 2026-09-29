import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import type { ProjectSummary } from '../../content/types'
import './ProjectList.css'

export function ProjectList({ projects }: { projects: ProjectSummary[] }) {
  const { t } = useTranslation()

  return (
    <ol className="project-list">
      {projects.map((project, index) => (
        <li key={project.slug}>
          <Link to={`/projects/${project.slug}`} className="project-card">
            <span className="project-card__top">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <span className="project-card__status">
                {t(`projects.types.${project.type}`)}
                {project.status && ` · ${project.status}`}
              </span>
            </span>
            <h3 className="project-card__title" lang={project.lang}>
              {project.title}
            </h3>
            <p className="project-card__summary" lang={project.lang}>
              {project.summary}
            </p>
            <ul className="project-card__stack">
              {project.stack.map(tech => (
                <li key={tech}>{tech}</li>
              ))}
            </ul>
          </Link>
        </li>
      ))}
    </ol>
  )
}
