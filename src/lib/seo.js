import network from '../../network.config.js'
import site from './site.js'
import { getActiveSite } from './activeSite.js'
import { cityFromPath, cityPageContent, cityPath } from './cityContent.js'
import { homeDescription } from './content.js'
import {
  absoluteUrl,
  hasStreetAddress,
  logoAltText,
  publicEmail,
  publicHttpUrl,
  schemaHours,
  serviceAreaCities,
  siteOrigin,
  socialLinks,
} from './site.js'

export function normalizePath(pathname) {
  if (!pathname) return '/'
  let path = String(pathname).split('?')[0].split('#')[0]
  if (!path.startsWith('/')) path = `/${path}`
  if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1)
  return path || '/'
}

export function allRoutes() {
  return ['/', ...serviceAreaCities().map((city) => cityPath(city))]
}

function businessNode() {
  const id = `${absoluteUrl('/')}#business`
  const node = {
    '@type': ['AutomotiveBusiness', 'LocalBusiness'],
    '@id': id,
    name: site.businessName,
    telephone: site.phoneTel,
    url: absoluteUrl('/'),
    areaServed: serviceAreaCities().map((city) => ({
      '@type': 'City',
      name: city,
      containedInPlace: {
        '@type': 'State',
        name: site.state,
        address: { '@type': 'PostalAddress', addressRegion: site.stateAbbr, addressCountry: 'US' },
      },
    })),
    address: {
      '@type': 'PostalAddress',
      addressLocality: site.primaryCity,
      addressRegion: site.stateAbbr,
      addressCountry: 'US',
    },
  }

  if (hasStreetAddress()) node.address.streetAddress = site.streetAddress.trim()
  if (site.postalCode && String(site.postalCode).trim()) node.address.postalCode = String(site.postalCode).trim()

  const email = publicEmail()
  if (email) node.email = email

  const hours = schemaHours()
  if (hours.length) {
    node.openingHoursSpecification = hours.map((row) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: row.days,
      opens: row.opens,
      closes: row.closes,
    }))
  }

  const sameAs = socialLinks().map((item) => item.url)
  const reviewUrl = publicHttpUrl(site.googleReviewUrl)
  if (reviewUrl) sameAs.push(reviewUrl)
  if (sameAs.length) node.sameAs = sameAs

  if (site.logoPath && site.logoPath.startsWith('/')) {
    node.image = absoluteUrl(site.logoPath)
    node.logo = absoluteUrl(site.logoPath)
  }

  if (site.claims.paidOnPickup && site.claims.paymentMethods) {
    node.paymentAccepted = site.claims.paymentMethods
  }
  node.currenciesAccepted = 'USD'

  const description = homeDescription()
  node.description = description
  return node
}

function homeMeta() {
  const title = `${site.businessName} | Sell Your Junk Car for Cash Today`
  const description = homeDescription()
  const canonical = absoluteUrl('/')
  return {
    title,
    description,
    path: '/',
    canonical,
    robots: 'index,follow',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        businessNode(),
        {
          '@type': 'WebSite',
          name: site.businessName,
          url: canonical,
          description,
        },
      ],
    },
  }
}

function cityMeta(city) {
  const content = cityPageContent(city)
  const canonical = absoluteUrl(content.path)
  return {
    title: content.title,
    description: content.description,
    path: content.path,
    canonical,
    robots: 'index,follow',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        businessNode(),
        {
          '@type': 'WebPage',
          name: content.title,
          description: content.description,
          url: canonical,
          isPartOf: absoluteUrl('/'),
          about: { '@id': `${absoluteUrl('/')}#business` },
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl('/') },
            { '@type': 'ListItem', position: 2, name: content.city, item: canonical },
          ],
        },
      ],
    },
  }
}

function notFoundMeta(path) {
  return {
    title: `Page not found | ${site.businessName}`,
    description: `That page is not on the ${site.businessName} website.`,
    path,
    canonical: absoluteUrl(path),
    robots: 'noindex,follow',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [businessNode()],
    },
  }
}

export function directoryMeta() {
  const canonical = `https://${network.domain}/`
  const title = `${network.name} | Find a junk-car buyer`
  const description = network.tagline
  return {
    title,
    description,
    path: '/',
    canonical,
    robots: 'index,follow',
    affiliate: '',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          name: network.name,
          url: canonical,
          description,
        },
        {
          '@type': 'WebSite',
          name: network.name,
          url: canonical,
          description,
        },
      ],
    },
  }
}

function withAffiliate(meta) {
  const current = getActiveSite()
  const affiliate = current && current.kind !== 'directory' ? current.subdomain || '' : ''
  return { ...meta, affiliate }
}

export function pageMeta(pathname) {
  const path = normalizePath(pathname)
  if (getActiveSite()?.kind === 'directory') {
    if (path === '/') return directoryMeta()
    return withAffiliate({
      ...notFoundMeta(path),
      title: `Page not found | ${network.name}`,
      description: `That page is not on ${network.name}.`,
    })
  }
  if (path === '/') return withAffiliate(homeMeta())
  const city = cityFromPath(path)
  if (city) return withAffiliate(cityMeta(city))
  return withAffiliate(notFoundMeta(path))
}

export function sitemapPaths() {
  return allRoutes().map((path) => ({
    path,
    loc: siteOrigin() ? absoluteUrl(path) : path,
  }))
}

export { logoAltText }
