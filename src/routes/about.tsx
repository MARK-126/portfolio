import { useTranslation } from 'react-i18next'
import type { Route } from './+types/about'
import { PageIntro } from '../components/PageIntro'
import { About } from '../components/about/About'
import { pageMeta } from '../config/meta'

export const meta: Route.MetaFunction = ({ location }) =>
  pageMeta({
    path: location.pathname,
    title: 'Sobre mí',
    description:
      'Marcos Rio: desarrollador backend en camino a data engineer, estudiante de Ciencia de Datos e IA y psicólogo. Experiencia, formación, stack y CV.',
  })

export default function AboutPage() {
  const { t } = useTranslation()

  return (
    <>
      <PageIntro tag={t('pages.about.tag')} title={t('pages.about.title')} intro={t('pages.about.intro')} />
      <section className="container page-section">
        <About />
      </section>
    </>
  )
}
