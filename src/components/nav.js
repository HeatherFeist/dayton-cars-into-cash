import { createContext, useContext, useEffect, useState } from 'react'
import { normalizePath } from '../lib/seo'

export const NavContext = createContext({
  navigate() {},
})

export function useNavigate() {
  return useContext(NavContext)
}

export function usePath(ssrPath) {
  const [path, setPath] = useState(() =>
    typeof window === 'undefined' ? normalizePath(ssrPath) : normalizePath(window.location.pathname),
  )

  useEffect(() => {
    const onPop = () => setPath(normalizePath(window.location.pathname))
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
    const next = normalizePath(url.pathname)
    window.history.pushState({}, '', `${url.pathname}${url.search}${url.hash}`)
    setPath(next)
    if (!url.hash) window.scrollTo(0, 0)
  }

  return { path, navigate }
}
