import { m } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { DecodeText } from '../motion/DecodeText'
import { reveal } from '../motion/reveal'
import './Manifesto.css'

// Articles of the manifesto, in order (numbered I to IV on the page)
const articles = ['late', 'capture', 'design', 'foresight'] as const
const NUMERALS = ['I', 'II', 'III', 'IV']

/** The positioning as four statements, on the inverted grey block. */
export function Manifesto() {
  const { t } = useTranslation()

  return (
    <section className="manifesto panel" aria-labelledby="manifesto-title">
      <div className="manifesto__intro">
        <h2 className="manifesto__label" id="manifesto-title">
          <DecodeText text={t('home.manifesto.label')} />
        </h2>
        <p className="manifesto__lead">{t('home.manifesto.intro')}</p>
      </div>
      <ol className="manifesto__list">
        {articles.map((key, index) => (
          <m.li key={key} className="manifesto__item" {...reveal(index * 0.08)}>
            <span className="manifesto__number">{NUMERALS[index]}</span>
            <p className="manifesto__text">
              {t(`home.manifesto.items.${key}.claim`)}{' '}
              <span className="manifesto__rest">{t(`home.manifesto.items.${key}.rest`)}</span>
            </p>
          </m.li>
        ))}
      </ol>
    </section>
  )
}
