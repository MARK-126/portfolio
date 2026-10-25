// Serves build/client the way Cloudflare Workers static assets do in production (`wrangler.jsonc`):
// `html_handling: auto-trailing-slash` and `not_found_handling: 404-page`. `vite preview` falls back
// to the home page for `/about` instead of serving `about/index.html`, which breaks hydration.
import { createReadStream, statSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join, normalize } from 'node:path'

const root = join(import.meta.dirname, '..', 'build', 'client')
const port = Number(process.env.PORT ?? 4173)

const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.data': 'text/x-script',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.pdf': 'application/pdf',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
}

const isFile = path => {
  try {
    return statSync(path).isFile()
  } catch {
    return false
  }
}

const send = (res, status, file) => {
  res.writeHead(status, { 'content-type': types[extname(file)] ?? 'application/octet-stream' })
  createReadStream(file).pipe(res)
}

createServer((req, res) => {
  const url = new URL(req.url ?? '/', 'http://localhost')
  const path = normalize(decodeURIComponent(url.pathname))
  const file = join(root, path)
  if (!file.startsWith(root)) return send(res, 404, join(root, '404.html'))

  // Exact files (assets, .data, sitemap...) and `/page` → `page.html`.
  if (!path.endsWith('/') && isFile(file)) return send(res, 200, file)
  if (!path.endsWith('/') && isFile(`${file}.html`)) return send(res, 200, `${file}.html`)

  // Folder pages are served with a trailing slash, as in production.
  if (isFile(join(file, 'index.html'))) {
    if (path.endsWith('/')) return send(res, 200, join(file, 'index.html'))
    res.writeHead(307, { location: `${path}/${url.search}` })
    return res.end()
  }

  send(res, 404, join(root, '404.html'))
}).listen(port, () => console.log(`Preview (Cloudflare-like) at http://localhost:${port}/`))
