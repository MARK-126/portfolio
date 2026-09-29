/**
 * Slug of a content page from its URL. Content pages are one static route per file (see
 * src/routes.ts), so there is no route param. Prerendering requests both /section/<slug> (HTML)
 * and /section/<slug>.data (loader data).
 */
export function slugFromRequest(request: Request) {
  const path = new URL(request.url).pathname.replace(/\/$/, '').replace(/\.data$/, '')
  return path.split('/').pop() ?? ''
}
