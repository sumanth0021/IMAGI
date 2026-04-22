"use client"

import { memo, useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import {
  siDailymotion,
  siFacebook,
  siInstagram,
  siJio,
  siNetflix,
  siRumble,
  siVimeo,
  siX,
  siYoutube,
} from "simple-icons"

// ─── Platform SVGs ────────────────────────────────────────────────────────────

function BrandIcon({
  path,
  color,
  size = 20,
}: {
  path: string
  color: string
  size?: number
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d={path} />
    </svg>
  )
}

const PlatformIcon = ({ name }: { name: string }) => {
  switch (name.toLowerCase().trim()) {
    case "youtube":
      return <BrandIcon path={siYoutube.path} color={`#${siYoutube.hex}`} />

    case "netflix":
      return <BrandIcon path={siNetflix.path} color={`#${siNetflix.hex}`} />

    case "prime video":
    case "amazon prime":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#00A8E0">
          <path d="M13.958 10.09c0 1.232.029 2.256-.591 3.351-.502.891-1.301 1.438-2.186 1.438-1.214 0-1.922-.924-1.922-2.292 0-2.692 2.415-3.182 4.7-3.182v.685zm3.186 7.705c-.209.189-.512.201-.745.076-1.047-.872-1.233-1.276-1.808-2.107-1.731 1.765-2.955 2.293-5.192 2.293-2.652 0-4.715-1.636-4.715-4.91 0-2.557 1.387-4.297 3.358-5.146 1.71-.75 4.105-.883 5.933-1.088v-.405c0-.744.058-1.626-.381-2.27-.381-.578-1.107-.817-1.749-.817-1.186 0-2.247.61-2.505 1.872-.053.282-.259.56-.542.574l-3.035-.328c-.256-.058-.541-.266-.468-.66C6.56 2.252 9.642 1 12.403 1c1.415 0 3.263.376 4.376 1.451 1.415 1.322 1.279 3.086 1.279 5.009v4.537c0 1.365.565 1.963 1.097 2.701.188.265.229.581-.01.778l-2.001 1.318zm3.954 3.449C19.224 22.98 15.751 24 12.6 24c-4.947 0-9.399-1.83-12.765-4.875-.265-.238-.028-.563.29-.378 3.638 2.117 8.134 3.386 12.777 3.386 3.134 0 6.582-.649 9.755-1.994.478-.203.878.313.441.705zm1.26-1.435c-.361-.462-2.384-.218-3.294-.109-.277.033-.32-.208-.07-.383 1.614-1.133 4.26-.806 4.567-.426.308.382-.083 3.025-1.596 4.289-.233.197-.456.091-.352-.166.34-.851 1.107-2.741.745-3.205z"/>
        </svg>
      )

    case "hotstar":
    case "disney+ hotstar":
    case "jiohotstar":
    case "jiohoster":
    case "jio hotstar":
    case "jio-hoster":
      return <BrandIcon path={siJio.path} color={`#${siJio.hex}`} />

    case "instagram":
      return <BrandIcon path={siInstagram.path} color={`#${siInstagram.hex}`} />

    case "facebook":
      return <BrandIcon path={siFacebook.path} color={`#${siFacebook.hex}`} />

    case "apple tv":
    case "appletv":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <rect x="2" y="5" width="20" height="14" rx="3" fill="#111" stroke="#A3A3A3" strokeWidth="1.2"/>
          <path d="M8.6 13.4c.5-.3.8-.8.8-1.3-.4 0-.9.3-1.1.6-.2.3-.4.8-.3 1.2.4 0 .8-.2 1-.5z" fill="#fff"/>
          <path d="M10.7 15.6c.3 0 .6-.1.9-.1.3 0 .6.1.9.1.4 0 .8-.2 1.1-.6-.5-.2-.8-.7-.8-1.2 0-.6.3-1 .8-1.2-.3-.4-.7-.6-1.2-.6-.3 0-.6.1-.8.1-.3 0-.5-.1-.8-.1-.9 0-1.8.8-1.8 1.9 0 .6.2 1.2.5 1.7.3.5.7.8 1.2.8z" fill="#fff"/>
          <path d="M14.8 9.2h4.2M16.9 7.4v3.6" stroke="#fff" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      )

    case "dailymotion":
      return <BrandIcon path={siDailymotion.path} color={`#${siDailymotion.hex}`} />

    case "x":
    case "twitter":
    case "x (twitter)":
      return <BrandIcon path={siX.path} color={`#${siX.hex}`} />

    case "rumble":
      return <BrandIcon path={siRumble.path} color={`#${siRumble.hex}`} />

    case "vimeo":
      return <BrandIcon path={siVimeo.path} color={`#${siVimeo.hex}`} />

    case "mx player":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <rect x="2" y="2" width="20" height="20" rx="5" fill="#1C6BFF"/>
          <path d="M8 7.5h2.1L12 10l1.9-2.5H16l-2.7 3.5L16 14.5h-2.1L12 12l-1.9 2.5H8l2.7-3.5L8 7.5z" fill="white"/>
        </svg>
      )

    case "zee5":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="#111"/>
          <circle cx="12" cy="12" r="7.5" stroke="#7C3AED" strokeWidth="1.5"/>
          <circle cx="12" cy="12" r="5.5" stroke="#22D3EE" strokeWidth="1.5"/>
          <path d="M8 9h8l-8 6h8" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )

    case "sonyliv":
    case "sony liv":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <rect x="2" y="2" width="20" height="20" rx="5" fill="url(#sonyliv-gradient)"/>
          <path d="M8 14.5c1.5 1 3 .7 4.3-.4" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
          <defs>
            <linearGradient id="sonyliv-gradient" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
              <stop stopColor="#2B0B3F"/>
              <stop offset="0.5" stopColor="#EC4899"/>
              <stop offset="1" stopColor="#F59E0B"/>
            </linearGradient>
          </defs>
        </svg>
      )

    default:
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="rgba(255,255,255,0.5)" strokeWidth="1.8"
          strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="M10 8l6 4-6 4V8z" fill="rgba(255,255,255,0.5)" stroke="none"/>
        </svg>
      )
  }
}

