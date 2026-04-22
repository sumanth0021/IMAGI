"use client"

import { Suspense, useEffect } from "react"
import { useRouter } from "next/navigation"

function OpenContent() {
  const router = useRouter()

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const target = searchParams.get("target")
    if (!target) return

    const decodedTarget = decodeURIComponent(target)
    const isAllowedTarget =
      decodedTarget.startsWith("/stories/") || decodedTarget.startsWith("/shortfilms/")

    if (!isAllowedTarget) return

    const timeoutId = window.setTimeout(() => {
      try {
        window.sessionStorage.setItem("imagi_shared_entry", "1")
      } catch {
        // Ignore storage failures and continue navigation.
      }

      router.replace(decodedTarget)
    }, 1000)

    return () => window.clearTimeout(timeoutId)
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white">
      <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-white/70 backdrop-blur-xl">
        Opening content...
      </div>
    </div>
  )
}

export default function OpenPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-black text-white">
          <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-white/70 backdrop-blur-xl">
            Opening content...
          </div>
        </div>
      }
    >
      <OpenContent />
    </Suspense>
  )
}