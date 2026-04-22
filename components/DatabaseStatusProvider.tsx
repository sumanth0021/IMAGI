"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { DbStatus, normalizeDatabaseError } from "@/lib/supabase/request"

type RetryHandler = (() => Promise<void> | void) | null

type DatabaseStatusContextValue = {
  dbStatus: DbStatus
  isOverlayOpen: boolean
  isRetrying: boolean
  errorMessage: string
  setDbLoading: () => void
  setDbOk: () => void
  setDbError: (error: unknown) => void
  closeOverlay: () => void
  setRetryHandler: (handler: RetryHandler) => void
  retryNow: () => Promise<void>
}

const DEFAULT_DESCRIPTION =
  "Please wait a moment or try again. If the issue continues, contact support."

const DatabaseStatusContext = createContext<DatabaseStatusContextValue | null>(null)

export function DatabaseStatusProvider({ children }: { children: ReactNode }) {
  const [dbStatus, setDbStatus] = useState<DbStatus>("ok")
  const [isOverlayOpen, setIsOverlayOpen] = useState(false)
  const [isRetrying, setIsRetrying] = useState(false)
  const [errorMessage, setErrorMessage] = useState(DEFAULT_DESCRIPTION)
  const retryHandlerRef = useRef<RetryHandler>(null)

  const setDbLoading = useCallback(() => {
    setDbStatus("loading")
  }, [])

  const setDbOk = useCallback(() => {
    setDbStatus("ok")
    setIsOverlayOpen(false)
    setErrorMessage(DEFAULT_DESCRIPTION)
  }, [])

  const setDbError = useCallback((error: unknown) => {
    const normalized = normalizeDatabaseError(error)
    setErrorMessage(normalized.message || DEFAULT_DESCRIPTION)

    setDbStatus((previous) => {
      if (previous !== "error") {
        setIsOverlayOpen(true)
      }
      return "error"
    })
  }, [])

  const closeOverlay = useCallback(() => {
    setIsOverlayOpen(false)
  }, [])

  const setRetryHandler = useCallback((handler: RetryHandler) => {
    retryHandlerRef.current = handler
  }, [])

  const retryNow = useCallback(async () => {
    if (!retryHandlerRef.current || isRetrying) return

    setIsRetrying(true)
    setDbStatus("loading")

    try {
      await retryHandlerRef.current()
      setDbOk()
    } catch (error: unknown) {
      setDbError(error)
    } finally {
      setIsRetrying(false)
    }
  }, [isRetrying, setDbError, setDbOk])

  useEffect(() => {
    if (dbStatus !== "error" || !retryHandlerRef.current) return

    const intervalId = setInterval(() => {
      void retryNow()
    }, 8000)

    return () => clearInterval(intervalId)
  }, [dbStatus, retryNow])

  const value = useMemo<DatabaseStatusContextValue>(
    () => ({
      dbStatus,
      isOverlayOpen,
      isRetrying,
      errorMessage,
      setDbLoading,
      setDbOk,
      setDbError,
      closeOverlay,
      setRetryHandler,
      retryNow,
    }),
    [
      closeOverlay,
      dbStatus,
      errorMessage,
      isOverlayOpen,
      isRetrying,
      retryNow,
      setDbError,
      setDbLoading,
      setDbOk,
      setRetryHandler,
    ]
  )

  return <DatabaseStatusContext.Provider value={value}>{children}</DatabaseStatusContext.Provider>
}

export function useDatabaseStatus() {
  const context = useContext(DatabaseStatusContext)
  if (!context) {
    throw new Error("useDatabaseStatus must be used inside DatabaseStatusProvider")
  }
  return context
}
