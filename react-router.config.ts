import type { Config } from '@react-router/dev/config'

export default {
  appDirectory: 'src',
  // Static site: every route is rendered to HTML at build time, so it can be hosted anywhere.
  ssr: false,
  prerender: true,
} satisfies Config
