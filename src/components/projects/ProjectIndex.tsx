import { Link } from 'react-router'
import { AnimatePresence, m } from 'motion/react'
import { useTranslation } from 'react-i18next'
import type { ProjectSummary } from '../../content/types'
import './ProjectIndex.css'

/** Full-width project rows for the /projects page. */
export function ProjectIndex({ projects }: { projects: ProjectSummary[] }) {
  const { t } = useTranslation()

  return (
    <ol className="project-index">
      {/* Rows slide into their new place when the filter changes */}
      <AnimatePresence initial={false} mode="popLayout">
        {projects.map((project, index) => (
          <m.li
            key={project.slug}
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link viewTransition to={`/projects/${project.slug}`} className="project-row">
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
          </m.li>
        ))}
      </AnimatePresence>
    </ol>
  )
}
