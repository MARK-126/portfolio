import { Link } from 'react-router'
import type { ProjectSummary } from '../../content/types'
import './ProjectList.css'

export function ProjectList({ projects }: { projects: ProjectSummary[] }) {
  return (
    <ol className="project-list">
      {projects.map((project, index) => (
        <li key={project.slug}>
          <Link to={`/${project.section}/${project.slug}`} className="project-card">
            <span className="project-card__top">
              <span>{String(index + 1).padStart(2, '0')}</span>
              {project.status && <span className="project-card__status">{project.status}</span>}
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
