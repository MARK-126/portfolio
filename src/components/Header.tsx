import { Link, NavLink } from 'react-router'
import { useTranslation } from 'react-i18next'
import { languages } from '../i18n'
import { useLanguage } from '../hooks/useLanguage'
import { useTheme } from '../hooks/useTheme'
import { site } from '../config/site'
import { sections } from '../config/sections'
import { MoonIcon, SunIcon } from './Icons'
import './Header.css'

export function Header() {
  const { t } = useTranslation()
  const { language, setLanguage } = useLanguage()
  const { theme, toggleTheme } = useTheme()
  const themeLabel = theme === 'dark' ? t('theme.toLight') : t('theme.toDark')

  return (
    <header className="header">
      <div className="header__inner container">
        <Link to="/" className="header__brand">
          {site.handle}
        </Link>

        <nav className="header__nav" aria-label={t('nav.label')}>
          {sections.map(section => (
            <NavLink key={section} to={`/${section}`}>
              {t(`nav.${section}`)}
            </NavLink>
          ))}
        </nav>

        <div className="header__actions">
          <div className="lang-switch" role="group" aria-label={t('language.label')}>
            {languages.map(lng => (
              <button key={lng} type="button" aria-pressed={language === lng} onClick={() => setLanguage(lng)}>
                {lng}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={themeLabel}
            title={themeLabel}
          >
            {theme === 'dark' ? <SunIcon width={15} height={15} /> : <MoonIcon width={15} height={15} />}
          </button>
        </div>
      </div>
    </header>
  )
}
