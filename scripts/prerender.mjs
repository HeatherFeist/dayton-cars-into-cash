import { build } from 'vite'
import fs from 'fs'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import { faviconSvg, fillTemplate, manifestJson, robotsTxt, sitemapXml } from './siteFiles.mjs'
import { citySlug } from '../src/lib/cityContent.js'
import site from '../site.config.js'
import { serviceAreaCities, themeCss } from '../src/lib/site.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')

function fail(message) {
  console.error(`\nConfig problem: ${message}\nFix it in site.config.js and build again.\n`)
  process.exit(1)
}

function checkConfig() {
  if (!String(site.businessName || '').trim()) fail('Add a business name.')
  if (!String(site.phoneDisplay || '').trim() || !String(site.phoneTel || '').trim()) {
    fail('Add the phone number customers should call (phoneDisplay and phoneTel).')
  }
  const digits = String(site.phoneTel).replace(/\D/g, '')
  if (digits.length < 10) fail('phoneTel needs a real phone number, with country code, like +19375550100.')
  if (!String(site.primaryCity || '').trim() || !String(site.state || '').trim()) {
    fail('Add the primary city and state.')
  }
  const cities = serviceAreaCities()
  if (cities.length === 0) fail('Add at least one service-area city.')
  const slugs = new Map()
  for (const city of cities) {
    const slug = citySlug(city)
    if (slugs.has(slug)) fail(`"${city}" and "${slugs.get(slug)}" would make the same web address. Rename one.`)
    slugs.set(slug, city)
  }
  const css = themeCss()
  for (const key of ['brand', 'brandDark', 'teal', 'accent', 'text', 'muted', 'background']) {
    if (!css.includes(site.colors[key])) fail(`colors.${key} needs to be a hex color like #14284f.`)
  }
  if (!/^https?:\/\/.+/i.test(String(site.siteUrl || ''))) {
    fail('siteUrl needs to be your real website address, starting with https://')
  }
  if (/example\.com/i.test(site.siteUrl)) {
    console.warn('\nReminder: siteUrl is still https://example.com. Change it before this yard goes live.\n')
  }
  if (site.videoPath === '/explainer.mp4') {
    console.warn('Reminder: the home-page video is still the sample file. Replace it or clear videoPath before launch.\n')
  }
}

checkConfig()

const templatePath = path.join(dist, 'index.html')
if (!fs.existsSync(templatePath)) {
  fail('dist/index.html is missing. Run vite build first.')
}

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
const routes = mod.allRoutes()

for (const route of routes) {
  const html = mod.render(route)
  const meta = mod.pageMeta(route)
  const page = fillTemplate(template, meta, { appHtml: html })
  const file = route === '/' ? path.join(dist, 'index.html') : path.join(dist, route.slice(1), 'index.html')
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, page)
}

fs.writeFileSync(path.join(dist, 'favicon.svg'), faviconSvg())
fs.writeFileSync(path.join(dist, 'manifest.webmanifest'), manifestJson())
fs.writeFileSync(path.join(dist, 'robots.txt'), robotsTxt())
fs.writeFileSync(path.join(dist, 'sitemap.xml'), sitemapXml())

const home = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')
const sampleCity = routes.find((route) => route !== '/')
const cityHtml = fs.readFileSync(path.join(dist, sampleCity.slice(1), 'index.html'), 'utf8')
if (home.includes('__TITLE__') || cityHtml.includes('__APP__')) {
  fail('Page templates still have blank tokens. The build did not fill them in.')
}
if (home.includes('<title>') && cityHtml.includes('<title>')) {
  const homeTitle = home.match(/<title>([^<]*)<\/title>/)?.[1]
  const cityTitle = cityHtml.match(/<title>([^<]*)<\/title>/)?.[1]
  if (!homeTitle || !cityTitle || homeTitle === cityTitle) {
    fail('Home and city pages ended up with the same title.')
  }
}

console.log(`Prerendered ${routes.length} pages (home + ${routes.length - 1} cities).`)
