// Optional phone push (Pushover) when a new lead is saved.
//
// This runs in the browser, so VITE_PUSHOVER_* ships in the site's JavaScript.
// Anyone who views source could send you extra pushes. For a small local site
// that is usually an acceptable trade-off. To lock it down later, move this
// call into a server function so the keys stay server-side.
//
// If the env vars are not set, this no-ops. The lead still saves. A push
// failure never blocks the form.

import site from './site.js'

const PUSHOVER_ENDPOINT = 'https://api.pushover.net/1/messages.json'
const APP_TOKEN = import.meta.env.VITE_PUSHOVER_TOKEN
const USER_KEY = import.meta.env.VITE_PUSHOVER_USER

function money(n) {
  return `$${Number(n).toLocaleString('en-US')}`
}

function buildMessage(lead, range) {
  const vehicle = [lead.year, lead.make, lead.model].filter(Boolean).join(' ') || 'Vehicle'
  const mid =
    range && range.low != null && range.high != null
      ? Math.round((range.low + range.high) / 2)
      : null

  const lines = [vehicle]
  if (mid != null) {
    lines.push(`Quoted ~${money(mid)} (${money(range.low)}–${money(range.high)})`)
  }
  if (lead.name) lines.push(`Name: ${lead.name}`)
  if (lead.phone) lines.push(`Phone: ${lead.phone}`)
  if (lead.zip) lines.push(`Zip: ${lead.zip}`)
  if (site.subdomain) lines.push(`Yard: ${site.subdomain}`)
  return lines.join('\n')
}

export async function notifyNewLead(lead, range) {
  if (!APP_TOKEN || !USER_KEY) return { sent: false, reason: 'not-configured' }

  try {
    const body = new URLSearchParams({
      token: APP_TOKEN,
      user: USER_KEY,
      title: `New lead — ${site.businessName}`,
      message: buildMessage(lead, range),
      priority: '1',
    })

    const res = await fetch(PUSHOVER_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    })
    if (!res.ok) {
      console.error('Pushover push failed:', res.status, await res.text())
      return { sent: false, reason: `http-${res.status}` }
    }
    return { sent: true }
  } catch (err) {
    console.error('Pushover push errored:', err)
    return { sent: false, reason: 'error' }
  }
}
