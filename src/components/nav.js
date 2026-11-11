import { createContext, useContext, useEffect, useState } from 'react'
import { publicPathFromAff } from '../lib/hostRouter'
import { normalizePath } from '../lib/seo'

function browserPath() {
  return normalizePath(publicPathFromAff(window.location.pathname) ?? window.location.pathname)
}

function withAffPrefix(pathname) {
  if (typeof window === 'undefined') return pathname
  const prefix = window.location.pathname.match(/^(\/_aff\/[a-z0-9-]+)/)
  if (!prefix || pathname.startsWith('/_aff/')) return pathname
  if (pathname === '/') return `${prefix[1]}/`
  return `${prefix[1]}${pathname}`
}

export const NavContext = createContext({
  navigate() {},
})

export function useNavigate() {
  return useContext(NavContext)
}

export function usePath(ssrPath) {
  const [path, setPath] = useState(() =>
    typeof window === 'undefined' ? normalizePath(ssrPath) : browserPath(),
  )

  useEffect(() => {
    const onPop = () => setPath(browserPath())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    if (!hash) return
    const timer = window.setTimeout(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 0)
    return () => window.clearTimeout(timer)
  }, [path])

  function navigate(event, href) {
    if (!event || event.defaultPrevented) return
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return
    const url = new URL(href, window.location.origin)
    if (url.origin !== window.location.origin) return
    event.preventDefault()
    const next = normalizePath(publicPathFromAff(url.pathname) ?? url.pathname)
    const visible = withAffPrefix(url.pathname)
    window.history.pushState({}, '', `${visible}${url.search}${url.hash}`)
    setPath(next)
    if (!url.hash) window.scrollTo(0, 0)
  }

  return { path, navigate }
}
