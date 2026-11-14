import { setActiveSite } from '../src/lib/activeSite.js'
import { rewritePath, subdomainFromHost } from '../src/lib/hostRouter.js'
import { resolveRequest } from '../src/lib/yards.js'
import { faviconSvg, manifestJson, robotsTxt, sitemapXml, devHtml } from './siteFiles.mjs'

let devHost = ''

export function sitePlugin() {
  return {
    name: 'site-template',
    transformIndexHtml: {
      order: 'pre',
      handler(html, ctx) {
        if (!ctx.server) return html
        const url = ctx.originalUrl || '/'
        return devHtml(html, url, devHost)
      },
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, _res, next) => {
        const host = req.headers.host || ''
        const sub = subdomainFromHost(host)
        const [path, query] = String(req.url || '').split('?')
        const target = rewritePath(path, sub)
        if (target) req.url = `${target}${query ? `?${query}` : ''}`
        else if (!path.includes('.') && path.length > 1 && !path.endsWith('/')) {
          req.url = `${path}/${query ? `?${query}` : ''}`
        }
        next()
      })
    },
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        devHost = req.headers.host || ''
        next()
      })
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split('?')[0]
        const { site: resolved } = resolveRequest(req.headers.host || '', url || '/')
        setActiveSite(resolved)
        if (url === '/favicon.svg') {
          res.setHeader('Content-Type', 'image/svg+xml')
          res.end(faviconSvg())
          return
        }
        if (url === '/manifest.webmanifest') {
          res.setHeader('Content-Type', 'application/manifest+json')
          res.end(manifestJson())
          return
        }
        if (url === '/robots.txt') {
          res.setHeader('Content-Type', 'text/plain; charset=utf-8')
          res.end(robotsTxt())
          return
        }
        if (url === '/sitemap.xml') {
          res.setHeader('Content-Type', 'application/xml; charset=utf-8')
          res.end(sitemapXml())
          return
        }
        next()
      })
    },
  }
}
