import { useTranslation } from 'react-i18next'
import { ParticleField } from './ParticleField'
import './Hero.css'

export function Hero() {
  const { t } = useTranslation()
  const tags = t('hero.tags', { returnObjects: true }) as string[]

  return (
    <section id="top" className="hero">
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
          <a href="#work" className="button button--solid">
            {t('hero.ctaWork')}
          </a>
          <a href="#contact" className="button button--outline">
            {t('hero.ctaHire')}
          </a>
          <a href="#notes" className="button button--link">
            {t('hero.ctaNotes')} <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>

      <div className="hero__footer container" aria-hidden="true">
        <span>{t('hero.scroll')}</span>
        <span className="hero__scroll-line" />
      </div>
    </section>
  )
}
