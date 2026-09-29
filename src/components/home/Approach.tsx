import { useTranslation } from 'react-i18next'
import './Approach.css'

const principles = ['behavior', 'bias', 'trust'] as const

/** What psychology brings to the data work: the core of the positioning. */
export function Approach() {
  const { t } = useTranslation()

  return (
    <div className="approach">
      <p className="approach__intro">{t('home.approach.intro')}</p>
      <ol className="approach__list">
        {principles.map((key, index) => (
          <li key={key} className="approach__item">
            <span className="approach__number">{String(index + 1).padStart(2, '0')}</span>
            <h3 className="approach__title">{t(`home.approach.items.${key}.title`)}</h3>
            <p className="approach__text">{t(`home.approach.items.${key}.text`)}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}
