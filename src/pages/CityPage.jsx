import { useState } from 'react'
import OfferForm from '../components/OfferForm'
import { useNavigate } from '../components/nav'
import site, { listAnd, serviceAreaCities, telHref } from '../lib/site'
import { cityPageContent, cityPath } from '../lib/cityContent'
import { STEPS, buildFaqs, cityMapQuery, heroPoints } from '../lib/content'
import { trackCall } from '../lib/track'

export default function CityPage({ city }) {
  const { navigate } = useNavigate()
  const content = cityPageContent(city)
  const [openFaq, setOpenFaq] = useState(0)
  const faqs = buildFaqs().slice(0, 4)

  return (
    <>
      <section className="hero">
        <div className="hero__inner">
          <div className="hero__copy">
            <p className="eyebrow">
              <a href="/" onClick={(event) => navigate(event, '/')}>
                Home
              </a>
              <span aria-hidden="true"> / </span>
              {city}
            </p>
            <h1>{content.h1}</h1>
            <p>{content.lead}</p>
            <ul className="hero__points">
              {heroPoints().map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <div className="hero__actions">
              <a
                className="btn btn--light"
                href={telHref(site.phoneTel)}
                onClick={() => trackCall(`city-${content.slug}`)}
              >
                Call {site.phoneDisplay}
              </a>
              <button className="btn btn--accent" type="button" onClick={scrollToForm}>
                Get My Offer
              </button>
            </div>
          </div>
          <div className="hero__form">
            <OfferForm source={content.path} />
          </div>
        </div>
      </section>

      <section className="city-copy">
        <div className="city-copy__inner">
          {content.details.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <h2>How pickup works in {city}</h2>
          <div className="steps__grid">
            {STEPS.map((step, i) => (
              <div className="step-card" key={step.title}>
                <span className="step-card__num">Step {i + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="service-area" id="service-area">
        <h2>Pickup in {city} and nearby</h2>
        <p className="service-area__intro">
          {content.neighbors.length
            ? `${site.businessName} also picks up in ${listAnd(content.neighbors)}. The full list is every city we serve around ${site.primaryCity}.`
            : `These are the cities ${site.businessName} serves around ${site.primaryCity}.`}
        </p>
        <div className="service-area__body">
          <div className="service-area__map">
            <iframe
              title={`Map of ${city}, ${site.stateAbbr}`}
              src={cityMapQuery(city)}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
          <ul className="service-area__cities">
            {serviceAreaCities().map((name) => (
              <li key={name} className={name === city ? 'is-current' : undefined}>
                {name === city ? (
                  name
                ) : (
                  <a href={cityPath(name)} onClick={(event) => navigate(event, cityPath(name))}>
                    {name}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="faq">
        <h2>Questions from {city}</h2>
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
        <h2>Get a cash offer in {city}</h2>
        <p>Call {site.businessName} or send the vehicle details. No obligation.</p>
        <div className="cta__actions">
          <button className="cta__button" type="button" onClick={scrollToForm}>
            Get My Offer
          </button>
          <a className="cta__call" href={telHref(site.phoneTel)} onClick={() => trackCall(`city-cta-${content.slug}`)}>
            Call {site.phoneDisplay}
          </a>
        </div>
      </section>
    </>
  )
}

function scrollToForm() {
  document.querySelector('.quote-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}
