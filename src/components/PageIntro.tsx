import type { ReactNode } from 'react'
import './PageIntro.css'

type PageIntroProps = {
  tag: string
  title: string
  intro: string
  children?: ReactNode
}

/** Opening block shared by the inner pages: mono tag, big title and a short intro. */
export function PageIntro({ tag, title, intro, children }: PageIntroProps) {
  return (
    <section className="page-intro container">
      <p className="page-intro__tag">{tag}</p>
      <h1 className="page-intro__title">{title}</h1>
      <p className="page-intro__text">{intro}</p>
      {children}
    </section>
  )
}
