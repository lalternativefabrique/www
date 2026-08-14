import { createReadStream, existsSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join, normalize } from 'node:path'
import { Readable } from 'node:stream'
import handler from './dist/server/server.js'

/**
 * Production entry point.
 *
 * The build emits a request handler, not a listening server, so this is what
 * binds it to a port. It also serves dist/client, since the prerendered pages
 * and the assets are no longer fronted by nginx — see
 * docs/adr/0001-articles-from-bucket-ssr-blog-admin.md.
 */

const PORT = Number(process.env.PORT ?? 3000)
const HOST = process.env.HOST ?? '0.0.0.0'
const CLIENT_DIR = new URL('./dist/client/', import.meta.url).pathname

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
}

/**
 * The static file for a path, or undefined. Assets and prerendered pages both
 * live here; anything else falls through to the handler.
 */
function staticFile(pathname) {
  // normalize collapses '..' before it can climb out of dist/client.
  const rel = normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, '')
  const direct = join(CLIENT_DIR, rel)

  if (existsSync(direct) && statSync(direct).isFile()) return direct

  // A prerendered route is a directory holding index.html.
  const asIndex = join(CLIENT_DIR, rel, 'index.html')
  if (existsSync(asIndex)) return asIndex

  return undefined
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`)

    const file = req.method === 'GET' ? staticFile(url.pathname) : undefined
    if (file) {
      const type = MIME[extname(file)] ?? 'application/octet-stream'
      // Hashed asset names are immutable; everything else must revalidate or a
      // published article would be served from a stale cache.
      const cache = url.pathname.startsWith('/assets/')
        ? 'public, max-age=31536000, immutable'
        : 'public, max-age=0, must-revalidate'
      res.writeHead(200, { 'Content-Type': type, 'Cache-Control': cache })
      createReadStream(file).pipe(res)
      return
    }

    const body =
      req.method === 'GET' || req.method === 'HEAD'
        ? undefined
        : Readable.toWeb(req)

    const response = await handler.fetch(
      new Request(url, {
        method: req.method,
        headers: req.headers,
        body,
        duplex: body ? 'half' : undefined,
      }),
    )

    res.writeHead(response.status, Object.fromEntries(response.headers))
    if (response.body) {
      Readable.fromWeb(response.body).pipe(res)
    } else {
      res.end()
    }
  } catch (err) {
    console.error(err)
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' })
    res.end('Internal Server Error')
  }
})

server.listen(PORT, HOST, () => {
  console.log(`listening on http://${HOST}:${PORT}`)
})
