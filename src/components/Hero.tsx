import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { ParticleField } from './ParticleField'
import './Hero.css'

export function Hero() {
  const { t } = useTranslation()
  const tags = t('hero.tags', { returnObjects: true }) as string[]

  return (
    <section className="hero">
      <ParticleField />

      <div className="hero__inner container">
        <ul className="hero__tags">
          {tags.map(tag => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>

        <h1 className="hero__headline">
          <span>{t('hero.headline1')}</span>
          <span className="hero__headline-accent">{t('hero.headline2')}</span>
        </h1>

        <p className="hero__subtitle">{t('hero.subtitle')}</p>

        <div className="hero__cta">
          <Link to="/projects" className="button button--solid">
            {t('hero.ctaProjects')}
          </Link>
          <Link to="/contact" className="button button--outline">
            {t('hero.ctaHire')}
          </Link>
        </div>
      </div>

      <a href="#home-content" className="hero__scroll">
        <span>{t('hero.scroll')}</span>
        <span className="hero__scroll-line" aria-hidden="true" />
      </a>
    </section>
  )
}
