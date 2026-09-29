import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { ParticleField } from './ParticleField'
import './Hero.css'

export function Hero() {
  const { t } = useTranslation()
  const branches = t('hero.branches', { returnObjects: true }) as string[]

  return (
    <section className="hero">
      <ParticleField branches={branches} />

      <div className="hero__inner container">
        <p className="hero__status">
          <span className="hero__status-dot" aria-hidden="true" />
          <span>{t('hero.disciplines')}</span>
        </p>

        <h1 className="hero__headline">
          <span>{t('hero.headline1')}</span>
          <span>
            {t('hero.headline2')} <span className="hero__headline-accent">{t('hero.headline2Accent')}</span>
          </span>
        </h1>

        <p className="hero__subtitle">{t('hero.subtitle')}</p>

        <div className="hero__cta">
          <Link to="/projects" className="button button--solid">
            {t('hero.ctaProjects')} <span aria-hidden="true">→</span>
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
