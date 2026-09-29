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
  // Displacement caused by the pointer, eased back to 0
  ox: number
  oy: number
}

type Dust = { x: number; y: number; vx: number; vy: number; alpha: number }
type Rgb = [number, number, number]

const POINTER_RADIUS = 110
const POINTER_PUSH = 26

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)))
  return t * t * (3 - 2 * t)
}

function readRgb(element: Element, name: string, fallback: Rgb): Rgb {
  const parts = getComputedStyle(element).getPropertyValue(name).split(',').map(Number)
  return parts.length === 3 && parts.every(Number.isFinite) ? (parts as Rgb) : fallback
}

/**
 * Decorative canvas: scattered white particles drift left to right and converge into a single
 * wave that turns amber — raw data becoming the signal. Particles move away from the pointer.
 */
export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const finePointer = window.matchMedia('(pointer: fine)').matches
    let width = 0
    let height = 0
    let particles: Particle[] = []
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

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const count = Math.round(Math.min(3200, (width * height) / 400))
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        noise: (Math.random() - 0.5) * 2,
        band: (Math.random() - 0.5) * 2,
        speed: 0.1 + Math.random() * 0.3,
        size: Math.random() < 0.85 ? 1.2 : 1.8,
        alpha: 0.35 + Math.random() * 0.65,
        phase: Math.random() * Math.PI * 2,
        ox: 0,
        oy: 0,
      }))

      // Sparse, faint dust over the right half to balance wide screens
      dust = Array.from({ length: Math.round(count * 0.1) }, () => ({
        x: width * (0.45 + Math.random() * 0.55),
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.08,
        vy: (Math.random() - 0.5) * 0.08,
        alpha: 0.08 + Math.random() * 0.2,
      }))
    }

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height)
      const t = time / 1000
      const animate = !reducedMotion
      const center = height * 0.56
      const amplitude = Math.min(90, height * 0.08)
      const wavelength = Math.max(420, width * 0.42)

      for (const d of dust) {
        ctx.fillStyle = `rgba(${raw[0]}, ${raw[1]}, ${raw[2]}, ${d.alpha * smoothstep(0.4, 0.75, d.x / width)})`
        ctx.fillRect(d.x, d.y, 1, 1)
        if (animate) {
          d.x += d.vx
          d.y += d.vy
          if (d.x < width * 0.4 || d.x > width) d.vx *= -1
          if (d.y < 0 || d.y > height) d.vy *= -1
        }
      }

      for (const p of particles) {
        const progress = p.x / width
        // 0 = raw noise on the left, 1 = on the signal wave on the right
        const order = smoothstep(0.3, 0.78, progress)
        const rawY = height * (0.56 + p.noise * 0.34) + Math.sin(t * 0.45 + p.phase + p.x * 0.004) * 30
        const phase = (p.x / wavelength) * Math.PI * 2
        const waveY =
          center +
          Math.sin(phase - t * 0.5) * amplitude +
          Math.sin(phase * 2.3 + t * 0.35) * amplitude * 0.25 +
          p.band * (2 + 10 * (1 - order))
        const baseY = rawY + (waveY - rawY) * order

        if (animate) {
          // Push away from the pointer, then ease back into place
          let tx = 0
          let ty = 0
          if (pointer.active) {
            const dx = p.x - pointer.x
            const dy = baseY - pointer.y
            const dist = Math.hypot(dx, dy)
            if (dist < POINTER_RADIUS && dist > 0.01) {
              const force = (1 - dist / POINTER_RADIUS) ** 2 * POINTER_PUSH
              tx = (dx / dist) * force
              ty = (dy / dist) * force
            }
          }
          p.ox += (tx - p.ox) * 0.12
          p.oy += (ty - p.oy) * 0.12
        }

        const x = p.x + p.ox
        const y = baseY + p.oy
        // White while raw, amber only once the particle is on the wave
        const mix = smoothstep(0.62, 0.95, progress) * order
        const r = Math.round(raw[0] + (signal[0] - raw[0]) * mix)
        const g = Math.round(raw[1] + (signal[1] - raw[1]) * mix)
        const b = Math.round(raw[2] + (signal[2] - raw[2]) * mix)
        // Fade towards the left so the headline stays readable
        const fade = smoothstep(0.05, 0.6, progress) * 0.8 + 0.2 * smoothstep(0.4, 0.8, y / height)

        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.alpha * fade})`
        ctx.fillRect(x, y, p.size, p.size)

        if (animate) {
          p.x += p.speed * (1 - order * 0.4)
          if (p.x > width) p.x = 0
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

    // Re-read the colors when the theme changes
    const themeObserver = new MutationObserver(() => {
      readColors()
      if (reducedMotion) draw(0)
    })
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onPointerMove)
      document.documentElement.removeEventListener('pointerleave', onPointerLeave)
      observer.disconnect()
      themeObserver.disconnect()
    }
  }, [])

  return <canvas ref={canvasRef} className="particle-field" aria-hidden="true" />
}
