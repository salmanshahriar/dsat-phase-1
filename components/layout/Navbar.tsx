import { ThemeToggle } from "./ThemeToggle"

export function Navbar() {
  return (
    <header className="h-16 border-b bg-white">
      <div className="container max-w-7xl mx-auto px-4 h-full">
        <div className="flex items-center justify-end h-full">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}

