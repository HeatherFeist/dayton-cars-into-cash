/**
 * The main website, wepay4cars.com.
 *
 * This is the front door: a list of cities. Each city links to the
 * independent yard that picks up there. Yards live on their own
 * subdomain, named for the business (sandys.wepay4cars.com).
 *
 * The domain below is the real network address. Yards are listed in
 * affiliates.config.js.
 */

const network = {
  domain: 'wepay4cars.com',
  name: 'We Pay 4 Cars',
  headline: 'Find a junk-car buyer in your city',
  tagline:
    'Each listing is an independent yard in the We Pay 4 Cars network. You call that yard directly.',
  // Footer line on every yard site. Clear it to hide the line.
  affiliateLine: 'Independent buyer in the We Pay 4 Cars network',
  colors: {
    brand: '#14284f',
    brandDark: '#0a1733',
    teal: '#1abc9c',
    accent: '#ffb703',
    text: '#1a1a1a',
    muted: '#5a5a5a',
    background: '#f7f7f5',
  },
}

export default network
