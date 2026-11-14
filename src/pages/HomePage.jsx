import { useState } from 'react'
import OfferForm from '../components/OfferForm'
import { useNavigate } from '../components/nav'
import site, { hasReviewStats, serviceAreaCities, telHref } from '../lib/site'
import { cityPath } from '../lib/cityContent'
import {
  steps,
  buildFaqs,
  heroPoints,
  mapQuery,
  reasons,
  serviceIntro,
  trustItems,
} from '../lib/content'
import { trackCall } from '../lib/track'

export default function HomePage() {
  const { navigate } = useNavigate()
  const [openFaq, setOpenFaq] = useState(0)
  const [videoPlaying, setVideoPlaying] = useState(false)
  const faqs = buildFaqs()
  const cities = serviceAreaCities()

  return (
    <>
      {site.videoPath && (
        <section className="intro-video" id="intro-video">
          <div className="intro-video__inner">
            <h2 className="intro-video__title">See How It Works</h2>
            <p className="intro-video__sub">
              A quick look at how {site.businessName} turns your junk car into cash — in under a
              minute.
            </p>
            {videoPlaying ? (
              <video className="intro-video__player" src={site.videoPath} controls autoPlay playsInline>
                Sorry, your browser can't play this video. Call us at {site.phoneDisplay}.
              </video>
            ) : (
              <button
                type="button"
                className="intro-video__placeholder"
                onClick={() => setVideoPlaying(true)}
                aria-label={`Play the ${site.businessName} explainer video`}
              >
                <span className="intro-video__play" aria-hidden="true">
                  ▶
                </span>
                <span className="intro-video__badge">Watch: How It Works</span>
              </button>
            )}
          </div>
        </section>
      )}

      <section className="hero">
        <div className="hero__inner">
          <div className="hero__copy">
            <h1>{site.heroHeadline}</h1>
            <p>{site.tagline}</p>
            <ul className="hero__points">
              {heroPoints().map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <div className="hero__actions">
              <a className="btn btn--light" href={telHref(site.phoneTel)} onClick={() => trackCall('hero')}>
                Call {site.phoneDisplay}
              </a>
              <button className="btn btn--accent" type="button" onClick={scrollToForm}>
                Get My Offer
              </button>
            </div>
            <TrustLine />
          </div>
          <div className="hero__form">
            <OfferForm source="home" />
          </div>
        </div>
      </section>

      <section className="trustbar">
        <div className="trustbar__inner">
          {trustItems().map((item) => (
            <div className="trustbar__item" key={item.text}>
              <strong>{item.strong}</strong>
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="steps" id="how-it-works">
        <h2>How It Works</h2>
        <p className="section-sub">Three simple steps from junk car to cash.</p>
        <div className="steps__grid">
          {steps().map((step, i) => (
            <div className="step-card" key={step.title}>
              <span className="step-card__num">Step {i + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </div>
          ))}
        </div>
        <div className="steps__cta">
          <a className="btn btn--light btn--onlight" href={telHref(site.phoneTel)} onClick={() => trackCall('steps')}>
            Call {site.phoneDisplay}
          </a>
          <button type="button" onClick={scrollToForm}>
            Get My Instant Offer
          </button>
        </div>
      </section>

      <section className="reasons">
        <h2>Why {site.primaryCity} Sells to Us</h2>
        <p className="section-sub">Straightforward, local, and fair — every time.</p>
        <div className="reasons__grid">
          {reasons().map((reason) => (
            <div className="reason-card" key={reason.title}>
              <h3>{reason.title}</h3>
              <p>{reason.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="service-area" id="service-area">
        <h2>Our Service Area</h2>
        <p className="service-area__intro">
          {serviceIntro().includes(String(site.serviceRadiusMiles)) ? (
            <ServiceIntro />
          ) : (
            serviceIntro()
          )}
        </p>
        <div className="service-area__body">
          <div className="service-area__map">
            <iframe
              title={`${site.businessName} service area map`}
              src={mapQuery(`${site.primaryCity}, ${site.stateAbbr}`)}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
          <ul className="service-area__cities">
            {cities.map((city) => (
              <li key={city}>
                <a href={cityPath(city)} onClick={(event) => navigate(event, cityPath(city))}>
                  {city}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <p className="service-area__note">
          Not sure if you're in range? Call or text{' '}
          <a href={telHref(site.phoneTel)} onClick={() => trackCall('service-area')}>
            {site.phoneDisplay}
          </a>{' '}
          — we'll let you know right away.
        </p>
      </section>

      <section className="faq" id="faq">
        <h2>Frequently Asked Questions</h2>
        <div className="faq__list">
          {faqs.map((item, i) => {
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
                  <span className="faq__chevron" aria-hidden="true">{open ? '−' : '+'}</span>
                </button>
                {open && <p className="faq__a">{item.a}</p>}
              </div>
            )
          })}
        </div>
      </section>

      <section className="cta">
        <h2>Ready for a No-Obligation Cash Offer?</h2>
        <p>It takes less than 2 minutes. Or call and we'll take the details.</p>
        <div className="cta__actions">
          <button className="cta__button" type="button" onClick={scrollToForm}>
            Get My Offer
          </button>
          <a className="cta__call" href={telHref(site.phoneTel)} onClick={() => trackCall('cta')}>
            Call {site.phoneDisplay}
          </a>
        </div>
      </section>
    </>
  )
}

function ServiceIntro() {
  const text = serviceIntro()
  const needle = `${site.serviceRadiusMiles}-mile radius of ${site.primaryCity}, ${site.state}`
  const [before, after] = text.split(needle)
  if (!after && before === text) return text
  return (
    <>
      {before}
      <strong>{needle}</strong>
      {after}
    </>
  )
}

function TrustLine() {
  if (hasReviewStats()) {
    const rating = String(site.googleRating).trim()
    const count = String(site.googleReviewCount).trim()
    const stars = '★★★★★'
    const inner = (
      <>
        <span className="hero__stars" aria-hidden="true">{stars}</span>
        <span className="hero__rating-text">
          {rating} from {count} Google reviews
        </span>
      </>
    )
    if (site.googleReviewUrl) {
      return (
        <a className="hero__rating" href={site.googleReviewUrl}>
          {inner}
        </a>
      )
    }
    return <p className="hero__rating">{inner}</p>
  }
  if (!site.trustLine) return null
  return (
    <p className="hero__rating">
      <span className="hero__rating-text hero__rating-text--plain">{site.trustLine}</span>
    </p>
  )
}

function scrollToForm() {
  document.querySelector('.quote-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}
