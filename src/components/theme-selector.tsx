"use client"

import { useEffect, useState } from "react"
import { Check, ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Theme, setTheme, themes, getTheme } from "@/lib/utils"

export function ThemeSelector() {
  const [open, setOpen] = useState(false)
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
    setTheme(savedTheme)
  }, [])

  // Handle theme selection
  const handleSelectTheme = (theme: Theme) => {
    setCurrentTheme(theme)
    setTheme(theme)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {themeNames[currentTheme]}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search themes..." />
          <CommandEmpty>No theme found.</CommandEmpty>
          <CommandGroup>
            {themes.map((theme) => (
              <CommandItem
                key={theme}
                value={theme}
                onSelect={() => handleSelectTheme(theme)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    currentTheme === theme ? "opacity-100" : "opacity-0"
                  )}
                />
                {themeNames[theme]}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
} 