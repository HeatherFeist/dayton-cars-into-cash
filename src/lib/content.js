import site from '../../site.config.js'
import { vehiclePhrase } from './site.js'

export const STEPS = [
  {
    title: 'Tell Us About Your Car',
    body: 'Enter your year, make, model, and condition. It takes less than two minutes.',
  },
  {
    title: 'Get Your Offer',
    body: 'We call you to confirm a cash offer. Nothing is scheduled until you say yes.',
  },
  {
    title: 'Get Paid at Pickup',
    body: site.claims.paidOnPickup
      ? `We tow it${site.claims.freeTowing ? ' free' : ''} and hand you ${site.claims.paymentMethods} on the spot${site.claims.sameDayPickupOften ? ' — often same day' : ''}.`
      : 'We schedule a pickup time that works for you and explain payment before we arrive.',
  },
]

export function heroPoints() {
  const points = ['Request a cash offer online']
  if (site.claims.freeTowing) {
    points.push(`Free towing up to ${site.serviceRadiusMiles} miles from ${site.primaryCity}`)
  }
  if (site.claims.sameDayPickupOften && site.claims.noHiddenFees) {
    points.push('Paid same day, no hidden fees')
  } else if (site.claims.sameDayPickupOften) {
    points.push('Same-day pickup is often available')
  } else if (site.claims.noHiddenFees) {
    points.push('No hidden fees')
  }
  return points
}

export function trustItems() {
  const items = []
  if (site.claims.freeTowing) items.push({ strong: 'Free', text: 'Towing & pickup' })
  if (site.claims.sameDayPickupOften) items.push({ strong: 'Same\u00A0Day', text: 'Pickup available' })
  items.push({
    strong: `${site.serviceRadiusMiles}\u00A0mi`,
    text: `Around ${site.primaryCity}, ${site.stateAbbr}`,
  })
  if (site.claims.noHiddenFees) items.push({ strong: '$0', text: 'Hidden fees, ever' })
  return items
}

export function reasons() {
  const vehicles = vehiclePhrase({ capitalize: true })
  const conditions = site.conditionsAccepted.join(', ')
  return [
    {
      title: 'Any Condition, Any Vehicle',
      body: `${conditions} — we buy it. ${vehicles}.`,
    },
    {
      title: site.claims.freeTowing ? 'Free Towing, Always' : 'We Come to You',
      body: site.claims.freeTowing
        ? "We handle the tow truck. You don't pay a dime and you don't lift a wrench."
        : 'Tell us where the vehicle sits and we will explain pickup when we call.',
    },
    {
      title: 'Local & Fast',
      body: site.claims.freeTowing
        ? `We're based right here in ${site.primaryCity}, ${site.state}, with free pickup up to ${site.serviceRadiusMiles} miles out.`
        : `We're based right here in ${site.primaryCity}, ${site.state}.`,
    },
    {
      title: 'No Games, No Lowballing',
      body: site.claims.noHiddenFees
        ? 'The offer we give you is the cash you get. No surprise deductions at pickup.'
        : 'We confirm your offer by phone before we schedule pickup.',
    },
  ]
}

export function serviceIntro() {
  if (site.claims.freeTowing) {
    return `We pick up vehicles free of charge anywhere within a ${site.serviceRadiusMiles}-mile radius of ${site.primaryCity}, ${site.state} — including these communities and everywhere in between.`
  }
  return `We pick up vehicles in ${site.primaryCity}, ${site.state}, and in these communities.`
}

export function formDisclaimer() {
  const towing = site.claims.freeTowing
    ? ` Free towing within ${site.serviceRadiusMiles} miles of ${site.primaryCity}.`
    : ''
  return `We'll call to confirm your offer. No obligation.${towing}`
}

export function homeDescription() {
  const extras = []
  if (site.claims.freeTowing) extras.push('Free towing')
  if (site.claims.sameDayPickupOften) extras.push('same-day pickup')
  if (site.claims.paidOnPickup) extras.push('paid on the spot')
  const tail = extras.length ? ` ${extras.join(', ')}.` : ''
  return `Get a free cash offer for your junk, wrecked, or used car in ${site.primaryCity}, ${site.state}.${tail}`
}

export function buildFaqs() {
  const faqs = [
    {
      q: 'How much is my junk car worth?',
      a: 'It depends on the year, make, model, condition, and current scrap prices. Tell us about the vehicle and we will call you to confirm your cash offer. This site does not show a price, because a real offer depends on the car.',
    },
    {
      q: 'Do you buy cars that do not run?',
      a: `Yes. We buy running, non-running, wrecked, and flood-damaged vehicles — ${vehiclePhrase()}.`,
    },
  ]

  if (!isBlankSafe(site.titleNote)) {
    faqs.push({
      q: 'Do I need a title to sell my car?',
      a: site.titleNote,
    })
  }

  faqs.push({
    q: 'Is towing really free?',
    a: site.claims.freeTowing
      ? `Always. Free towing is included anywhere within about ${site.serviceRadiusMiles} miles of ${site.primaryCity} — you never pay for pickup.`
      : `Call us and we will tell you how pickup works around ${site.primaryCity}.`,
  })

  faqs.push({
    q: 'How fast can you pick up my car?',
    a: site.claims.sameDayPickupOften
      ? 'Often the same day or the next day. When you accept your offer, we schedule a pickup time that works for you.'
      : 'When you accept your offer, we schedule a pickup time that works for you.',
  })

  faqs.push({
    q: 'How do I get paid?',
    a: site.claims.paidOnPickup
      ? `Our driver pays you on the spot with ${site.claims.paymentMethods} when we hook up your vehicle — no waiting.`
      : 'We explain payment when we call you with the offer, before pickup is scheduled.',
  })

  return faqs
}

function isBlankSafe(value) {
  return value == null || String(value).trim() === ''
}

export function footerLine() {
  const radius = site.claims.freeTowing || site.serviceRadiusMiles
    ? ` and everywhere within ${site.serviceRadiusMiles} miles`
    : ''
  return `Serving ${site.primaryCity}, ${site.state}${radius}.`
}

export function mapQuery(place) {
  return `https://www.google.com/maps?q=${encodeURIComponent(place)}&z=8&output=embed`
}

export function cityMapQuery(city) {
  return `https://www.google.com/maps?q=${encodeURIComponent(`${city}, ${site.stateAbbr}`)}&z=11&output=embed`
}
