"use client"

import { useState } from "react"
import { createPortal } from "react-dom"
import { motion } from "framer-motion"
import { Minus, X, Maximize2, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FloatingCalculatorProps {
  onClose: () => void
}

export function FloatingCalculator({ onClose }: FloatingCalculatorProps) {
  const [isMinimized, setIsMinimized] = useState(false)
  const [isMaximized, setIsMaximized] = useState(false)
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null)

  useState(() => {
    const container = document.createElement("div")
    container.style.position = "fixed"
    container.style.zIndex = "2147483647"
    container.style.top = "0"
    container.style.left = "0"
    container.style.width = "100%"
    container.style.height = "100%"
    container.style.pointerEvents = "none"
    document.body.appendChild(container)
    setPortalContainer(container)

    return () => {
      document.body.removeChild(container)
    }
  }, [])

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized)
    if (isMaximized) setIsMaximized(false)
  }

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized)
    if (isMinimized) setIsMinimized(false)
  }

  if (!portalContainer) return null

  return createPortal(
    <motion.div
      drag={!isMaximized}
      dragMomentum={false}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
      className="fixed bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden pointer-events-auto"
      style={{
        width: isMaximized ? "100%" : isMinimized ? "200px" : "620px",
        height: isMaximized ? "100%" : isMinimized ? "auto" : "570px",
        top: isMaximized ? "0" : "5rem",
        right: isMaximized ? "0" : "1rem",
        left: isMaximized ? "0" : "auto",
      }}
    >
      <div className="cursor-move bg-[#1E1E1E] p-2 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-white">Calculator</h3>
          <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-white">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex space-x-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-gray-400 hover:text-white"
            onClick={toggleMinimize}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-gray-400 hover:text-white"
            onClick={toggleMaximize}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-white" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <motion.div
        animate={{ height: isMinimized ? 0 : isMaximized ? "calc(100vh - 40px)" : "520px" }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <iframe
          src="https://www.desmos.com/calculator"
          width="100%"
          height="100%"
          style={{
            border: "none",
            height: isMaximized ? "calc(100vh - 40px)" : "520px",
          }}
        />
      </motion.div>
    </motion.div>,
    portalContainer,
  )
}

