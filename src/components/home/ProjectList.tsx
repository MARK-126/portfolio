import { Link } from 'react-router'
import type { ProjectSummary } from '../../content/types'
import './ProjectList.css'

export function ProjectList({ projects }: { projects: ProjectSummary[] }) {
  return (
    <ol className="project-list">
      {projects.map((project, index) => (
        <li key={project.slug}>
          <Link to={`/${project.section}/${project.slug}`} className="project-card">
            <span className="project-card__index">{String(index + 1).padStart(2, '0')}</span>
            <h3 className="project-card__title">{project.title}</h3>
            <p className="project-card__summary">{project.summary}</p>
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
