import { useEffect, useMemo, useState } from 'react'
import network from '../../network.config.js'
import UsMap from '../components/UsMap'
import { citiesInState, directoryPageMeta, parseDirectoryPath } from '../lib/yards'
import { US_STATES } from '../lib/usStates'

function Shell({ crumb, children }) {
  return (
    <div className="page directory">
      <header className="header">
        <div className="header__inner">
          <a className="logo" href="/">
            {network.name}
          </a>
          <p className="header__tag">Find a yard</p>
        </div>
      </header>
      <section className="hero directory-hero">
        <div className="directory-hero__inner">
          {crumb}
          {children}
        </div>
      </section>
      <footer className="footer">
        <p>
          &copy; {new Date().getFullYear()} {network.name}. City links open that yard&apos;s own
          website. You call them directly.
        </p>
      </footer>
    </div>
  )
}

function Crumb({ state, city }) {
  return (
    <p className="directory-crumb">
      <a href="/">All states</a>
      {state ? (
        <>
          <span aria-hidden="true"> / </span>
          {city ? <a href={`/${state.slug}`}>{state.name}</a> : state.name}
        </>
      ) : null}
      {city ? (
        <>
          <span aria-hidden="true"> / </span>
          {city}
        </>
      ) : null}
    </p>
  )
}

export default function DirectoryPage({ path = '/' }) {
  const page = parseDirectoryPath(path)
  const [query, setQuery] = useState('')

  useEffect(() => {
    const meta = directoryPageMeta(path)
    document.title = meta.title
  }, [path])

  if (page.kind === 'state') {
    const cities = citiesInState(page.state)
    return (
      <Shell crumb={<Crumb state={page.state} />}>
        <h1>Cities in {page.state.name}</h1>
        <p>
          {cities.length
            ? 'Choose a city. The next page lists the yards there, and each one opens that yard’s own website.'
            : `No yards are listed in ${page.state.name} yet.`}
        </p>
        {cities.length > 0 && (
          <div className="directory-grid directory-grid--on-dark">
            {cities.map((city) => (
              <a className="directory-card" key={city.slug} href={`/${page.state.slug}/${city.slug}`}>
                <strong>{city.name}</strong>
                <span>
                  {page.state.abbr}
                </span>
              </a>
            ))}
          </div>
        )}
        <p className="directory-map-lead">Or click another state on the map.</p>
        <UsMap selected={page.state.abbr} activeAbbrs={activeStateAbbrs()} />
      </Shell>
    )
  }

  if (page.kind === 'city') {
    return (
      <Shell crumb={<Crumb state={page.state} city={page.city} />}>
        <h1>Yards in {page.city}, {page.state.abbr}</h1>
        <p>Each link opens that yard’s own website.</p>
        <div className="directory-grid directory-grid--on-dark">
          {page.yards.map((row) => (
            <a className="directory-card" key={row.yard.subdomain} href={row.href}>
              <strong>{row.yard.businessName}</strong>
              <span className="directory-card__host">{row.host}</span>
              {row.yard.phoneDisplay ? <span className="directory-card__phone">{row.yard.phoneDisplay}</span> : null}
            </a>
          ))}
        </div>
      </Shell>
    )
  }

  if (page.kind === 'missing') {
    return (
      <Shell crumb={<Crumb />}>
        <h1>Page not found</h1>
        <p>That page is not on the directory.</p>
        <a className="btn btn--accent" href="/">
          Back to all states
        </a>
      </Shell>
    )
  }

  return <StatesHome query={query} setQuery={setQuery} />
}

function StatesHome({ query, setQuery }) {
  const needle = query.trim().toLowerCase()
  const states = useMemo(
    () =>
      US_STATES.map((state) => ({
        state,
        cities: citiesInState(state),
      })),
    [],
  )
  const visibleStates = needle
    ? states.filter((row) => row.state.name.toLowerCase().includes(needle) || row.state.abbr.toLowerCase() === needle)
    : states
  const cityHits = needle
    ? states.flatMap((row) =>
        row.cities
          .filter((city) => city.name.toLowerCase().includes(needle))
          .map((city) => ({ ...city, state: row.state })),
      )
    : []

  const matchAbbrs = needle
    ? new Set([
        ...visibleStates.map((row) => row.state.abbr),
        ...cityHits.map((city) => city.state.abbr),
      ])
    : null
  const activeAbbrs = useMemo(
    () => new Set(states.filter((row) => row.cities.length).map((row) => row.state.abbr)),
    [states],
  )

  return (
    <Shell crumb={null}>
      <h1>Choose your state</h1>
      <p>{network.tagline}</p>
      <p className="directory-map-lead">
        Click a state on the map to see its cities, then open a yard’s own website.
      </p>
      <label className="directory-search">
        <span>Search by state or city</span>
        <input
          type="search"
          value={query}
          placeholder="Try Ohio or Dayton"
          onChange={(event) => setQuery(event.target.value)}
        />
      </label>
      <UsMap activeAbbrs={activeAbbrs} matchAbbrs={matchAbbrs} />
      {cityHits.length > 0 && (
        <div className="directory-grid directory-grid--on-dark">
          {cityHits.map((city) => (
            <a className="directory-card" key={`${city.state.slug}-${city.slug}`} href={`/${city.state.slug}/${city.slug}`}>
              <strong>{city.name}</strong>
              <span>{city.state.name}</span>
            </a>
          ))}
        </div>
      )}
      <div className="directory-grid directory-grid--on-dark">
        {visibleStates.map((row) => (
          <a
            className={`directory-card${row.cities.length ? '' : ' directory-card--empty'}`}
            key={row.state.abbr}
            href={`/${row.state.slug}`}
          >
            <strong>{row.state.name}</strong>
            <span>{row.cities.length ? `${row.cities.length} ${row.cities.length === 1 ? 'city' : 'cities'}` : 'No yards yet'}</span>
          </a>
        ))}
      </div>
      {visibleStates.length === 0 && cityHits.length === 0 && (
        <p className="directory-empty">No state or city matches that search.</p>
      )}
    </Shell>
  )
}

function activeStateAbbrs() {
  return new Set(US_STATES.filter((state) => citiesInState(state).length).map((state) => state.abbr))
}
