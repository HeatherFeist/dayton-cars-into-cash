import { getActiveSite } from './lib/activeSite'
import Layout from './components/Layout'
import { NavContext, usePath } from './components/nav'
import { cityFromPath } from './lib/cityContent'
import { inboxEnabled } from './lib/inbox'
import { normalizePath } from './lib/seo'
import CityPage from './pages/CityPage'
import DirectoryPage from './pages/DirectoryPage'
import HomePage from './pages/HomePage'
import InboxPage from './pages/InboxPage'
import MissingYard from './pages/MissingYard'
import NotFound from './pages/NotFound'

export default function App({ ssrPath = '/' }) {
  const nav = usePath(ssrPath)
  const current = getActiveSite()
  if (current?.kind === 'missing') return <MissingYard subdomain={current.subdomain} />
  if (current?.kind === 'directory') {
    return <DirectoryPage path={normalizePath(nav.path || ssrPath)} />
  }

  const path = normalizePath(nav.path || ssrPath)
  const city = cityFromPath(path)
  let page = <NotFound />
  if (path === '/') page = <HomePage />
  else if (path === '/inbox' && inboxEnabled()) page = <InboxPage />
  else if (city) page = <CityPage city={city} />

  return (
    <NavContext.Provider value={nav}>
      <Layout path={path}>{page}</Layout>
    </NavContext.Provider>
  )
}
