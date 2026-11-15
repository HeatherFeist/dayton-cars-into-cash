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
import { estimateOffer, formatRange } from '../lib/estimateOffer'
import {
  NO_TITLE_VALUE,
  conditionSummary,
  questionsForYard,
} from '../lib/conditionQuestions'
import { notifyNewLead } from '../lib/notifyLead'
import { supabase } from '../lib/supabaseClient'
import site, { telHref } from '../lib/site'
import { trackCall } from '../lib/track'

const CURRENT_YEAR = new Date().getFullYear()
const OLDEST_YEAR = 1978
const YEARS = []
for (let year = CURRENT_YEAR + 1; year >= OLDEST_YEAR; year -= 1) YEARS.push(year)

const VEHICLE_STEP = { kind: 'vehicle' }
const CONTACT_STEP = { kind: 'contact' }

const EMPTY = {
  year: '',
  make: '',
  model: '',
  trim: '',
  mileage: '',
  starts: '',
  whole: '',
  bodyDamage: '',
  title: '',
  zip: '',
  name: '',
  phone: '',
  email: '',
  botField: '',
}

export default function OfferForm({ source = 'home' }) {
  const questions = useMemo(() => questionsForYard(site.titleNote), [])
  const steps = useMemo(
    () => [VEHICLE_STEP, ...questions.map((question) => ({ kind: 'condition', question })), CONTACT_STEP],
    [questions],
  )
  const total = steps.length

  const [form, setForm] = useState(EMPTY)
  const [stepIndex, setStepIndex] = useState(0)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [estimate, setEstimate] = useState(null)
  const [fallback, setFallback] = useState(null)
  const formRef = useRef(null)

  const step = steps[stepIndex]
  const isFirst = stepIndex === 0
  const isLast = stepIndex === total - 1
  const progress = Math.round(((stepIndex + 1) / total) * 100)
  const isOtherMake = form.make === OTHER
  const modelOptions = useMemo(() => modelsForMake(form.make), [form.make])
  const endpoint = formEndpoint()
  const noTitle = form.title === NO_TITLE_VALUE
  const liveRange = step.kind === 'contact' ? estimateOffer(form) : null

  function update(name, value) {
    setForm((prev) => {
      if (name === 'make') return { ...prev, make: value, model: '' }
      return { ...prev, [name]: value }
    })
  }

  function handleChange(event) {
    update(event.target.name, event.target.value)
  }

  const canAdvance = useMemo(() => {
    if (step.kind === 'vehicle') return Boolean(form.year && form.make && form.model)
    if (step.kind === 'condition') return Boolean(form[step.question.field])
    return true
  }, [step, form])

  function goNext() {
    setError('')
    if (!canAdvance) return
    setStepIndex((i) => Math.min(total - 1, i + 1))
  }

  function goBack() {
    setError('')
    setStepIndex((i) => Math.max(0, i - 1))
  }

  function pickOption(field, value) {
    update(field, value)
    // Stay on the title step when they pick "no title" so they can read the
    // yard's titleNote. Next still works — we do not block the quote.
    if (field === 'title' && value === NO_TITLE_VALUE) return
    setTimeout(() => setStepIndex((i) => Math.min(total - 1, i + 1)), 160)
  }

  function payload(range) {
    const page = typeof window === 'undefined' ? source : window.location.pathname
    return {
      ...form,
      page,
      condition: conditionSummary(form),
      estimate_low: range?.low,
      estimate_high: range?.high,
    }
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

  async function saveToInbox(data, range) {
    if (!supabase) return { saved: false }
    const { error: insertError } = await supabase.from('dayton_cars_leads').insert([
      {
        year: data.year,
        make: data.make,
        model: data.model,
        trim: data.trim || null,
        mileage: data.mileage ? Number(data.mileage) : null,
        starts: data.starts,
        whole: data.whole,
        bodyDamage: data.bodyDamage,
        title: data.title,
        zip: data.zip,
        name: data.name,
        phone: data.phone,
        email: data.email || null,
        condition: data.condition,
        estimate_low: range.low,
        estimate_high: range.high,
        yard: site.subdomain || '',
        page: data.page || '',
        status: 'New',
      },
    ])
    if (insertError) {
      console.error(insertError)
      return { saved: false }
    }
    return { saved: true }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (form.botField) {
      setStatus('success')
      return
    }
    setStatus('submitting')
    setError('')
    const range = estimateOffer(form)
    const data = payload(range)
    setEstimate(range)

    const inbox = await saveToInbox(data, range)
    if (inbox.saved) notifyNewLead(data, range)

    if (endpoint) {
      const result = await deliverLead(data)
      if (result.ok || inbox.saved) {
        setStatus('success')
        return
      }
      if (result.cors && formRef.current) {
        formRef.current.submit()
        return
      }
      openFallback(data)
      return
    }

    if (inbox.saved) {
      setStatus('success')
      return
    }

    openFallback(data)
  }

  function reset() {
    setForm(EMPTY)
    setEstimate(null)
    setFallback(null)
    setStepIndex(0)
    setStatus('idle')
    setError('')
  }

  if (status === 'success') {
    return (
      <div className="quote-form quote-form--success" id="get-offer">
        <h3>Your estimated offer</h3>
        {estimate && <p className="quote-form__estimate">{formatRange(estimate)}</p>}
        <p>
          This is a ballpark based on what you told us. We'll call you
          {form.phone ? ` at ${form.phone}` : ''} to confirm your cash offer
          for the {form.year} {form.make} {form.model}. Nothing is scheduled
          until you say yes.
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
        <h3>Your estimated offer</h3>
        {estimate && <p className="quote-form__estimate">{formatRange(estimate)}</p>}
        <p>
          Send this request to us so we can confirm the cash offer. Your phone
          or email app should open with the details filled in. If it did not,
          use one of the buttons below. We do not see the request until that
          message is sent.
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
      <div className="wizard__head">
        <h3>Get Your Cash Offer</h3>
        <span className="wizard__count">
          Step {stepIndex + 1} of {total}
        </span>
      </div>
      <div
        className="wizard__progress"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <span className="wizard__progress-bar" style={{ width: `${progress}%` }} />
      </div>

      <form ref={formRef} method="POST" action={endpoint ? endpoint.endpoint : undefined} onSubmit={handleSubmit}>
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

        {step.kind === 'vehicle' && (
          <div className="wizard__step">
            <h4 className="wizard__q">Tell us about your vehicle</h4>
            <div className="quote-form__grid">
              <label className="field">
                <span>Year</span>
                <select name="year" value={form.year} onChange={handleChange} required>
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
                <select name="make" value={form.make} onChange={handleChange} required>
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
                  <input name="model" placeholder="Model" value={form.model} onChange={handleChange} required autoComplete="off" />
                ) : (
                  <select name="model" value={form.model} onChange={handleChange} required disabled={!form.make}>
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
                <span>Trim / style (optional)</span>
                <input name="trim" placeholder="Trim / style" value={form.trim} onChange={handleChange} />
              </label>
              <label className="field field--wide">
                <span>Mileage (optional)</span>
                <input
                  name="mileage"
                  placeholder="Mileage"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={form.mileage}
                  onChange={handleChange}
                />
              </label>
            </div>
          </div>
        )}

        {step.kind === 'condition' && (
          <div className="wizard__step">
            <h4 className="wizard__q">{step.question.question}</h4>
            {step.question.help && <p className="wizard__help">{step.question.help}</p>}
            <div className="wizard__options">
              {step.question.options.map((opt) => {
                const selected = form[step.question.field] === opt.value
                return (
                  <button
                    key={opt.value}
                    type="button"
                    className={`wizard__option${selected ? ' wizard__option--selected' : ''}`}
                    onClick={() => pickOption(step.question.field, opt.value)}
                  >
                    <span className="wizard__option-radio" aria-hidden="true" />
                    {opt.label}
                  </button>
                )
              })}
            </div>
            {step.question.field === 'title' && noTitle && site.titleNote && (
              <p className="quote-form__notice">{site.titleNote}</p>
            )}
          </div>
        )}

        {step.kind === 'contact' && (
          <div className="wizard__step">
            <input type="hidden" name="year" value={form.year} />
            <input type="hidden" name="make" value={form.make} />
            <input type="hidden" name="model" value={form.model} />
            <input type="hidden" name="trim" value={form.trim} />
            <input type="hidden" name="mileage" value={form.mileage} />
            <input type="hidden" name="starts" value={form.starts} />
            <input type="hidden" name="whole" value={form.whole} />
            <input type="hidden" name="bodyDamage" value={form.bodyDamage} />
            <input type="hidden" name="title" value={form.title} />
            <input type="hidden" name="condition" value={conditionSummary(form)} />
            {liveRange && (
              <>
                <input type="hidden" name="estimate_low" value={liveRange.low} />
                <input type="hidden" name="estimate_high" value={liveRange.high} />
              </>
            )}
            <h4 className="wizard__q">Where should we send your offer?</h4>
            <div className="quote-form__grid">
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
                  onChange={handleChange}
                  required
                />
              </label>
              <label className="field">
                <span>Your name</span>
                <input name="name" placeholder="Your name" autoComplete="name" value={form.name} onChange={handleChange} required />
              </label>
              <label className="field">
                <span>Phone</span>
                <input
                  name="phone"
                  type="tel"
                  placeholder="Phone number"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  minLength={7}
                />
              </label>
              <label className="field">
                <span>Email (optional)</span>
                <input name="email" type="email" placeholder="Email" autoComplete="email" value={form.email} onChange={handleChange} />
              </label>
            </div>
          </div>
        )}

        {error && <p className="quote-form__error">{error}</p>}

        <div className="wizard__nav">
          {!isFirst && (
            <button type="button" className="wizard__back" onClick={goBack}>
              ‹ Back
            </button>
          )}
          {isLast ? (
            <button type="submit" className="wizard__submit" disabled={status === 'submitting'}>
              {status === 'submitting' ? 'Sending…' : 'Get My Cash Offer'}
            </button>
          ) : (
            <button type="button" className="wizard__submit" onClick={goNext} disabled={!canAdvance}>
              Next ›
            </button>
          )}
        </div>

        <p className="quote-form__disclaimer">{formDisclaimer()}</p>
      </form>
    </div>
  )
}
