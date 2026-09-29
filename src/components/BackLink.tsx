import { Link, useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import './BackLink.css'

/** Position of the current entry in this visit's history (React Router stores it as `idx`). */
function historyIndex() {
  const state = window.history.state as { idx?: number } | null
  return state?.idx ?? 0
}

/**
 * "← Back": returns to the previous page of the site, or to `fallback` (the parent section) when
 * the visitor landed on this page directly. Renders a plain link, so it works before hydration.
 */
export function BackLink({ fallback }: { fallback: string }) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <Link
      to={fallback}
      className="back-link"
      onClick={event => {
        // Index 0 is the first page of the visit: going back would leave the site
        if (historyIndex() > 0) {
          event.preventDefault()
          void navigate(-1)
        }
      }}
    >
      <span className="back-link__arrow" aria-hidden="true">
        ←
      </span>
      {t('nav.back')}
    </Link>
  )
}
