import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import './Pager.css'

type PagerLink = { to: string; title: string }

type PagerProps = {
  label: string
  previous?: PagerLink
  next?: PagerLink
}

/** Previous / next links at the end of a case study or article. */
export function Pager({ label, previous, next }: PagerProps) {
  const { t } = useTranslation()
  if (!previous && !next) return null

  return (
    <nav className="pager" aria-label={label}>
      {previous ? (
        <Link to={previous.to} className="pager__link">
          <span className="pager__label">← {t('pager.previous')}</span>
          <span className="pager__title">{previous.title}</span>
        </Link>
      ) : (
        <span />
      )}
      {next && (
        <Link to={next.to} className="pager__link pager__link--next">
          <span className="pager__label">{t('pager.next')} →</span>
          <span className="pager__title">{next.title}</span>
        </Link>
      )}
    </nav>
  )
}
