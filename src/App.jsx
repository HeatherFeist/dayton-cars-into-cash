import Layout from './components/Layout'
import { NavContext, usePath } from './components/nav'
import { cityFromPath } from './lib/cityContent'
import { normalizePath } from './lib/seo'
import CityPage from './pages/CityPage'
import HomePage from './pages/HomePage'
import NotFound from './pages/NotFound'

export default function App({ ssrPath = '/' }) {
  const nav = usePath(ssrPath)
  const path = normalizePath(nav.path)
  const city = cityFromPath(path)

  let page = <NotFound />
  if (path === '/') page = <HomePage />
  else if (city) page = <CityPage city={city} />

  return (
    <NavContext.Provider value={nav}>
      <Layout path={path}>{page}</Layout>
    </NavContext.Provider>
  )
}
