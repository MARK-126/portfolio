import { site } from './site'

type PageMetaOptions = {
  /** Page name; omitted on the home page. */
  title?: string
  description: string
}

/** Title, description and social preview tags for a route's `meta` export. */
export function pageMeta({ title, description }: PageMetaOptions) {
  const fullTitle = title ? `${title} · ${site.name}` : `${site.name} · Data Engineer`

  return [
    { title: fullTitle },
    { name: 'description', content: description },
    { property: 'og:title', content: fullTitle },
    { property: 'og:description', content: description },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary' },
  ]
}
