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

// Follow-up statuses the owner can set per lead. Free text in the DB; this is
// just the fixed set the dropdown offers.
const STATUS_OPTIONS = ['New', 'Contacted', 'Scheduled', 'Paid', 'Passed']

// Columns exported to CSV (and the order). Keeps every useful field so the CSV
// opens cleanly in Google Sheets / Excel.
const CSV_FIELDS = [
  'created_at', 'status', 'name', 'phone', 'email', 'zip',
  'year', 'make', 'model', 'trim', 'mileage',
  'starts', 'wheels', 'whole', 'catalytic', 'bodyDamage', 'interior', 'title',
  'estimate_low', 'estimate_high', 'notes',
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

// Quote one CSV cell: wrap in quotes and double any inner quotes, so commas,
// newlines, and quotes in notes/names don't break the file.
function csvCell(value) {
  if (value == null) return ''
  const s = String(value)
  return `"${s.replace(/"/g, '""')}"`
}

function leadsToCsv(leads) {
  const header = CSV_FIELDS.join(',')
  const rows = leads.map((lead) => CSV_FIELDS.map((f) => csvCell(lead[f])).join(','))
  return [header, ...rows].join('\r\n')
}

export default function AdminPanel({ onClose }) {
  const [authed, setAuthed] = useState(false)
  const [pw, setPw] = useState('')
  const [pwError, setPwError] = useState('')

  const [status, setStatus] = useState('idle') // idle | loading | ready | error
  const [leads, setLeads] = useState([])
  const [errorMsg, setErrorMsg] = useState('')
  const [query, setQuery] = useState('')
  const [savingId, setSavingId] = useState(null) // id of the row currently saving

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

  // Save an edited field (status or notes) for one lead. Optimistically update
  // the UI, then persist; on failure, reload to resync.
  async function saveLeadField(id, field, value) {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, [field]: value } : l)))
    setSavingId(id)
    try {
      if (!supabase) throw new Error('Supabase is not configured.')
      const { error } = await supabase
        .from('dayton_cars_leads')
        .update({ [field]: value })
        .eq('id', id)
      if (error) throw error
    } catch (err) {
      console.error('Failed to save', field, err)
      setErrorMsg(
        'Could not save your change. If this keeps happening, run ' +
          'supabase/003_lead_status_and_notes.sql to add the status/notes columns and update policy.'
      )
      loadLeads() // resync from the server
    } finally {
      setSavingId(null)
    }
  }

  // Permanently delete a lead (e.g. a test submission). Confirms first, then
  // removes it from the DB and the on-screen list.
  async function deleteLead(lead) {
    const who = lead.name || [lead.year, lead.make, lead.model].filter(Boolean).join(' ') || 'this lead'
    if (!window.confirm(`Delete ${who}? This can't be undone.`)) return
    setSavingId(lead.id)
    try {
      if (!supabase) throw new Error('Supabase is not configured.')
      const { error } = await supabase.from('dayton_cars_leads').delete().eq('id', lead.id)
      if (error) throw error
      setLeads((prev) => prev.filter((l) => l.id !== lead.id))
    } catch (err) {
      console.error('Failed to delete', err)
      setErrorMsg(
        'Could not delete that lead. If this keeps happening, run ' +
          'supabase/004_lead_delete_policy.sql to add the delete policy.'
      )
    } finally {
      setSavingId(null)
    }
  }

  function exportCsv() {
    const csv = leadsToCsv(leads)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    const stamp = new Date().toISOString().slice(0, 10)
    a.href = url
    a.download = `dayton-leads-${stamp}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // --- Search filter ---------------------------------------------------------
  const filteredLeads = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return leads
    return leads.filter((lead) => {
      const hay = [
        lead.name, lead.phone, lead.email, lead.zip, lead.status,
        lead.year, lead.make, lead.model, lead.notes,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return hay.includes(q)
    })
  }, [leads, query])

  // --- Derived stats (over ALL leads, not the filtered view) -----------------
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
              <div className="admin__head-actions">
                <button
                  type="button"
                  className="admin__export"
                  onClick={exportCsv}
                  disabled={leads.length === 0}
                  title="Download all leads as a CSV you can open in Google Sheets or Excel"
                >
                  ⇩ Export CSV
                </button>
                <button type="button" className="admin__refresh" onClick={loadLeads}>
                  ↻ Refresh
                </button>
              </div>
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

                <div className="admin__log-head">
                  <h3 className="admin__log-title">All leads</h3>
                  <input
                    className="admin__search"
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search name, phone, zip, vehicle…"
                  />
                </div>

                <div className="admin__table-wrap">
                  <table className="admin__table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>Email</th>
                        <th>Zip</th>
                        <th>Vehicle</th>
                        <th>Estimate</th>
                        <th>Notes</th>
                        <th aria-label="Delete"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLeads.length === 0 ? (
                        <tr>
                          <td colSpan={10} className="admin__muted">
                            {leads.length === 0 ? 'No leads yet.' : 'No leads match your search.'}
                          </td>
                        </tr>
                      ) : (
                        filteredLeads.map((lead) => (
                          <tr key={lead.id}>
                            <td>{fmtDate(lead.created_at)}</td>
                            <td>
                              <select
                                className={`admin__status admin__status--${(lead.status || 'New').toLowerCase()}`}
                                value={lead.status || 'New'}
                                disabled={savingId === lead.id}
                                onChange={(e) => saveLeadField(lead.id, 'status', e.target.value)}
                              >
                                {STATUS_OPTIONS.map((s) => (
                                  <option key={s} value={s}>
                                    {s}
                                  </option>
                                ))}
                              </select>
                            </td>
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
                            <td>
                              <input
                                className="admin__notes"
                                type="text"
                                defaultValue={lead.notes || ''}
                                placeholder="Add a note…"
                                disabled={savingId === lead.id}
                                // Save on blur (leaving the field) or Enter, so we
                                // don't write on every keystroke.
                                onBlur={(e) => {
                                  if (e.target.value !== (lead.notes || '')) {
                                    saveLeadField(lead.id, 'notes', e.target.value)
                                  }
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') e.target.blur()
                                }}
                              />
                            </td>
                            <td>
                              <button
                                type="button"
                                className="admin__delete"
                                title="Delete this lead"
                                aria-label={`Delete lead ${lead.name || ''}`}
                                disabled={savingId === lead.id}
                                onClick={() => deleteLead(lead)}
                              >
                                🗑
                              </button>
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
