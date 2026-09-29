import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import './ContactCta.css'

export function ContactCta() {
  const { t } = useTranslation()

  return (
    <section className="contact-cta">
      <div className="container">
        <h2 className="contact-cta__title">{t('home.contact.title')}</h2>
        <p className="contact-cta__text">{t('home.contact.text')}</p>
        <Link to="/contact" className="button button--solid">
          {t('home.contact.cta')}
        </Link>
      </div>
    </section>
  )
}
