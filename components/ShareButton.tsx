"use client"

import { useCallback, useState } from "react"
import { Upload } from "lucide-react"
import ShareModal from "@/components/ShareModal"

type ShareButtonProps = {
  title: string
  sharePath?: string
  shareViaHome?: boolean
  className?: string
}

export default function ShareButton({
  title,
  sharePath,
  shareViaHome = true,
  className = "",
}: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [shareUrl, setShareUrl] = useState("")

  const getShareUrl = useCallback(() => {
    if (typeof window === "undefined") return ""

    const normalizedPath =
      sharePath && sharePath.trim().length > 0
        ? sharePath.startsWith("/")
          ? sharePath
          : `/${sharePath}`
        : window.location.pathname

    if (shareViaHome) {
      return `${window.location.origin}/?open=${encodeURIComponent(normalizedPath)}`
    }

    return `${window.location.origin}${normalizedPath}`
  }, [sharePath, shareViaHome])

  const handleCopy = useCallback(async () => {
    if (!shareUrl) return

    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }, [shareUrl])

  const handleShareClick = useCallback(async () => {
    const url = getShareUrl()
    if (!url) return

    setShareUrl(url)

    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({
          title,
          url,
        })
        return
      } catch (error) {
        const nativeError = error as DOMException
        if (nativeError?.name === "AbortError") {
          return
        }
      }
    }

    setIsOpen(true)
  }, [getShareUrl, title])

  return (
    <>
      <button
        type="button"
        onClick={() => {
          void handleShareClick()
        }}
        className={`inline-flex h-10 items-center gap-2 rounded-full border border-white/20 bg-black/40 px-3 text-white/90 backdrop-blur transition duration-200 hover:scale-105 hover:bg-white/20 hover:text-white ${className}`}
        aria-label="Share this content"
      >
        <Upload className="h-4 w-4" />
        <span className="hidden text-sm font-medium md:inline">Share</span>
      </button>

      <ShareModal
        isOpen={isOpen}
        title={title}
        url={shareUrl}
        copied={copied}
        onClose={() => setIsOpen(false)}
        onCopy={handleCopy}
      />
    </>
  )
}