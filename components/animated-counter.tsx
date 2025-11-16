'use client'

import { useEffect, useRef, useState } from 'react'

interface CounterProps {
  end: number
  duration?: number
  suffix?: string
  prefix?: string
}

function useIntersectionObserver(ref: React.RefObject<Element>, options?: IntersectionObserverInit) {
  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting)
    }, options)

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [ref, options])

  return isIntersecting
}

function AnimatedCounter({ end, duration = 2000, suffix = '', prefix = '' }: CounterProps) {
  const [count, setCount] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const counterRef = useRef<HTMLSpanElement>(null)
  const isVisible = useIntersectionObserver(counterRef, { threshold: 0.3 })

  useEffect(() => {
    if (isVisible && !hasAnimated) {
      setHasAnimated(true)
      let startTime: number
      const startValue = 0
      const endValue = end

      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime
        const progress = Math.min((currentTime - startTime) / duration, 1)
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4)
        const currentCount = Math.floor(easeOutQuart * (endValue - startValue) + startValue)
        
        setCount(currentCount)
        
        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          setCount(endValue)
        }
      }
      
      requestAnimationFrame(animate)
    }
  }, [isVisible, hasAnimated, end, duration])

  return (
    <span ref={counterRef} className="font-bold">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  )
}

export default function AnimatedCounterSection() {
  return (
    <section className="py-16 bg-gradient-to-r from-humsafar-600 via-humsafar-700 to-humsafar-800 relative overflow-hidden">
      {/* Background Animation Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-float"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-white/5 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white/10 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-32 right-1/3 w-24 h-24 bg-white/5 rounded-full animate-float" style={{animationDelay: '0.5s'}}></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 animate-fade-in-down">
            Trusted by Thousands
          </h2>
          <p className="text-xl text-white/90 animate-fade-in-up">
            Join our growing community of successful matches
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center animate-fade-in-up stagger-1">
            <div className="text-4xl md:text-5xl font-bold text-white mb-2">
              <AnimatedCounter end={50000} suffix="+" />
            </div>
            <p className="text-white/80 text-sm md:text-base">Happy Members</p>
          </div>
          
          <div className="text-center animate-fade-in-up stagger-2">
            <div className="text-4xl md:text-5xl font-bold text-white mb-2">
              <AnimatedCounter end={15000} suffix="+" />
            </div>
            <p className="text-white/80 text-sm md:text-base">Successful Matches</p>
          </div>
          
          <div className="text-center animate-fade-in-up stagger-3">
            <div className="text-4xl md:text-5xl font-bold text-white mb-2">
              <AnimatedCounter end={98} suffix="%" />
            </div>
            <p className="text-white/80 text-sm md:text-base">Success Rate</p>
          </div>
          
          <div className="text-center animate-fade-in-up stagger-4">
            <div className="text-4xl md:text-5xl font-bold text-white mb-2">
              <AnimatedCounter end={24} suffix="/7" />
            </div>
            <p className="text-white/80 text-sm md:text-base">Support Available</p>
          </div>
        </div>
      </div>
    </section>
  )
}