import { useTranslation } from 'react-i18next'
import type { Route } from './+types/contact'
import { PageIntro } from '../components/PageIntro'
import { ContactForm } from '../components/contact/ContactForm'
import { ContactChannels } from '../components/contact/ContactChannels'
import { TeamPrinciples } from '../components/contact/TeamPrinciples'
import { pageMeta } from '../config/meta'
import './contact.css'

export const meta: Route.MetaFunction = ({ location }) =>
  pageMeta({
    path: location.pathname,
    title: 'Contacto',
    description: 'Escríbele a Marcos Rio sobre proyectos de ingeniería de datos, analítica o IA.',
  })

export default function Contact() {
  const { t } = useTranslation()

  return (
    <>
      <PageIntro tag={t('pages.contact.tag')} title={t('pages.contact.title')} intro={t('pages.contact.intro')} />
      <TeamPrinciples />
      <section className="container page-section contact-layout">
        <ContactForm />
        <ContactChannels />
      </section>
    </>
  )
}
