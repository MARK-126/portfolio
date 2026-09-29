import { useTranslation } from 'react-i18next'
import { inferProfile, useBehaviorLog, type BehaviorEvent } from '../hooks/useBehaviorLog'
import './BehaviorPanel.css'

function clock(ms: number) {
  const seconds = ms / 1000
  const minutes = Math.floor(seconds / 60)
  return `${String(minutes).padStart(2, '0')}:${(seconds % 60).toFixed(1).padStart(4, '0')}`
}

function compact(value: number) {
  return value >= 1000 ? `${(value / 1000).toFixed(1)}k` : String(Math.round(value))
}

/** Activity per second as a tiny line chart. */
function Sparkline({ values }: { values: number[] }) {
  const max = Math.max(4, ...values)
  const step = 100 / (values.length - 1)
  const points = values.map((value, index) => `${(index * step).toFixed(2)},${(28 - (value / max) * 26).toFixed(2)}`)

  return (
    <svg className="behavior__sparkline" viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden="true">
      <polyline points={points.join(' ')} vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

function EventRow({ event }: { event: BehaviorEvent }) {
  return (
    <li className="behavior__row">
      <span className="behavior__time">{clock(event.at)}</span>
      <span className="behavior__type">{event.type}</span>
      <span className="behavior__detail">{event.detail}</span>
    </li>
  )
}

/**
 * "Data is behavior", demonstrated: a live log of how the visitor is using the page, with a few
 * metrics and a playful profile. Everything stays in the browser.
 */
export function BehaviorPanel() {
  const { t } = useTranslation()
  const { events, stats, live } = useBehaviorLog()
  const profile = inferProfile(stats)

  return (
    <section className="behavior" aria-label={t('behavior.label')}>
      <header className="behavior__bar">
        <code>{t('behavior.file')}</code>
        <span className={`behavior__live${live ? ' is-live' : ''}`}>
          <span className="behavior__dot" aria-hidden="true" />
          {t('behavior.live')}
        </span>
      </header>

      <ol className="behavior__log" role="log" aria-live="off">
        {events.length === 0 ? (
          <li className="behavior__row behavior__row--empty">{t('behavior.waiting')}</li>
        ) : (
          events.map(event => <EventRow key={event.id} event={event} />)
        )}
      </ol>

      <dl className="behavior__stats">
        <div>
          <dt>{t('behavior.stats.time')}</dt>
          <dd>{clock(stats.elapsed).slice(0, 5)}</dd>
        </div>
        <div>
          <dt>{t('behavior.stats.cursor')}</dt>
          <dd>{compact(stats.distance)} px</dd>
        </div>
        <div>
          <dt>{t('behavior.stats.scroll')}</dt>
          <dd>{stats.scrollDepth}%</dd>
        </div>
        <div>
          <dt>{t('behavior.stats.events')}</dt>
          <dd>{stats.events}</dd>
        </div>
      </dl>

      <Sparkline values={stats.activity} />

      <p className="behavior__profile">
        <span className="behavior__profile-label">{t('behavior.profile')}</span>{' '}
        <strong>{t(`behavior.profiles.${profile.key}`)}</strong>
        <span className="behavior__confidence">
          {t('behavior.confidence', { value: profile.confidence, n: stats.events })}
        </span>
      </p>

      <footer className="behavior__privacy">{t('behavior.privacy')}</footer>
    </section>
  )
}
