import site from './site.js'
import { supabase } from './supabaseClient.js'

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
  if (!supabase) return
  supabase
    .from('call_clicks')
    .insert([{ kind, source, yard: site.subdomain || '' }])
    .then(({ error }) => {
      if (error) console.error('call_clicks insert failed', error)
    })
}
