import { useEffect, useRef } from 'react'
import './ParticleField.css'

/** A unit of data: flickering static while raw, a hard streak once it falls into its lane. */
type Streak = {
  x: number
  y: number
  vy: number
  speed: number
  lane: number // index in `lanes`
  size: number
  // Displacement caused by the pointer, eased back to 0
  ox: number
  oy: number
}

type Rgb = [number, number, number]
type Rect = { left: number; top: number; right: number; bottom: number }

const POINTER_RADIUS = 120
const POINTER_PUSH = 28
/** Soft margin (px) around text blocks where particles fade out. */
const TEXT_MARGIN = 40
const LANE_COUNT = 5
/** Frames simulated before the first paint, so the field opens already flowing into its lanes. */
const WARM_UP = 260

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)))
  return t * t * (3 - 2 * t)
}

function readRgb(element: Element, name: string, fallback: Rgb): Rgb {
  const parts = getComputedStyle(element).getPropertyValue(name).split(',').map(Number)
  return parts.length === 3 && parts.every(Number.isFinite) ? (parts as Rgb) : fallback
}

const rgba = ([r, g, b]: Rgb, alpha: number) => `rgba(${r}, ${g}, ${b}, ${alpha})`

/** 1 far from every text block, fading to 0 inside them, so particles never sit behind text. */
function textClearance(x: number, y: number, rects: Rect[]) {
  let clearance = 1
  for (const rect of rects) {
    const dx = Math.max(rect.left - x, 0, x - rect.right)
    const dy = Math.max(rect.top - y, 0, y - rect.bottom)
    clearance = Math.min(clearance, smoothstep(0, TEXT_MARGIN, Math.hypot(dx, dy)))
  }
  return clearance
}

/** Moves a point away from the pointer; returns the eased displacement. */
function repel(
  point: { ox: number; oy: number },
  x: number,
  y: number,
  pointer: { x: number; y: number; active: boolean },
) {
  let tx = 0
  let ty = 0
  if (pointer.active) {
    const dx = x - pointer.x
    const dy = y - pointer.y
    const dist = Math.hypot(dx, dy)
    if (dist < POINTER_RADIUS && dist > 0.01) {
      const force = (1 - dist / POINTER_RADIUS) ** 2 * POINTER_PUSH
      tx = (dx / dist) * force
      ty = (dy / dist) * force
    }
  }
  point.ox += (tx - point.ox) * 0.12
  point.oy += (ty - point.oy) * 0.12
}

/**
 * Decorative canvas for the hero: static enters from the left and, past the middle, falls into a
 * few straight lanes that were drawn (dashed) across the whole field before any data reached them:
 * the shape of the data exists before the data does. Everything moves away from the pointer, and
 * particles fade out around the hero's text so it stays readable.
 */
