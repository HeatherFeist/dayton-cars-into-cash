import { isApexHost, publicPathFromAff, rewritePath, subdomainFromHost, NETWORK_DOMAIN } from './src/lib/hostRouter.js'

export default function middleware(request) {
  const url = new URL(request.url)
  if (isApexHost(url.host) && url.pathname.startsWith('/_aff/')) {
    const sub = url.pathname.match(/^\/_aff\/([a-z0-9-]+)/)?.[1]
    const rest = publicPathFromAff(url.pathname) || '/'
    if (sub) return Response.redirect(`https://${sub}.${NETWORK_DOMAIN}${rest}${url.search}`, 301)
  }
  const sub = subdomainFromHost(url.host)
  const target = rewritePath(url.pathname, sub)
  if (!target) return
  const rewritten = new URL(request.url)
  rewritten.pathname = target
  return new Response(null, {
    headers: { 'x-middleware-rewrite': rewritten.toString() },
  })
}

export const config = {
  matcher: '/:path*',
}
