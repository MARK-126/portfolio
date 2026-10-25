import { m } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { DecodeText } from '../motion/DecodeText'
import { reveal } from '../motion/reveal'
import './Approach.css'

const principles = ['validity', 'reliability', 'goodhart'] as const

/** Ideas from psychometrics applied to data work: the core of the positioning. */
export function Approach() {
  const { t } = useTranslation()

  return (
    <div className="approach">
      <p className="approach__intro">{t('home.approach.intro')}</p>
      <ol className="approach__list">
        {principles.map((key, index) => (
          <m.li key={key} className="approach__item" {...reveal(index * 0.12)}>
            <p className="approach__label">
              <span className="approach__number">{String(index + 1).padStart(2, '0')}</span>
              <DecodeText text={t(`home.approach.items.${key}.label`)} />
            </p>
            <h3 className="approach__title">{t(`home.approach.items.${key}.title`)}</h3>
            <p className="approach__text">{t(`home.approach.items.${key}.text`)}</p>
          </m.li>
        ))}
      </ol>
    </div>
  )
}
