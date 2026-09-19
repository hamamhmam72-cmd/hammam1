import { useEffect, useState } from "react"

/**
 * Hash routing keeps /admin working on any static host (and inside a sandboxed preview)
 * without server rewrites. "#/admin" is the dashboard; anything else is the public site.
 */
function current() {
  return window.location.hash.replace(/^#/, "")
}

export function useRoute() {
  const [route, setRoute] = useState(current)
  useEffect(() => {
    const on = () => setRoute(current())
    window.addEventListener("hashchange", on)
    return () => window.removeEventListener("hashchange", on)
  }, [])
  return route
}

export function navigate(path: string) {
  window.location.hash = path
}
