import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import type { Route } from './+types/not-found'
import { PageIntro } from '../components/PageIntro'
import { pageMeta } from '../config/meta'

export const meta: Route.MetaFunction = () => [
  ...pageMeta({ title: 'Not found', description: 'This page does not exist.' }),
  { name: 'robots', content: 'noindex' },
]

// Catch-all route, prerendered as /404.html.
export default function NotFound() {
  const { t } = useTranslation()

  return (
    <PageIntro tag="404" title={t('notFound.title')} intro={t('notFound.intro')}>
      <p className="page-intro__actions">
        <Link to="/" className="button button--outline">
          {t('notFound.home')}
        </Link>
      </p>
    </PageIntro>
  )
}
