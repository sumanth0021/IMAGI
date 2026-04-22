"use client"

import { useEffect } from "react"
import type { ComponentType } from "react"
import { Copy, Mail, MessageCircle, Send, Twitter, X } from "lucide-react"

type ShareModalProps = {
  isOpen: boolean
  title: string
  url: string
  copied: boolean
  onClose: () => void
  onCopy: () => Promise<void>
}

type ShareOption = {
  key: "copy" | "whatsapp" | "telegram" | "twitter" | "email"
  label: string
  href?: string
  icon: ComponentType<{ className?: string }>
  onClick?: () => void
}

export default function ShareModal({
  isOpen,
  title,
  url,
  copied,
  onClose,
  onCopy,
}: ShareModalProps) {
  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const encodedTitle = encodeURIComponent(title)
  const encodedUrl = encodeURIComponent(url)

  const options: ShareOption[] = [
    {
      key: "copy",
      label: copied ? "Link copied" : "Copy Link",
      icon: Copy,
      onClick: () => {
        void onCopy()
      },
    },
    {
      key: "whatsapp",
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      icon: MessageCircle,
    },
    {
      key: "telegram",
      label: "Telegram",
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      icon: Send,
    },
    {
      key: "twitter",
      label: "Twitter (X)",
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      icon: Twitter,
    },
    {
      key: "email",
      label: "Email",
      href: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
      icon: Mail,
    },
  ]

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 px-4 backdrop-blur-xl"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-5 text-white shadow-2xl shadow-black/50 transition-all duration-200 ease-out animate-in fade-in zoom-in-95"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-modal-title"
      >
        <div className="flex items-center justify-between">
          <h2 id="share-modal-title" className="text-base font-semibold tracking-wide">
            Share
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white/80 transition hover:scale-105 hover:bg-white/15 hover:text-white"
            aria-label="Close share modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="mt-2 line-clamp-2 text-sm text-white/70">{title}</p>

        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          {options.map((option) => {
            const Icon = option.icon
            const baseClassName =
              "flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/90 transition hover:bg-white/10"

            if (option.key === "copy") {
              return (
                <button
                  key={option.key}
                  type="button"
                  onClick={option.onClick}
                  className={`${baseClassName} ${copied ? "border-emerald-300/40 text-emerald-200" : ""}`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{option.label}</span>
                </button>
              )
            }

            return (
              <a
                key={option.key}
                href={option.href}
                target="_blank"
                rel="noreferrer"
                className={baseClassName}
              >
                <Icon className="h-4 w-4" />
                <span>{option.label}</span>
              </a>
            )
          })}
        </div>
      </div>
    </div>
  )
}