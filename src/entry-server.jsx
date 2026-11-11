import { renderToString } from 'react-dom/server'
import App from './App.jsx'
import { allRoutes, pageMeta } from './lib/seo.js'
import site from '../site.config.js'

export function render(url) {
  return renderToString(<App ssrPath={url} />)
}

export { allRoutes, pageMeta, site }
