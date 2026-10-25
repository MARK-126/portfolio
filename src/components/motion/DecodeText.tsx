import { useEffect, useRef } from 'react'

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=/<>'
const DURATION = 700
const FRAME = 45

/**
 * Mono label that "decodes" the first time it scrolls into view: random characters resolve,
 * left to right, into the text, like a value being processed. The real text is rendered on the
 * server and kept for screen readers; nothing animates with "reduce motion" on.
 */
export function DecodeText({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const node = ref.current?.firstChild
    if (!ref.current || !node || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frame = 0
    let start = 0
    let last = 0
    const tick = (now: number) => {
      if (!start) start = now
      const progress = Math.min(1, (now - start) / DURATION)
      if (now - last >= FRAME || progress === 1) {
        last = now
        const resolved = Math.floor(progress * text.length)
        node.nodeValue = [...text]
          .map((char, index) =>
            index < resolved || !/[\p{L}\p{N}]/u.test(char) ? char : GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
          )
          .join('')
      }
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      observer.disconnect()
      frame = requestAnimationFrame(tick)
    })
    observer.observe(ref.current)

    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
      node.nodeValue = text
    }
  }, [text])

  return (
    <>
      <span className="visually-hidden">{text}</span>
      {/* Keyed by the text so a language change mounts a fresh node instead of patching the animated one */}
      <span key={text} ref={ref} aria-hidden="true">
        {text}
      </span>
    </>
  )
}
