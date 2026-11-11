/**
 * Every yard on wepay4cars.com.
 *
 * The sample yard is site.config.js. To add a yard, copy that file's
 * details into a new block below, give it a subdomain (the business
 * name, lowercase, no spaces or apostrophes), and add the block to
 * this list. Do not invent a phone number, a review, or a city the
 * yard does not actually serve.
 *
 * Sandy's Towing → subdomain 'sandys'
 * Jim's Towing → subdomain 'jimstowing'
 */

import sampleYard from './site.config.js'

const affiliates = [
  sampleYard,
]

export default affiliates
