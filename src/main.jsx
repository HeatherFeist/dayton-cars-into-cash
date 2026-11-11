import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { setActiveSite } from './lib/activeSite'
import { publicPathFromAff } from './lib/hostRouter'
import { applyTheme } from './lib/site'
import { normalizePath } from './lib/seo'
import { resolveRequest } from './lib/yards'

const request = resolveRequest(window.location.host, window.location.pathname)
setActiveSite(request.site)
applyTheme(request.site.colors)

const rootEl = document.getElementById('root')
const app = (
  <StrictMode>
    <App ssrPath={request.path} />
  </StrictMode>
)

const here = publicPathFromAff(window.location.pathname) ?? normalizePath(window.location.pathname)
const renderedPath = normalizePath(document.documentElement.dataset.path || '')
const renderedAff = document.documentElement.dataset.affiliate || ''
const hereAff =
  request.site.kind === 'directory' || request.site.kind === 'missing' ? '' : request.site.subdomain || ''

if (rootEl.hasChildNodes() && renderedPath === normalizePath(here) && renderedAff === hereAff) {
  hydrateRoot(rootEl, app)
} else {
  rootEl.replaceChildren()
  createRoot(rootEl).render(app)
}
