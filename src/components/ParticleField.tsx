import { useEffect, useRef } from 'react'
import './ParticleField.css'

type Particle = {
  x: number
  noise: number // vertical position while it is still "raw"
  band: number // offset inside the signal band once ordered
  speed: number
  size: number
  alpha: number
  phase: number
  source: number // index in `sources`, or -1 for the main stream entering from the left
  // Displacement caused by the pointer, eased back to 0
  ox: number
  oy: number
}

/** A dot flowing along one of the delivery lines. */
type Flow = {
  line: number
  x: number
  jitter: number
  speed: number
  size: number
  alpha: number
  ox: number
  oy: number
}

/** A secondary stream of raw data entering from a screen edge and merging into the wave. */
type Source = {
  startX: number
  startY: number
  mergeX: number
  curve: number // > 1 keeps the stream near its edge longer before it turns towards the wave
  spread: number // half-width of the stream where it enters
}

type Dust = { x: number; y: number; vx: number; vy: number; alpha: number }
type Rgb = [number, number, number]
type Rect = { left: number; top: number; right: number; bottom: number }

const POINTER_RADIUS = 120
const POINTER_PUSH = 28
/** Soft margin (px) around text blocks where particles fade out. */
const TEXT_MARGIN = 56

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
 * Decorative canvas: scattered white particles drift left to right and converge into an amber
 * wave — raw data becoming the signal. On wide screens two fainter streams join it from the top
 * and bottom edges (many sources, one pipeline). The wave then splits into lines flowing to each consumer of
 * the pipeline (`branches` are their labels). Everything moves away from the pointer, and particles
 * fade out around the hero's text so it stays readable.
 */
