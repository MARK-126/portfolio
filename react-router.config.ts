import type { Config } from '@react-router/dev/config'
import { copyFile } from 'node:fs/promises'
import { join } from 'node:path'

export default {
  appDirectory: 'src',
  // Static site: every route is rendered to HTML at build time, so it can be hosted anywhere.
  ssr: false,
  // All static routes (including one per project, see src/routes.ts) plus the 404 page.
  prerender: ({ getStaticPaths }) => [...getStaticPaths(), '/404'],
  // Most static hosts serve /404.html for unknown URLs.
  async buildEnd({ reactRouterConfig }) {
    const client = join(reactRouterConfig.buildDirectory, 'client')
    await copyFile(join(client, '404', 'index.html'), join(client, '404.html'))
  },
} satisfies Config
