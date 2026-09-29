import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import type { ProjectDetail } from '../../content/types'
import { Pager } from '../Pager'
import '../Prose.css'
import './CaseStudy.css'

export function CaseStudy({ project }: { project: ProjectDetail }) {
  const { t } = useTranslation()
  const base = `/${project.section}`
  const links = [
    { key: 'repo', href: project.repo },
    { key: 'demo', href: project.demo },
  ].filter(link => link.href)

  return (
    <article className="case-study container">
      <header className="case-study__header">
        <Link to={base} className="case-study__back">
          <span aria-hidden="true">←</span> {t(`${project.section}.back`)}
        </Link>
        <h1 className="case-study__title" lang={project.lang}>
          {project.title}
        </h1>
        <p className="case-study__summary" lang={project.lang}>
          {project.summary}
        </p>
      </header>

      <dl className="case-study__facts">
        {project.status && (
          <div>
            <dt>{t('work.status')}</dt>
            <dd>{project.status}</dd>
          </div>
        )}
        {project.role && (
          <div>
            <dt>{t('work.role')}</dt>
            <dd>{project.role}</dd>
          </div>
        )}
        <div>
          <dt>{t('work.year')}</dt>
          <dd>
            <time dateTime={project.date}>{project.date.slice(0, 4)}</time>
          </dd>
        </div>
        {project.stack.length > 0 && (
          <div>
            <dt>{t('work.stack')}</dt>
            <dd>{project.stack.join(', ')}</dd>
          </div>
        )}
        {links.length > 0 && (
          <div>
            <dt>{t('work.links')}</dt>
            <dd className="case-study__links">
              {links.map(({ key, href }) => (
                <a key={key} href={href} target="_blank" rel="noreferrer">
                  {t(`work.${key}`)} <span aria-hidden="true">↗</span>
                </a>
              ))}
            </dd>
          </div>
        )}
      </dl>

      {project.highlights.length > 0 && (
        <section className="case-study__highlights" aria-label={t('work.results')} lang={project.lang}>
          <ul>
            {project.highlights.map(highlight => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Body is rendered at build time from Markdown files in this repo (trusted content). */}
      {/* eslint-disable-next-line react-dom/no-dangerously-set-innerhtml */}
      <div className="case-study__body prose" lang={project.lang} dangerouslySetInnerHTML={{ __html: project.html }} />

      <Pager
        label={t(`${project.section}.more`)}
        previous={project.previous && { to: `${base}/${project.previous.slug}`, title: project.previous.title }}
        next={project.next && { to: `${base}/${project.next.slug}`, title: project.next.title }}
      />
    </article>
  )
}
