'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface AdminAuthContextType {
  isAdmin: boolean
  login: (password: string) => boolean
  logout: () => void
  isLoading: boolean
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider')
  }
  return context
}

interface AdminAuthProviderProps {
  children: ReactNode
}

export function AdminAuthProvider({ children }: AdminAuthProviderProps) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if admin session exists on mount
    const adminSession = localStorage.getItem('adminSession')
    if (adminSession === 'true') {
      setIsAdmin(true)
    }
    setIsLoading(false)
  }, [])

  const login = (password: string): boolean => {
    // Simple password authentication (in production, this should be more secure)
    const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin789'

    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true)
      localStorage.setItem('adminSession', 'true')
      return true
    }
    return false
  }

  const logout = () => {
    setIsAdmin(false)
    localStorage.removeItem('adminSession')
  }

  const value: AdminAuthContextType = {
    isAdmin,
    login,
    logout,
    isLoading
  }

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  )
}