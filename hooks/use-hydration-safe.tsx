"use client"

import { useState, useEffect } from 'react'

export function useHydrationSafe() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return isClient
}

export function HydrationSafe({ children, fallback = null }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  const isClient = useHydrationSafe()
  
  if (!isClient) {
    return <>{fallback}</>
  }
  
  return <>{children}</>
}
