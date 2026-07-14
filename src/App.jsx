import QuoteForm from './components/QuoteForm'

const STEPS = [
  {
    title: '1. Get Your Offer',
    body: 'Tell us about your car — year, make, model, and condition. Get an instant cash offer in minutes.',
  },
  {
    title: '2. Schedule Free Pickup',
    body: "We come to you, anywhere in the Dayton area. Pick a time that works — often same-day or next-day.",
  },
  {
    title: '3. Get Paid on the Spot',
    body: 'Our driver hands you cash or a check when we hook up your car. No hidden fees, ever.',
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
    body: "We're based right here in Dayton, Ohio, with pickup across the Miami Valley.",
  },
  {
    title: 'No Games, No Lowballing',
    body: 'The offer we give you is the cash you get. No surprise deductions at pickup.',
  },
]

function App() {
  return (
    <div className="page">
      <header className="header">
        <div className="header__inner">
          <span className="logo">
            Dayton <span className="logo__accent">Cars into Cash</span>
          </span>
          <a className="header__phone" href="tel:19372966755">
            (937) 296-6755
          </a>
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
              <li>✔ Instant online offer</li>
              <li>✔ Free towing anywhere in the Dayton area</li>
              <li>✔ Paid same day, no hidden fees</li>
            </ul>
          </div>
          <div className="hero__form">
            <QuoteForm />
          </div>
        </div>
      </section>

      <section className="steps">
        <h2>How It Works</h2>
        <div className="steps__grid">
          {STEPS.map((step) => (
            <div className="step-card" key={step.title}>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="reasons">
        <h2>Why Dayton Sells to Us</h2>
        <div className="reasons__grid">
          {REASONS.map((reason) => (
            <div className="reason-card" key={reason.title}>
              <h3>{reason.title}</h3>
              <p>{reason.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="cta">
        <h2>Ready for a No-Obligation Cash Offer?</h2>
        <p>It takes less than 2 minutes.</p>
        <a className="cta__button" href="#top" onClick={(e) => {
          e.preventDefault()
          document.querySelector('.quote-form')?.scrollIntoView({ behavior: 'smooth' })
        }}>
          Get My Offer
        </a>
      </section>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Dayton Cars into Cash. Serving Dayton, Ohio and the Miami Valley.</p>
        <p>
          Call or text <a href="tel:19372966755">(937) 296-6755</a>
        </p>
      </footer>
    </div>
  )
}

export default App
