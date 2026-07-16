import { useState } from 'react'
import QuoteForm from './components/QuoteForm'

const STEPS = [
  {
    title: 'Tell Us About Your Car',
    body: 'Enter your year, make, model, and condition. It takes less than two minutes.',
  },
  {
    title: 'Get Your Instant Offer',
    body: 'See a real cash range right away, then we confirm your final offer by phone.',
  },
  {
    title: 'Get Paid at Pickup',
    body: 'We tow it free and hand you cash or a check on the spot — often same day.',
  },
]

const REASONS = [
  {
    title: 'Any Condition, Any Vehicle',
    body: 'Running, wrecked, no title, flooded — we buy it. Cars, trucks, SUVs, and vans.',
  },
  {
    title: 'Free Towing, Always',
    body: "We handle the tow truck. You don't pay a dime and you don't lift a wrench.",
  },
  {
    title: 'Local & Fast',
    body: "We're based right here in Dayton, Ohio, with free pickup up to 60 miles out.",
  },
  {
    title: 'No Games, No Lowballing',
    body: 'The offer we give you is the cash you get. No surprise deductions at pickup.',
  },
]

// Cities/communities within roughly 60 miles of Dayton, OH
const SERVICE_CITIES = [
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
]

// Placeholder testimonials — swap for real, permissioned customer reviews
// before launch. Do not attribute quotes to real people without consent.
const REVIEWS = [
  {
    quote: 'Had an offer in minutes and they towed my old truck the next morning. Cash in hand, no hassle.',
    detail: 'Replace with a real customer review',
  },
  {
    quote: 'My car had no title and would not start. Still got a fair price and free pickup. Easy.',
    detail: 'Replace with a real customer review',
  },
  {
    quote: 'The offer they gave me online was the exact amount I got paid. No lowballing at pickup.',
    detail: 'Replace with a real customer review',
  },
]

const FAQS = [
  {
    q: 'How much is my junk car worth?',
    a: 'It depends on the year, make, model, condition, and current scrap prices. Our instant estimate gives you a real ballpark in seconds, and we confirm your final cash offer by phone.',
  },
  {
    q: 'Do you buy cars that do not run?',
    a: 'Yes. We buy running, non-running, wrecked, and flood-damaged vehicles — cars, trucks, SUVs, and vans.',
  },
  {
    q: 'Do I need a title to sell my car?',
    a: 'A title makes it easiest, but we can often still help if you do not have one. Call or text us and we will walk you through your options.',
  },
  {
    q: 'Is towing really free?',
    a: 'Always. Free towing is included anywhere within about 60 miles of Dayton — you never pay for pickup.',
  },
  {
    q: 'How fast can you pick up my car?',
    a: 'Often the same day or the next day. When you accept your offer, we schedule a pickup time that works for you.',
  },
  {
    q: 'How do I get paid?',
    a: 'Our driver pays you on the spot with cash or a check when we hook up your vehicle — no waiting.',
  },
]

const PHONE_DISPLAY = '(937) 296-6755'
const PHONE_HREF = 'tel:19372966755'

