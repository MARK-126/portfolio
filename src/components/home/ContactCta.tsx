import { Link } from 'react-router'
import { m } from 'motion/react'
import { reveal } from '../motion/reveal'
import { useTranslation } from 'react-i18next'
import './ContactCta.css'

/** Closing block of the home page, inverted against the page: the word, its echo, the call. */
export function ContactCta() {
  const { t } = useTranslation()

  return (
    <section className="contact-cta panel" aria-labelledby="contact-cta-title">
      <m.h2 className="contact-cta__title" id="contact-cta-title" {...reveal()}>
        <span>{t('home.contact.line1')}</span>
        <span className="contact-cta__echo" aria-hidden="true">
          {t('home.contact.line1')}
        </span>
        <span>{t('home.contact.line2')}</span>
      </m.h2>
      <div className="contact-cta__foot">
        <p className="contact-cta__text">{t('home.contact.text')}</p>
        <Link viewTransition to="/contact" className="button contact-cta__button">
          {t('home.contact.cta')} <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  )
}
