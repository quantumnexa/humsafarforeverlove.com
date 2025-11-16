"use client"

import React, { useRef, useEffect, useState } from 'react'
import Image from 'next/image'

interface ProtectedImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void
  onLoad?: () => void
  priority?: boolean
}

export default function ProtectedImage({
  src,
  alt,
  width,
  height,
  className = '',
  onError,
  onLoad,
  priority = false
}: ProtectedImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !src || hasError) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = width
    canvas.height = height

    // Create main image
    const mainImg = new window.Image()
    mainImg.crossOrigin = 'anonymous'
    
    mainImg.onload = () => {
      // Fill canvas with black background
      ctx.fillStyle = 'black'
      ctx.fillRect(0, 0, width, height)
      
      // Calculate dimensions to maintain aspect ratio
      const imgAspectRatio = mainImg.naturalWidth / mainImg.naturalHeight
      const canvasAspectRatio = width / height
      
      let drawWidth, drawHeight, drawX, drawY
      
      if (imgAspectRatio > canvasAspectRatio) {
        // Image is wider than canvas
        drawWidth = width
        drawHeight = width / imgAspectRatio
        drawX = 0
        drawY = (height - drawHeight) / 2
      } else {
        // Image is taller than canvas
        drawHeight = height
        drawWidth = height * imgAspectRatio
        drawX = (width - drawWidth) / 2
        drawY = 0
      }
      
      // Draw main image centered with aspect ratio preserved
      ctx.drawImage(mainImg, drawX, drawY, drawWidth, drawHeight)
      
      // Create overlay image
      const overlayImg = new window.Image()
      overlayImg.crossOrigin = 'anonymous'
      
      overlayImg.onload = () => {
        // Set very low opacity for overlay (10%)
        ctx.globalAlpha = 0.1
        // Draw overlay on top with reduced opacity
        ctx.drawImage(overlayImg, 0, 0, width, height)
        // Reset opacity for future drawings
        ctx.globalAlpha = 1.0
        setIsLoaded(true)
        if (onLoad) onLoad()
      }
      
      overlayImg.onerror = () => {
        // If overlay fails to load, still show the main image
        setIsLoaded(true)
        if (onLoad) onLoad()
      }
      
      overlayImg.src = '/overlay-2.png'
    }
    
    mainImg.onerror = (e) => {
      setHasError(true)
      if (onError) {
        const syntheticEvent = {
          target: mainImg,
          currentTarget: mainImg
        } as unknown as React.SyntheticEvent<HTMLImageElement, Event>
        onError(syntheticEvent)
      }
    }
    
    mainImg.src = src
  }, [src, width, height, onError, onLoad, hasError])

  // Prevent right-click context menu
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    return false
  }

  // Prevent drag and drop
  const handleDragStart = (e: React.DragEvent) => {
    e.preventDefault()
    return false
  }

  // Prevent selection
  const handleSelectStart = (e: React.SyntheticEvent) => {
    e.preventDefault()
    return false
  }

  if (hasError) {
    return (
      <div className={`${className} bg-gray-100 flex items-center justify-center`}>
        <div className="text-center text-gray-400">
          <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
          <p className="text-sm">No Photo</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative block w-full bg-black">
      {/* Hidden Next.js Image for SEO and loading optimization */}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="absolute opacity-0 pointer-events-none"
        priority={priority}
        onError={onError}
      />
      
      {/* Protected Canvas */}
      <canvas
        ref={canvasRef}
        className={`${className} ${!isLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onContextMenu={handleContextMenu}
        onDragStart={handleDragStart}
        style={{
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none',
          WebkitTouchCallout: 'none',
          // @ts-ignore
          WebkitUserDrag: 'none',
          KhtmlUserSelect: 'none'
        }}
      />
      
      {/* Loading placeholder */}
      {!isLoaded && !hasError && (
        <div className={`${className} bg-black flex items-center justify-center absolute inset-0`}>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
        </div>
      )}
      
      {/* Invisible overlay to prevent right-click on the entire area */}
      <div
        className="absolute inset-0 z-10"
        onContextMenu={handleContextMenu}
        onDragStart={handleDragStart}
        style={{
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none',
          WebkitTouchCallout: 'none'
        }}
      />
    </div>
  )
}