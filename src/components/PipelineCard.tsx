import type { CSSProperties } from 'react'
import { useTranslation } from 'react-i18next'
import './PipelineCard.css'

const stages = ['ingest', 'transform', 'serve'] as const

// Decorative "live pipeline" panel that hints at the data engineering theme.
export function PipelineCard() {
  const { t } = useTranslation()

  return (
    <figure className="pipeline" aria-label={t('pipeline.label')}>
      <div className="pipeline__bar">
        <span className="pipeline__dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <code>pipeline.yml</code>
      </div>

      <ol className="pipeline__stages">
        {stages.map((stage, index) => (
          <li key={stage} className="pipeline__stage" style={{ '--i': index } as CSSProperties}>
            <span className="pipeline__node" aria-hidden="true" />
            <code>
              <span className="pipeline__step">0{index + 1}</span> {t(`pipeline.${stage}`)}
            </code>
            <span className="pipeline__ok">✓</span>
          </li>
        ))}
      </ol>

      <figcaption className="pipeline__status">
        <span className="pulse" aria-hidden="true" />
        <code>status: {t('pipeline.healthy')}</code>
      </figcaption>
    </figure>
  )
}
