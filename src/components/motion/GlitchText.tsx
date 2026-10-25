import { Fragment, useEffect, useRef } from 'react'
import './GlitchText.css'

const NOISE = '#%&@*+=/<>01:;░▒'

const rand = (min: number, max: number) => min + Math.random() * (max - min)

/**
 * Text that loses its signal every few seconds: a run of letters (sometimes the whole line) falls
 * into the dot-matrix face (`--glitch`) for a dozen stuttering frames, with random weight,
 * roundness, offset and noise glyphs, then comes back clean. Each letter is locked to its clean
 * width so the line never reflows. The real text is rendered on the server and kept for screen
 * readers; nothing animates with "reduce motion" on.
 */
export function GlitchText({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return
    const letters = [...root.querySelectorAll<HTMLElement>('.glitch__ch')]

    const measure = () => {
      letters.forEach(letter => (letter.style.width = ''))
      const widths = letters.map(letter => letter.getBoundingClientRect().width)
      letters.forEach((letter, index) => (letter.style.width = `${widths[index]}px`))
    }
    void document.fonts?.ready.then(measure)
    window.addEventListener('resize', measure)

    const reset = (letter: HTMLElement) => {
      letter.classList.remove('is-lost')
      letter.textContent = letter.dataset.ch ?? ''
    }

    const timers: number[] = []
    const later = (callback: () => void, delay: number) => timers.push(window.setTimeout(callback, delay))

    const drop = () => {
      // Roughly one drop in three takes the whole line; the rest break a run of 4 to 9 letters
      const burst = Math.random() < 0.35
      const start = Math.floor(Math.random() * letters.length)
      const run = burst ? letters : letters.slice(start, start + 4 + Math.floor(Math.random() * 6))
      const frames = burst ? 14 + Math.floor(Math.random() * 8) : 8 + Math.floor(Math.random() * 6)
      let frame = 0

      const tick = () => {
        for (const letter of run) {
          if (frame >= frames || Math.random() < 0.25) {
            reset(letter)
            continue
          }
          letter.classList.add('is-lost')
          letter.textContent =
            Math.random() < 0.3 ? NOISE[Math.floor(Math.random() * NOISE.length)] : (letter.dataset.ch ?? '')
          letter.style.setProperty('--glitch-weight', String(Math.round(rand(100, 900))))
          letter.style.setProperty('--glitch-round', String(Math.round(rand(0, 100))))
          letter.style.setProperty('--glitch-opacity', rand(0.35, 1).toFixed(2))
          letter.style.setProperty('--glitch-x', `${rand(-0.14, 0.14).toFixed(3)}em`)
          letter.style.setProperty('--glitch-y', `${rand(-0.08, 0.08).toFixed(3)}em`)
        }
        if (frame++ < frames) later(tick, rand(35, 90))
      }

      tick()
      later(drop, rand(2400, 5200))
    }

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) later(drop, 1000)

    return () => {
      timers.forEach(timer => window.clearTimeout(timer))
      window.removeEventListener('resize', measure)
      letters.forEach(letter => {
        reset(letter)
        letter.style.width = ''
      })
    }
  }, [text])

  return (
    <>
      <span className="visually-hidden">{text}</span>
      {/* Keyed by the text so a language change mounts fresh letters instead of patching the animated ones */}
      <span key={text} ref={ref} className="glitch" aria-hidden="true">
        {/* Positions are stable keys here: the whole tree remounts when the text changes */}
        {text.split(' ').map((word, wordIndex) => (
          // Letters are grouped per word so the line can only wrap between words
          // eslint-disable-next-line react-x/no-array-index-key -- see above
          <Fragment key={wordIndex}>
            {wordIndex > 0 && ' '}
            <span className="glitch__word">
              {[...word].map((char, index) => (
                // eslint-disable-next-line react-x/no-array-index-key -- see above
                <span key={index} className="glitch__ch" data-ch={char}>
                  {char}
                </span>
              ))}
            </span>
          </Fragment>
        ))}
      </span>
    </>
  )
}
