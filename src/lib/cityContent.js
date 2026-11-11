import site from '../../site.config.js'
import { listAnd, serviceAreaCities, vehiclePhrase } from './site.js'

export function citySlug(name) {
  return String(name)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' and ')
    .replace(/['’]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function cityPath(name) {
  return `/areas/${citySlug(name)}`
}

export function cityBySlug(slug) {
  return serviceAreaCities().find((city) => citySlug(city) === slug) || null
}

export function cityFromPath(pathname) {
  const match = String(pathname || '').match(/^\/areas\/([a-z0-9-]+)$/)
  if (!match) return null
  return cityBySlug(match[1])
}

function hash(name) {
  let h = 0
  for (const char of name) h = (h * 33 + char.charCodeAt(0)) >>> 0
  return h
}

export function neighborCities(city) {
  const cities = serviceAreaCities()
  const index = cities.indexOf(city)
  if (index < 0) return []
  const picks = []
  for (const delta of [1, -1, 2, -2, 3, -3]) {
    const name = cities[index + delta]
    if (name && name !== city) picks.push(name)
    if (picks.length === 3) break
  }
  return picks
}

function towingClause() {
  if (!site.claims.freeTowing) {
    return `Pickup is available in the ${site.serviceRadiusMiles}-mile area around ${site.primaryCity}.`
  }
  return `Towing is free within about ${site.serviceRadiusMiles} miles of ${site.primaryCity}.`
}

function payClause() {
  if (!site.claims.paidOnPickup) {
    return 'We call you with a cash offer before anything is scheduled.'
  }
  const when = site.claims.sameDayPickupOften ? 'Often the same day, you are ' : 'You are '
  return `${when}paid at pickup with ${site.claims.paymentMethods}.`
}

const JOBS = [
  'cars that no longer run, trucks with bad transmissions, and vehicles that are not worth fixing',
  'wrecked daily drivers, old trucks, and SUVs that have been sitting in a driveway',
  'flood-damaged vehicles, cars that will not start, and trucks the owner is done repairing',
  'unwanted cars, vans with engine trouble, and SUVs that failed an inspection',
]

export function cityPageContent(city) {
  const neighbors = neighborCities(city)
  const variant = hash(city) % 4
  const place = `${city}, ${site.stateAbbr}`
  const vehicles = vehiclePhrase()
  const near =
    neighbors.length > 0
      ? `The same pickup also covers nearby ${listAnd(neighbors)}.`
      : ''

  const leads = [
    `${site.businessName} buys junk ${vehicles} in ${place}. ${towingClause()} You do not have to drive the vehicle to ${site.primaryCity} — we come to the address in ${city}.`,
    `Have a vehicle in ${city} that will not start, was wrecked, or is just in the way? ${site.businessName} picks it up in ${place}. ${towingClause()}`,
    `${city} is on the ${site.businessName} pickup list for the ${site.serviceRadiusMiles}-mile area around ${site.primaryCity}, ${site.stateAbbr}. ${payClause()}`,
    `Sell a junk car in ${city} without towing it yourself. ${site.businessName} asks for the year, make, model, and condition, then calls you with an offer. ${towingClause()}`,
  ]

  const seconds = [
    `${payClause()} ${near} Tell us the year, make, model, and condition and we will say whether we can take it.`,
    `People in ${city} call about the same jobs we see in ${neighbors[0] || site.primaryCity}: ${JOBS[variant]}. ${payClause()}`,
    `${near} There is no price printed on this page, because the offer depends on the vehicle. We confirm it by phone before pickup.`,
    `If the car is in ${city}, leave it where it sits. ${payClause()} ${near}`,
  ]

  const title = `Cash for Junk Cars in ${place} | ${site.businessName}`
  const description = [
    `Sell a junk or used vehicle in ${city}, ${site.state}.`,
    site.claims.freeTowing
      ? `Free towing within ${site.serviceRadiusMiles} miles of ${site.primaryCity}.`
      : `${site.businessName} picks up around ${site.primaryCity}.`,
    site.claims.paidOnPickup ? `Paid at pickup with ${site.claims.paymentMethods}.` : 'Call for a cash offer.',
    `Call ${site.phoneDisplay}.`,
  ].join(' ')

  return {
    city,
    slug: citySlug(city),
    path: cityPath(city),
    neighbors,
    title,
    description,
    h1: `Cash for Junk Cars in ${city}, ${site.state}`,
    lead: leads[variant],
    details: [
      seconds[variant],
      `We pick up ${vehicles} in ${city}, including ${listAnd(site.conditionsAccepted.map((item) => item.toLowerCase()))} vehicles.`,
    ].filter(Boolean),
    jobs: JOBS[variant],
  }
}
