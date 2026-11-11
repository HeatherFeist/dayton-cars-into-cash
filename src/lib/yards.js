import affiliates from '../../affiliates.config.js'
import network from '../../network.config.js'
import { cityPath, citySlug } from './cityContent.js'
import { publicPathFromAff, subdomainFromHost } from './hostRouter.js'
import { normalizePath } from './seo.js'
import { stateBySlug, US_STATES } from './usStates.js'

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

function stateForYard(yard) {
  const abbr = String(yard.stateAbbr || '').trim().toUpperCase()
  const byAbbr = US_STATES.find((state) => state.abbr === abbr)
  if (byAbbr) return byAbbr
  const name = String(yard.state || '').trim().toLowerCase()
  return US_STATES.find((state) => state.name.toLowerCase() === name) || null
}

export function citiesInState(state) {
  const cities = new Map()
  for (const yard of affiliates) {
    if (stateForYard(yard)?.abbr !== state.abbr) continue
    for (const name of servedCities(yard)) {
      const slug = citySlug(name)
      if (!cities.has(slug)) cities.set(slug, { name, slug, state })
    }
  }
  return [...cities.values()].sort((a, b) => a.name.localeCompare(b.name))
}

export function yardsInCity(state, slug) {
  const matches = []
  for (const yard of affiliates) {
    if (stateForYard(yard)?.abbr !== state.abbr) continue
    const city = servedCities(yard).find((name) => citySlug(name) === slug)
    if (!city) continue
    matches.push({
      yard,
      city,
      host: yardPublicHost(yard),
      href: `${yardOrigin(yard)}${cityPath(city)}`,
    })
  }
  return matches.sort((a, b) => a.yard.businessName.localeCompare(b.yard.businessName))
}

export function parseDirectoryPath(pathname) {
  const path = normalizePath(pathname)
  const parts = path.split('/').filter(Boolean)
  if (parts.length === 0) return { kind: 'states', path: '/' }
  const state = stateBySlug(parts[0])
  if (!state) return { kind: 'missing', path }
  if (parts.length === 1) return { kind: 'state', path: `/${state.slug}`, state }
  if (parts.length === 2) {
    const match = yardsInCity(state, parts[1])
    if (match.length === 0) return { kind: 'missing', path }
    return {
      kind: 'city',
      path: `/${state.slug}/${parts[1]}`,
      state,
      city: match[0].city,
      yards: match,
    }
  }
  return { kind: 'missing', path }
}

export function directoryRoutes() {
  const routes = ['/']
  for (const state of US_STATES) {
    routes.push(`/${state.slug}`)
    for (const city of citiesInState(state)) routes.push(`/${state.slug}/${city.slug}`)
  }
  return routes
}

export function directoryPageMeta(pathname) {
  const page = parseDirectoryPath(pathname)
  const origin = `https://${network.domain}`
  const base = {
    robots: 'index,follow',
    affiliate: '',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      isPartOf: `${origin}/`,
      publisher: { '@type': 'Organization', name: network.name, url: `${origin}/` },
    },
  }
  if (page.kind === 'states') {
    return {
      ...base,
      title: `${network.name} | Choose your state`,
      description: 'Pick a state, then a city, to open an independent junk-car buyer’s own website.',
      path: '/',
      canonical: `${origin}/`,
    }
  }
  if (page.kind === 'state') {
    const count = citiesInState(page.state).length
    const description = count
      ? `${count} ${count === 1 ? 'city' : 'cities'} in ${page.state.name} with a junk-car buyer. Open a city to see that yard’s website.`
      : `No junk-car buyers are listed in ${page.state.name} yet.`
    return {
      ...base,
      title: `Junk car buyers in ${page.state.name} | ${network.name}`,
      description,
      path: page.path,
      canonical: `${origin}${page.path}`,
    }
  }
  if (page.kind === 'city') {
    const names = page.yards.map((row) => row.yard.businessName).join(', ')
    return {
      ...base,
      title: `Junk car buyers in ${page.city}, ${page.state.abbr} | ${network.name}`,
      description: `Yards serving ${page.city}, ${page.state.name}: ${names}. Each link opens that yard’s own website.`,
      path: page.path,
      canonical: `${origin}${page.path}`,
    }
  }
  return {
    ...base,
    title: `Page not found | ${network.name}`,
    description: `That page is not on ${network.name}.`,
    path: page.path || pathname || '/',
    canonical: `${origin}${page.path || '/'}`,
    robots: 'noindex,follow',
  }
}
