"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // This effect will run only on the client
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null // Prevents hydration mismatch

  return (
    <button
      className="relative w-14 h-7 rounded-full bg-accent p-1 flex items-center"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <div
        className={`w-5 h-5 rounded-full bg-primary flex items-center justify-center transition-transform duration-200 ${
          theme === "dark" ? "transform translate-x-7" : ""
        }`}
      >
        {theme === "light" ? <Sun className="h-4 w-4 text-accent" /> : <Moon className="h-4 w-4 text-accent" />}
      </div>
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}

