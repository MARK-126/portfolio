import { useTranslation } from 'react-i18next'
import { site } from '../config/site'
import { ArrowRightIcon, GithubIcon, LinkedinIcon, MailIcon } from './Icons'
import { PipelineCard } from './PipelineCard'
import './Hero.css'

const socialLinks = [
  { key: 'github', href: site.links.github, Icon: GithubIcon },
  { key: 'linkedin', href: site.links.linkedin, Icon: LinkedinIcon },
  { key: 'email', href: site.links.email && `mailto:${site.links.email}`, Icon: MailIcon },
] as const

export function Hero() {
  const { t } = useTranslation()

  return (
    <section id="top" className="hero">
      <div className="hero__inner container">
        <div className="hero__content">
          <p className="hero__status">
            <span className="pulse" aria-hidden="true" />
            {t('hero.status')}
          </p>

          <h1 className="hero__name">{site.name}</h1>
          <p className="hero__title">
            <span className="hero__prompt" aria-hidden="true">
              &gt;
            </span>
            {t('hero.title')}
            <span className="hero__caret" aria-hidden="true" />
          </p>
          <p className="hero__subtitle">{t('hero.subtitle')}</p>

          <div className="hero__cta">
            <a href="#projects" className="button button--primary">
              {t('hero.ctaProjects')}
              <ArrowRightIcon width={18} height={18} />
            </a>
            <a href="#contact" className="button button--ghost">
              {t('hero.ctaContact')}
            </a>
          </div>

          <ul className="hero__social">
            {socialLinks
              .filter(link => link.href)
              .map(({ key, href, Icon }) => (
                <li key={key}>
                  <a
                    href={href}
                    className="icon-button"
                    aria-label={t(`social.${key}`)}
                    title={t(`social.${key}`)}
                    {...(key !== 'email' && { target: '_blank', rel: 'noreferrer' })}
                  >
                    <Icon />
                  </a>
                </li>
              ))}
          </ul>
        </div>

        <PipelineCard />
      </div>
    </section>
  )
}
