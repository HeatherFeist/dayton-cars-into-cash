import { supabase } from '../supabaseClient'

// Fire-and-forget click counter for the phone/text links, so call volume is a
// real number instead of a guess. Never blocks the tel:/sms: navigation and
// never surfaces an error to the visitor — this is analytics, not a feature.
export function trackClick(kind, source) {
  if (!supabase) return
  supabase
    .from('call_clicks')
    .insert({ kind, source })
    .then(({ error }) => {
      if (error) console.error('trackClick failed:', error)
    })
}
