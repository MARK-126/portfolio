import { m } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { DecodeText } from '../motion/DecodeText'
import { reveal } from '../motion/reveal'
import './TeamPrinciples.css'

const principles = ['firstToKnow', 'product', 'small'] as const

/** What working together looks like, shown above the contact form. */
export function TeamPrinciples() {
  const { t } = useTranslation()

  return (
    <section className="container team-principles" aria-labelledby="team-principles-title">
      <h2 id="team-principles-title" className="team-principles__title">
        <DecodeText text={t('pages.contact.team.title')} />
      </h2>
      <ol className="team-principles__list">
        {principles.map((key, index) => (
          <m.li key={key} className="team-principles__item" {...reveal(index * 0.12)}>
            <span className="team-principles__number">{String(index + 1).padStart(2, '0')}</span>
            <h3 className="team-principles__item-title">{t(`pages.contact.team.items.${key}.title`)}</h3>
            <p className="team-principles__text">{t(`pages.contact.team.items.${key}.text`)}</p>
          </m.li>
        ))}
      </ol>
    </section>
  )
}
