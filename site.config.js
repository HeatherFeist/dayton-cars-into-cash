/**
 * ============================================================
 *  THIS IS THE ONLY FILE YOU EDIT TO LAUNCH A NEW YARD.
 * ============================================================
 *
 * Open it in any text editor. Change the words between the quotes.
 * Save the file. The rest of the website reads from here.
 *
 * Leave a line as '' (two quotes with nothing inside) to hide that
 * piece of the site. Do not type a review count, a star rating, a
 * license number, or a price you do not actually have.
 *
 * The values below are the SAMPLE yard (Dayton, Ohio) so the demo
 * still looks like the original site. Replace them before you launch.
 */

const site = {
  // The name customers see in the header, the page title, and the footer.
  businessName: 'We Pay 4 Cars',

  // The yard's address on wepay4cars.com. Use the business name in
  // lowercase with spaces and apostrophes removed.
  // Sandy's Towing → sandys    Jim's Towing → jimstowing
  // The main site (wepay4cars.com) is the city directory. This yard is
  // https://wepay4cars.wepay4cars.com because the sample name is We Pay 4 Cars.
  subdomain: 'wepay4cars',

  // Text logo only: the part of the name to draw in the gold accent color.
  // Ignored when logoPath is set. Must be an exact piece of businessName.
  logoAccent: '4 Cars',

  // Your logo file. Put the image in the public folder, then set this.
  // Example: save public/logo.svg and set logoPath to '/logo.svg'.
  // Leave blank to use the text logo.
  logoPath: '',

  // Words a screen reader says for the logo image. Blank uses the business name.
  logoAlt: '',

  // Big headline on the home page.
  heroHeadline: 'Turn Your Junk Car Into Cash — Today',

  // Sentence under the headline.
  tagline:
    "Dayton's trusted junk car buyer. Free towing, an honest offer, and cash in your hand the moment we pick up your vehicle.",

  // Short line under the bullet points. Not a review and not a star rating.
  trustLine: 'Trusted by drivers across the Miami Valley',

  // How the phone number LOOKS, and the number phones should dial.
  // phoneTel and smsTel need the country code: +1 then 10 digits.
  phoneDisplay: '(937) 296-6755',
  phoneTel: '+19372966755',
  smsTel: '+19372966755',

  // Public email. Leave blank to hide it. Offers can also be emailed here
  // when no form address is set below.
  email: '',

  // Real shop address. Leave street and ZIP blank until you have them.
  // We do not show a street address you did not type.
  streetAddress: '',
  postalCode: '',

  // Hours. Leave the list empty until you are ready to publish them.
  // What you type in label and hours is what visitors see.
  // days / opens / closes are optional and only used for Google's listing.
  // Times are 24-hour, so 1:00 PM is 13:00.
  // hours: [
  //   {
  //     label: 'Monday–Friday',
  //     hours: '8:00 AM – 6:00 PM',
  //     days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  //     opens: '08:00',
  //     closes: '18:00',
  //   },
  //   { label: 'Saturday', hours: '9:00 AM – 1:00 PM', days: ['Saturday'], opens: '09:00', closes: '13:00' },
  //   { label: 'Sunday', hours: 'Closed' },
  // ],
  hours: [],

  // Where the yard is based, and how far you advertise pickup.
  primaryCity: 'Dayton',
  state: 'Ohio',
  stateAbbr: 'OH',
  serviceRadiusMiles: 60,

  // Every city you actually pick up in. One page is created for each city.
  // Only list places you serve. The sample list is the Dayton area.
  serviceCities: [
    'Dayton',
    'Kettering',
    'Beavercreek',
    'Huber Heights',
    'Fairborn',
    'Riverside',
    'Centerville',
    'Miamisburg',
    'Springfield',
    'Xenia',
    'Trotwood',
    'Vandalia',
    'Springboro',
    'West Carrollton',
    'Englewood',
    'Troy',
    'Piqua',
    'Sidney',
    'Greenville',
    'Eaton',
    'Middletown',
    'Hamilton',
    'Franklin',
    'Wilmington',
    'Washington Court House',
    'Urbana',
  ],

  // Leave this as example.com to use https://SUBDOMAIN.wepay4cars.com.
  // Set a full https address only when this yard has its own domain.
  siteUrl: 'https://example.com',

  // Brand colors. These recolor the whole site: header, buttons, links.
  colors: {
    brand: '#14284f',
    brandDark: '#0a1733',
    teal: '#1abc9c',
    accent: '#ffb703',
    text: '#1a1a1a',
    muted: '#5a5a5a',
    background: '#f7f7f5',
  },

  // What you buy. Shown in the "we buy it" sentence. Only list what is true.
  vehiclesAccepted: ['Cars', 'Trucks', 'SUVs', 'Vans'],
  conditionsAccepted: ['Running', 'wrecked', 'no title', 'flooded'],

  // Menu on the offer form.
  conditionChoices: [
    'Runs and drives',
    'Starts but does not drive',
    'Does not start',
    'Wrecked or damaged',
    'Flood-damaged',
  ],

  // Promises. Turn a line off (false) if you do not really offer it.
  // paymentMethods is the phrase in "paid with ___".
  claims: {
    freeTowing: true,
    paidOnPickup: true,
    paymentMethods: 'cash or a check',
    sameDayPickupOften: true,
    noHiddenFees: true,
  },

  // FAQ sentence about titles. Write only what you actually do.
  titleNote:
    'A title makes it easiest, but we can often still help if you do not have one. Call or text us and we will walk you through your options.',

  // License or registration line for the footer. Leave blank if you do not
  // want one published. Do not invent a license number.
  licenseLine: '',

  // Full links only, starting with https://. Blank links are hidden.
  social: {
    facebook: '',
    instagram: '',
    youtube: '',
    x: '',
    tiktok: '',
    nextdoor: '',
  },

  // Link to your Google reviews. Leave blank to hide it.
  // Do not type a star rating or a review count unless both numbers are
  // copied from your real Google listing.
  googleReviewUrl: '',
  googleRating: '',
  googleReviewCount: '',

  // Optional visitor counters. Leave blank to add nothing.
  // Google's measurement ID looks like G-ABC123 (it is public, not a secret key).
  // Plausible is the domain you signed up with, such as youryard.com.
  analytics: {
    googleAnalyticsId: '',
    plausibleDomain: '',
  },

  // Where the "Get an offer" form is sent.
  // Paste any https form address that accepts a normal form POST
  // (Formspree, Getform, Basin, a Google Apps Script, your own webhook).
  // format 'form' sends regular form fields. format 'json' sends JSON.
  // Leave endpoint blank and the form opens a text message or an email
  // with the customer's answers already filled in. No account is required.
  //
  // Netlify only: set netlifyFormName to a short word like 'offer' and
  // Netlify will store submissions. Leave it blank on any other host.
  leadForm: {
    endpoint: '',
    format: 'form',
    netlifyFormName: '',
  },

  // Short video at the top of the home page. The sample file is the
  // original Dayton explainer — replace public/explainer.mp4 or clear
  // this line before a new yard goes live. Blank hides the video.
  videoPath: '/explainer.mp4',
}

export default site
