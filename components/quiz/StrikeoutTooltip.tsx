"use client"

import type React from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface StrikeoutTooltipProps {
  children: React.ReactNode
}

export function StrikeoutTooltip({ children }: StrikeoutTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent className="bg-gray-800 text-white border-gray-800">
          <p>Cross out answer choices you think are wrong.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

