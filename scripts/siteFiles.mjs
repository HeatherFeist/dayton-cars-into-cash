import site from '../site.config.js'
import { homeDescription } from '../src/lib/content.js'
import { netlifyFormName } from '../src/lib/submitLead.js'
import { pageMeta, sitemapPaths } from '../src/lib/seo.js'
import { siteOrigin, themeCss } from '../src/lib/site.js'

const HEX = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/

export function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function replaceToken(html, token, value) {
  return html.split(token).join(value)
}

export function faviconSvg(colors = site.colors) {
  const brand = HEX.test(colors.brand) ? colors.brand : '#14284f'
  const accent = HEX.test(colors.accent) ? colors.accent : '#ffb703'
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="${brand}"/><text x="16" y="22" font-size="18" text-anchor="middle" fill="${accent}" font-family="Arial, sans-serif" font-weight="bold">$</text></svg>`
}

export function manifestJson() {
  return JSON.stringify(
    {
      name: site.businessName,
      short_name: site.businessName.slice(0, 18),
      description: homeDescription(),
      start_url: '/',
      scope: '/',
      display: 'standalone',
      background_color: site.colors.background,
      theme_color: site.colors.brand,
      icons: [{ src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }],
    },
    null,
    2,
  )
}

export function robotsTxt() {
  const lines = ['User-agent: *', 'Allow: /', '']
  if (siteOrigin()) lines.push(`Sitemap: ${siteOrigin()}/sitemap.xml`, '')
  return lines.join('\n')
}

export function sitemapXml() {
  const today = new Date().toISOString().slice(0, 10)
  const urls = sitemapPaths()
    .map(({ loc, path }) => {
      const priority = path === '/' ? '1.0' : '0.8'
      return `  <url><loc>${escapeHtml(loc)}</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>${priority}</priority></url>`
    })
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
}

function analyticsSnippets() {
  const parts = []
  const ga = String(site.analytics?.googleAnalyticsId || '').trim()
  if (/^G-[A-Z0-9]+$/.test(ga)) {
    parts.push(
      `<script async src="https://www.googletagmanager.com/gtag/js?id=${escapeHtml(ga)}"></script>`,
      `<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config',${JSON.stringify(ga)},{anonymize_ip:true});</script>`,
    )
  }
  const domain = String(site.analytics?.plausibleDomain || '').trim()
  if (/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(domain) && !/example\.com/i.test(domain)) {
    parts.push(
      `<script defer data-domain="${escapeHtml(domain)}" src="https://plausible.io/js/script.js"></script>`,
    )
  }
  return parts.join('\n    ')
}

export function netlifyFormHtml() {
  const name = netlifyFormName()
  if (!name) return ''
  const fields = ['year', 'make', 'model', 'condition', 'zip', 'name', 'phone', 'page', 'business']
  const inputs = fields.map((field) => `<input name="${field}" />`).join('')
  return `<form name="${escapeHtml(name)}" method="POST" data-netlify="true" netlify-honeypot="bot-field" hidden><input name="form-name" value="${escapeHtml(name)}" />${inputs}<input name="bot-field" /></form>`
}

export function fillTemplate(html, meta, { appHtml = '' } = {}) {
  const jsonLd = `<script id="site-jsonld" type="application/ld+json">${JSON.stringify(meta.jsonLd).replace(/</g, '\\u003c')}</script>`
  let out = html
  out = replaceToken(out, '__TITLE__', escapeHtml(meta.title))
  out = replaceToken(out, '__DESCRIPTION__', escapeHtml(meta.description))
  out = replaceToken(out, '__CANONICAL__', escapeHtml(meta.canonical))
  out = replaceToken(out, '__ROBOTS__', escapeHtml(meta.robots))
  out = replaceToken(out, '__THEME_COLOR__', escapeHtml(site.colors.brand))
  out = replaceToken(out, '__SITE_NAME__', escapeHtml(site.businessName))
  out = replaceToken(out, '__THEME_CSS__', themeCss())
  out = replaceToken(out, '__JSONLD__', jsonLd)
  out = replaceToken(out, '__ANALYTICS__', analyticsSnippets())
  out = replaceToken(out, '__PATH__', escapeHtml(meta.path))
  out = replaceToken(out, '__APP__', appHtml)
  out = replaceToken(out, '__NETLIFY_FORM__', netlifyFormHtml())
  return out
}

export function devHtml(html, url = '/') {
  const path = String(url || '/').split('?')[0]
  return fillTemplate(html, pageMeta(path), { appHtml: '' })
}
