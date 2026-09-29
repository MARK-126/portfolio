import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { site } from '../../config/site'
import './ContactForm.css'

const ENDPOINT = 'https://api.web3forms.com/submit'
const topics = ['project', 'job', 'other'] as const

type Status = 'idle' | 'sending' | 'sent' | 'error'
type Field = 'name' | 'email' | 'message'
type Errors = Partial<Record<Field, string>>

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function ContactForm() {
  const { t } = useTranslation()
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<Errors>({})
  const configured = site.contactFormKey !== ''

  function validate(form: FormData): Errors {
    const result: Errors = {}
    const name = String(form.get('name') ?? '').trim()
    const email = String(form.get('email') ?? '').trim()
    const message = String(form.get('message') ?? '').trim()
    if (!name) result.name = t('contact.errors.name')
    if (!EMAIL_PATTERN.test(email)) result.email = t('contact.errors.email')
    if (message.length < 10) result.message = t('contact.errors.message')
    return result
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formElement = event.currentTarget
    const form = new FormData(formElement)
    const found = validate(form)
    setErrors(found)
    if (Object.keys(found).length > 0) {
      const first = Object.keys(found)[0]
      formElement.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
      return
    }

    setStatus('sending')
    try {
      const topic = String(form.get('topic') ?? 'other')
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: site.contactFormKey,
          subject: `[${site.handle}] ${t(`contact.topics.${topic}`)} — ${form.get('name')}`,
          from_name: site.handle,
          name: form.get('name'),
          email: form.get('email'),
          topic: t(`contact.topics.${topic}`),
          message: form.get('message'),
          botcheck: form.get('botcheck') ? true : '',
        }),
      })
      const result = (await response.json()) as { success?: boolean }
      if (!response.ok || !result.success) throw new Error('Submission failed')
      setStatus('sent')
      formElement.reset()
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div className="contact-form__done" role="status">
        <p className="contact-form__done-title">{t('contact.sent.title')}</p>
        <p>{t('contact.sent.text')}</p>
        <button type="button" className="button button--link" onClick={() => setStatus('idle')}>
          {t('contact.sent.again')}
        </button>
      </div>
    )
  }

  const fieldProps = (field: Field) => ({
    id: `contact-${field}`,
    name: field,
    'aria-invalid': errors[field] ? true : undefined,
    'aria-describedby': errors[field] ? `contact-${field}-error` : undefined,
    onChange: () => errors[field] && setErrors(current => ({ ...current, [field]: undefined })),
  })

  const fieldError = (field: Field) =>
    errors[field] && (
      <p id={`contact-${field}-error`} className="contact-form__error">
        {errors[field]}
      </p>
    )

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <fieldset className="contact-form__topics">
        <legend>{t('contact.topicLabel')}</legend>
        {topics.map((topic, index) => (
          <label key={topic}>
            <input type="radio" name="topic" value={topic} defaultChecked={index === 0} />
            <span>{t(`contact.topics.${topic}`)}</span>
          </label>
        ))}
      </fieldset>

      <div className="contact-form__row">
        <div className="contact-form__field">
          <label htmlFor="contact-name">{t('contact.name')}</label>
          <input type="text" autoComplete="name" {...fieldProps('name')} />
          {fieldError('name')}
        </div>
        <div className="contact-form__field">
          <label htmlFor="contact-email">{t('contact.email')}</label>
          <input type="email" autoComplete="email" {...fieldProps('email')} />
          {fieldError('email')}
        </div>
      </div>

      <div className="contact-form__field">
        <label htmlFor="contact-message">{t('contact.message')}</label>
        <textarea rows={6} placeholder={t('contact.messagePlaceholder')} {...fieldProps('message')} />
        {fieldError('message')}
      </div>

      {/* Honeypot: hidden from people, bots tend to fill it in */}
      <input type="checkbox" name="botcheck" className="visually-hidden" tabIndex={-1} aria-hidden="true" />

      <div className="contact-form__footer">
        <button type="submit" className="button button--solid" disabled={!configured || status === 'sending'}>
          {status === 'sending' ? t('contact.sending') : t('contact.send')}
        </button>
        <p className="contact-form__status" role="status">
          {!configured && t('contact.notConfigured', { email: site.links.email })}
          {status === 'error' && t('contact.error', { email: site.links.email })}
        </p>
      </div>
    </form>
  )
}
