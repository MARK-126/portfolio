/** Top-level sections, in navigation order. Each one is a route: /projects, /notes... */
export const sections = ['projects', 'notes', 'about', 'contact'] as const

export type Section = (typeof sections)[number]
