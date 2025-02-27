"use client"

import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="transition-all duration-200 hover:scale-105 hover:shadow-lg"
    >
      {theme === "light" ? <Moon className="h-5 w-5 text-secondary" /> : <Sun className="h-5 w-5 text-tertiary" />}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

