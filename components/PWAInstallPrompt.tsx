"use client"

import { useEffect, useRef, useState } from "react"
import { Download, Share, X } from "lucide-react"

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>
}

const DISMISS_KEY = "pwa-dismissed"

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isIOSFallback, setIsIOSFallback] = useState(false)
  const [isAndroidFallback, setIsAndroidFallback] = useState(false)
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    const ua = navigator.userAgent
    const isMobile = /iPhone|iPad|iPod|Android/i.test(ua)
    if (!isMobile) return

    const isIOS = /iPhone|iPad|iPod/i.test(ua)
    const isAndroid = /Android/i.test(ua)
    const isChromeOnAndroid =
      isAndroid && /Chrome/i.test(ua) && !/EdgA|OPR|SamsungBrowser/i.test(ua)
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone)

    let wasDismissed = false

    try {
      wasDismissed = window.localStorage.getItem(DISMISS_KEY) === "true"
    } catch {
      wasDismissed = false
    }

    if (wasDismissed) return

    if (isIOS && !isStandalone) {
      timerRef.current = window.setTimeout(() => {
        setIsIOSFallback(true)
        setIsAndroidFallback(false)
        setIsVisible(true)
      }, 7000)

      return () => {
        if (timerRef.current) {
          window.clearTimeout(timerRef.current)
        }
      }
    }

    if (isAndroid && !isChromeOnAndroid) {
      timerRef.current = window.setTimeout(() => {
        setIsAndroidFallback(true)
        setIsIOSFallback(false)
        setIsVisible(true)
      }, 7000)
    }

    const handleBeforeInstallPrompt = (event: Event) => {
      const promptEvent = event as BeforeInstallPromptEvent
      console.log("[PWA] beforeinstallprompt fired", {
        url: window.location.href,
        displayModeStandalone: window.matchMedia("(display-mode: standalone)").matches,
      })
      event.preventDefault()
      setDeferredPrompt(promptEvent)
      setIsAndroidFallback(false)

      if (timerRef.current) {
        window.clearTimeout(timerRef.current)
      }

      timerRef.current = window.setTimeout(() => {
        setIsVisible(true)
      }, 7000)
    }

    const handleAppInstalled = () => {
      console.log("[PWA] appinstalled fired", { url: window.location.href })
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    window.addEventListener("appinstalled", handleAppInstalled)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.removeEventListener("appinstalled", handleAppInstalled)
      if (timerRef.current) {
        window.clearTimeout(timerRef.current)
      }
    }
  }, [])

  const handleDismiss = () => {
    try {
      window.localStorage.setItem(DISMISS_KEY, "true")
    } catch {
      // Ignore storage failures and only close the popup.
    }

    setIsVisible(false)
    setIsIOSFallback(false)
    setIsAndroidFallback(false)
  }

  const handleInstall = async () => {
    if (!deferredPrompt) return

    try {
      await deferredPrompt.prompt()
      await deferredPrompt.userChoice
    } finally {
      setIsVisible(false)
      setDeferredPrompt(null)
    }
  }

  const canShowNativeInstall = Boolean(deferredPrompt) && !isIOSFallback

  return (
    <div
      className={`fixed inset-x-0 bottom-4 z-[120] flex justify-center px-4 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        isVisible && (deferredPrompt || isIOSFallback || isAndroidFallback)
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-5 opacity-0"
      }`}
      aria-hidden={!isVisible}
    >
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-black/70 p-4 text-white shadow-2xl shadow-black/60 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/20 bg-white/10">
            <img
              src="/web-app-manifest-192x192.png"
              alt="IMAGI app icon"
              className="h-6 w-6 rounded-md object-cover"
            />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold tracking-wide">Install app</p>
            {isIOSFallback ? (
              <p className="mt-0.5 text-xs text-white/65">
                Open this site in Safari, tap
                <span className="mx-1 inline-flex items-center align-middle">
                  <Share className="h-3.5 w-3.5" />
                </span>
                then Add to Home Screen
              </p>
            ) : isAndroidFallback ? (
              <p className="mt-0.5 text-xs text-white/65">
                Open this site in Chrome, then tap menu and choose Install app
              </p>
            ) : (
              <p className="mt-0.5 text-xs text-white/65">
                You can download our app for faster access
              </p>
            )}
          </div>

          {canShowNativeInstall ? (
            <button
              type="button"
              onClick={() => {
                void handleInstall()
              }}
              className="inline-flex items-center gap-1 rounded-full bg-white px-4 py-2 text-xs font-semibold text-black transition duration-200 hover:scale-105"
            >
              <Download className="h-3.5 w-3.5" />
              Install
            </button>
          ) : (
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] text-white/70">
              {isIOSFallback ? "iPhone: Use Safari" : "Android: Use Chrome"}
            </span>
          )}

          <button
            type="button"
            onClick={handleDismiss}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-white/40 transition duration-200 hover:bg-white/10 hover:text-white"
            aria-label="Dismiss install prompt"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}