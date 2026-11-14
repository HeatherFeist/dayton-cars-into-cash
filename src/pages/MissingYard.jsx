import network from '../../network.config.js'

export default function MissingYard({ subdomain }) {
  return (
    <div className="page">
      <section className="hero">
        <div className="hero__inner">
          <div className="hero__copy">
            <h1>That yard is not listed</h1>
            <p>
              {subdomain ? `${subdomain}.${network.domain} is not a yard on this network yet.` : 'That address is not a yard on this network yet.'}
            </p>
            <div className="hero__actions">
              <a className="btn btn--accent" href={`https://${network.domain}/`}>
                Find a city
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
