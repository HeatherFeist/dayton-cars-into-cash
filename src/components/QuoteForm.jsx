import { useState } from 'react'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'

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

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('submitting')
    setError('')
    try {
      await addDoc(collection(db, 'leads'), {
        ...form,
        createdAt: serverTimestamp(),
      })
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
        <h3>Thanks! Your request is in.</h3>
        <p>
          A Dayton Cars into Cash specialist will call you shortly with your
          cash offer. Prefer to talk now? Call{' '}
          <a href="tel:19375550123">(937) 555-0123</a>.
        </p>
        <button type="button" onClick={() => setStatus('idle')}>
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
        <input
          name="make"
          placeholder="Make (e.g. Honda)"
          value={form.make}
          onChange={handleChange}
          required
        />
        <input
          name="model"
          placeholder="Model (e.g. Civic)"
          value={form.model}
          onChange={handleChange}
          required
        />
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
      {error && <p className="quote-form__error">{error}</p>}
      <button type="submit" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Submitting…' : 'Get My Cash Offer'}
      </button>
      <p className="quote-form__disclaimer">
        No obligation. Free towing anywhere in the Dayton area.
      </p>
    </form>
  )
}
