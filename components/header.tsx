"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Heart, Menu, User, Settings, LogOut, Crown, Phone, Mail, Facebook, Twitter, Instagram, Linkedin } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"
import Image from "next/image"




export default function Header() {
  const [user, setUser] = useState<any>(null)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)



  const router = useRouter()

  const navigationItems = [
    { title: "Home", href: "/" },
    { title: "About", href: "/about" },
    { title: "Featured Profile", href: "/profiles" },
    { title: "Event Registration", href: "/event-registration" },
    { title: "Packages", href: "/packages" },
    // Removed: Success Stories and Contact links from header navigation
  ]

  const morePages = [
    { title: "Match Making Process", href: "/match-making-process" },
    { title: "About", href: "/about" },
    { title: "Terms of Use", href: "/terms-of-use" },
    { title: "Alerts", href: "/alerts" },
    { title: "How do we stand out?", href: "/how-do-we-stand-out" },
    { title: "Refund Policy", href: "/refund-policy" },
    { title: "Privacy Policy", href: "/privacy-policy" },
    { title: "100% Secure", href: "/100-secure" },
    { title: "Match Guarantee", href: "/match-guarantee" },
    { title: "We Care", href: "/we-care" },
    { title: "Word from CEO", href: "/ceo-note" },
    { title: "Technical Issues", href: "/technical-support" },
    { title: "How to Use", href: "/how-to-use" },
    { title: "Bank Accounts", href: "/bank-accounts" },
    { title: "FAQs", href: "/faqs" },
    { title: "Blog", href: "/blog" },
    { title: "Contact Us", href: "/contact" },
  ]

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        // If we previously persisted session manually, restore it into Supabase on first load
        const persisted = localStorage.getItem('sb-auth-token')
        if (persisted) {
          const parsed = JSON.parse(persisted)
          if (parsed?.access_token) {
            await supabase.auth.setSession({
              access_token: parsed.access_token,
              refresh_token: parsed.refresh_token,
            })
          }
        }
      } catch (_) {}

      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        setUser(session.user)
        
        // Fetch user profile data
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .single()
        
        setUserProfile(profile)
      } else {
        setUser(null)
        setUserProfile(null)
      }
    }

    // Small delay to prevent race conditions with auth page
    setTimeout(() => {
      getInitialSession()
    }, 100)

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      
      if (session?.user) {
        setUser(session.user)
        
        // Fetch user profile data
        const { data: profile } = await supabase.from("user_profiles").select("*").eq("user_id", session.user.id).single()
        setUserProfile(profile)
        
        // Check user subscription status for terminated profiles
        const { data: subscriptionData } = await supabase
          .from("user_subscriptions")
          .select("profile_status")
          .eq("user_id", session.user.id)
          .single()
        
        // If profile is terminated, redirect to terminated page
        if (subscriptionData?.profile_status === 'terminated') {
          router.push('/profile-terminated')
        }
      } else {
        setUser(null)
        setUserProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    try { localStorage.removeItem('sb-auth-token') } catch (_) {}
    setUser(null)
    setUserProfile(null)
    router.push('/')
  }



  const getInitials = (firstName: string, middleName?: string, lastName?: string) => {
    if (!firstName) return "U"
    const first = firstName.charAt(0).toUpperCase()
    const middle = middleName ? middleName.charAt(0).toUpperCase() : ""
    const last = lastName ? lastName.charAt(0).toUpperCase() : ""
    return first + middle + last
  }

  const getUserDisplayName = () => {
    if (userProfile?.first_name) {
      return userProfile.first_name
    }
    if (user?.user_metadata?.first_name) {
      return user.user_metadata.first_name
    }
    return user?.email?.split("@")[0] || "User"
  }

  const getUserFullName = () => {
    const first = userProfile?.first_name || user?.user_metadata?.first_name || ""
    const middle = userProfile?.middle_name || user?.user_metadata?.middle_name || ""
    const last = userProfile?.last_name || user?.user_metadata?.last_name || ""
    const full = [first, middle, last].filter(Boolean).join(' ')
    return full || user?.email?.split("@")[0] || "User"
  }

  return (
    <>
      {/* Top Contact Bar */}
        <div className="bg-humsafar-500 py-2 text-sm relative z-40">
        <div className="container mx-auto px-8">
          <div className="flex items-center justify-between">
            {/* Left: Contact Info */}
             <div className="hidden md:flex items-center space-x-6 text-white">
               <div className="flex items-center space-x-2">
                 <Phone className="h-4 w-4" />
                 <span>+92 332 7355681</span>
               </div>
               <div className="flex items-center space-x-2">
                 <Mail className="h-4 w-4" />
                 <span>info@humsafarforeverlove.com</span>
               </div>
             </div>
            
            {/* Right: Social Links */}
            <div className="flex items-center space-x-4">
              <a href="#" className="text-white hover:text-gray-200 transition-colors" aria-label="Facebook" title="Facebook">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="text-white hover:text-gray-200 transition-colors" aria-label="Twitter" title="Twitter">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="text-white hover:text-gray-200 transition-colors" aria-label="Instagram" title="Instagram">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="text-white hover:text-gray-200 transition-colors" aria-label="LinkedIn" title="LinkedIn">
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
       </div>
       
       
       
       {/* Main Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50" suppressHydrationWarning>
      <div className="container mx-auto px-4" suppressHydrationWarning>
        <div className="flex items-center justify-between h-28" suppressHydrationWarning>
          {/* Left: Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center" legacyBehavior>
              <Image src="/humsafar-logo.png" alt="Humsafar Logo" width={192} height={64} priority />
            </Link>
          </div>

          {/* Center: Navigation Links */}
          <div className="flex items-center" suppressHydrationWarning>
            <NavigationMenu className="hidden lg:flex">
              <NavigationMenuList>
                {navigationItems.map((item) => (
                  <NavigationMenuItem key={item.title}>
                    <Link href={item.href} legacyBehavior passHref>
                      <NavigationMenuLink className="group inline-flex h-12 w-max items-center justify-center rounded-md bg-background px-6 py-3 text-base font-semibold transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                        {item.title}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                ))}
                
                {/* More Pages Dropdown - Removed from desktop, moved to footer */}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right: Login/Signup or User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Desktop actions: Dashboard + Logout */}
                <div className="hidden sm:flex items-center space-x-3">
                  <Link href="/dashboard" legacyBehavior>
                    <Button
                      variant="outline"
                      className="border-humsafar-500 text-humsafar-600 hover:bg-humsafar-500 hover:text-white bg-transparent"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="border-humsafar-500 text-humsafar-600 hover:bg-humsafar-500 hover:text-white bg-transparent"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>

                {/* Mobile view for authenticated user */}
                <div className="sm:hidden">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      {/* Removed greeting label per requirements */}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard" legacyBehavior>
                          <User className="mr-2 h-4 w-4" />
                          <span>Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/profile" legacyBehavior>
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Profile Settings</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/packages" legacyBehavior>
                          <Crown className="mr-2 h-4 w-4" />
                          <span>Upgrade Plan</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </>
            ) : (
              <>
                <Link href="/auth" className="hidden lg:block" legacyBehavior>
                  <Button className="bg-humsafar-500 hover:bg-humsafar-600 text-white">Login / Register</Button>
                </Link>
              </>
            )}

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] flex flex-col h-full">
                <div className="flex flex-col space-y-4 mt-8 overflow-y-auto flex-1 pr-2 max-h-[calc(100vh-8rem)] scrollbar-hide">
                  <Link href="/" className="flex items-center mb-6" legacyBehavior>
                    <a className="flex items-center">
                      <Image src="/humsafar-logo.png" alt="Humsafar Logo" width={160} height={54} />
                    </a>
                  </Link>

                  {navigationItems.map((item) => (
                    <Link
                      key={item.title}
                      href={item.href}
                      className="text-lg font-medium text-gray-900 hover:text-humsafar-500 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                      legacyBehavior
                    >
                      <a className="block py-2">{item.title}</a>
                    </Link>
                  ))}
                  
                  {/* Authentication-based buttons */}
                  {user ? (
                    // Dashboard Button (for authenticated users)
                    <div className="pt-4">
                      <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} legacyBehavior>
                        <a>
                          <Button className="w-full bg-humsafar-500 hover:bg-humsafar-600 text-white flex items-center justify-center space-x-2">
                            <User className="h-5 w-5" />
                            <span>Dashboard</span>
                          </Button>
                        </a>
                      </Link>
                    </div>
                  ) : (
                    // Login/Register Button (for non-authenticated users)
                    <div className="pt-4">
                      <Link href="/auth" onClick={() => setMobileMenuOpen(false)} legacyBehavior>
                        <a>
                          <Button className="w-full bg-humsafar-500 hover:bg-humsafar-600 text-white">
                            Login / Register
                          </Button>
                        </a>
                      </Link>
                    </div>
                  )}
                  
                  {/* Additional Pages */}
                  <div className="pt-4 border-t">
                    <div className="text-sm font-semibold text-gray-500 mb-3">More Pages</div>
                    {morePages.map((page) => (
                      <Link
                        key={page.title}
                        href={page.href}
                        className="text-base font-medium text-gray-700 hover:text-humsafar-500 transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                        legacyBehavior
                      >
                        <a className="block py-2">{page.title}</a>
                      </Link>
                    ))}
                  </div>

                  {/* User greeting and logout section */}
                  {user && (
                    <div className="pt-6 border-t">
                      <div className="space-y-4">
                        <div className="text-sm text-gray-600">Hello, {getUserDisplayName()}</div>
                        <Button
                          variant="ghost"
                          className="w-full justify-start p-0 h-auto text-gray-900 hover:text-humsafar-500"
                          onClick={() => {
                            handleLogout()
                            setMobileMenuOpen(false)
                          }}
                        >
                          <LogOut className="h-5 w-5 mr-2" />
                          Log out
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
      {/* Announcement Bar */}
      {user ? (
  <div className="bg-humsafar-500 text-white overflow-hidden relative">
    <div className="container mx-auto px-4 py-2">
      <div className="whitespace-nowrap animate-marquee">
        Welcome, {getUserFullName()}, hope you found your soulmate
      </div>
    </div>
  </div>
) : (
  <div className="bg-humsafar-500 text-white overflow-hidden relative">
    <div className="container mx-auto px-4 py-2">
      <div className="whitespace-nowrap animate-marquee">
        Limited Time Offer: 50% Discount on all Packages
      </div>
    </div>
  </div>
)}


    </header>
    </>
  );
}