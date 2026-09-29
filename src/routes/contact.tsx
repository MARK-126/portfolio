import { useTranslation } from 'react-i18next'
import type { Route } from './+types/contact'
import { PageIntro } from '../components/PageIntro'
import { ContactForm } from '../components/contact/ContactForm'
import { ContactChannels } from '../components/contact/ContactChannels'
import { pageMeta } from '../config/meta'
import './contact.css'

export const meta: Route.MetaFunction = () =>
  pageMeta({
    title: 'Contact',
    description: 'Get in touch with Marcos Rio about data engineering, analytics or AI projects.',
  })

export default function Contact() {
  const { t } = useTranslation()

  return (
    <>
      <PageIntro tag={t('pages.contact.tag')} title={t('pages.contact.title')} intro={t('pages.contact.intro')} />
      <section className="container page-section contact-layout">
        <ContactForm />
        <ContactChannels />
      </section>
    </>
  )
}
