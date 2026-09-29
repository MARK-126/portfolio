import { useTranslation } from 'react-i18next'
import type { ProjectDetail } from '../../content/types'
import { Pager } from '../Pager'
import { BackLink } from '../BackLink'
import { ProjectBody } from './ProjectBody'
import './CaseStudy.css'

export function CaseStudy({ project }: { project: ProjectDetail }) {
  const { t } = useTranslation()
  const base = '/projects'
  const links = [
    { key: 'repo', href: project.repo },
    { key: 'demo', href: project.demo },
  ].filter(link => link.href)

  return (
    <article className="case-study container">
      <header className="case-study__header">
        <BackLink fallback="/projects" />
        <h1 className="case-study__title" lang={project.lang}>
          {project.title}
        </h1>
        <p className="case-study__summary" lang={project.lang}>
          {project.summary}
        </p>
      </header>

      <dl className="case-study__facts">
        <div>
          <dt>{t('projects.type')}</dt>
          <dd>{t(`projects.types.${project.type}`)}</dd>
        </div>
        {project.status && (
          <div>
            <dt>{t('projects.status')}</dt>
            <dd>{project.status}</dd>
          </div>
        )}
        {project.role && (
          <div>
            <dt>{t('projects.role')}</dt>
            <dd>{project.role}</dd>
          </div>
        )}
        <div>
          <dt>{t('projects.year')}</dt>
          <dd>
            <time dateTime={project.date}>{project.date.slice(0, 4)}</time>
          </dd>
        </div>
        {project.stack.length > 0 && (
          <div>
            <dt>{t('projects.stack')}</dt>
            <dd>{project.stack.join(', ')}</dd>
          </div>
        )}
        {links.length > 0 && (
          <div>
            <dt>{t('projects.links')}</dt>
            <dd className="case-study__links">
              {links.map(({ key, href }) => (
                <a key={key} href={href} target="_blank" rel="noreferrer">
                  {t(`projects.${key}`)} <span aria-hidden="true">↗</span>
                </a>
              ))}
            </dd>
          </div>
        )}
      </dl>

      {project.highlights.length > 0 && (
        <section className="case-study__highlights" aria-label={t('projects.results')} lang={project.lang}>
          <ul>
            {project.highlights.map(highlight => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        </section>
      )}

      <ProjectBody html={project.html} lang={project.lang} />

      <Pager
        label={t('projects.more')}
        previous={project.previous && { to: `${base}/${project.previous.slug}`, title: project.previous.title }}
        next={project.next && { to: `${base}/${project.next.slug}`, title: project.next.title }}
      />
    </article>
  )
}
