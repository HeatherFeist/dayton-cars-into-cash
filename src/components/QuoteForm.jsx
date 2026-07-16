import { useMemo, useState } from 'react'
import { supabase } from '../supabaseClient'
import { estimateOffer, formatRange } from '../lib/estimateOffer'
import { MAKES, modelsForMake, OTHER } from '../lib/vehicleData'
import { CONDITION_QUESTIONS, NO_TITLE_VALUE } from '../lib/conditionQuestions'

const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: 40 }, (_, i) => CURRENT_YEAR + 1 - i)

const PHONE_DISPLAY = '(937) 296-6755'
const PHONE_HREF = 'tel:19372966755'

// One entry per screen of the wizard, in order. The vehicle basics and the
// contact details are custom screens; every condition question in between is
// generated from CONDITION_QUESTIONS so the flow stays data-driven.
const VEHICLE_STEP = { kind: 'vehicle' }
const CONTACT_STEP = { kind: 'contact' }
const STEPS = [
  VEHICLE_STEP,
  ...CONDITION_QUESTIONS.map((q) => ({ kind: 'condition', question: q })),
  CONTACT_STEP,
]
const TOTAL_STEPS = STEPS.length

const initialState = {
  // vehicle basics
  year: '',
  make: '',
  model: '',
  trim: '',
  mileage: '',
  // condition answers (one per CONDITION_QUESTIONS entry)
  starts: '',
  wheels: '',
  whole: '',
  catalytic: '',
  bodyDamage: '',
  interior: '',
  title: '',
  // contact
  zip: '',
  name: '',
  phone: '',
  email: '',
}

