"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { type LucideIcon, LayoutDashboard, Brain, HelpCircle, User, ChevronRight, ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  title: string
  href: string
  icon: LucideIcon
}

const navItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Practice", href: "/practice", icon: Brain },
  { title: "Doubts", href: "/doubts", icon: HelpCircle },
  { title: "Profile", href: "/profile", icon: User },
]

export function SideNav() {
  const [isExpanded, setIsExpanded] = useState(true)
  const pathname = usePathname()
  const activeIndex = navItems.findIndex((item) => item.href === pathname)

  return (
    <nav
      className={`hidden lg:flex flex-col h-[calc(100vh-4rem)] bg-background border-r border-border transition-all duration-300 flex-shrink-0 ${
        isExpanded ? "w-48" : "w-[74px]"
      }`}
    >
      <div className="flex items-center justify-end p-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 rounded-full hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
        >
          {isExpanded ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
        </button>
      </div>
      <ul className="flex-1 px-3 py-4 space-y-2">
        {navItems.map((item, index) => (
          <li key={item.href}>
            <Link href={item.href} passHref>
              <div
                className={cn(
                  "flex items-center px-3 py-2 rounded-lg text-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-200 ",
                  index === activeIndex && " dark:text-white text-primary-foreground bg-indigo-500",
                )}
              >
                <item.icon size={24} className="flex-shrink-0" />
                {isExpanded && <span className="ml-3">{item.title}</span>}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

