"use client"

import { useEffect } from "react"
import { getTheme, setTheme } from "@/lib/utils"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Initialize theme on client
  useEffect(() => {
    const savedTheme = getTheme()
    setTheme(savedTheme)
  }, [])

  return <>{children}</>
} 