"use client"

import { useEffect, useState } from "react"
import { Palette } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Theme, setTheme, themes, getTheme } from "@/lib/utils"

export function ThemeToggle() {
  const [currentTheme, setCurrentTheme] = useState<Theme>('minimal')
  
  // Theme display names with proper capitalization and spaces
  const themeNames: Record<Theme, string> = {
    minimal: "Minimal Light",
    dark: "Dark Mode",
    sepia: "Sepia Tone",
    fantasy: "Fantasy",
    pastel: "Pastel",
    cyberpunk: "Cyberpunk",
    vintage: "Vintage",
    ocean: "Ocean",
    forest: "Forest",
    noir: "Noir",
    cozy: "Cozy Night"
  }

  // Initialize theme on client
  useEffect(() => {
    const savedTheme = getTheme()
    setCurrentTheme(savedTheme)
  }, [])

  // Handle theme selection
  const handleSelectTheme = (theme: Theme) => {
    setCurrentTheme(theme)
    setTheme(theme)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" title="Change theme">
          <Palette className="h-5 w-5" />
          <span className="sr-only">Change theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themes.map((theme) => (
          <DropdownMenuItem
            key={theme}
            onClick={() => handleSelectTheme(theme)}
            className={currentTheme === theme ? "bg-muted" : ""}
          >
            {themeNames[theme]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 