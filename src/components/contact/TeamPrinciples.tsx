import { useTranslation } from 'react-i18next'
import './TeamPrinciples.css'

const principles = ['firstToKnow', 'product', 'small'] as const

/** What working together looks like, shown above the contact form. */
export function TeamPrinciples() {
  const { t } = useTranslation()

  return (
    <section className="container team-principles" aria-labelledby="team-principles-title">
      <h2 id="team-principles-title" className="team-principles__title">
        {t('pages.contact.team.title')}
      </h2>
      <ol className="team-principles__list">
        {principles.map((key, index) => (
          <li key={key} className="team-principles__item">
            <span className="team-principles__number">{String(index + 1).padStart(2, '0')}</span>
            <h3 className="team-principles__item-title">{t(`pages.contact.team.items.${key}.title`)}</h3>
            <p className="team-principles__text">{t(`pages.contact.team.items.${key}.text`)}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
