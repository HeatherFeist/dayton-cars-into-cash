import { useMemo, useState } from 'react'
import network from '../../network.config.js'
import { yardsForDirectory } from '../lib/yards'

function cityLine(row) {
  const others = row.cities.filter((city) => city !== row.primaryCity)
  const shown = others.slice(0, 3)
  const extra = others.length - shown.length
  if (shown.length === 0) return `Based in ${row.primaryCity}`
  const list = [row.primaryCity, ...shown].join(', ')
  return extra > 0 ? `Picks up in ${list}, and ${extra} more` : `Picks up in ${list}`
}

export default function DirectoryPage() {
  const [query, setQuery] = useState('')
  const yards = useMemo(() => yardsForDirectory(), [])
  const needle = query.trim().toLowerCase()
  const visible = needle
    ? yards.filter((row) =>
        `${row.yard.businessName} ${row.host} ${row.primaryCity} ${row.state} ${row.cities.join(' ')}`
          .toLowerCase()
          .includes(needle),
      )
    : yards

  const groups = []
  for (const row of visible) {
    const last = groups[groups.length - 1]
    if (!last || last.state !== row.state) groups.push({ state: row.state, rows: [row] })
    else last.rows.push(row)
  }

  return (
    <div className="page directory">
      <header className="header">
        <div className="header__inner">
          <a className="logo" href="/">
            {network.name}
          </a>
          <p className="header__tag">Yard directory</p>
        </div>
      </header>

      <section className="hero directory-hero">
        <div className="directory-hero__inner">
          <h1>{network.headline}</h1>
          <p>{network.tagline}</p>
          <label className="directory-search">
            <span>Search by city or yard</span>
            <input
              type="search"
              value={query}
              placeholder="Try a city or a business name"
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
        </div>
      </section>

      <section className="directory-list" id="yards">
        {groups.length === 0 && <p className="directory-empty">No yard matches that search.</p>}
        {groups.map((group) => (
          <div key={group.state} className="directory-group">
            <h2>{group.state}</h2>
            <div className="directory-grid">
              {group.rows.map((row) => (
                <a className="directory-card" key={row.yard.subdomain} href={row.href}>
                  <strong>{row.yard.businessName}</strong>
                  <span className="directory-card__host">{row.host}</span>
                  <span>
                    {row.primaryCity}, {row.stateAbbr}
                  </span>
                  <span className="directory-card__phone">{cityLine(row)}</span>
                  {row.yard.phoneDisplay ? <span className="directory-card__phone">{row.yard.phoneDisplay}</span> : null}
                </a>
              ))}
            </div>
          </div>
        ))}
      </section>

      <footer className="footer">
        <p>
          &copy; {new Date().getFullYear()} {network.name}. Each link opens that yard&apos;s own
          website. You call them directly.
        </p>
      </footer>
    </div>
  )
}
