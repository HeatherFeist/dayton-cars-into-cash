import { getActiveSite } from './activeSite.js'
import network from '../../network.config.js'

const site = new Proxy(
  {},
  {
    get(_target, prop) {
      const current = getActiveSite()
      if (!current) {
        throw new Error('No yard is selected yet.')
      }
      const value = current[prop]
      return typeof value === 'function' ? value.bind(current) : value
    },
  },
)

export default site

export function isBlank(value) {
  return value == null || String(value).trim() === ''
}

/** A value the yard has not replaced yet. Hidden, never shown as a fact. */
export function isPlaceholder(value) {
  if (isBlank(value)) return true
  const v = String(value).trim().toLowerCase()
  return (
    v.includes('replace') ||
    v.includes('example.com') ||
    v.includes('your-') ||
    v.includes('xxxx') ||
    v === 'todo'
  )
}

export function digitsTel(value) {
  const raw = String(value || '').trim()
  if (!raw || isPlaceholder(raw)) return ''
  const digits = raw.replace(/\D/g, '')
  if (digits.length < 10) return ''
  return raw.startsWith('+') ? `+${digits}` : `+${digits}`
}

export function telHref(value) {
  const tel = digitsTel(value)
  return tel ? `tel:${tel}` : ''
}

export function smsHref(value, body) {
  const tel = digitsTel(value)
  if (!tel) return ''
  if (!body) return `sms:${tel}`
  return `sms:${tel}?body=${encodeURIComponent(body)}`
}

export function publicEmail(value = site.email) {
  if (isPlaceholder(value)) return ''
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim())) return ''
  return String(value).trim()
}

export function publicHttpUrl(value) {
  const url = String(value || '').trim()
  if (!/^https:\/\/.+/i.test(url)) return ''
  if (isPlaceholder(url)) return ''
  return url
}

export function siteOrigin() {
  const current = getActiveSite()
  if (!current) return ''
  const custom = String(current.siteUrl || '').trim().replace(/\/$/, '')
  if (/^https?:\/\/.+/i.test(custom) && !/example\.com/i.test(custom)) return custom
  if (current.kind === 'directory') return `https://${network.domain}`
  if (current.subdomain) return `https://${current.subdomain}.${network.domain}`
  return ''
}

export function absoluteUrl(path = '/') {
  const base = siteOrigin()
  const normalized = path.startsWith('/') ? path : `/${path}`
  if (!base) return normalized
  if (normalized === '/') return `${base}/`
  return `${base}${normalized}`
}

export function listAnd(items) {
  const list = (items || []).map((item) => String(item).trim()).filter(Boolean)
  if (list.length === 0) return ''
  if (list.length === 1) return list[0]
  if (list.length === 2) return `${list[0]} and ${list[1]}`
  return `${list.slice(0, -1).join(', ')}, and ${list[list.length - 1]}`
}

/** "cars, trucks, SUVs, and vans" — keeps SUV capitalized. */
export function vehiclePhrase({ capitalize = false } = {}) {
  const items = (site.vehiclesAccepted || []).map((item) => {
    const text = String(item).trim()
    if (/^suvs?$/i.test(text)) return text.toLowerCase() === 'suv' ? 'SUV' : 'SUVs'
    return text.toLowerCase()
  })
  const phrase = listAnd(items)
  if (!phrase || !capitalize) return phrase
  return phrase.charAt(0).toUpperCase() + phrase.slice(1)
}

export function serviceAreaCities() {
  const seen = new Set()
  const cities = []
  const source = Array.isArray(site.serviceCities) ? site.serviceCities : []
  for (const name of [site.primaryCity, ...source]) {
    const city = String(name || '').trim()
    if (!city) continue
    const key = city.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    cities.push(city)
  }
  return cities
}

const HEX = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/

export function themeCss(colors = site.colors) {
  const map = {
    '--brand': colors.brand,
    '--brand-dark': colors.brandDark,
    '--teal': colors.teal,
    '--accent': colors.accent,
    '--text': colors.text,
    '--muted': colors.muted,
    '--bg': colors.background,
  }
  const body = Object.entries(map)
    .filter(([, value]) => HEX.test(String(value || '').trim()))
    .map(([key, value]) => `${key}:${String(value).trim()}`)
    .join(';')
  return `:root{${body}}`
}

export function applyTheme(colors = site.colors) {
  if (typeof document === 'undefined') return
  const style = themeCss(colors).replace(/^:root\{|\}$/g, '')
  for (const part of style.split(';')) {
    const [key, value] = part.split(':')
    if (key && value) document.documentElement.style.setProperty(key, value)
  }
}

export function logoAltText() {
  return isBlank(site.logoAlt) ? site.businessName : site.logoAlt.trim()
}

export function hasReviewStats() {
  const rating = String(site.googleRating || '').trim()
  const count = String(site.googleReviewCount || '').trim()
  return /^[0-5](\.\d)?$/.test(rating) && /^\d+$/.test(count) && Number(count) > 0
}

export function socialLinks() {
  const labels = {
    facebook: 'Facebook',
    instagram: 'Instagram',
    youtube: 'YouTube',
    x: 'X',
    tiktok: 'TikTok',
    nextdoor: 'Nextdoor',
  }
  return Object.entries(site.social || {})
    .map(([key, url]) => ({ key, label: labels[key] || key, url: publicHttpUrl(url) }))
    .filter((item) => item.url)
}

export function visibleHours() {
  if (!Array.isArray(site.hours)) return []
  return site.hours.filter((row) => row && !isBlank(row.label) && !isBlank(row.hours))
}

export function schemaHours() {
  return visibleHours().filter(
    (row) => Array.isArray(row.days) && row.days.length && row.opens && row.closes,
  )
}

export function hasStreetAddress() {
  return !isBlank(site.streetAddress)
}
