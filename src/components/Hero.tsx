import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { BehaviorPanel } from './BehaviorPanel'
import './Hero.css'

export function Hero() {
  const { t } = useTranslation()

  return (
    <section className="hero">
      <div className="hero__inner container">
        <p className="hero__status">
          <span className="hero__status-dot" aria-hidden="true" />
          <span className="hero__status-sep" aria-hidden="true">
            │
          </span>
          <span>{t('hero.disciplines')}</span>
        </p>

        <h1 className="hero__headline">
          <span>{t('hero.headline1')}</span>
          <em className="hero__headline-accent">{t('hero.headline2')}</em>
        </h1>

        <div className="hero__grid">
          <div className="hero__copy">
            <p className="hero__subtitle">{t('hero.subtitle')}</p>
            <div className="hero__cta">
              <Link to="/projects" className="button button--solid" data-track="cta_proyectos">
                {t('hero.ctaProjects')} <span aria-hidden="true">→</span>
              </Link>
              <Link to="/contact" className="button button--outline" data-track="cta_contratar">
                {t('hero.ctaHire')}
              </Link>
            </div>
            <p className="hero__hint">{t('hero.hint')}</p>
          </div>

          <BehaviorPanel />
        </div>
      </div>

      <a href="#home-content" className="hero__scroll">
        <span>{t('hero.scroll')}</span>
        <span className="hero__scroll-line" aria-hidden="true" />
      </a>
    </section>
  )
}
