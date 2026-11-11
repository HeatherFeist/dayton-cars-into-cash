import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { applyTheme } from './lib/site'
import { normalizePath } from './lib/seo'

applyTheme()

const rootEl = document.getElementById('root')
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

const renderedPath = normalizePath(document.documentElement.dataset.path || '')
const here = normalizePath(window.location.pathname)
if (rootEl.hasChildNodes() && renderedPath === here) {
  hydrateRoot(rootEl, app)
} else {
  rootEl.replaceChildren()
  createRoot(rootEl).render(app)
}