// ─── Safe link resolver ───────────────────────────────────────────────────────

function resolveLink(
  platform: string,
  platform_links: Record<string, string>
): string | undefined {
  const candidates = [
    platform,
    platform.toLowerCase(),
    platform.toUpperCase(),
    platform.trim(),
    platform.trim().toLowerCase(),
    platform.trim().toUpperCase(),
  ]

  for (const key of candidates) {
    if (platform_links[key]) return platform_links[key]
  }

  // Last resort: full case-insensitive scan
  const lower = platform.toLowerCase().trim()
  const matchedKey = Object.keys(platform_links).find(
    (k) => k.toLowerCase().trim() === lower
  )

  return matchedKey ? platform_links[matchedKey] : undefined
}

function isValidPlatformLink(link: string): boolean {
  try {
    const parsed = new URL(link)
    return parsed.protocol === "http:" || parsed.protocol === "https:"
  } catch {
    return false
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

function WatchButton({
  id,
  platforms,
  platform_links,
  buttonLabel = "Watch now",
}: {
  id: string
  platforms: string[]
  platform_links: Record<string, string>
  buttonLabel?: string
}) {
  const supabase = createClient()
  const [showModal, setShowModal] = useState(false)
  const [visible, setVisible] = useState(false)
  const [linkError, setLinkError] = useState("")

  const resolvedPlatforms = Array.from(
    new Set(
      [...platforms, ...Object.keys(platform_links)]
        .map((name) => (typeof name === "string" ? name.trim() : ""))
        .filter((name) => name.length > 0)
    )
  )

  const modalHeaderText =
    resolvedPlatforms.length > 1
      ? "Multiple platforms available"
      : "Watch here"

  const invalidLinkMessage =
    "invalid link cantact uploader if cantact info is available"
  const missingLinkMessage =
    "no external link added"

  // Fire-and-forget — never blocks navigation
  const incrementViews = async () => {
    try {
      await supabase.rpc("increment_views", { row_id: id })
    } catch (_) {}
  }

  const handleWatch = () => {
    if (!resolvedPlatforms || resolvedPlatforms.length === 0) {
      setLinkError(missingLinkMessage)
      return
    }
    setLinkError("")

    incrementViews() // no await — intentionally fire and forget

    setShowModal(true)
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)))
  }

  const closeModal = () => {
    setVisible(false)
    setLinkError("")
    setTimeout(() => setShowModal(false), 280)
  }

  const handlePlatformClick = (platform: string) => {
    const link = resolveLink(platform, platform_links)
    if (link && isValidPlatformLink(link)) {
      setLinkError("")
      window.open(link, "_blank")
      closeModal()
    } else {
      setLinkError(link ? invalidLinkMessage : missingLinkMessage)
    }
  }

  useEffect(() => {
    if (!showModal) return
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") closeModal() }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [showModal])

  useEffect(() => {
    if (!showModal) return

    const previousBodyOverflow = document.body.style.overflow
    const previousHtmlOverflow = document.documentElement.style.overflow
    document.body.style.overflow = "hidden"
    document.documentElement.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = previousBodyOverflow
      document.documentElement.style.overflow = previousHtmlOverflow
    }
  }, [showModal])

  return (
    <>
      {/* Watch Button */}
      <button
        onClick={handleWatch}
        className="mt-6 inline-flex w-full max-w-sm items-center justify-center gap-2
                   rounded-full bg-white px-8 py-3 text-black text-sm font-medium
                   hover:bg-white/90 active:scale-95 transition-all duration-150
                   md:w-auto"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
          <path d="M8 5v14l11-7z" />
        </svg>
        {buttonLabel}
      </button>

      {linkError && !showModal && (
        <p className="mt-3 max-w-sm text-xs text-amber-300/95">
          {linkError}
        </p>
      )}

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center px-4 pb-6 md:pb-0"
          style={{
            backgroundColor: visible ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0)",
            backdropFilter: visible ? "blur(20px)" : "blur(0px)",
            transition: "background-color 0.28s ease, backdrop-filter 0.28s ease",
          }}
          onClick={closeModal}
        >
          <div
            className="w-full md:max-w-sm max-h-[85vh]"
            style={{
              transform: visible ? "translateY(0)" : "translateY(20px)",
              opacity: visible ? 1 : 0,
              transition: "transform 0.3s cubic-bezier(0.22,1,0.36,1), opacity 0.25s ease",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="rounded-[28px] overflow-hidden flex max-h-[85vh] flex-col"
              style={{ background: "rgba(28,28,30,0.97)" }}
            >
              {/* Header */}
              <div className="px-6 pt-7 pb-5 text-center border-b border-white/[0.06]">
                <p className="text-[11px] uppercase tracking-[0.18em] text-white/35 mb-2">
                  {modalHeaderText}
                </p>
                {resolvedPlatforms.length > 1 && (
                  <h2 className="text-[17px] font-semibold text-white">
                    Choose a platform
                  </h2>
                )}
              </div>

              {/* Platform list */}
              {linkError && (
                <div className="mx-4 mt-4 rounded-xl border border-amber-300/30 bg-amber-300/10 px-3 py-2 text-xs text-amber-100">
                  {linkError}
                </div>
              )}

              <div
                className="min-h-0 flex-1 overflow-y-auto overscroll-contain py-2"
                style={{ WebkitOverflowScrolling: "touch", touchAction: "pan-y" }}
              >
                {resolvedPlatforms.map((platform, i) => (
                  <button
                    key={platform}
                    onClick={() => handlePlatformClick(platform)}
                    className={`w-full flex items-center gap-4 px-6 py-4 text-left
                                hover:bg-white/[0.06] active:bg-white/[0.08]
                                transition-colors duration-150
                                ${i !== 0 ? "border-t border-white/[0.05]" : ""}`}
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center
                                    rounded-[10px] bg-white/[0.07]">
                      <PlatformIcon name={platform} />
                    </div>

                    <span className="flex-1 text-[15px] text-white font-medium">
                      {platform}
                    </span>

                    <svg
                      width="14" height="14" viewBox="0 0 14 14" fill="none"
                      stroke="rgba(255,255,255,0.22)" strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round"
                    >
                      <path d="M2 7h10M8 3l4 4-4 4" />
                    </svg>
                  </button>
                ))}
              </div>

              {/* Cancel */}
              <div className="p-3 border-t border-white/[0.06]">
                <button
                  onClick={closeModal}
                  className="w-full py-3.5 rounded-[18px] text-[15px] font-medium
                             text-white/50 hover:text-white/80
                             bg-white/[0.05] hover:bg-white/[0.08]
                             transition-all duration-150"
                >
                  Cancel
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default memo(WatchButton)