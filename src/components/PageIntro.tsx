import type { ReactNode } from 'react'
import { BackLink } from './BackLink'
import { DecodeText } from './motion/DecodeText'
import './PageIntro.css'

type PageIntroProps = {
  tag: string
  title: string
  intro: string
  /** Where "back" goes when there is no previous page in the visit. */
  back?: string
  /** Extra class for page-specific tweaks. */
  className?: string
  children?: ReactNode
}

/**
 * Opening block shared by the inner pages, framed as a panel like the home's hero: back link, mono
 * tag, big uppercase title and a short intro.
 */
export function PageIntro({ tag, title, intro, back = '/', className, children }: PageIntroProps) {
  return (
    <section className={className ? `page-intro panel ${className}` : 'page-intro panel'}>
      <div className="page-intro__inner container">
        <BackLink fallback={back} />
        <p className="page-intro__tag">
          <DecodeText text={tag} />
        </p>
        <h1 className="page-intro__title">{title}</h1>
        <p className="page-intro__text">{intro}</p>
        {children}
      </div>
    </section>
  )
}
