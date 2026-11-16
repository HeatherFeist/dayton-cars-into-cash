// Weight-based ballpark estimator for junk/used car offers.
//
// This produces a rough cash RANGE from the vehicle details plus the
// condition answers we collect. It is NOT a market valuation and it is
// NOT a guaranteed public price — the final offer is always confirmed
// by phone after a human reviews the vehicle.
//
// Model:
//
//   scrap value  =  vehicle weight (tons)  ×  scrap rate ($/ton)
//   offer        =  scrap value  ×  condition multiplier
//                                   (running cars carry salvageable parts,
//                                    so they're worth MORE than pure scrap)
//                                −  mild age penalty on the parts premium
//                                −  deductions for missing high-value parts
//
// The scrap value is a hard floor: a complete vehicle is always worth at
// least its metal, regardless of age or whether it runs. Missing major parts
// (engine, converter) can pull the offer BELOW the whole-body scrap floor.
//
// The scrap rate lives in site.config.js (scrapRatePerTon) so each yard
// can change the one knob that rescales every estimate. Default 180 if
// that line is missing.

import site from './site.js'

const CURRENT_YEAR = new Date().getFullYear()

const CATALYTIC_CONVERTER_VALUE = 150

const BODY_TYPE_WEIGHT_TONS = [
  { test: /f-?250|f-?350|silverado ?2500|silverado ?3500|ram ?2500|ram ?3500|sierra ?2500|sierra ?3500|super ?duty|promaster|\bk ?2500\b|\bk ?3500\b|\bc ?2500\b|\bc ?3500\b|d250|d350/i, tons: 3.2 },
  { test: /truck|pickup|silverado|sierra|f-?150|f-?100|\bram\b|1500|tundra|tacoma|ranger|maverick|frontier|colorado|ridgeline|canyon|gladiator|santa cruz|titan|\bc-?10\b|\bc-?1500\b|\bk-?10\b|\bk-?1500\b|d150|caballero|el camino|scout/i, tons: 2.5 },
  { test: /suburban|tahoe|yukon|expedition|sequoia|escalade|denali|armada|navigator|wagoneer|palisade|telluride|grand wagoneer|gx|lx|qx80|gls|ramcharger|travelall|bronco(?! sport)/i, tons: 2.9 },
  { test: /van|caravan|odyssey|sienna|pacifica|carnival|sedona|transit|express|savana|town ?&? ?country|voyager|safari|astro/i, tons: 2.25 },
  { test: /suv|explorer|pilot|passport|highlander|4runner|traverse|ascent|equinox|rav4|cr-?v|rogue|escape|bronco sport|blazer|durango|edge|cherokee|wrangler|forester|outback|crosstrek|cx-?5|cx-?9|cx-?90|sorento|santa fe|tucson|sportage|seltos|kicks|trailblazer|trax|kona|venue|atlas|tiguan|4motion|q5|q7|x3|x5|glc|gle|rx|nx|mdx|rdx|trooper|rodeo|jimmy|samurai|sidekick|grand vitara|cj-?5|cj-?7/i, tons: 2.0 },
  { test: /.*/, tons: 1.7 },
]

const STARTS_MULTIPLIER = {
  starts_drives: 1.6,
  starts_no_drive: 1.25,
  no_start: 1.0,
}

const WHOLE_MULTIPLIER = {
  whole: 1.0,
  missing_minor: 0.9,
  missing_engine: 0.65,
}

const BODY_DAMAGE_MULTIPLIER = {
  none: 1.0,
  minor: 0.95,
  moderate: 0.85,
  severe: 0.75,
}

const WHEELS_MULTIPLIER = {
  all_intact: 1.0,
  some_missing: 0.9,
}

const INTERIOR_MULTIPLIER = {
  intact: 1.0,
  damaged: 0.97,
  missing: 0.92,
}

export function scrapRatePerTon() {
  try {
    const n = Number(site.scrapRatePerTon)
    return Number.isFinite(n) && n > 0 ? n : 180
  } catch {
    return 180
  }
}

function weightForVehicle(make = '', model = '') {
  const hay = `${make} ${model}`
  const match = BODY_TYPE_WEIGHT_TONS.find((row) => row.test.test(hay))
  return match ? match.tons : 1.7
}

function roundTo25(n) {
  return Math.round(n / 25) * 25
}

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
  const scrapValue = tons * scrapRatePerTon()

  const multiplier =
    factor(STARTS_MULTIPLIER, starts) *
    factor(WHOLE_MULTIPLIER, whole) *
    factor(BODY_DAMAGE_MULTIPLIER, bodyDamage) *
    factor(WHEELS_MULTIPLIER, wheels) *
    factor(INTERIOR_MULTIPLIER, interior)

  const age = year ? Math.max(0, CURRENT_YEAR - Number(year)) : 15
  const premiumAgeFactor = Math.max(0.4, 1 - age * 0.03)

  const grossOffer = scrapValue * multiplier
  const premium = Math.max(0, grossOffer - scrapValue) * premiumAgeFactor

  const floor = scrapValue * Math.min(1, factor(WHOLE_MULTIPLIER, whole))
  let point = Math.max(floor, scrapValue + premium)

  if (catalytic === 'missing') {
    point = Math.max(100, point - CATALYTIC_CONVERTER_VALUE)
  }

  const low = roundTo25(Math.max(100, point * 0.85))
  const high = roundTo25(point * 1.15)

  return { low, high }
}

export function formatRange({ low, high }) {
  const fmt = (n) => `$${n.toLocaleString('en-US')}`
  return `${fmt(low)}–${fmt(high)}`
}
