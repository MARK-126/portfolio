import type { Config } from '@react-router/dev/config'
import { copyFile, readdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { site } from './src/config/site.ts'

/** URL paths of every prerendered page in the client build (excluding the 404 page). */
async function pagePaths(client: string) {
  const entries = await readdir(client, { recursive: true })
  return entries
    .filter(entry => entry === 'index.html' || entry.endsWith('/index.html'))
    .map(entry => `/${entry.replace(/\/?index\.html$/, '')}`)
    .filter(path => path !== '/404')
    .sort()
}

export default {
  appDirectory: 'src',
  // Static site: every route is rendered to HTML at build time, so it can be hosted anywhere.
  ssr: false,
  // All static routes (including one per content page, see src/routes.ts) plus the 404 page.
  prerender: ({ getStaticPaths }) => [...getStaticPaths(), '/404'],
  async buildEnd({ reactRouterConfig }) {
    const client = join(reactRouterConfig.buildDirectory, 'client')

    // Most static hosts (Cloudflare Pages included) serve /404.html for unknown URLs
    await copyFile(join(client, '404', 'index.html'), join(client, '404.html'))

    const urls = (await pagePaths(client)).map(path => `  <url><loc>${site.url}${path}</loc></url>`)
    await writeFile(
      join(client, 'sitemap.xml'),
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`,
    )
    await writeFile(join(client, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`)
  },
} satisfies Config
