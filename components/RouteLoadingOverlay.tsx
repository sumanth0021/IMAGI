"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"

const SHOW_DELAY_MS = 1000

function isInternalNavAnchor(anchor: HTMLAnchorElement): boolean {
  const href = anchor.getAttribute("href")
  if (!href) return false
  if (
    href.startsWith("#") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    href.startsWith("javascript:")
  ) {
    return false
  }

  if (anchor.hasAttribute("download")) return false
  if (anchor.target && anchor.target !== "_self") return false

  try {
    const destination = new URL(anchor.href, window.location.href)
    const current = new URL(window.location.href)

    if (destination.origin !== current.origin) return false

    const samePage =
      destination.pathname === current.pathname &&
      destination.search === current.search &&
      destination.hash === current.hash

    return !samePage
  } catch {
    return false
  }
}

export default function RouteLoadingOverlay() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [visible, setVisible] = useState(false)
  const showTimerRef = useRef<number | null>(null)

  const stopPending = () => {
    if (showTimerRef.current !== null) {
      window.clearTimeout(showTimerRef.current)
      showTimerRef.current = null
    }
    setVisible(false)
  }

  const startPending = () => {
    if (showTimerRef.current !== null) {
      window.clearTimeout(showTimerRef.current)
    }
    showTimerRef.current = window.setTimeout(() => {
      setVisible(true)
    }, SHOW_DELAY_MS)
  }

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented) return
      if (event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

      const target = event.target as HTMLElement | null
      if (!target) return

      const anchor = target.closest("a") as HTMLAnchorElement | null
      if (!anchor) return

      if (!isInternalNavAnchor(anchor)) return
      startPending()
    }

    window.addEventListener("click", handleClick, true)
    return () => {
      window.removeEventListener("click", handleClick, true)
    }
  }, [])

  useEffect(() => {
    const onStart = () => startPending()
    const onEnd = () => stopPending()

    window.addEventListener("imagi:navigation-start", onStart)
    window.addEventListener("imagi:navigation-end", onEnd)

    return () => {
      window.removeEventListener("imagi:navigation-start", onStart)
      window.removeEventListener("imagi:navigation-end", onEnd)
    }
  }, [])

  useEffect(() => {
    stopPending()
  }, [pathname, searchParams])

  useEffect(() => {
    return () => {
      stopPending()
    }
  }, [])

  if (!visible) return null

  return (
    <div className="apple-loading-screen apple-loading-screen--instant-reveal" role="status" aria-live="polite" aria-label="Loading">
      <div className="apple-loading-spinner" aria-hidden="true" />
    </div>
  )
}