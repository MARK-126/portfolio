import { useTranslation } from 'react-i18next'
import { languages } from '../i18n'
import { useTheme } from '../hooks/useTheme'
import { site } from '../config/site'
import { MoonIcon, SunIcon } from './Icons'
import './Header.css'

const sections = ['work', 'notes', 'lab', 'contact'] as const

export function Header() {
  const { t, i18n } = useTranslation()
  const { theme, toggleTheme } = useTheme()
  const current = i18n.resolvedLanguage
  const themeLabel = theme === 'dark' ? t('theme.toLight') : t('theme.toDark')

  return (
    <header className="header">
      <div className="header__inner container">
        <a href="#top" className="header__brand">
          <span className="header__name">{site.handle}</span>
          <span className="header__tagline">{t('header.tagline')}</span>
        </a>

        <nav className="header__nav" aria-label={t('nav.label')}>
          {sections.map(section => (
            <a key={section} href={`#${section}`}>
              {t(`nav.${section}`)}
            </a>
          ))}
        </nav>

        <div className="header__actions">
          <div className="lang-switch" role="group" aria-label={t('language.label')}>
            {languages.map(lng => (
              <button
                key={lng}
                type="button"
                aria-pressed={current === lng}
                onClick={() => void i18n.changeLanguage(lng)}
              >
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
