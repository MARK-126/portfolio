import type { ReactNode } from 'react'
import { BackLink } from './BackLink'
import './PageIntro.css'

type PageIntroProps = {
  tag: string
  title: string
  intro: string
  /** Where "back" goes when there is no previous page in the visit. */
  back?: string
  children?: ReactNode
}

/** Title with its closing punctuation in the accent color: "Proyectos." → "Proyectos" + amber "." */
function AccentEnding({ text }: { text: string }) {
  const match = /[.?!]$/.exec(text)
  if (!match) return text
  return (
    <>
      {text.slice(0, -1)}
      <span className="page-intro__dot">{match[0]}</span>
    </>
  )
}

/** Opening block shared by the inner pages: back link, mono tag, big title and a short intro. */
export function PageIntro({ tag, title, intro, back = '/', children }: PageIntroProps) {
  return (
    <section className="page-intro container">
      <BackLink fallback={back} />
      <p className="page-intro__tag">{tag}</p>
      <h1 className="page-intro__title">
        <AccentEnding text={title} />
      </h1>
      <p className="page-intro__text">{intro}</p>
      {children}
    </section>
  )
}
