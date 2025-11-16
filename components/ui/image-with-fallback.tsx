'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'

interface ImageWithFallbackProps {
  src: string
  alt: string
  fallbackSrc?: string
  className?: string
  fill?: boolean
  width?: number
  height?: number
  priority?: boolean
}

export function ImageWithFallback({
  src,
  alt,
  fallbackSrc = '/placeholder.jpg',
  className,
  fill = false,
  width,
  height,
  priority = false,
  ...props
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const [hasError, setHasError] = useState(false)

  const handleError = () => {
    if (!hasError) {
      setHasError(true)
      setImgSrc(fallbackSrc)
    }
  }

  // Reset source when src prop changes
  useEffect(() => {
    setImgSrc(src)
    setHasError(false)
  }, [src])

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      className={className}
      fill={fill}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      priority={priority}
      onError={handleError}
    />
  )
}
