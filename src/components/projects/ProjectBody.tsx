import { Fragment, type ComponentType } from 'react'
import { BehaviorPanel } from '../BehaviorPanel'
import '../Prose.css'
import './ProjectBody.css'

/**
 * Interactive components that a project's Markdown can place in its body with
 * `<div data-embed="name"></div>` on its own line.
 */
const embeds: Record<string, ComponentType> = {
  'behavior-panel': BehaviorPanel,
}

const EMBED_MARKER = /<div data-embed="([\w-]+)"><\/div>/

/** Markdown body rendered at build time, with embed markers replaced by live components. */
export function ProjectBody({ html, lang }: { html: string; lang: string }) {
  // split() with a capture group alternates: html, embed name, html, embed name, html...
  const parts = html.split(EMBED_MARKER)

  return (
    <div className="case-study__body" lang={lang}>
      {parts.map((part, index) => {
        if (index % 2 === 1) {
          const Embed = embeds[part]
          return Embed ? (
            <div key={`embed-${part}`} className="project-embed">
              <Embed />
            </div>
          ) : null
        }
        return part.trim() ? (
          <Fragment key={part}>
            {/* Trusted HTML rendered at build time from Markdown files in this repo. */}
            {/* eslint-disable-next-line react-dom/no-dangerously-set-innerhtml */}
            <div className="prose" dangerouslySetInnerHTML={{ __html: part }} />
          </Fragment>
        ) : null
      })}
    </div>
  )
}
