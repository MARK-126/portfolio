import { site } from './site'

type PageMetaOptions = {
  /** Page name; omitted on the home page. */
  title?: string
  description: string
  /** Open Graph type; articles also get their publication date. */
  type?: 'website' | 'article'
  publishedTime?: string
}

/** Title, description and social preview tags for a route's `meta` export. */
export function pageMeta({ title, description, type = 'website', publishedTime }: PageMetaOptions) {
  const fullTitle = title ? `${title} · ${site.name}` : `${site.name} · Data Engineer`

  return [
    { title: fullTitle },
    { name: 'description', content: description },
    { property: 'og:title', content: fullTitle },
    { property: 'og:description', content: description },
    { property: 'og:type', content: type },
    ...(publishedTime ? [{ property: 'article:published_time', content: publishedTime }] : []),
    { name: 'twitter:card', content: 'summary' },
  ]
}
