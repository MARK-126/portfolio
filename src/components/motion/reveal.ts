import type { MotionProps } from 'motion/react'

const EASE_OUT = [0.22, 1, 0.36, 1] as const

/**
 * Props for `m.*` elements that fade and rise into place the first time they scroll into view.
 * `delay` staggers items of a list. With "reduce motion" on, MotionConfig keeps only the fade.
 */
export function reveal(delay = 0): MotionProps {
  return {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '0px 0px -8% 0px' },
    transition: { duration: 0.7, delay, ease: EASE_OUT },
  }
}
