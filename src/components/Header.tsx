import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { useTranslation } from 'react-i18next'
import { languages } from '../i18n'
import { useLanguage } from '../hooks/useLanguage'
import { useTheme } from '../hooks/useTheme'
import { site } from '../config/site'
import { sections } from '../config/sections'
import { CloseIcon, MenuIcon, MoonIcon, SunIcon } from './Icons'
import './Header.css'

export function Header() {
  const { t } = useTranslation()
  const { language, setLanguage } = useLanguage()
  const { theme, toggleTheme } = useTheme()
  const themeLabel = theme === 'dark' ? t('theme.toLight') : t('theme.toDark')
  // Mobile menu (on wider screens the links are always visible and this has no effect). It stores the
  // page it was opened on, so it closes by itself after any navigation.
  const { pathname } = useLocation()
  const [menuPath, setMenuPath] = useState<string | null>(null)
  const menuOpen = menuPath === pathname
  const setMenuOpen = (open: boolean) => setMenuPath(open ? pathname : null)

  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuPath(null)
    }
    // A tap outside the header (on the page below the panel) also closes it
    const onPointerDown = (event: PointerEvent) => {
      if (!(event.target as Element).closest('.header')) setMenuPath(null)
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('pointerdown', onPointerDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('pointerdown', onPointerDown)
    }
  }, [menuOpen])

  return (
    <header className="header">
      <div className="header__inner container">
        <Link to="/" className="header__brand">
          {site.name}
        </Link>

        <nav id="header-nav" className="header__nav" data-open={menuOpen} aria-label={t('nav.label')}>
          {sections.map(section => (
            <NavLink key={section} to={`/${section}`} onClick={() => setMenuOpen(false)}>
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
          <button
            type="button"
            className="menu-toggle"
            aria-expanded={menuOpen}
            aria-controls="header-nav"
            aria-label={menuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <CloseIcon width={16} height={16} /> : <MenuIcon width={16} height={16} />}
          </button>
        </div>
      </div>
    </header>
  )
}
