import { renderToString } from 'react-dom/server'
import { setActiveSite } from './lib/activeSite.js'
import App from './App.jsx'
import { allRoutes, directoryMeta, pageMeta } from './lib/seo.js'

export function useSite(site) {
  setActiveSite(site)
}

export function render(url, site) {
  setActiveSite(site)
  return renderToString(<App ssrPath={url} />)
}

export function metaFor(url, site) {
  setActiveSite(site)
  if (site?.kind === 'directory') return directoryMeta()
  return pageMeta(url)
}

export { allRoutes, directoryMeta, pageMeta }
