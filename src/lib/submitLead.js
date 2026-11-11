import site from './site.js'
import { isBlank, publicEmail, publicHttpUrl, smsHref } from './site.js'

export function leadFields(data) {
  return {
    year: data.year,
    make: data.make,
    model: data.model,
    condition: data.condition,
    zip: data.zip,
    name: data.name,
    phone: data.phone,
    page: data.page || '',
    business: site.businessName,
  }
}

export function leadMessage(data) {
  const lines = [
    `New vehicle offer for ${site.businessName}`,
    `${data.year} ${data.make} ${data.model}`.trim(),
    `Condition: ${data.condition}`,
    `ZIP: ${data.zip}`,
    `Name: ${data.name}`,
    `Phone: ${data.phone}`,
  ]
  if (data.page) lines.push(`Page: ${data.page}`)
  return lines.join('\n')
}

export function formEndpoint() {
  const format = site.leadForm?.format === 'json' ? 'json' : 'form'
  const endpoint = publicHttpUrl(site.leadForm?.endpoint)
  return endpoint ? { endpoint, format } : null
}

export function netlifyFormName() {
  const name = String(site.leadForm?.netlifyFormName || '').trim()
  if (isBlank(name) || !/^[a-z0-9-]+$/i.test(name)) return ''
  return name
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

async function postNetlify(name, fields) {
  const body = new URLSearchParams({ 'form-name': name, ...fields })
  const res = await fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
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
  const netlify = netlifyFormName()

  try {
    if (target) {
      const ok =
        target.format === 'json'
          ? await postJson(target.endpoint, fields)
          : await postForm(target.endpoint, fields)
      return { ok, cors: false }
    }
    if (netlify) {
      const ok = await postNetlify(netlify, fields)
      return { ok, cors: false }
    }
  } catch {
    return { ok: false, cors: true }
  }

  return { ok: false, cors: false }
}
