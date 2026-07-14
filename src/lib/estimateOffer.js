// Weight-based ballpark estimator for junk/used car offers.
//
// This produces a rough cash RANGE from the handful of fields we collect.
// It is NOT a market valuation — the final offer is always confirmed by
// phone after a human reviews the vehicle.
//
// Model (mirrors how real Dayton scrap yards price a vehicle):
//
//   scrap value  =  vehicle weight (tons)  ×  scrap rate ($/ton)
//   offer        =  scrap value  ×  condition multiplier
//                                   (running cars carry salvageable parts,
//                                    so they're worth MORE than pure scrap)
//                                −  mild age penalty on the parts premium
//
// The scrap value is a hard floor: a complete vehicle is always worth at
// least its metal, regardless of age or whether it runs.
//
// CALIBRATION — Dayton / Ohio market, 2026 (sources at bottom of file):
//   Scrap steel rate ........... ~$175–$185/ton (using $180 midpoint)
//   Typical curb weights ....... sedan ~1.7t, SUV ~2.0t, van ~2.25t,
//                                pickup ~2.5t
//   → scrap-only floor .......... sedan ~$306, SUV ~$360, van ~$405,
//                                truck ~$450
//   Dayton per-type averages ... sedan ~$403, SUV ~$470, truck ~$479
//     (the gap above scrap = the running/parts premium)

const CURRENT_YEAR = new Date().getFullYear()

// Current scrap steel rate for a complete auto body, $/ton. Ohio ran
// ~$175–$185/ton in 2026; $180 is the midpoint. Bump this when the metals
// market moves — it's the single knob that rescales every estimate.
const SCRAP_RATE_PER_TON = 180

// Keyword → typical curb weight in tons (a proxy we can't measure directly).
// Order matters: first match wins, so put more specific / heavier types
// before lighter ones.
const BODY_TYPE_WEIGHT_TONS = [
  // Heavy-duty & full-size pickups
  { test: /f-?250|f-?350|silverado ?2500|silverado ?3500|ram ?2500|ram ?3500|sierra ?2500|sierra ?3500|super ?duty/i, tons: 3.2 },
  // Light-duty pickups
  { test: /truck|pickup|silverado|sierra|f-?150|ram|tundra|tacoma|ranger|frontier|colorado|ridgeline|canyon/i, tons: 2.5 },
  // Full-size SUVs & vans
  { test: /suburban|tahoe|yukon|expedition|sequoia|escalade|denali|armada|navigator/i, tons: 2.9 },
  // Minivans / cargo vans
  { test: /van|caravan|odyssey|sienna|pacifica|transit|express|savana|town ?&? ?country/i, tons: 2.25 },
  // Midsize/compact SUVs & crossovers
  { test: /suv|explorer|pilot|highlander|4runner|traverse|equinox|rav4|cr-?v|rogue|escape|blazer|durango|edge|cherokee|wrangler|forester|outback|cx-?5/i, tons: 2.0 },
  // Sedans / coupes / everything else
  { test: /.*/, tons: 1.7 },
]

// Condition multiplier applied to scrap value. "Not Running" but complete is
// the reference (×1.0 = pure scrap). Running vehicles carry resellable parts
// (engine, transmission, cats, electronics) and fetch a premium. Damaged /
// title-less vehicles are worth less because they're scrap-only or harder to
// process. Capped so a running truck stays inside the real Dayton ceiling.
const CONDITION_MULTIPLIER = {
  Running: 1.6,
  'Not Running': 1.0,
  'Wrecked / Totaled': 0.9,
  'No Title': 0.8,
}

function weightForVehicle(make = '', model = '') {
  const hay = `${make} ${model}`
  const match = BODY_TYPE_WEIGHT_TONS.find((row) => row.test.test(hay))
  return match ? match.tons : 1.7
}

// Round to the nearest $25 so the numbers look like real quotes.
function roundTo25(n) {
  return Math.round(n / 25) * 25
}

export function estimateOffer({ year, make, model, condition }) {
  const tons = weightForVehicle(make, model)
  const multiplier = CONDITION_MULTIPLIER[condition] ?? 1.0

  // Pure metal value — this is the hard floor. A complete vehicle is always
  // worth at least its scrap steel, no matter the age or condition.
  const scrapValue = tons * SCRAP_RATE_PER_TON

  // Age only erodes the PART of the offer that's above scrap (the parts
  // premium). Newer vehicles have more valuable, in-demand parts. We never
  // let the total fall below the metal value.
  const age = year ? Math.max(0, CURRENT_YEAR - Number(year)) : 15
  const premiumAgeFactor = Math.max(0.4, 1 - age * 0.03) // -3%/yr, floor 40%

  const grossOffer = scrapValue * multiplier
  const premium = Math.max(0, grossOffer - scrapValue) * premiumAgeFactor
  const point = scrapValue + premium

  // Present a range around the point estimate (±15%), never below scrap.
  const low = roundTo25(Math.max(scrapValue, point * 0.85))
  const high = roundTo25(point * 1.15)

  return { low, high }
}

export function formatRange({ low, high }) {
  const fmt = (n) => `$${n.toLocaleString('en-US')}`
  return `${fmt(low)}–${fmt(high)}`
}

// Calibration sources (Dayton / Ohio junk car market, checked 2026):
//   - Ohio scrap car rate ~$175–$185/ton; regional (Toledo) $180/ton:
//     https://clunqr.com/junk-car-prices-per-ton/
//   - Typical curb weights by body type (sedan ~1.7t, SUV ~2.0t,
//     van ~2.25t, pickup ~2.5t): same source.
//   - Dayton per-vehicle averages (~$427 overall; sedan ~$403, SUV ~$470,
//     truck ~$479): https://www.junkcarmedics.com/ohio/dayton-oh-junk-car-buyers/
//   - Dayton scrap-yard pricing & rules (title, notarization, complete-
//     vehicle requirements): https://www.daytonmetalrecycling.com/pricing
//   - Local scrap-metal spot prices:
//     https://www.recyclingmonster.com/scrap-metal-price/united-states/ohio/dayton/655
// Update SCRAP_RATE_PER_TON when the metals market moves — it rescales
// every estimate. Re-check weights only if you add new body-type keywords.
