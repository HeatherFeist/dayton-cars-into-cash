import { US_MAP_SEPARATOR, US_MAP_VIEWBOX, US_STATE_PATHS } from '../lib/usMapPaths'
import { US_STATES } from '../lib/usStates'

export default function UsMap({ selected = '', activeAbbrs, matchAbbrs }) {
  const active = activeAbbrs || new Set()
  const matching = matchAbbrs || null

  return (
    <svg
      className="us-map"
      viewBox={US_MAP_VIEWBOX}
      role="img"
      aria-label="Map of the United States. Click a state to see its cities."
    >
      <path className="us-map__separator" d={US_MAP_SEPARATOR} fill="none" aria-hidden="true" />
      {US_STATES.map((state) => {
        const d = US_STATE_PATHS[state.abbr]
        if (!d) return null
        const isActive = active.has(state.abbr)
        const isSelected = selected.toUpperCase() === state.abbr
        const isDim = matching != null && !matching.has(state.abbr)
        return (
          <a
            key={state.abbr}
            className={[
              'us-map__state',
              isActive ? 'is-active' : '',
              isSelected ? 'is-selected' : '',
              isDim ? 'is-dim' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            href={`/${state.slug}`}
            aria-label={state.name}
            aria-current={isSelected ? 'page' : undefined}
          >
            <title>{state.name}</title>
            <path d={d} />
          </a>
        )
      })}
    </svg>
  )
}
