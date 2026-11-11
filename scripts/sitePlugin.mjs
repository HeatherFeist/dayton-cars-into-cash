import { faviconSvg, manifestJson, robotsTxt, sitemapXml, devHtml } from './siteFiles.mjs'

export function sitePlugin() {
  return {
    name: 'site-template',
    transformIndexHtml: {
      order: 'pre',
      handler(html, ctx) {
        if (!ctx.server) return html
        const url = ctx.originalUrl || '/'
        return devHtml(html, url)
      },
    },
    configurePreviewServer(server) {
      // Folder pages live at /areas/city/index.html. Preview should serve them
      // for /areas/city as well, not fall back to the home page.
      server.middlewares.use((req, _res, next) => {
        const [path, query] = String(req.url || '').split('?')
        if (/^\/areas\/[a-z0-9-]+$/.test(path)) {
          req.url = `${path}/${query ? `?${query}` : ''}`
        }
        next()
      })
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split('?')[0]
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
