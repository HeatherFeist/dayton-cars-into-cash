import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../supabaseClient'

// Hidden lead dashboard for the business owner. It's opened by a secret
// gesture in App.jsx (tap the logo 6× fast) and gated by a simple password.
//
// ⚠️ This password lives in front-end code and the Supabase anon key is public,
// so this hides the data from casual view but is NOT strong security. See
// supabase/002_wizard_columns_and_admin_read.sql for the proper-auth upgrade
// path. Keep real secrets out of here.
const ADMIN_PASSWORD = 'Admin'

// Only these columns are shown in the log table, in this order. (The raw row
// has more — condition answers etc. — but this keeps the table readable.)
const COLUMNS = [
  { key: 'created_at', label: 'Date' },
  { key: 'name', label: 'Name' },
  { key: 'phone', label: 'Phone' },
  { key: 'email', label: 'Email' },
  { key: 'zip', label: 'Zip' },
  { key: 'vehicle', label: 'Vehicle' },
  { key: 'estimate', label: 'Estimate' },
]

function fmtDate(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function dayKey(iso) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function AdminPanel({ onClose }) {
  const [authed, setAuthed] = useState(false)
  const [pw, setPw] = useState('')
  const [pwError, setPwError] = useState('')

  const [status, setStatus] = useState('idle') // idle | loading | ready | error
  const [leads, setLeads] = useState([])
  const [errorMsg, setErrorMsg] = useState('')

  // Close on Escape for convenience.
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  async function loadLeads() {
    setStatus('loading')
    setErrorMsg('')
    try {
      if (!supabase) throw new Error('Supabase is not configured.')
      const { data, error } = await supabase
        .from('dayton_cars_leads')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      setLeads(data || [])
      setStatus('ready')
    } catch (err) {
      console.error(err)
      // The most common cause is a missing SELECT policy on the table — call
      // that out so it's fixable without digging.
      setErrorMsg(
        (err && err.message ? err.message + ' ' : '') +
          "If this says permission denied or returns nothing, run supabase/002_wizard_columns_and_admin_read.sql to add the read policy."
      )
      setStatus('error')
    }
  }

  function submitPassword(e) {
    e.preventDefault()
    if (pw === ADMIN_PASSWORD) {
      setAuthed(true)
      setPwError('')
      loadLeads()
    } else {
      setPwError('Incorrect password.')
    }
  }

  // --- Derived stats ---------------------------------------------------------
  const perDay = useMemo(() => {
    const counts = new Map()
    for (const lead of leads) {
      const k = dayKey(lead.created_at)
      counts.set(k, (counts.get(k) || 0) + 1)
    }
    return [...counts.entries()] // preserves insertion order = newest first
  }, [leads])

  const perZip = useMemo(() => {
    const counts = new Map()
    for (const lead of leads) {
      const k = lead.zip || '(no zip)'
      counts.set(k, (counts.get(k) || 0) + 1)
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1])
  }, [leads])

  const todayCount = useMemo(() => {
    const today = dayKey(new Date().toISOString())
    return leads.filter((l) => dayKey(l.created_at) === today).length
  }, [leads])

  return (
    <div className="admin" role="dialog" aria-modal="true" aria-label="Admin panel">
      <div className="admin__box">
        <button className="admin__close" type="button" onClick={onClose} aria-label="Close">
          ×
        </button>

        {!authed ? (
          <form className="admin__gate" onSubmit={submitPassword}>
            <h2>Admin Access</h2>
            <p>Enter the password to view leads.</p>
            <input
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="Password"
              autoFocus
            />
            {pwError && <p className="admin__error">{pwError}</p>}
            <button type="submit">View Leads</button>
          </form>
        ) : (
          <div className="admin__dash">
            <div className="admin__head">
              <h2>Leads Dashboard</h2>
              <button type="button" className="admin__refresh" onClick={loadLeads}>
                ↻ Refresh
              </button>
            </div>

            {status === 'loading' && <p>Loading leads…</p>}
            {status === 'error' && <p className="admin__error">{errorMsg}</p>}

            {status === 'ready' && (
              <>
                <div className="admin__stats">
                  <div className="admin__stat">
                    <strong>{leads.length}</strong>
                    <span>Total leads</span>
                  </div>
                  <div className="admin__stat">
                    <strong>{todayCount}</strong>
                    <span>Today</span>
                  </div>
                  <div className="admin__stat">
                    <strong>{perZip.length}</strong>
                    <span>Zip codes</span>
                  </div>
                </div>

                <div className="admin__cols">
                  <div className="admin__panel">
                    <h3>Per day</h3>
                    {perDay.length === 0 ? (
                      <p className="admin__muted">No leads yet.</p>
                    ) : (
                      <ul className="admin__list">
                        {perDay.map(([day, count]) => (
                          <li key={day}>
                            <span>{day}</span>
                            <span className="admin__count">{count}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="admin__panel">
                    <h3>By location (zip)</h3>
                    {perZip.length === 0 ? (
                      <p className="admin__muted">No leads yet.</p>
                    ) : (
                      <ul className="admin__list">
                        {perZip.map(([zip, count]) => (
                          <li key={zip}>
                            <span>{zip}</span>
                            <span className="admin__count">{count}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                <h3 className="admin__log-title">All leads</h3>
                <div className="admin__table-wrap">
                  <table className="admin__table">
                    <thead>
                      <tr>
                        {COLUMNS.map((c) => (
                          <th key={c.key}>{c.label}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {leads.length === 0 ? (
                        <tr>
                          <td colSpan={COLUMNS.length} className="admin__muted">
                            No leads yet.
                          </td>
                        </tr>
                      ) : (
                        leads.map((lead) => (
                          <tr key={lead.id}>
                            <td>{fmtDate(lead.created_at)}</td>
                            <td>{lead.name || '—'}</td>
                            <td>{lead.phone || '—'}</td>
                            <td>{lead.email || '—'}</td>
                            <td>{lead.zip || '—'}</td>
                            <td>
                              {[lead.year, lead.make, lead.model].filter(Boolean).join(' ') || '—'}
                            </td>
                            <td>
                              {lead.estimate_low != null && lead.estimate_high != null ? (
                                <span className="admin__quote">
                                  <strong>
                                    ~$
                                    {Math.round(
                                      (lead.estimate_low + lead.estimate_high) / 2
                                    ).toLocaleString('en-US')}
                                  </strong>
                                  <span className="admin__quote-range">
                                    ${lead.estimate_low.toLocaleString('en-US')}–$
                                    {lead.estimate_high.toLocaleString('en-US')}
                                  </span>
                                </span>
                              ) : (
                                '—'
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
