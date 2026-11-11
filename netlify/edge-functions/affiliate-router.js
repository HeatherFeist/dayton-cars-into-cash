import { isApexHost, rewritePath, subdomainFromHost, publicPathFromAff, NETWORK_DOMAIN } from '../../src/lib/hostRouter.js'

export default async (request, context) => {
  const url = new URL(request.url)
  const host = url.host
  if (isApexHost(host) && url.pathname.startsWith('/_aff/')) {
    const sub = url.pathname.match(/^\/_aff\/([a-z0-9-]+)/)?.[1]
    const rest = publicPathFromAff(url.pathname) || '/'
    if (sub) return Response.redirect(`https://${sub}.${NETWORK_DOMAIN}${rest}${url.search}`, 301)
  }
  const sub = subdomainFromHost(host)
  const target = rewritePath(url.pathname, sub)
  if (!target) return context.next()
  return context.rewrite(target + url.search)
}

export const config = { path: '/*' }
