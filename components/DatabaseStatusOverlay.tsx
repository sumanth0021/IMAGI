"use client"

import { AnimatePresence, motion } from "framer-motion"
import { AlertTriangle, Loader2, X } from "lucide-react"
import { useDatabaseStatus } from "@/components/DatabaseStatusProvider"

export default function DatabaseStatusOverlay() {
  const { dbStatus, errorMessage, isOverlayOpen, closeOverlay, retryNow, isRetrying } = useDatabaseStatus()

  const showOverlay = dbStatus === "error" && isOverlayOpen

  return (
    <AnimatePresence>
      {showOverlay ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[160] bg-black/55 backdrop-blur-sm px-4"
          onClick={closeOverlay}
        >
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute left-1/2 top-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/15 bg-black/75 p-5 text-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="db-status-title"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-full bg-red-500/20 p-2 text-red-300">
                <AlertTriangle className="h-5 w-5" />
              </div>

              <div className="flex-1">
                <h3 id="db-status-title" className="text-lg font-semibold tracking-wide">
                  Server is not responding
                </h3>
                <p className="mt-1 text-sm text-white/75">{errorMessage}</p>
              </div>

              <button
                type="button"
                onClick={closeOverlay}
                className="rounded-full p-1.5 text-white/70 transition hover:bg-white/10 hover:text-white"
                aria-label="Close database status"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-end gap-2">
              <button
                type="button"
                onClick={closeOverlay}
                className="rounded-lg border border-white/20 px-3 py-1.5 text-sm text-white/85 transition hover:bg-white/10"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => void retryNow()}
                disabled={isRetrying}
                className="inline-flex items-center gap-2 rounded-lg bg-red-700 px-3 py-1.5 text-sm text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isRetrying ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {isRetrying ? "Retrying..." : "Retry"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
