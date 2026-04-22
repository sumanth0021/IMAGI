"use client"

import { ReactNode } from "react"
import DatabaseStatusOverlay from "@/components/DatabaseStatusOverlay"
import { DatabaseStatusProvider } from "@/components/DatabaseStatusProvider"

export default function DatabaseStatusClientShell({ children }: { children: ReactNode }) {
  return (
    <DatabaseStatusProvider>
      {children}
      <DatabaseStatusOverlay />
    </DatabaseStatusProvider>
  )
}