export default function QuoteForm() {
  const [form, setForm] = useState(initialState)
  const [stepIndex, setStepIndex] = useState(0)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [estimate, setEstimate] = useState(null)

  const step = STEPS[stepIndex]
  const isFirst = stepIndex === 0
  const isLast = stepIndex === TOTAL_STEPS - 1
  const progress = Math.round(((stepIndex + 1) / TOTAL_STEPS) * 100)

  // When "Other" make is chosen, there's no useful model dropdown, so let the
  // customer type their model instead of forcing a single "Other" option.
  const isOtherMake = form.make === OTHER
  const modelOptions = useMemo(() => modelsForMake(form.make), [form.make])

  // We can't buy a vehicle without a valid title, so block the flow the moment
  // "I don't have the title" is selected on the title step.
  const noTitle = form.title === NO_TITLE_VALUE

  function update(name, value) {
    setForm((prev) => {
      // Changing the make invalidates the previously selected model, so clear
      // it — otherwise a leftover model from the old make could be submitted.
      if (name === 'make') return { ...prev, make: value, model: '' }
      return { ...prev, [name]: value }
    })
  }

  function handleChange(e) {
    update(e.target.name, e.target.value)
  }

  // Is the current step complete enough to advance?
  const canAdvance = useMemo(() => {
    if (step.kind === 'vehicle') {
      return Boolean(form.year && form.make && form.model)
    }
    if (step.kind === 'condition') {
      const answered = Boolean(form[step.question.field])
      // Don't let them move past the title question with "no title" selected —
      // we show the block notice instead.
      if (step.question.field === 'title') return answered && !noTitle
      return answered
    }
    return true // contact step validates via the browser on submit
  }, [step, form, noTitle])

  function goNext() {
    setError('')
    if (!canAdvance) return
    setStepIndex((i) => Math.min(TOTAL_STEPS - 1, i + 1))
  }

  function goBack() {
    setError('')
    setStepIndex((i) => Math.max(0, i - 1))
  }

  // Picking an answer on a condition step auto-advances (like Peddle), unless
  // it's the blocking "no title" choice.
  function pickOption(field, value) {
    update(field, value)
    if (field === 'title' && value === NO_TITLE_VALUE) return
    // Advance on the next tick so the highlighted selection is visible first.
    setTimeout(() => setStepIndex((i) => Math.min(TOTAL_STEPS - 1, i + 1)), 160)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (noTitle) return
    setStatus('submitting')
    setError('')
    try {
      const range = estimateOffer(form)
      if (!supabase) throw new Error('Supabase is not configured')
      const { error: insertError } = await supabase.from('dayton_cars_leads').insert([
        {
          ...form,
          mileage: form.mileage ? Number(form.mileage) : null,
          estimate_low: range.low,
          estimate_high: range.high,
        },
      ])
      if (insertError) throw insertError
      setEstimate(range)
      setStatus('success')
    } catch (err) {
      console.error(err)
      setError('Something went wrong submitting your request. Please call us instead.')
      setStatus('error')
    }
  }

  function reset() {
    setForm(initialState)
    setEstimate(null)
    setStepIndex(0)
    setStatus('idle')
    setError('')
  }

  if (status === 'success') {
    return (
      <div className="quote-form quote-form--success">
        <h3>Your Estimated Offer</h3>
        {estimate && <p className="quote-form__estimate">{formatRange(estimate)}</p>}
        <p>
          This is a ballpark estimate based on what you told us. We'll call you
          shortly to confirm your <strong>final cash offer</strong> and schedule
          free pickup. Prefer to talk now? Call{' '}
          <a href={PHONE_HREF}>{PHONE_DISPLAY}</a>.
        </p>
        <button type="button" onClick={reset}>
          Submit another vehicle
        </button>
      </div>
    )
  }

  return (
    <div className="quote-form">
      <div className="wizard__head">
        <h3>Get Your Instant Cash Offer</h3>
        <span className="wizard__count">
          Step {stepIndex + 1} of {TOTAL_STEPS}
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

      <form onSubmit={handleSubmit}>
        {step.kind === 'vehicle' && (
          <div className="wizard__step">
            <h4 className="wizard__q">Tell us about your vehicle</h4>
            <div className="quote-form__grid">
              <select name="year" value={form.year} onChange={handleChange} required>
                <option value="" disabled>
                  Year
                </option>
                {YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
              <select name="make" value={form.make} onChange={handleChange} required>
                <option value="" disabled>
                  Make
                </option>
                {MAKES.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              {isOtherMake ? (
                <input
                  name="model"
                  placeholder="Model"
                  value={form.model}
                  onChange={handleChange}
                  required
                />
              ) : (
                <select
                  name="model"
                  value={form.model}
                  onChange={handleChange}
                  required
                  disabled={!form.make}
                >
                  <option value="" disabled>
                    {form.make ? 'Model' : 'Select make first'}
                  </option>
                  {modelOptions.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              )}
              <input
                name="trim"
                placeholder="Trim / Style (optional)"
                value={form.trim}
                onChange={handleChange}
              />
              <input
                name="mileage"
                placeholder="Mileage (optional)"
                inputMode="numeric"
                pattern="[0-9]*"
                value={form.mileage}
                onChange={handleChange}
              />
            </div>
          </div>
        )}

        {step.kind === 'condition' && (
          <div className="wizard__step">
            <h4 className="wizard__q">{step.question.question}</h4>
            {step.question.help && (
              <p className="wizard__help">{step.question.help}</p>
            )}
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
            {step.question.field === 'title' && noTitle && (
              <p className="quote-form__notice">
                Sorry, we cannot buy a vehicle without a valid title. If you can
                get a replacement title, we'd be glad to make you an offer — or
                call us at <a href={PHONE_HREF}>{PHONE_DISPLAY}</a> to talk
                through your options.
              </p>
            )}
          </div>
        )}

        {step.kind === 'contact' && (
          <div className="wizard__step">
            <h4 className="wizard__q">Where should we send your offer?</h4>
            <div className="quote-form__grid">
              <input
                name="zip"
                placeholder="Zip Code"
                inputMode="numeric"
                pattern="[0-9]{5}"
                maxLength={5}
                value={form.zip}
                onChange={handleChange}
                required
              />
              <input
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                required
              />
              <input
                name="phone"
                type="tel"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
                required
              />
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
              />
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
            <button
              type="submit"
              className="wizard__submit"
              disabled={status === 'submitting' || noTitle}
            >
              {status === 'submitting' ? 'Submitting…' : 'Get My Cash Offer'}
            </button>
          ) : (
            <button
              type="button"
              className="wizard__submit"
              onClick={goNext}
              disabled={!canAdvance}
            >
              Next ›
            </button>
          )}
        </div>

        <p className="quote-form__disclaimer">
          Get an instant estimate — final offer confirmed by phone. No obligation,
          free towing within 60 miles of Dayton.
        </p>
      </form>
    </div>
  )
}
