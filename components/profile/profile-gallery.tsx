'use client'

import { useMemo, useState } from 'react'
import { ImageWithFallback } from '@/components/ui/image-with-fallback'
import { Badge } from '@/components/ui/badge'
import { Shield } from 'lucide-react'

type UserImage = {
  id: string | number
  image_url: string
  is_main?: boolean
}

interface ProfileGalleryProps {
  images: UserImage[] | null | undefined
  personName: string
  isPremium?: boolean
  isVerified?: boolean
  className?: string
}

export default function ProfileGallery({
  images,
  personName,
  isPremium = false,
  isVerified = false,
  className,
}: ProfileGalleryProps) {
  const orderedImages = useMemo(() => {
    const imgs = Array.isArray(images) ? images : []
    return [...imgs].sort((a, b) => Number(b.is_main) - Number(a.is_main))
  }, [images])

  const initialMain = orderedImages[0]?.image_url || '/placeholder.jpg'
  const [selectedSrc, setSelectedSrc] = useState<string>(initialMain)

  const thumbnails = useMemo(() => {
    return orderedImages.filter((img) => img.image_url !== selectedSrc).slice(0, 3)
  }, [orderedImages, selectedSrc])

  return (
    <div className={className}>
      <div className="mb-6 border-humsafar-100 overflow-hidden relative rounded-md">
        <div className="relative w-full h-96">
          <ImageWithFallback
            src={selectedSrc}
            alt={personName}
            fallbackSrc="/placeholder.jpg"
            fill
            className="object-contain bg-black"
            priority
          />
          {isPremium && (
            <Badge className="absolute top-2 left-2 z-10 bg-humsafar-600 text-white text-xs px-2 py-1 rounded-full">Premium</Badge>
          )}
          {isVerified && (
            <span className="absolute top-2 right-2 z-10 pointer-events-none inline-flex items-center gap-1 rounded-full bg-humsafar-600 text-white text-xs px-2.5 py-1">
              <Shield className="w-3 h-3" />
              Verified
            </span>
          )}
        </div>
      </div>

      {thumbnails.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {thumbnails.map((img) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setSelectedSrc(img.image_url)}
              className="relative w-full aspect-square overflow-hidden rounded focus:outline-none focus:ring-2 focus:ring-humsafar-500"
              aria-label="Change profile image"
            >
              <ImageWithFallback
                src={img.image_url}
                alt="Thumbnail"
                fallbackSrc="/placeholder.jpg"
                fill
                className="object-contain bg-black"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
