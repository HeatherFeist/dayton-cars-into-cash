import network from '../../network.config.js'

export const NETWORK_DOMAIN = network.domain

const RESERVED = new Set(['www', 'mail', 'ftp', 'localhost', 'apex', '_aff'])

export function isSubdomainLabel(value) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(value || ''))
}

export function hostnameOf(host) {
  return String(host || '').split(':')[0].toLowerCase()
}

/** Yard label from a hostname, or '' when this is the main directory. */
export function subdomainFromHost(host) {
  const name = hostnameOf(host)
  if (!name || name === NETWORK_DOMAIN || name === `www.${NETWORK_DOMAIN}`) return ''
  const suffix = `.${NETWORK_DOMAIN}`
  if (name.endsWith(suffix)) {
    const label = name.slice(0, -suffix.length)
    if (label && !label.includes('.') && !RESERVED.has(label)) return label
    return ''
  }
  if (name.endsWith('.localhost')) {
    const label = name.slice(0, -'.localhost'.length)
    if (label && !label.includes('.') && !RESERVED.has(label)) return label
  }
  return ''
}

export function isApexHost(host) {
  const name = hostnameOf(host)
  return name === NETWORK_DOMAIN || name === `www.${NETWORK_DOMAIN}`
}

/**
 * File to serve for a yard hostname.
 * Shared files (the JavaScript bundle, the video) stay where they are.
 * Returns null when the request should be served as-is.
 */
export function rewritePath(pathname, subdomain) {
  if (!subdomain) return null
  const path = pathname || '/'
  if (path.startsWith('/assets/') || path.startsWith('/_aff/')) return null
  if (path === '/explainer.mp4') return null
  const perSite =
    path === '/sitemap.xml' ||
    path === '/robots.txt' ||
    path === '/favicon.svg' ||
    path === '/manifest.webmanifest'
  if (!perSite && path.includes('.') && !path.endsWith('.html')) return null
  let file = path
  if (file === '/' || file === '') file = '/index.html'
  else if (!file.split('/').pop().includes('.')) {
    file = file.endsWith('/') ? `${file}index.html` : `${file}/index.html`
  }
  return `/_aff/${subdomain}${file}`
}

/** Browser path for a file that lives under /_aff/yard/... */
export function publicPathFromAff(pathname) {
  const match = String(pathname || '').match(/^\/_aff\/[a-z0-9-]+(\/.*)?$/)
  if (!match) return null
  const rest = match[1] || '/'
  if (rest.length > 1 && rest.endsWith('/')) return rest.slice(0, -1)
  return rest || '/'
}
