import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  // Missing config would otherwise crash createClient and blank the whole
  // page. Log a clear message so the cause is visible in the console, and
  // let the app render (form submissions will surface their own error).
  console.error(
    'Supabase config missing: set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY ' +
      'as environment variables (locally in .env, or in the Netlify site settings).'
  )
}

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null
