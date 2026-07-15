import { useState } from 'react'
import { supabase } from '../supabaseClient'
import { estimateOffer, formatRange } from '../lib/estimateOffer'
import { MAKES, modelsForMake, OTHER } from '../lib/vehicleData'

const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: 40 }, (_, i) => CURRENT_YEAR + 1 - i)

const CONDITIONS = ['Running', 'Not Running', 'Wrecked / Totaled', 'No Title']

const initialState = {
  year: '',
  make: '',
  model: '',
  condition: '',
  zip: '',
  name: '',
  phone: '',
  email: '',
}

export default function QuoteForm() {
  const [form, setForm] = useState(initialState)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [estimate, setEstimate] = useState(null)

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => {
      // Changing the make invalidates the previously selected model, so clear
      // it — otherwise a leftover model from the old make could be submitted.
      if (name === 'make') return { ...prev, make: value, model: '' }
      return { ...prev, [name]: value }
    })
  }

  // When "Other" make is chosen, there's no useful model dropdown, so let the
  // customer type their model instead of forcing a single "Other" option.
  const isOtherMake = form.make === OTHER
  const modelOptions = modelsForMake(form.make)

  // We can't buy a vehicle without a valid title, so block submission and show
  // a message the moment "No Title" is selected.
  const noTitle = form.condition === 'No Title'

  async function handleSubmit(e) {
    e.preventDefault()
    if (noTitle) return
    setStatus('submitting')
    setError('')
    try {
      const range = estimateOffer(form)
      if (!supabase) throw new Error('Supabase is not configured')
      const { error: insertError } = await supabase.from('dayton_cars_leads').insert([
        { ...form, estimate_low: range.low, estimate_high: range.high },
      ])
      if (insertError) throw insertError
      setEstimate(range)
      setStatus('success')
      setForm(initialState)
    } catch (err) {
      console.error(err)
      setError('Something went wrong submitting your request. Please call us instead.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="quote-form quote-form--success">
        <h3>Your Estimated Offer</h3>
        {estimate && (
          <p className="quote-form__estimate">{formatRange(estimate)}</p>
        )}
        <p>
          This is a ballpark estimate based on what you told us. We'll call you
          shortly to confirm your <strong>final cash offer</strong> and schedule
          free pickup. Prefer to talk now? Call{' '}
          <a href="tel:19372966755">(937) 296-6755</a>.
        </p>
        <button type="button" onClick={() => { setEstimate(null); setStatus('idle') }}>
          Submit another vehicle
        </button>
      </div>
    )
  }

  return (
    <form className="quote-form" onSubmit={handleSubmit}>
      <h3>Get Your Instant Cash Offer</h3>
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
        <select
          name="condition"
          value={form.condition}
          onChange={handleChange}
          required
        >
          <option value="" disabled>
            Condition
          </option>
          {CONDITIONS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
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
      {noTitle && (
        <p className="quote-form__notice">
          Sorry, we cannot service without a valid title. If you can get a
          replacement title, we'd be glad to make you an offer — or call us at{' '}
          <a href="tel:19372966755">(937) 296-6755</a> to talk through your
          options.
        </p>
      )}
      {error && <p className="quote-form__error">{error}</p>}
      <button type="submit" disabled={status === 'submitting' || noTitle}>
        {status === 'submitting' ? 'Submitting…' : 'Get My Cash Offer'}
      </button>
      <p className="quote-form__disclaimer">
        Get an instant estimate — final offer confirmed by phone. No obligation,
        free towing within 60 miles of Dayton.
      </p>
    </form>
  )
}
