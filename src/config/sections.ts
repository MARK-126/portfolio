/** Top-level sections, in navigation order. Each one is a route: /work, /notes... */
export const sections = ['work', 'notes', 'lab', 'contact'] as const

export type Section = (typeof sections)[number]
