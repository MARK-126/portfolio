import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import { site } from '../config/site'
import { sections } from '../config/sections'
import './Footer.css'

const year = new Date().getFullYear()

const socialLinks = [
  { key: 'github', href: site.links.github },
  { key: 'linkedin', href: site.links.linkedin },
  { key: 'email', href: site.links.email && `mailto:${site.links.email}` },
] as const

export function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="footer">
      <div className="footer__inner container">
        <p className="footer__copy">
          © {year} {site.name}. {t('footer.rights')}
        </p>

        <nav className="footer__links" aria-label={t('nav.footerLabel')}>
          {sections.map(section => (
            <Link key={section} to={`/${section}`}>
              {t(`nav.${section}`)}
            </Link>
          ))}
        </nav>

        <ul className="footer__links">
          {socialLinks
            .filter(link => link.href)
            .map(({ key, href }) => (
              <li key={key}>
                <a href={href} {...(key !== 'email' && { target: '_blank', rel: 'noreferrer' })}>
                  {t(`social.${key}`)} <span aria-hidden="true">↗</span>
                </a>
              </li>
            ))}
        </ul>
      </div>
    </footer>
  )
}
