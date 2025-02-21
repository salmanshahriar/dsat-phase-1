"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface AuthContextType {
  isAuthenticated: boolean
  login: (token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const sessionData = document.cookie.replace(/(?:(?:^|.*;\s*)session_data\s*=\s*([^;]*).*$)|^.*$/, "$1")
    setIsAuthenticated(!!sessionData)
  }, [])

  const login = (token: string) => {
    document.cookie = `accessToken=${token}; path=/; max-age=3600; SameSite=Strict; Secure`
    document.cookie = `session_data=${token}; path=/; max-age=3600; SameSite=Strict; Secure`
    setIsAuthenticated(true)
  }

  const logout = () => {
    document.cookie = "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    document.cookie = "session_data=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    setIsAuthenticated(false)
  }

  return <AuthContext.Provider value={{ isAuthenticated, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

