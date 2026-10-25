import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { m } from 'motion/react'
import { reveal } from '../motion/reveal'
import './HomeSection.css'

type HomeSectionProps = {
  index: string
  title: string
  link?: { to: string; label: string }
  children: ReactNode
}

/** Numbered block on the home page, optionally linking to the full section. */
export function HomeSection({ index, title, link, children }: HomeSectionProps) {
  return (
    <m.section className="home-section container" {...reveal()}>
      <header className="home-section__header">
        <span className="home-section__index cell-index">[{index}]</span>
        <h2 className="home-section__title">{title}</h2>
        {link && (
          <Link viewTransition to={link.to} className="button button--link home-section__all">
            {link.label} <span aria-hidden="true">→</span>
          </Link>
        )}
      </header>
      {children}
    </m.section>
  )
}

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <p className="empty-state">
      <span className="empty-state__cursor" aria-hidden="true">
        _
      </span>
      {children}
    </p>
  )
}
