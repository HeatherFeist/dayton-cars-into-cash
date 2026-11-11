import site from './site.js'

function gaId() {
  const id = String(site.analytics?.googleAnalyticsId || '').trim()
  return /^G-[A-Z0-9]+$/.test(id) ? id : ''
}

export function trackCall(source, kind = 'call') {
  if (typeof window === 'undefined') return
  if (gaId() && typeof window.gtag === 'function') {
    window.gtag('event', kind === 'text' ? 'click_to_text' : 'click_to_call', {
      source,
    })
  }
}
