import { useMemo, useRef, useState } from 'react'
import { MAKES, modelsForMake, OTHER } from '../lib/vehicleData'
import { formDisclaimer } from '../lib/content'
import {
  deliverLead,
  formEndpoint,
  leadMessage,
  mailtoHref,
  textHref,
} from '../lib/submitLead'
import site from '../lib/site'
import { telHref } from '../lib/site'
import { trackCall } from '../lib/track'

const CURRENT_YEAR = new Date().getFullYear()
const OLDEST_YEAR = 1978
const YEARS = []
for (let year = CURRENT_YEAR + 1; year >= OLDEST_YEAR; year -= 1) YEARS.push(year)

const EMPTY = {
  year: '',
  make: '',
  model: '',
  condition: '',
  zip: '',
  name: '',
  phone: '',
  botField: '',
}

export default function OfferForm({ source = 'home' }) {
  const [form, setForm] = useState(EMPTY)
  const [status, setStatus] = useState('idle')
  const [fallback, setFallback] = useState(null)
  const formRef = useRef(null)

  const isOtherMake = form.make === OTHER
  const modelOptions = useMemo(() => modelsForMake(form.make), [form.make])
  const endpoint = formEndpoint()

  function update(event) {
    const { name, value } = event.target
    setForm((prev) => {
      if (name === 'make') return { ...prev, make: value, model: '' }
      return { ...prev, [name]: value }
    })
  }

  function payload() {
    const page = typeof window === 'undefined' ? source : window.location.pathname
    return { ...form, page }
  }

  function openFallback(data) {
    const sms = textHref(data)
    const mail = mailtoHref(data)
    setFallback({ sms, mail, message: leadMessage(data) })
    const mobile = typeof navigator !== 'undefined' && /Android|iPhone|iPad/i.test(navigator.userAgent)
    const href = mobile ? sms || mail : mail || sms
    if (href) window.location.href = href
    setStatus('fallback')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (form.botField) {
      setStatus('success')
      return
    }
    const data = payload()
    if (endpoint) {
      setStatus('submitting')
      const result = await deliverLead(data)
      if (result.ok) {
        setStatus('success')
        return
      }
      if (result.cors && endpoint && formRef.current) {
        formRef.current.submit()
        return
      }
    }
    openFallback(data)
  }

  function reset() {
    setForm(EMPTY)
    setFallback(null)
    setStatus('idle')
  }

  if (status === 'success') {
    return (
      <div className="quote-form quote-form--success" id="get-offer">
        <h3>We got your request</h3>
        <p>
          Thanks{form.name ? `, ${form.name.split(' ')[0]}` : ''}. We'll call you
          {form.phone ? ` at ${form.phone}` : ''} about the {form.year} {form.make}{' '}
          {form.model}.
        </p>
        <div className="quote-form__success-actions">
          <a className="quote-form__text-btn" href={telHref(site.phoneTel)} onClick={() => trackCall('quote-success')}>
            Call {site.phoneDisplay}
          </a>
          <button type="button" onClick={reset}>
            Submit another vehicle
          </button>
        </div>
      </div>
    )
  }

  if (status === 'fallback' && fallback) {
    return (
      <div className="quote-form quote-form--success" id="get-offer">
        <h3>Send this request to us</h3>
        <p>
          Your phone or email app should open with the details filled in. If it
          did not, use one of the buttons below. We do not see the request until
          that message is sent.
        </p>
        <pre className="quote-form__message">{fallback.message}</pre>
        <div className="quote-form__success-actions">
          {fallback.sms && (
            <a className="quote-form__text-btn" href={fallback.sms} onClick={() => trackCall('quote-fallback', 'text')}>
              Text us
            </a>
          )}
          {fallback.mail && (
            <a className="quote-form__text-btn" href={fallback.mail}>
              Email us
            </a>
          )}
          <a className="quote-form__text-btn" href={telHref(site.phoneTel)} onClick={() => trackCall('quote-fallback')}>
            Call {site.phoneDisplay}
          </a>
        </div>
        <button type="button" className="quote-form__again" onClick={reset}>
          Start over
        </button>
      </div>
    )
  }

  return (
    <div className="quote-form" id="get-offer">
      <h3>Get Your Cash Offer</h3>
      <form
        ref={formRef}
        method="POST"
        action={endpoint ? endpoint.endpoint : undefined}
        onSubmit={handleSubmit}
      >
        <p className="hp">
          <label>
            Leave this empty
            <input
              name="bot-field"
              tabIndex={-1}
              autoComplete="off"
              value={form.botField}
              onChange={(event) => setForm((prev) => ({ ...prev, botField: event.target.value }))}
            />
          </label>
        </p>
        <div className="quote-form__grid">
          <label className="field">
            <span>Year</span>
            <select name="year" value={form.year} onChange={update} required>
              <option value="" disabled>
                Year
              </option>
              {YEARS.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Make</span>
            <select name="make" value={form.make} onChange={update} required>
              <option value="" disabled>
                Make
              </option>
              {MAKES.map((make) => (
                <option key={make} value={make}>
                  {make}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Model</span>
            {isOtherMake ? (
              <input
                name="model"
                placeholder="Model"
                value={form.model}
                onChange={update}
                required
                autoComplete="off"
              />
            ) : (
              <select
                name="model"
                value={form.model}
                onChange={update}
                required
                disabled={!form.make}
              >
                <option value="" disabled>
                  {form.make ? 'Model' : 'Select make first'}
                </option>
                {modelOptions.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            )}
          </label>
          <label className="field">
            <span>Condition</span>
            <select name="condition" value={form.condition} onChange={update} required>
              <option value="" disabled>
                Condition
              </option>
              {site.conditionChoices.map((choice) => (
                <option key={choice} value={choice}>
                  {choice}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>ZIP code</span>
            <input
              name="zip"
              placeholder="ZIP code"
              inputMode="numeric"
              autoComplete="postal-code"
              pattern="[0-9]{5}"
              maxLength={5}
              value={form.zip}
              onChange={update}
              required
            />
          </label>
          <label className="field">
            <span>Your name</span>
            <input
              name="name"
              placeholder="Your name"
              autoComplete="name"
              value={form.name}
              onChange={update}
              required
            />
          </label>
          <label className="field field--wide">
            <span>Phone</span>
            <input
              name="phone"
              type="tel"
              placeholder="Phone number"
              autoComplete="tel"
              value={form.phone}
              onChange={update}
              required
              minLength={7}
            />
          </label>
        </div>
        <button type="submit" disabled={status === 'submitting'}>
          {status === 'submitting' ? 'Sending…' : 'Get My Cash Offer'}
        </button>
        <p className="quote-form__disclaimer">{formDisclaimer()}</p>
      </form>
    </div>
  )
}
