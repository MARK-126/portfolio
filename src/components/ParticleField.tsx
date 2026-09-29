import { useEffect, useRef } from 'react'
import './ParticleField.css'

type Particle = {
  x: number
  lane: number // row the particle settles into once it becomes "structured"
  noise: number // vertical offset while it is still "raw"
  speed: number
  size: number
  alpha: number
  phase: number
}

const ROWS = 36

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)))
  return t * t * (3 - 2 * t)
}

/**
 * Decorative canvas: scattered particles drift left to right and settle into
 * ordered rows — raw data turning into structure.
 */
export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let width = 0
    let height = 0
    let particles: Particle[] = []
    let color = '255, 255, 255'
    let frame = 0
    let visible = true

    const readColor = () => {
      color = getComputedStyle(canvas).getPropertyValue('--particle-rgb').trim() || color
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const count = Math.round(Math.min(4200, (width * height) / 320))
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        lane: Math.floor(Math.random() * ROWS),
        noise: (Math.random() - 0.5) * 2,
        speed: 0.15 + Math.random() * 0.45,
        size: Math.random() < 0.85 ? 1.2 : 1.8,
        alpha: 0.35 + Math.random() * 0.65,
        phase: Math.random() * Math.PI * 2,
      }))
    }

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height)
      const blockTop = height * 0.42
      const blockHeight = height * 0.3
      const rowGap = blockHeight / (ROWS - 1)
      const t = time / 1000

      for (const p of particles) {
        const progress = p.x / width
        // 0 = raw noise on the left, 1 = aligned rows on the right
        const order = smoothstep(0.35, 0.8, progress)
        const rawY = height * (0.62 + p.noise * 0.3) + Math.sin(t * 0.6 + p.phase + p.x * 0.004) * 30
        const rowY = blockTop + p.lane * rowGap
        const y = rawY + (rowY - rawY) * order
        // Snap x to a column grid as it gets ordered, so the block reads like a table
        const x = order > 0.95 ? Math.round(p.x / 6) * 6 : p.x
        // Fade towards the top-left so the headline stays readable
        const fade = smoothstep(0.05, 0.6, progress) * 0.8 + 0.2 * smoothstep(0.4, 0.8, y / height)

        ctx.fillStyle = `rgba(${color}, ${p.alpha * fade})`
        ctx.fillRect(x, y, p.size, p.size)

        if (!reducedMotion) {
          p.x += p.speed * (1 - order * 0.5)
          if (p.x > width) p.x = 0
        }
      }
    }

    const loop = (time: number) => {
      if (visible) draw(time)
      frame = requestAnimationFrame(loop)
    }

    readColor()
    resize()
    if (reducedMotion) draw(0)
    else frame = requestAnimationFrame(loop)

    const onResize = () => {
      resize()
      if (reducedMotion) draw(0)
    }
    window.addEventListener('resize', onResize)

    // Pause when the hero is off screen
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
    })
    observer.observe(canvas)

    // Re-read the particle color when the theme changes
    const themeObserver = new MutationObserver(() => {
      readColor()
      if (reducedMotion) draw(0)
    })
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', onResize)
      observer.disconnect()
      themeObserver.disconnect()
    }
  }, [])

  return <canvas ref={canvasRef} className="particle-field" aria-hidden="true" />
}