export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    const hero = canvas?.parentElement
    if (!canvas || !ctx || !hero) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const finePointer = window.matchMedia('(pointer: fine)').matches
    let width = 0
    let height = 0
    let lanes: number[] = []
    let textRects: Rect[] = []
    let streaks: Streak[] = []
    let color: Rgb = [241, 241, 239]
    let frame = 0
    let visible = true
    const pointer = { x: -9999, y: -9999, active: false }

    const readColors = () => {
      color = readRgb(canvas, '--particle-rgb', color)
    }

    /** Text blocks relative to the canvas; the lanes run through the free band between them. */
    const measureLayout = () => {
      const origin = canvas.getBoundingClientRect()
      const toRect = (element: Element): Rect => {
        const rect = element.getBoundingClientRect()
        return {
          left: rect.left - origin.left,
          top: rect.top - origin.top,
          right: rect.right - origin.left,
          bottom: rect.bottom - origin.top,
        }
      }
      textRects = [...hero.querySelectorAll('.hero__kicker, .hero__lede, .hero__cta, .hero__status')].map(toRect)
      const headline = hero.querySelector('.hero__headline')
      const top = Math.max(0, ...textRects.map(rect => rect.bottom)) + 32
      const bottom = headline ? toRect(headline).top - 24 : height * 0.7
      // Short screens leave no free band: spread the lanes over the middle of the hero instead
      const [from, to] = bottom - top > 120 ? [top, bottom] : [height * 0.25, height * 0.6]
      lanes = Array.from({ length: LANE_COUNT }, (_, index) => from + ((index + 0.5) / LANE_COUNT) * (to - from))
    }

    const spawn = (streak: Partial<Streak>, anywhere: boolean): Streak => {
      const lane = Math.floor(Math.random() * LANE_COUNT)
      const spread = (lanes[LANE_COUNT - 1] - lanes[0]) * 0.8 + 80
      return Object.assign(streak, {
        x: anywhere ? Math.random() * width : -20 - Math.random() * width * 0.3,
        y: lanes[lane] + (Math.random() - 0.5) * spread,
        vy: (Math.random() - 0.5) * 2,
        speed: 0.7 + Math.random() * 1.6,
        lane,
        size: Math.random() < 0.85 ? 1.3 : 2,
        ox: 0,
        oy: 0,
      })
    }

    /** Advances one frame; returns how filtered the streak is (0 = raw static, 1 = in its lane). */
    const step = (streak: Streak) => {
      const filtered = smoothstep(0.45, 0.68, streak.x / width)
      streak.vy += (Math.random() - 0.5) * 1.2 * (1 - filtered)
      streak.vy *= 0.9
      streak.y += streak.vy * (1 - filtered) + (lanes[streak.lane] - streak.y) * 0.08 * filtered
      streak.x += streak.speed * (1 + filtered)
      if (streak.x > width + 40) spawn(streak, false)
      return filtered
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      measureLayout()
      const count = Math.round(Math.min(320, (width * height) / 3600))
      streaks = Array.from({ length: count }, () => spawn({}, true))
      for (let i = 0; i < WARM_UP; i++) streaks.forEach(step)
    }

    const draw = (animate: boolean) => {
      ctx.clearRect(0, 0, width, height)

      // The lanes exist before the data: faint dashed lines across the whole field
      ctx.save()
      ctx.strokeStyle = rgba(color, 0.08)
      ctx.lineWidth = 1
      ctx.setLineDash([2, 8])
      for (const y of lanes) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.stroke()
      }
      ctx.restore()

      for (const streak of streaks) {
        const filtered = animate ? step(streak) : smoothstep(0.45, 0.68, streak.x / width)
        if (animate) repel(streak, streak.x, streak.y, pointer)
        const x = streak.x + streak.ox
        const y = streak.y + streak.oy
        const clearance = textClearance(x, y, textRects)
        if (clearance < 0.01) continue

        if (filtered < 1) {
          // Raw static: square specks that flicker
          if (animate && Math.random() < 0.3) continue
          ctx.fillStyle = rgba(color, (0.15 + Math.random() * 0.4) * clearance)
          ctx.fillRect(x, y, streak.size, streak.size)
        } else {
          ctx.strokeStyle = rgba(color, 0.6 * clearance)
          ctx.lineWidth = streak.size * 0.6
          ctx.beginPath()
          ctx.moveTo(x - streak.speed * 14, y)
          ctx.lineTo(x, y)
          ctx.stroke()
        }
      }
    }

    const loop = () => {
      if (visible) draw(true)
      frame = requestAnimationFrame(loop)
    }

    readColors()
    resize()
    if (reducedMotion) draw(false)
    else frame = requestAnimationFrame(loop)

    const onResize = () => {
      resize()
      if (reducedMotion) draw(false)
    }
    window.addEventListener('resize', onResize)
    // Text can reflow after web fonts load or the language changes: re-measure it
    void document.fonts?.ready.then(onResize)
    const textObserver = new ResizeObserver(() => {
      measureLayout()
      if (reducedMotion) draw(false)
    })
    hero.querySelectorAll('.hero__headline, .hero__lede, .hero__top').forEach(element => textObserver.observe(element))

    // The canvas ignores pointer events (text and buttons sit on top), so track the pointer on the window
    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      pointer.x = event.clientX - rect.left
      pointer.y = event.clientY - rect.top
      pointer.active = pointer.y >= 0 && pointer.y <= rect.height
    }
    const onPointerLeave = () => {
      pointer.active = false
    }
    if (finePointer && !reducedMotion) {
      window.addEventListener('pointermove', onPointerMove, { passive: true })
      document.documentElement.addEventListener('pointerleave', onPointerLeave)
    }

    // Pause when the hero is off screen
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
    })
    observer.observe(canvas)

    // Re-read the color when the theme changes
    const themeObserver = new MutationObserver(() => {
      readColors()
      if (reducedMotion) draw(false)
    })
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onPointerMove)
      document.documentElement.removeEventListener('pointerleave', onPointerLeave)
      textObserver.disconnect()
      observer.disconnect()
      themeObserver.disconnect()
    }
  }, [])

  return <canvas ref={canvasRef} className="particle-field" aria-hidden="true" />
}
