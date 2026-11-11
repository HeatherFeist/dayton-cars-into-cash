import { isApexHost, publicPathFromAff, rewritePath, subdomainFromHost, NETWORK_DOMAIN } from '../src/lib/hostRouter.js'

export async function onRequest(context) {
  const url = new URL(context.request.url)
  if (isApexHost(url.host) && url.pathname.startsWith('/_aff/')) {
    const sub = url.pathname.match(/^\/_aff\/([a-z0-9-]+)/)?.[1]
    const rest = publicPathFromAff(url.pathname) || '/'
    if (sub) return Response.redirect(`https://${sub}.${NETWORK_DOMAIN}${rest}${url.search}`, 301)
  }
  const sub = subdomainFromHost(url.host)
  const target = rewritePath(url.pathname, sub)
  if (!target) return context.next()
  const rewritten = new URL(context.request.url)
  rewritten.pathname = target
  return context.env.ASSETS.fetch(rewritten)
}
