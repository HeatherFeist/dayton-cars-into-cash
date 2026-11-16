import site, { isBlank } from './site.js'

export function inboxPassword() {
  try {
    return String(site.inboxPassword || '').trim()
  } catch {
    return ''
  }
}

export function inboxEnabled() {
  return !isBlank(inboxPassword())
}

export function currentYard() {
  try {
    return String(site.subdomain || '').trim()
  } catch {
    return ''
  }
}
