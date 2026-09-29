import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { site } from '../../config/site'
import './ContactChannels.css'

/** Direct ways to reach out, next to the form. */
export function ContactChannels() {
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)
  const { email, linkedin, github } = site.links

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard unavailable: the mailto link still works.
    }
  }

  return (
    <aside className="contact-channels" aria-label={t('contact.direct')}>
      <p className="contact-channels__label">{t('contact.direct')}</p>

      {email && (
        <div className="contact-channels__email">
          <a href={`mailto:${email}`}>
            {/* Allow a line break only before the @ */}
            {email.split('@')[0]}
            <wbr />@{email.split('@')[1]}
          </a>
          <button type="button" className="contact-channels__copy" onClick={copyEmail}>
            {copied ? t('contact.copied') : t('contact.copy')}
          </button>
          <span className="visually-hidden" role="status">
            {copied ? t('contact.copied') : ''}
          </span>
        </div>
      )}

      <ul className="contact-channels__links">
        {linkedin && (
          <li>
            <a href={linkedin} target="_blank" rel="noreferrer">
              LinkedIn <span aria-hidden="true">↗</span>
            </a>
          </li>
        )}
        {github && (
          <li>
            <a href={github} target="_blank" rel="noreferrer">
              GitHub <span aria-hidden="true">↗</span>
            </a>
          </li>
        )}
      </ul>
    </aside>
  )
}
