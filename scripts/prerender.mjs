import { build } from 'vite'
import fs from 'fs'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import affiliates from '../affiliates.config.js'
import { setActiveSite } from '../src/lib/activeSite.js'
import { citySlug } from '../src/lib/cityContent.js'
import { isSubdomainLabel } from '../src/lib/hostRouter.js'
import { faviconSvg, fillTemplate, manifestJson, robotsTxt, sitemapXml } from './siteFiles.mjs'
import { serviceAreaCities, themeCss } from '../src/lib/site.js'
import { directorySite } from '../src/lib/yards.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')

function fail(message) {
  console.error(`\nConfig problem: ${message}\nFix it in site.config.js or affiliates.config.js and build again.\n`)
  process.exit(1)
}

function checkYard(yard) {
  const label = yard.businessName || yard.subdomain || 'A yard'
  if (!String(yard.businessName || '').trim()) fail('Every yard needs a business name.')
  if (!isSubdomainLabel(yard.subdomain)) {
    fail(`${label} needs a subdomain like sandys or jimstowing (lowercase letters and numbers).`)
  }
  if (!String(yard.phoneDisplay || '').trim() || !String(yard.phoneTel || '').trim()) {
    fail(`${label} needs phoneDisplay and phoneTel.`)
  }
  const digits = String(yard.phoneTel).replace(/\D/g, '')
  if (digits.length < 10) fail(`${label} phoneTel needs a real phone number, with country code.`)
  if (!String(yard.primaryCity || '').trim() || !String(yard.state || '').trim()) {
    fail(`${label} needs a primary city and state.`)
  }
  setActiveSite(yard)
  const cities = serviceAreaCities()
  if (cities.length === 0) fail(`${label} needs at least one service-area city.`)
  const slugs = new Map()
  for (const city of cities) {
    const slug = citySlug(city)
    if (slugs.has(slug)) fail(`${label}: "${city}" and "${slugs.get(slug)}" would make the same page. Rename one.`)
    slugs.set(slug, city)
  }
  const css = themeCss()
  for (const key of ['brand', 'brandDark', 'teal', 'accent', 'text', 'muted', 'background']) {
    if (!css.includes(yard.colors?.[key])) fail(`${label} colors.${key} needs to be a hex color like #14284f.`)
  }
}

const seen = new Map()
for (const yard of affiliates) {
  checkYard(yard)
  if (seen.has(yard.subdomain)) {
    fail(`"${yard.subdomain}" is used by ${seen.get(yard.subdomain)} and ${yard.businessName}. Each yard needs its own subdomain.`)
  }
  seen.set(yard.subdomain, yard.businessName)
}

const templatePath = path.join(dist, 'index.html')
if (!fs.existsSync(templatePath)) fail('dist/index.html is missing. Run vite build first.')

await build({
  root,
  logLevel: 'warn',
  build: {
    ssr: path.join(root, 'src/entry-server.jsx'),
    outDir: path.join(root, '.ssr'),
    emptyOutDir: true,
  },
})

const mod = await import(pathToFileURL(path.join(root, '.ssr', 'entry-server.js')).href)
const template = fs.readFileSync(templatePath, 'utf8')

function writePage(file, site, route) {
  setActiveSite(site)
  const html = mod.render(route, site)
  const meta = mod.metaFor(route, site)
  const page = fillTemplate(template, meta, { appHtml: html })
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, page)
}

const directory = directorySite()
writePage(path.join(dist, 'index.html'), directory, '/')
setActiveSite(directory)
fs.writeFileSync(path.join(dist, 'favicon.svg'), faviconSvg(directory.colors))
fs.writeFileSync(path.join(dist, 'manifest.webmanifest'), manifestJson())
fs.writeFileSync(path.join(dist, 'robots.txt'), robotsTxt())
fs.writeFileSync(path.join(dist, 'sitemap.xml'), sitemapXml())

for (const yard of affiliates) {
  setActiveSite(yard)
  mod.useSite(yard)
  const routes = mod.allRoutes()
  const base = path.join(dist, '_aff', yard.subdomain)
  for (const route of routes) {
    const file = route === '/' ? path.join(base, 'index.html') : path.join(base, route.slice(1), 'index.html')
    writePage(file, yard, route)
  }
  fs.writeFileSync(path.join(base, 'favicon.svg'), faviconSvg(yard.colors))
  fs.writeFileSync(path.join(base, 'manifest.webmanifest'), manifestJson())
  fs.writeFileSync(path.join(base, 'robots.txt'), robotsTxt())
  fs.writeFileSync(path.join(base, 'sitemap.xml'), sitemapXml())
}

const home = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')
const sample = affiliates[0]
const yardHome = fs.readFileSync(path.join(dist, '_aff', sample.subdomain, 'index.html'), 'utf8')
if (home.includes('__TITLE__') || yardHome.includes('__APP__')) fail('Page templates still have blank tokens.')
if (!home.includes(directory.businessName)) fail('The city directory did not render.')
if (!yardHome.includes(sample.businessName)) fail('The sample yard home page did not render.')
console.log(`Directory plus ${affiliates.length} yard site${affiliates.length === 1 ? '' : 's'} (${affiliates.map((yard) => yard.subdomain).join(', ')}).`)