function scrollToForm() {
  document.querySelector('.quote-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

// Smooth-scroll to a section by id, used by the nav links. Only sections that
// exist on this single-page site get a nav entry (see NAV_LINKS).
function scrollToId(e, id) {
  e.preventDefault()
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// Peddle-style nav. This is a one-page site, so we only list the items that
// map to a real section on the page; add more here as pages/sections exist.
const NAV_LINKS = [
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'reviews', label: 'Reviews' },
]

function App() {
  const [openFaq, setOpenFaq] = useState(0)

  return (
    <div className="page">
      <header className="header">
        <div className="header__inner">
          <span className="logo">
            Dayton <span className="logo__accent">Cars into Cash</span>
          </span>
          <nav className="header__nav" aria-label="Primary">
            {NAV_LINKS.map((link) => (
              <a
                key={link.id}
                className="header__nav-link"
                href={`#${link.id}`}
                onClick={(e) => scrollToId(e, link.id)}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="header__actions">
            <a className="header__phone" href={PHONE_HREF}>
              {PHONE_DISPLAY}
            </a>
            <button className="header__cta" type="button" onClick={scrollToForm}>
              Get My Offer
            </button>
          </div>
        </div>
      </header>

      <section className="hero">
        <div className="hero__inner">
          <div className="hero__copy">
            <h1>Turn Your Junk Car Into Cash — Today</h1>
            <p>
              Dayton's trusted junk car buyer. Free towing, an honest offer,
              and cash in your hand the moment we pick up your vehicle.
            </p>
            <ul className="hero__points">
              <li>Instant online offer</li>
              <li>Free towing up to 60 miles from Dayton</li>
              <li>Paid same day, no hidden fees</li>
            </ul>
            <div className="hero__rating">
              <span className="hero__stars" aria-hidden="true">★★★★★</span>
              <span className="hero__rating-text">
                Trusted by drivers across the Miami Valley
              </span>
            </div>
          </div>
          <div className="hero__form">
            <QuoteForm />
          </div>
        </div>
      </section>

      <section className="trustbar">
        <div className="trustbar__inner">
          <div className="trustbar__item">
            <strong>Free</strong>
            <span>Towing &amp; pickup</span>
          </div>
          <div className="trustbar__item">
            <strong>Same&nbsp;Day</strong>
            <span>Pickup available</span>
          </div>
          <div className="trustbar__item">
            <strong>60&nbsp;mi</strong>
            <span>Around Dayton, OH</span>
          </div>
          <div className="trustbar__item">
            <strong>$0</strong>
            <span>Hidden fees, ever</span>
          </div>
        </div>
      </section>

      <section className="steps" id="how-it-works">
        <h2>How It Works</h2>
        <p className="section-sub">Three simple steps from junk car to cash.</p>
        <div className="steps__grid">
          {STEPS.map((step, i) => (
            <div className="step-card" key={step.title}>
              <span className="step-card__num">Step {i + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </div>
          ))}
        </div>
        <div className="steps__cta">
          <button type="button" onClick={scrollToForm}>
            Get My Instant Offer
          </button>
        </div>
      </section>

      <section className="reasons">
        <h2>Why Dayton Sells to Us</h2>
        <p className="section-sub">Straightforward, local, and fair — every time.</p>
        <div className="reasons__grid">
          {REASONS.map((reason) => (
            <div className="reason-card" key={reason.title}>
              <h3>{reason.title}</h3>
              <p>{reason.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="reviews" id="reviews">
        <h2>What Our Customers Say</h2>
        <p className="section-sub">
          Placeholder reviews — replace with your real customer testimonials.
        </p>
        <div className="reviews__grid">
          {REVIEWS.map((review, i) => (
            <figure className="review-card" key={i}>
              <div className="review-card__stars" aria-hidden="true">
                ★★★★★
              </div>
              <blockquote>{review.quote}</blockquote>
              <figcaption>{review.detail}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="service-area">
        <h2>Our Service Area</h2>
        <p className="service-area__intro">
          We pick up vehicles free of charge anywhere within a <strong>60-mile
          radius of Dayton, Ohio</strong> — including these communities and
          everywhere in between.
        </p>
        <div className="service-area__body">
          <div className="service-area__map">
            <iframe
              title="Dayton Cars into Cash service area map"
              src="https://www.google.com/maps?q=Dayton,+OH&z=8&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            ></iframe>
          </div>
          <ul className="service-area__cities">
            {SERVICE_CITIES.map((city) => (
              <li key={city}>{city}</li>
            ))}
          </ul>
        </div>
        <p className="service-area__note">
          Not sure if you're in range? Call or text{' '}
          <a href={PHONE_HREF}>{PHONE_DISPLAY}</a> — we'll let you know right away.
        </p>
      </section>

      <section className="faq">
        <h2>Frequently Asked Questions</h2>
        <div className="faq__list">
          {FAQS.map((item, i) => {
            const open = openFaq === i
            return (
              <div className={`faq__item${open ? ' faq__item--open' : ''}`} key={item.q}>
                <button
                  type="button"
                  className="faq__q"
                  aria-expanded={open}
                  onClick={() => setOpenFaq(open ? -1 : i)}
                >
                  <span>{item.q}</span>
                  <span className="faq__chevron" aria-hidden="true">
                    {open ? '−' : '+'}
                  </span>
                </button>
                {open && <p className="faq__a">{item.a}</p>}
              </div>
            )
          })}
        </div>
      </section>

      <section className="cta">
        <h2>Ready for a No-Obligation Cash Offer?</h2>
        <p>It takes less than 2 minutes.</p>
        <button className="cta__button" type="button" onClick={scrollToForm}>
          Get My Offer
        </button>
      </section>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Dayton Cars into Cash. Serving Dayton, Ohio and everywhere within 60 miles.</p>
        <p>
          Call or text <a href={PHONE_HREF}>{PHONE_DISPLAY}</a>
        </p>
      </footer>
    </div>
  )
}

export default App
