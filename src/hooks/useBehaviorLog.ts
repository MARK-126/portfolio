import { useEffect, useRef, useState } from 'react'

export type BehaviorEvent = {
  id: number
  /** Milliseconds since the session started. */
  at: number
  type: 'session_start' | 'pointer' | 'scroll' | 'hover' | 'click' | 'idle' | 'tab' | 'theme' | 'lang'
  detail: string
}

export type BehaviorStats = {
  elapsed: number
  distance: number
  scrollDepth: number
  events: number
  idles: number
  ctaHovers: number
  clicks: number
  /** Interactions per second over the last 30 seconds (oldest first). */
  activity: number[]
}

const MAX_EVENTS = 7
const IDLE_MS = 4000
const HISTORY_SECONDS = 30

const initialStats: BehaviorStats = {
  elapsed: 0,
  distance: 0,
  scrollDepth: 0,
  events: 0,
  idles: 0,
  ctaHovers: 0,
  clicks: 0,
  activity: Array<number>(HISTORY_SECONDS).fill(0),
}

/** Short, non-personal label for an interactive element. */
function describe(element: Element) {
  const tracked = element.getAttribute('data-track')
  if (tracked) return tracked
  const label = element.getAttribute('aria-label') ?? element.textContent ?? ''
  return label.trim().toLowerCase().replace(/\s+/g, '_').slice(0, 24) || element.tagName.toLowerCase()
}

/**
 * Records how the visitor interacts with the page, entirely in the browser: nothing is stored or
 * sent anywhere. Starts after hydration, so the prerendered HTML shows an empty log.
 */
export function useBehaviorLog() {
  const [events, setEvents] = useState<BehaviorEvent[]>([])
  const [stats, setStats] = useState<BehaviorStats>(initialStats)
  const [live, setLive] = useState(false)
  const nextId = useRef(0)

  useEffect(() => {
    const start = performance.now()
    const now = () => performance.now() - start
    const counters = { ...initialStats, activity: [...initialStats.activity] }
    let pendingDistance = 0
    let lastPointer: { x: number; y: number } | null = null
    let lastActivity = performance.now()
    let idleLogged = false
    let lastScrollLogged = 0
    let hovered: Element | null = null
    let secondActivity = 0

    const log = (type: BehaviorEvent['type'], detail: string) => {
      counters.events += 1
      const event = { id: nextId.current++, at: now(), type, detail }
      setEvents(current => [event, ...current].slice(0, MAX_EVENTS))
    }

    const touch = () => {
      lastActivity = performance.now()
      secondActivity += 1
      if (idleLogged) idleLogged = false
    }

    const html = document.documentElement
    // Start on the next task so the first client render matches the prerendered HTML
    const startTimer = window.setTimeout(() => {
      log(
        'session_start',
        `${html.lang} · ${html.dataset.theme ?? 'dark'} · ${window.innerWidth}×${window.innerHeight}`,
      )
      setLive(true)
    }, 0)

    const onPointerMove = (event: PointerEvent) => {
      if (lastPointer) pendingDistance += Math.hypot(event.clientX - lastPointer.x, event.clientY - lastPointer.y)
      lastPointer = { x: event.clientX, y: event.clientY }
      touch()
    }

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const depth = max > 0 ? Math.round((window.scrollY / max) * 100) : 0
      counters.scrollDepth = Math.max(counters.scrollDepth, depth)
      if (Math.abs(depth - lastScrollLogged) >= 10) {
        lastScrollLogged = depth
        log('scroll', `${depth}%`)
      }
      touch()
    }

    const onPointerOver = (event: PointerEvent) => {
      const target = (event.target as Element | null)?.closest('a, button, input, textarea, [data-track]')
      if (!target || target === hovered) return
      hovered = target
      if (target.getAttribute('data-track')?.startsWith('cta')) counters.ctaHovers += 1
      log('hover', describe(target))
    }

    const onClick = (event: MouseEvent) => {
      const target = (event.target as Element | null)?.closest('a, button, [data-track]')
      counters.clicks += 1
      log('click', target ? describe(target) : 'page')
      touch()
    }

    const onVisibility = () => log('tab', document.hidden ? 'hidden' : 'visible')

    const attributes = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        if (mutation.attributeName === 'data-theme') log('theme', html.dataset.theme ?? 'dark')
        if (mutation.attributeName === 'lang') log('lang', html.lang)
      }
    })
    attributes.observe(html, { attributes: true, attributeFilter: ['data-theme', 'lang'] })

    // Flush aggregated counters once per second to keep re-renders cheap
    const tick = window.setInterval(() => {
      if (pendingDistance > 40) log('pointer', `${Math.round(pendingDistance)} px`)
      counters.distance += pendingDistance
      pendingDistance = 0

      const idleFor = performance.now() - lastActivity
      if (!idleLogged && idleFor >= IDLE_MS) {
        idleLogged = true
        counters.idles += 1
        log('idle', `${(idleFor / 1000).toFixed(1)} s`)
      }

      counters.activity = [...counters.activity.slice(1), secondActivity]
      secondActivity = 0
      setStats({ ...counters, elapsed: now(), activity: counters.activity })
    }, 1000)

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('pointerover', onPointerOver)
    document.addEventListener('click', onClick)
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      window.clearTimeout(startTimer)
      window.clearInterval(tick)
      attributes.disconnect()
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('pointerover', onPointerOver)
      document.removeEventListener('click', onClick)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return { events, stats, live }
}

export type Profile = { key: 'newcomer' | 'decisive' | 'explorer' | 'reader' | 'observer'; confidence: number }

/** Tongue-in-cheek visitor profile from the session stats. */
export function inferProfile(stats: BehaviorStats): Profile {
  const confidence = Math.min(94, 38 + stats.events * 2 + Math.floor(stats.elapsed / 4000))
  if (stats.events < 4) return { key: 'newcomer', confidence: Math.min(confidence, 51) }
  if (stats.ctaHovers >= 1 && stats.elapsed < 20000) return { key: 'decisive', confidence }
  if (stats.scrollDepth >= 40) return { key: 'reader', confidence }
  if (stats.idles >= 2) return { key: 'observer', confidence }
  if (stats.distance > 2500) return { key: 'explorer', confidence }
  return { key: 'newcomer', confidence: Math.min(confidence, 60) }
}
