// Weight-based ballpark estimator for junk/used car offers.
//
// This produces a rough cash RANGE from the vehicle details plus the
// Peddle-style condition answers we collect. It is NOT a market valuation —
// the final offer is always confirmed by phone after a human reviews the
// vehicle.
//
// Model (mirrors how real Dayton scrap yards price a vehicle):
//
//   scrap value  =  vehicle weight (tons)  ×  scrap rate ($/ton)
//   offer        =  scrap value  ×  condition multiplier
//                                   (running cars carry salvageable parts,
//                                    so they're worth MORE than pure scrap)
//                                −  mild age penalty on the parts premium
//                                −  deductions for missing high-value parts
//                                    (engine/trans, catalytic converter)
//
// The scrap value is a hard floor: a complete vehicle is always worth at
// least its metal, regardless of age or whether it runs. Missing major parts
// (engine, converter) can pull the offer BELOW the whole-body scrap floor,
// because a stripped shell weighs and sells for less — so those deductions
// are allowed to reduce the floor.
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

// A catalytic converter is the single most valuable easily-removed part on a
// junk car. A missing one is a real, sizable deduction at every Dayton yard.
const CATALYTIC_CONVERTER_VALUE = 150

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

// ---------------------------------------------------------------------------
// Condition answers → multipliers.
//
// These are the option VALUES emitted by the wizard's dropdowns (see
// conditionQuestions.js). Each answer set maps to a factor applied to the
// scrap value. "Reference" (×1.0) is a complete, non-running vehicle — pure
// scrap. Running/driving vehicles carry resellable parts and earn a premium;
// damage and missing parts pull it back down.
// ---------------------------------------------------------------------------

// "Does the vehicle start?" — the biggest single driver of value, because a
// running drivetrain is the parts premium. Capped so a running truck stays
// inside the real Dayton ceiling.
const STARTS_MULTIPLIER = {
  starts_drives: 1.6, // starts AND drives
  starts_no_drive: 1.25, // starts but won't drive
  no_start: 1.0, // doesn't start (pure scrap reference)
}

// "Is the engine & transmission still in the vehicle?" A vehicle with the
// drivetrain pulled is worth less than whole-body scrap — the heaviest,
// most valuable assembly is gone.
const WHOLE_MULTIPLIER = {
  whole: 1.0, // all major parts present
  missing_minor: 0.9, // some parts missing, drivetrain present
  missing_engine: 0.65, // engine or transmission removed
}

// "Does it have body damage?"
const BODY_DAMAGE_MULTIPLIER = {
  none: 1.0,
  minor: 0.95,
  moderate: 0.85,
  severe: 0.75, // wrecked / totaled
}

// "Are all four wheels & tires intact?" Missing wheels means it can't roll
// onto the truck and there's less aluminum/rubber to reclaim.
const WHEELS_MULTIPLIER = {
  all_intact: 1.0,
  some_missing: 0.9,
}

// "Is the interior intact?" Minor effect — mostly matters for resellable
// vehicles, not pure scrap.
const INTERIOR_MULTIPLIER = {
  intact: 1.0,
  damaged: 0.97,
  missing: 0.92,
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

// Pull a multiplier out of a table, defaulting to 1.0 (no effect) for any
// answer we don't recognize or that wasn't provided — so a missing field
// never throws or zeroes out the whole offer.
function factor(table, value) {
  return table[value] ?? 1.0
}

export function estimateOffer({
  year,
  make,
  model,
  starts,
  whole,
  bodyDamage,
  wheels,
  interior,
  catalytic,
}) {
  const tons = weightForVehicle(make, model)

  // Pure metal value of a complete body — the reference point.
  const scrapValue = tons * SCRAP_RATE_PER_TON

  // Composite condition multiplier from the individual answers. Starting/
  // driving drives the parts premium; the rest chip away for damage and
  // missing pieces.
  const multiplier =
    factor(STARTS_MULTIPLIER, starts) *
    factor(WHOLE_MULTIPLIER, whole) *
    factor(BODY_DAMAGE_MULTIPLIER, bodyDamage) *
    factor(WHEELS_MULTIPLIER, wheels) *
    factor(INTERIOR_MULTIPLIER, interior)

  // Age only erodes the PART of the offer that's above scrap (the parts
  // premium). Newer vehicles have more valuable, in-demand parts.
  const age = year ? Math.max(0, CURRENT_YEAR - Number(year)) : 15
  const premiumAgeFactor = Math.max(0.4, 1 - age * 0.03) // -3%/yr, floor 40%

  const grossOffer = scrapValue * multiplier
  const premium = Math.max(0, grossOffer - scrapValue) * premiumAgeFactor

  // A whole vehicle is floored at its scrap steel. But if the engine/trans is
  // gone, the "stripped shell" floor drops with the whole-vehicle multiplier —
  // there's genuinely less metal to sell.
  const floor = scrapValue * Math.min(1, factor(WHOLE_MULTIPLIER, whole))
  let point = Math.max(floor, scrapValue + premium)

  // Hard deduction: a missing catalytic converter is real cash off the top at
  // every yard, applied after everything else.
  if (catalytic === 'missing') {
    point = Math.max(100, point - CATALYTIC_CONVERTER_VALUE)
  }

  // Present a range around the point estimate (±15%), never below $100.
  const low = roundTo25(Math.max(100, point * 0.85))
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
//   - Catalytic converter scrap value (~$100–$300 typical): local yard quotes.
// Update SCRAP_RATE_PER_TON when the metals market moves — it rescales
// every estimate. Re-check weights only if you add new body-type keywords.
