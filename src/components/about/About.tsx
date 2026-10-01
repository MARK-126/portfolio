import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import './About.css'

type Job = { role: string; org: string; period: string; points: string[] }
type Study = { title: string; org: string; status: string }
type StackGroup = { label: string; items: string }

const CV_URL = '/files/cv-marcos-rio.pdf'

/** Numbered block of the about page: label column on the left, content on the right. */
function AboutBlock({ index, title, children }: { index: string; title: string; children: ReactNode }) {
  return (
    <section className="about-block">
      <h2 className="about-block__title">
        <span className="cell-index">[{index}]</span>
        {title}
      </h2>
      <div className="about-block__body">{children}</div>
    </section>
  )
}

/** Bio with photo, experience, education and stack, plus the downloadable CV. */
export function About() {
  const { t } = useTranslation()
  const bio = t('pages.about.bio', { returnObjects: true }) as string[]
  const jobs = t('pages.about.experience.items', { returnObjects: true }) as Job[]
  const studies = t('pages.about.education.items', { returnObjects: true }) as Study[]
  const stack = t('pages.about.stack.groups', { returnObjects: true }) as StackGroup[]

  return (
    <div className="about">
      <div className="about__intro">
        <picture className="about__photo">
          <source srcSet="/images/marcos-rio.webp" type="image/webp" />
          <img src="/images/marcos-rio.jpg" width={800} height={1198} alt={t('pages.about.photoAlt')} />
        </picture>
        <div className="about__bio">
          {bio.map(paragraph => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <div className="about__actions">
            <a href={CV_URL} className="button button--solid" target="_blank" rel="noopener">
              {t('pages.about.cv')} <span aria-hidden="true">↓</span>
            </a>
            <Link to="/contact" className="button button--outline">
              {t('pages.about.contact')}
            </Link>
          </div>
        </div>
      </div>

      <AboutBlock index="01" title={t('pages.about.experience.title')}>
        <ol className="about-list">
          {jobs.map(job => (
            <li key={`${job.role}-${job.org}`} className="about-list__item">
              <p className="about-list__meta">{job.period}</p>
              <div>
                <h3 className="about-list__title">{job.role}</h3>
                <p className="about-list__org">{job.org}</p>
                {job.points.length > 0 && (
                  <ul className="about-list__points">
                    {job.points.map(point => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          ))}
        </ol>
      </AboutBlock>

      <AboutBlock index="02" title={t('pages.about.education.title')}>
        <ol className="about-list">
          {studies.map(study => (
            <li key={study.title} className="about-list__item">
              <p className="about-list__meta">{study.status}</p>
              <div>
                <h3 className="about-list__title">{study.title}</h3>
                <p className="about-list__org">{study.org}</p>
              </div>
            </li>
          ))}
        </ol>
      </AboutBlock>

      <AboutBlock index="03" title={t('pages.about.stack.title')}>
        <dl className="about-stack">
          {stack.map(group => (
            <div key={group.label} className="about-stack__row">
              <dt>{group.label}</dt>
              <dd>{group.items}</dd>
            </div>
          ))}
        </dl>
      </AboutBlock>
    </div>
  )
}
