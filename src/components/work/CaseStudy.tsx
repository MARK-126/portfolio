import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import type { ProjectDetail } from '../../content/types'
import '../Prose.css'
import './CaseStudy.css'

export function CaseStudy({ project }: { project: ProjectDetail }) {
  const { t } = useTranslation()
  const links = [
    { key: 'repo', href: project.repo },
    { key: 'demo', href: project.demo },
  ].filter(link => link.href)

  return (
    <article className="case-study container">
      <header className="case-study__header">
        <Link to="/work" className="case-study__back">
          <span aria-hidden="true">←</span> {t('work.back')}
        </Link>
        <h1 className="case-study__title">{project.title}</h1>
        <p className="case-study__summary">{project.summary}</p>
      </header>

      <dl className="case-study__facts">
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
        <section className="case-study__highlights" aria-label={t('work.results')}>
          <ul>
            {project.highlights.map(highlight => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Body is rendered at build time from Markdown files in this repo (trusted content). */}
      {/* eslint-disable-next-line react-dom/no-dangerously-set-innerhtml */}
      <div className="case-study__body prose" dangerouslySetInnerHTML={{ __html: project.html }} />

      {(project.previous || project.next) && (
        <nav className="case-study__pager" aria-label={t('work.more')}>
          {project.previous ? (
            <Link to={`/work/${project.previous.slug}`} className="case-study__pager-link">
              <span className="case-study__pager-label">← {t('work.previous')}</span>
              <span className="case-study__pager-title">{project.previous.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {project.next && (
            <Link to={`/work/${project.next.slug}`} className="case-study__pager-link case-study__pager-link--next">
              <span className="case-study__pager-label">{t('work.next')} →</span>
              <span className="case-study__pager-title">{project.next.title}</span>
            </Link>
          )}
        </nav>
      )}
    </article>
  )
}
