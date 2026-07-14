// Rule-based ballpark estimator for junk/used car offers.
//
// This is intentionally simple: it produces a rough cash RANGE from the
// handful of fields we collect. It is NOT a market valuation — the final
// offer is always confirmed by phone after a human reviews the vehicle.
//
// Model:
//   base scrap value  (by rough body type, a proxy for vehicle weight)
//   × condition multiplier   (running cars are worth more than pure scrap)
//   − mild age penalty       (older vehicles trend toward scrap value)
//   clamped to a floor so nothing reads as insultingly low.

const CURRENT_YEAR = new Date().getFullYear()

// Keyword → base value. Order matters: first match wins, so put more
// specific / heavier types before lighter ones.
const BODY_TYPE_BASE = [
  { test: /truck|pickup|silverado|sierra|f-?150|f-?250|f-?350|ram|tundra|tacoma|ranger|frontier|colorado/i, base: 650 },
  { test: /van|suburban|tahoe|yukon|expedition|sequoia|escalade|denali/i, base: 550 },
  { test: /suv|explorer|pilot|highlander|4runner|traverse|equinox|rav4|cr-?v|rogue|escape|blazer|durango/i, base: 500 },
  { test: /.*/, base: 400 }, // sedans / coupes / everything else
]

const CONDITION_MULTIPLIER = {
  Running: 1.6,
  'Not Running': 1.0,
  'Wrecked / Totaled': 0.85,
  'No Title': 0.7,
}

const FLOOR = 250 // we'll pay at least this for any complete vehicle

function baseForVehicle(make = '', model = '') {
  const hay = `${make} ${model}`
  const match = BODY_TYPE_BASE.find((row) => row.test.test(hay))
  return match ? match.base : 400
}

// Round to the nearest $25 so the numbers look like real quotes.
function roundTo25(n) {
  return Math.round(n / 25) * 25
}

export function estimateOffer({ year, make, model, condition }) {
  const base = baseForVehicle(make, model)
  const multiplier = CONDITION_MULTIPLIER[condition] ?? 1.0

  // Age penalty: newer vehicles hold more value. Cap the penalty so a very
  // old vehicle still lands at roughly its scrap floor rather than negative.
  const age = year ? Math.max(0, CURRENT_YEAR - Number(year)) : 15
  const ageFactor = Math.max(0.5, 1 - age * 0.02) // -2%/yr, never below 50%

  const point = Math.max(FLOOR, base * multiplier * ageFactor)

  // Present a range around the point estimate (±15%), clamped to the floor.
  const low = roundTo25(Math.max(FLOOR, point * 0.85))
  const high = roundTo25(point * 1.15)

  return { low, high }
}

export function formatRange({ low, high }) {
  const fmt = (n) => `$${n.toLocaleString('en-US')}`
  return `${fmt(low)}–${fmt(high)}`
}
