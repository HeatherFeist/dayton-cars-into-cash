import site, { telHref } from '../lib/site'
import { useNavigate } from '../components/nav'

export default function NotFound() {
  const { navigate } = useNavigate()
  return (
    <section className="hero">
      <div className="hero__inner">
        <div className="hero__copy">
          <h1>Page not found</h1>
          <p>That page is not on the {site.businessName} site.</p>
          <div className="hero__actions">
            <a className="btn btn--accent" href="/" onClick={(event) => navigate(event, '/')}>
              Back to the home page
            </a>
            <a className="btn btn--light" href={telHref(site.phoneTel)}>
              Call {site.phoneDisplay}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
