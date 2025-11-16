"use client"

import { useEffect, useState } from 'react'

interface HydrationSafeWrapperProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  className?: string
  suppressHydrationWarning?: boolean
}

export function HydrationSafeWrapper({ 
  children, 
  fallback = null, 
  className = "",
  suppressHydrationWarning = true 
}: HydrationSafeWrapperProps) {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // During SSR and initial hydration, render the fallback
  if (!isHydrated) {
    return <div className={className}>{fallback}</div>
  }

  // After hydration, render the actual content with suppressHydrationWarning
  return (
    <div className={className} suppressHydrationWarning={suppressHydrationWarning}>
      {children}
    </div>
  )
}

// Specialized wrapper for elements that commonly get modified by browser extensions
export function BrowserExtensionSafeWrapper({ 
  children, 
  className = "",
  ...props 
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={className} 
      suppressHydrationWarning={true}
      {...props}
    >
      {children}
    </div>
  )
}
