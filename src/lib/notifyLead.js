// Sends the owner an instant phone push (via Pushover) when a new lead comes
// in, with the customer and their quote. Called from the form after the lead
// is saved to Supabase.
//
// ⚠️ SECURITY NOTE: this runs in the browser, so the Pushover token/user key
// (VITE_PUSHOVER_*) ship in the site's JavaScript and are visible to anyone
// who views source. For a small local site the risk is low, but a determined
// person could use them to send you spam pushes or exhaust the monthly limit.
// To lock this down later, move this call into a Supabase Edge Function so the
// keys stay server-side. See PUSHOVER_SETUP.md.
//
// If the env vars aren't set, this quietly no-ops — the lead still saves; the
// owner just doesn't get a push. Notification failures never block the form.

const PUSHOVER_ENDPOINT = 'https://api.pushover.net/1/messages.json'

const APP_TOKEN = import.meta.env.VITE_PUSHOVER_TOKEN
const USER_KEY = import.meta.env.VITE_PUSHOVER_USER

function money(n) {
  return `$${Number(n).toLocaleString('en-US')}`
}

// Build a short, skimmable alert body from the lead + quote.
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
  return lines.join('\n')
}

export async function notifyNewLead(lead, range) {
  // Not configured → skip silently. Lead is already saved either way.
  if (!APP_TOKEN || !USER_KEY) {
    console.info('Pushover not configured (VITE_PUSHOVER_TOKEN / _USER); skipping push.')
    return { sent: false, reason: 'not-configured' }
  }

  try {
    const body = new URLSearchParams({
      token: APP_TOKEN,
      user: USER_KEY,
      title: 'New lead — Dayton Cars into Cash',
      message: buildMessage(lead, range),
      priority: '1', // high priority, bypasses quiet hours
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
    // Never let a notification error affect the customer's submission.
    console.error('Pushover push errored:', err)
    return { sent: false, reason: 'error' }
  }
}
