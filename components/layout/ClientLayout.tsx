"use client"

import { usePathname } from "next/navigation"
import { SideNav } from "@/components/layout/SideNav"
import { BottomNav } from "@/components/layout/BottomNav"
import { TopNav } from "@/components/layout/TopNav"
import type React from "react"

interface ClientLayoutProps {
  children: React.ReactNode
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname()
  const isPublicRoute = pathname === "/" || pathname === "/login"

  return (
    <>
      {!isPublicRoute && <TopNav />}
      <div className="flex flex-1 overflow-hidden">
        {!isPublicRoute && <SideNav />}
        <main className={`flex-1 overflow-hidden ${isPublicRoute ? "w-full" : ""}`}>{children}</main>
      </div>
      {!isPublicRoute && <BottomNav />}
    </>
  )
}

