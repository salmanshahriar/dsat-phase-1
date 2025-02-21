"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { type LucideIcon, LayoutDashboard, Brain, HelpCircle, User } from "lucide-react"
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

export function BottomNav() {
  const pathname = usePathname()
  const activeIndex = navItems.findIndex((item) => item.href === pathname)

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border">
      <ul className="flex justify-around items-center h-16">
        {navItems.map((item, index) => (
          <li key={item.href}>
            <Link href={item.href} passHref>
              <div
                className={cn(
                  "flex flex-col items-center justify-center w-16 h-16 text-foreground",
                  index === activeIndex && "text-primary",
                )}
              >
                <item.icon size={24} className="mb-1" />
                <span className="text-xs">{item.title}</span>
                {index === activeIndex && <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary" />}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

