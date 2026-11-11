import affiliates from '../../affiliates.config.js'
import network from '../../network.config.js'
import { publicPathFromAff, subdomainFromHost } from './hostRouter.js'
import { normalizePath } from './seo.js'

export function directorySite() {
  return {
    kind: 'directory',
    businessName: network.name,
    colors: network.colors,
    subdomain: '',
    siteUrl: `https://${network.domain}`,
    analytics: {},
    leadForm: {},
  }
}

export function allYards() {
  return affiliates
}

export function yardBySubdomain(label) {
  return affiliates.find((yard) => yard.subdomain === label) || null
}

export function resolveRequest(host, pathname) {
  const fromHost = subdomainFromHost(host)
  if (fromHost) {
    const yard = yardBySubdomain(fromHost)
    if (!yard) return { site: { kind: 'missing', subdomain: fromHost, businessName: network.name, colors: network.colors }, path: '/' }
    return { site: yard, path: normalizePath(pathname) }
  }
  const affPath = publicPathFromAff(pathname)
  if (affPath != null) {
    const label = String(pathname).match(/^\/_aff\/([a-z0-9-]+)/)?.[1] || ''
    const yard = yardBySubdomain(label)
    if (!yard) return { site: { kind: 'missing', subdomain: label, businessName: network.name, colors: network.colors }, path: '/' }
    return { site: yard, path: normalizePath(affPath) }
  }
  return { site: directorySite(), path: normalizePath(pathname) }
}

export function yardOrigin(yard) {
  const custom = String(yard.siteUrl || '').trim().replace(/\/$/, '')
  if (/^https?:\/\/.+/i.test(custom) && !/example\.com/i.test(custom)) return custom
  return `https://${yard.subdomain}.${network.domain}`
}

export function yardPublicHost(yard) {
  return yardOrigin(yard).replace(/^https?:\/\//, '')
}

function servedCities(yard) {
  const seen = new Set()
  const cities = []
  for (const name of [yard.primaryCity, ...(yard.serviceCities || [])]) {
    const city = String(name || '').trim()
    if (!city || seen.has(city.toLowerCase())) continue
    seen.add(city.toLowerCase())
    cities.push(city)
  }
  return cities
}

/** One entry per yard. The link is that yard's own website. */
export function yardsForDirectory() {
  return affiliates
    .map((yard) => {
      const cities = servedCities(yard)
      return {
        yard,
        href: `${yardOrigin(yard)}/`,
        host: yardPublicHost(yard),
        cities,
        state: yard.state,
        stateAbbr: yard.stateAbbr,
        primaryCity: yard.primaryCity,
      }
    })
    .sort((a, b) => a.state.localeCompare(b.state) || a.yard.businessName.localeCompare(b.yard.businessName))
}
