"use client"

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export default function MetaPixelRouteTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'PageView')
      }
    } catch {
      // silently ignore if fbq is not available
    }
    // fire on route changes and query changes
  }, [pathname, searchParams])

  return null
}