import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { ParticleField } from './ParticleField'
import { DecodeText } from './motion/DecodeText'
import { GlitchText } from './motion/GlitchText'
import './Hero.css'

/**
 * The thesis of the site: the omen ("everything will be data") stays still and grey; the answer
 * ("we see it coming") is where the signal breaks up every few seconds.
 */
export function Hero() {
  const { t } = useTranslation()

  return (
    <section className="hero panel">
      <ParticleField />

      <div className="hero__top">
        <div className="hero__intro">
          <p className="hero__kicker">
            <span className="hero__kicker-dot" aria-hidden="true" />
            <DecodeText text={t('hero.kicker')} />
          </p>
          <p className="hero__lede">
            {t('hero.lede.before')} <strong>{t('hero.lede.strong')}</strong> {t('hero.lede.after')}
          </p>
          <div className="hero__cta">
            <Link viewTransition to="/projects" className="button button--solid">
              {t('hero.ctaProjects')} <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        <Link viewTransition to="/contact" className="hero__status">
          <span className="hero__status-thumb" aria-hidden="true" />
          <span className="hero__status-body">
            <span className="hero__status-label">{t('hero.status.label')}</span>
            <span>
              {t('hero.status.text')} <span aria-hidden="true">→</span>
            </span>
          </span>
        </Link>
      </div>

      <h1 className="hero__headline">
        <span className="hero__omen">{t('hero.omen')}</span>
        <span className="hero__answer">
          <GlitchText text={t('hero.answer')} />
        </span>
      </h1>
    </section>
  )
}
