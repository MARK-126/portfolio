import { site } from './site'

type PageMetaOptions = {
  /** Page name; omitted on the home page. */
  title?: string
  description: string
  /** URL path of the page (e.g. location.pathname), for the canonical and social URLs. */
  path?: string
  /** Open Graph type; articles also get their publication date. */
  type?: 'website' | 'article'
  publishedTime?: string
}

const OG_IMAGE = `${site.url}/og.png`

/** Title, description, canonical URL and social preview tags for a route's `meta` export. */
export function pageMeta({ title, description, path, type = 'website', publishedTime }: PageMetaOptions) {
  const fullTitle = title ? `${title} · ${site.name}` : `${site.name} · Ingeniero de datos`
  const url = path !== undefined ? `${site.url}${path === '/' ? '/' : path.replace(/\/$/, '')}` : undefined

  return [
    { title: fullTitle },
    { name: 'description', content: description },
    ...(url
      ? [
          { tagName: 'link', rel: 'canonical', href: url },
          { property: 'og:url', content: url },
        ]
      : []),
    { property: 'og:site_name', content: site.name },
    { property: 'og:title', content: fullTitle },
    { property: 'og:description', content: description },
    { property: 'og:type', content: type },
    { property: 'og:image', content: OG_IMAGE },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    ...(publishedTime ? [{ property: 'article:published_time', content: publishedTime }] : []),
    { name: 'twitter:card', content: 'summary_large_image' },
  ]
}