export function ParticleField({ branches }: { branches: string[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const labelsRef = useRef(branches)

  useEffect(() => {
    labelsRef.current = branches
  }, [branches])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    const hero = canvas?.parentElement
    if (!canvas || !ctx || !hero) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const finePointer = window.matchMedia('(pointer: fine)').matches
    let width = 0
    let height = 0
    let narrow = false
    let center = 0
    let amplitude = 0
    let splitX = 0 // where the wave splits
    let fanEndX = 0 // where the lines reach their final spread
    let contentRight = 0 // right edge of the page grid: labels end here
    let offsets: number[] = []
    let sources: Source[] = []
    let textRects: Rect[] = []
    let particles: Particle[] = []
    let flows: Flow[] = []
    let dust: Dust[] = []
    let raw: Rgb = [235, 235, 240]
    let signal: Rgb = [245, 176, 65]
    let frame = 0
    let visible = true
    const pointer = { x: -9999, y: -9999, active: false }

    const readColors = () => {
      raw = readRgb(canvas, '--particle-rgb', raw)
      signal = readRgb(canvas, '--accent-rgb', signal)
    }

    /** Text blocks and the page grid, relative to the canvas. */
    const measureLayout = () => {
      const origin = canvas.getBoundingClientRect()
      textRects = [
        ...hero.querySelectorAll('.hero__headline > span, .hero__subtitle, .hero__cta, .hero__status, .hero__scroll'),
      ].map(element => {
        const rect = element.getBoundingClientRect()
        return {
          left: rect.left - origin.left,
          top: rect.top - origin.top,
          right: rect.right - origin.left,
          bottom: rect.bottom - origin.top,
        }
      })
      const inner = hero.querySelector('.hero__inner')
      if (inner) {
        const style = getComputedStyle(inner)
        const rect = inner.getBoundingClientRect()
        contentRight = rect.right - origin.left - parseFloat(style.paddingRight)
      } else {
        contentRight = width
      }
    }

    /** y of a delivery line at a given x (the fan opens between splitX and fanEndX). */
    const lineY = (line: number, x: number) => center + offsets[line] * smoothstep(splitX, fanEndX, x)

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      measureLayout()

      narrow = width < 900
      // 0 up to laptop widths, 1 on large monitors, where there is room right of the headline
      const roomy = narrow ? 0 : smoothstep(1440, 1800, width)
      const lerp = (a: number, b: number) => a + (b - a) * roomy
      center = height * (narrow ? 0.82 : 0.6)
      amplitude = Math.min(narrow ? 55 : 150, height * 0.13)
      // The lines finish opening before the labels, which end at the page grid's right edge
      fanEndX = contentRight - (narrow ? 0 : 170)
      splitX = narrow ? fanEndX - 140 : Math.min(width * lerp(0.64, 0.62), fanEndX - lerp(260, 320))

      // On large monitors the fan opens over most of the height (more room above the wave than below)
      const lineCount = Math.max(1, labelsRef.current.length)
      const spread = Math.min(narrow ? 45 : 170, height * 0.17)
      const up = lerp(spread, height * 0.4)
      const down = lerp(spread, height * 0.24)
      offsets = Array.from({ length: lineCount }, (_, index) =>
        lineCount === 1 ? 0 : -up + (index / (lineCount - 1)) * (up + down),
      )

      // Secondary sources: one rising from the bottom edge and, on large monitors, one falling from
      // the top edge into the split (on smaller screens it would run behind the whole headline)
      sources = narrow
        ? []
        : [
            { startX: splitX * 0.3, startY: height + 20, mergeX: splitX * 0.8, curve: 0.9, spread: 32 },
            ...(width >= 1600 ? [{ startX: splitX * 0.55, startY: -20, mergeX: splitX, curve: 2.5, spread: 22 }] : []),
          ]

      const count = Math.round(Math.min(3000, (width * height) / 400))
      particles = Array.from({ length: count }, () => {
        // Most particles belong to the main stream; the rest are split between the secondary sources
        const source = sources.length && Math.random() < 0.3 ? Math.floor(Math.random() * sources.length) : -1
        const startX = source >= 0 ? sources[source].startX : 0
        return {
          x: startX + Math.random() * (splitX - startX),
          source,
          noise: (Math.random() - 0.5) * 2,
          band: (Math.random() - 0.5) * 2,
          speed: 0.12 + Math.random() * 0.32,
          size: Math.random() < 0.85 ? 1.3 : 1.9,
          alpha: 0.35 + Math.random() * 0.65,
          phase: Math.random() * Math.PI * 2,
          ox: 0,
          oy: 0,
        }
      })

      // Dots flowing along the delivery lines, from the split to the right edge of the screen
      const perLine = Math.round((width - splitX) / 3)
      flows = offsets.flatMap((_, line) =>
        Array.from({ length: perLine }, () => ({
          line,
          x: splitX + Math.random() * (width - splitX),
          jitter: (Math.random() - 0.5) * 2.4,
          speed: 0.15 + Math.random() * 0.25,
          size: Math.random() < 0.8 ? 1.4 : 2,
          alpha: 0.45 + Math.random() * 0.55,
          ox: 0,
          oy: 0,
        })),
      )

      // Sparse, faint dust over the right half to balance wide screens
      dust = Array.from({ length: Math.round(count * 0.08) }, () => ({
        x: width * (0.45 + Math.random() * 0.55),
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.08,
        vy: (Math.random() - 0.5) * 0.08,
        alpha: 0.06 + Math.random() * 0.18,
      }))
    }

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height)
      const t = time / 1000
      const animate = !reducedMotion
      const wavelength = Math.max(360, splitX * 0.5)

      for (const d of dust) {
        const alpha = d.alpha * smoothstep(0.4, 0.75, d.x / width) * textClearance(d.x, d.y, textRects)
        if (alpha > 0.01) {
          ctx.fillStyle = rgba(raw, alpha)
          ctx.fillRect(d.x, d.y, 1, 1)
        }
        if (animate) {
          d.x += d.vx
          d.y += d.vy
          if (d.x < width * 0.4 || d.x > width) d.vx *= -1
          if (d.y < 0 || d.y > height) d.vy *= -1
        }
      }

      // Delivery lines: amber dots flowing to each consumer, fading out at the screen edge
      for (const flow of flows) {
        const baseY = lineY(flow.line, flow.x) + flow.jitter
        if (animate) repel(flow, flow.x, baseY, pointer)
        const x = flow.x + flow.ox
        const y = baseY + flow.oy
        const alpha = flow.alpha * (1 - smoothstep(width - 60, width, x)) * textClearance(x, y, textRects)
        if (alpha > 0.01) {
          ctx.fillStyle = rgba(signal, alpha)
          ctx.fillRect(x, y, flow.size, flow.size)
        }
        if (animate) {
          flow.x += flow.speed
          if (flow.x > width) flow.x = splitX
        }
      }

      // Labels for each consumer, right-aligned to the page grid (wide screens only)
      if (!narrow) {
        ctx.font = '500 11px "IBM Plex Mono", ui-monospace, monospace'
        ctx.textAlign = 'right'
        ctx.textBaseline = 'bottom'
        ctx.fillStyle = rgba(raw, 0.55)
        offsets.forEach((_, index) => {
          const label = labelsRef.current[index]
          if (label) ctx.fillText(label.toUpperCase(), contentRight, lineY(index, contentRight) - 8)
        })
      }

      for (const p of particles) {
        const progress = p.x / splitX
        const source = p.source >= 0 ? sources[p.source] : undefined
        // How far a secondary stream has travelled from its edge to the wave (0..1)
        const along = source ? Math.min(1, Math.max(0, (p.x - source.startX) / (source.mergeX - source.startX))) : 0
        // 0 = raw noise, 1 = on the signal wave
        const order = source ? smoothstep(0.55, 1, along) : smoothstep(0.35, 0.82, progress)
        // The wave flattens right before the split, so every line starts at the same point
        const envelope = 1 - smoothstep(0.75, 1, progress)
        const drift = Math.sin(t * 0.45 + p.phase + p.x * 0.004)
        const rawY = source
          ? source.startY +
            (center - source.startY) * along ** source.curve +
            p.noise * source.spread * (1 - along * 0.7) +
            drift * 8
          : height * (0.58 + p.noise * 0.34) + drift * 30
        const phase = (p.x / wavelength) * Math.PI * 2
        const waveY =
          center +
          (Math.sin(phase - t * 0.5) * amplitude + Math.sin(phase * 2.3 + t * 0.35) * amplitude * 0.22) * envelope +
          p.band * (2.5 + 14 * (1 - order))
        const baseY = rawY + (waveY - rawY) * order

        if (animate) repel(p, p.x, baseY, pointer)

        const x = p.x + p.ox
        const y = baseY + p.oy
        // White while raw, amber once the particle is on the wave
        const mix = smoothstep(0.62, 0.92, progress) * order
        const color: Rgb = [
          Math.round(raw[0] + (signal[0] - raw[0]) * mix),
          Math.round(raw[1] + (signal[1] - raw[1]) * mix),
          Math.round(raw[2] + (signal[2] - raw[2]) * mix),
        ]
        // Secondary streams stay faint until they join the wave
        const entry = source ? 0.3 + 0.7 * smoothstep(0.3, 1, along) : smoothstep(0.1, 0.5, progress) * 0.8 + 0.2
        const fade = entry * textClearance(x, y, textRects)

        if (fade > 0.01) {
          ctx.fillStyle = rgba(color, p.alpha * fade)
          ctx.fillRect(x, y, p.size, p.size)
        }

        if (animate) {
          p.x += p.speed * (1 - order * 0.35)
          // Particles "enter the pipeline" at the split and come back as new raw data
          if (p.x > splitX) p.x = source ? source.startX : 0
        }
      }
    }

    const loop = (time: number) => {
      if (visible) draw(time)
      frame = requestAnimationFrame(loop)
    }

    readColors()
    resize()
    if (reducedMotion) draw(0)
    else frame = requestAnimationFrame(loop)

    const onResize = () => {
      resize()
      if (reducedMotion) draw(0)
    }
    window.addEventListener('resize', onResize)
    // Text can reflow after web fonts load or the language changes: re-measure it
    void document.fonts?.ready.then(onResize)
    const textObserver = new ResizeObserver(measureLayout)
    hero
      .querySelectorAll('.hero__headline, .hero__subtitle, .hero__cta')
      .forEach(element => textObserver.observe(element))

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

    // Re-read the colors when the theme changes; redraw static frames when the language changes
    const themeObserver = new MutationObserver(() => {
      readColors()
      if (reducedMotion) draw(0)
    })
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'lang'] })

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
