"use client"

import { useRouter } from "next/navigation"
import { useCallback } from "react"

type BackButtonProps = {
  className?: string
  label?: string
  fallbackPath?: string
  alwaysUseFallback?: boolean
}

export default function BackButton({
  className = "",
  label = "Back",
  fallbackPath = "/",
  alwaysUseFallback = false,
}: BackButtonProps) {
  const router = useRouter()

  const handleBack = useCallback(() => {
    if (alwaysUseFallback) {
      window.location.replace(fallbackPath)
      return
    }

    let cameFromSharedLink = false

    try {
      cameFromSharedLink = window.sessionStorage.getItem("imagi_shared_entry") === "1"
      if (cameFromSharedLink) {
        window.sessionStorage.removeItem("imagi_shared_entry")
      }
    } catch {
      cameFromSharedLink = false
    }

    if (cameFromSharedLink || window.history.length <= 1) {
      window.location.replace(fallbackPath)
      return
    }

    router.back()
  }, [alwaysUseFallback, fallbackPath, router])

  return (
    <button
      type="button"
      onClick={handleBack}
      className={className}
      aria-label={label}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M15 18l-6-6 6-6" />
      </svg>
    </button>
  )
}
