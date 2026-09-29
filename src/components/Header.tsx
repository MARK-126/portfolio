import { useTranslation } from 'react-i18next'
import { languages } from '../i18n'
import { useTheme } from '../hooks/useTheme'
import { site } from '../config/site'
import { MoonIcon, SunIcon } from './Icons'
import './Header.css'

const sections = ['news', 'projects', 'contact'] as const

function initials(name: string) {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
}

export function Header() {
  const { t, i18n } = useTranslation()
  const { theme, toggleTheme } = useTheme()
  const current = i18n.resolvedLanguage

  return (
    <header className="header">
      <div className="header__inner container">
        <a href="#top" className="header__brand" aria-label={site.name}>
          <span className="header__logo" aria-hidden="true">
            {initials(site.name)}
          </span>
          <span className="header__name">{site.name}</span>
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
                {lng.toUpperCase()}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="icon-button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? t('theme.toLight') : t('theme.toDark')}
            title={theme === 'dark' ? t('theme.toLight') : t('theme.toDark')}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </div>
    </header>
  )
}
