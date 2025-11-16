'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface LazyLoadProps {
  children: ReactNode;
  className?: string;
  threshold?: number;
  rootMargin?: string;
  fallback?: ReactNode;
  once?: boolean;
  height?: string | number;
}

export function LazyLoad({
  children,
  className,
  threshold = 0.1,
  rootMargin = '50px',
  fallback,
  once = true,
  height = 'auto'
}: LazyLoadProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setHasLoaded(true);
          
          if (once) {
            observer.unobserve(element);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, once]);

  return (
    <div
      ref={elementRef}
      className={cn('transition-opacity duration-500', className)}
      style={{ height: !hasLoaded ? height : 'auto' }}
    >
      {isVisible || hasLoaded ? (
        <div className={cn(
          'transition-opacity duration-500',
          isVisible ? 'opacity-100' : 'opacity-0'
        )}>
          {children}
        </div>
      ) : (
        fallback || (
          <div 
            className="flex items-center justify-center bg-gray-50 animate-pulse"
            style={{ height }}
          >
            <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
          </div>
        )
      )}
    </div>
  );
}

// Skeleton loader component
export function SkeletonLoader({ 
  className,
  lines = 3,
  height = '1rem'
}: {
  className?: string;
  lines?: number;
  height?: string;
}) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className="bg-gray-200 animate-pulse rounded"
          style={{ 
            height,
            width: index === lines - 1 ? '75%' : '100%'
          }}
        />
      ))}
    </div>
  );
}

// Card skeleton for profile cards
export function ProfileCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('border rounded-lg p-4 space-y-4', className)}>
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse" />
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded animate-pulse" />
        <div className="h-3 bg-gray-200 rounded animate-pulse w-5/6" />
        <div className="h-3 bg-gray-200 rounded animate-pulse w-4/6" />
      </div>
    </div>
  );
}

// Lazy load wrapper for heavy components
export function LazySection({
  children,
  fallback,
  className,
  minHeight = '200px'
}: {
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
  minHeight?: string;
}) {
  return (
    <LazyLoad
      className={className}
      height={minHeight}
      fallback={fallback || <SkeletonLoader lines={5} />}
    >
      {children}
    </LazyLoad>
  );
}