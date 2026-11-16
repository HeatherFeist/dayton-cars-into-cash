import site from './site.js'
import { publicEmail, publicHttpUrl, smsHref } from './site.js'

export function leadFields(data) {
  return {
    year: data.year,
    make: data.make,
    model: data.model,
    trim: data.trim || '',
    mileage: data.mileage || '',
    condition: data.condition,
    starts: data.starts || '',
    whole: data.whole || '',
    bodyDamage: data.bodyDamage || '',
    title: data.title || '',
    zip: data.zip,
    name: data.name,
    phone: data.phone,
    email: data.email || '',
    page: data.page || '',
    business: site.businessName,
    yard: site.subdomain || '',
    estimate_low: data.estimate_low ?? '',
    estimate_high: data.estimate_high ?? '',
  }
}

export function leadMessage(data) {
  const vehicle = `${data.year} ${data.make} ${data.model}`.trim()
  const lines = [`New vehicle offer for ${site.businessName}`, vehicle]
  if (data.estimate_low != null && data.estimate_high != null && data.estimate_low !== '') {
    lines.push(`Ballpark: $${Number(data.estimate_low).toLocaleString('en-US')}–$${Number(data.estimate_high).toLocaleString('en-US')}`)
  }
  if (data.condition) lines.push(`Condition: ${data.condition}`)
  if (data.trim) lines.push(`Trim: ${data.trim}`)
  if (data.mileage) lines.push(`Mileage: ${data.mileage}`)
  lines.push(`ZIP: ${data.zip}`, `Name: ${data.name}`, `Phone: ${data.phone}`)
  if (data.email) lines.push(`Email: ${data.email}`)
  if (data.page) lines.push(`Page: ${data.page}`)
  return lines.join('\n')
}

export function formEndpoint() {
  const format = site.leadForm?.format === 'json' ? 'json' : 'form'
  const endpoint = publicHttpUrl(site.leadForm?.endpoint)
  return endpoint ? { endpoint, format } : null
}

export function mailtoHref(data) {
  const email = publicEmail()
  if (!email) return ''
  const subject = `Vehicle offer request — ${site.businessName}`
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(leadMessage(data))}`
}

export function textHref(data) {
  return smsHref(site.smsTel || site.phoneTel, leadMessage(data))
}

async function postJson(endpoint, fields) {
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(fields),
  })
  return res.ok
}

async function postForm(endpoint, fields) {
  const res = await fetch(endpoint, {
    method: 'POST',
    body: new URLSearchParams(fields),
  })
  return res.ok
}

/**
 * Try the configured form address. Returns
 *   { ok: true } when it was accepted
 *   { ok: false, cors: true } when the browser blocked the request
 *     (a normal form POST can still deliver it)
 *   { ok: false, cors: false } when the address answered with an error
 */
export async function deliverLead(data) {
  const fields = leadFields(data)
  const target = formEndpoint()
  if (!target) return { ok: false, cors: false }

  try {
    const ok =
      target.format === 'json'
        ? await postJson(target.endpoint, fields)
        : await postForm(target.endpoint, fields)
    return { ok, cors: false }
  } catch {
    return { ok: false, cors: true }
  }
}
