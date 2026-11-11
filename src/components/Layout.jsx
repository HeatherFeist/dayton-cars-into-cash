import { useEffect } from 'react'
import site, { applyTheme, hasStreetAddress, logoAltText, publicEmail, socialLinks, telHref, visibleHours } from '../lib/site'
import { footerLine } from '../lib/content'
import { publicHttpUrl } from '../lib/site'
import { pageMeta } from '../lib/seo'
import { trackCall } from '../lib/track'
import { useNavigate } from './nav'
import network from '../../network.config.js'

function Logo() {
  const { navigate } = useNavigate()
  const content = site.logoPath ? (
    <img className="logo__img" src={site.logoPath} alt={logoAltText()} />
  ) : (
    <Wordmark />
  )
  return (
    <a className="logo" href="/" title={site.businessName} onClick={(event) => navigate(event, '/')}>
      {content}
    </a>
  )
}

function Wordmark() {
  const accent = site.logoAccent
  const name = site.businessName
  if (accent && name.includes(accent)) {
    const index = name.indexOf(accent)
    const before = name.slice(0, index)
    const after = name.slice(index + accent.length)
    return (
      <span className="logo__wordmark">
        {before}
        <span className="logo__accent">{accent}</span>
        {after}
      </span>
    )
  }
  return name
}

const NAV = [
  { href: '/#how-it-works', label: 'How It Works' },
  { href: '/#service-area', label: 'Service Area' },
]

export default function Layout({ path, children }) {
  const nav = useNavigate()

  useEffect(() => {
    applyTheme()
    const meta = pageMeta(path)
    document.title = meta.title
    setMeta('description', meta.description)
    setMeta('robots', meta.robots)
    setProperty('og:title', meta.title)
    setProperty('og:description', meta.description)
    setProperty('og:url', meta.canonical)
    setCanonical(meta.canonical)
    setJsonLd(meta.jsonLd)
    document.documentElement.dataset.path = path
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', { page_path: path, page_title: meta.title })
    }
  }, [path])

  const mail = publicEmail()
  const reviewUrl = publicHttpUrl(site.googleReviewUrl)
  const hours = visibleHours()
  const socials = socialLinks()
  const sms = site.smsTel || site.phoneTel

  return (
      <div className="page">
        <header className="header">
          <div className="header__inner">
            <Logo />
            <nav className="header__nav" aria-label="Primary">
              {NAV.map((link) => (
                <a
                  key={link.href}
                  className="header__nav-link"
                  href={link.href}
                  onClick={(event) => nav.navigate(event, link.href)}
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="header__actions">
              <a
                className="header__phone"
                href={telHref(site.phoneTel)}
                onClick={() => trackCall('header')}
              >
                {site.phoneDisplay}
              </a>
              <button className="header__cta" type="button" onClick={scrollToForm}>
                Get My Offer
              </button>
            </div>
          </div>
        </header>

        {children}

        <footer className="footer">
          <p>
            &copy; {new Date().getFullYear()} {site.businessName}. {footerLine()}
          </p>
          {hasStreetAddress() && (
            <p>
              {site.streetAddress}
              {site.postalCode ? `, ${site.primaryCity}, ${site.stateAbbr} ${site.postalCode}` : ''}
            </p>
          )}
          {hours.length > 0 && (
            <ul className="footer__hours">
              {hours.map((row) => (
                <li key={row.label}>
                  <strong>{row.label}:</strong> {row.hours}
                </li>
              ))}
            </ul>
          )}
          <p>
            Call{sms ? ' or text ' : ' '}
            <a href={telHref(site.phoneTel)} onClick={() => trackCall('footer')}>
              {site.phoneDisplay}
            </a>
            {mail && (
              <>
                {' '}
                · <a href={`mailto:${mail}`}>{mail}</a>
              </>
            )}
          </p>
          {network.affiliateLine ? (
            <p>
              <a href={`https://${network.domain}/`}>{network.affiliateLine}</a>
            </p>
          ) : null}
          {(socials.length > 0 || reviewUrl || site.licenseLine) && (
            <p className="footer__links">
              {socials.map((item) => (
                <a key={item.key} href={item.url} rel="noreferrer">
                  {item.label}
                </a>
              ))}
              {reviewUrl && (
                <a href={reviewUrl} rel="noreferrer">
                  Google reviews
                </a>
              )}
              {site.licenseLine ? <span>{site.licenseLine}</span> : null}
            </p>
          )}
        </footer>

        <a
          className="tap-call"
          href={telHref(site.phoneTel)}
          onClick={() => trackCall('sticky')}
        >
          <PhoneIcon />
          <span>Call now</span>
          <strong>{site.phoneDisplay}</strong>
        </a>
      </div>
  )
}

function scrollToForm() {
  document.querySelector('.quote-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

function setMeta(name, content) {
  let el = document.querySelector(`meta[name="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('name', name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setProperty(property, content) {
  let el = document.querySelector(`meta[property="${property}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('property', property)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setCanonical(href) {
  let el = document.querySelector('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

function setJsonLd(data) {
  let el = document.getElementById('site-jsonld')
  if (!el) {
    el = document.createElement('script')
    el.id = 'site-jsonld'
    el.type = 'application/ld+json'
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(data).replace(/</g, '\\u003c')
}

function PhoneIcon() {
  return (
    <svg className="tap-call__icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M6.6 10.8a15.1 15.1 0 006.6 6.6l2.2-2.2a1 1 0 011-.25 11.4 11.4 0 003.6.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.4 11.4 0 00.57 3.6 1 1 0 01-.25 1L6.6 10.8z"
      />
    </svg>
  )
}
