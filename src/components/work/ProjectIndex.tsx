import { Link } from 'react-router'
import type { ProjectSummary } from '../../content/types'
import './ProjectIndex.css'

/** Full-width project rows for the /work page. */
export function ProjectIndex({ projects }: { projects: ProjectSummary[] }) {
  return (
    <ol className="project-index">
      {projects.map((project, index) => (
        <li key={project.slug}>
          <Link to={`/work/${project.slug}`} className="project-row">
            <span className="project-row__index">{String(index + 1).padStart(2, '0')}</span>
            <span className="project-row__main">
              <span className="project-row__title">{project.title}</span>
              <span className="project-row__summary">{project.summary}</span>
            </span>
            <span className="project-row__stack">{project.stack.join(' · ')}</span>
            <span className="project-row__year">
              {project.date.slice(0, 4)} <span aria-hidden="true">→</span>
            </span>
          </Link>
        </li>
      ))}
    </ol>
  )
}
