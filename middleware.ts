import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Handle canonical URL redirects and duplicate content prevention
  // Remove trailing slashes (except root)
  if (pathname !== '/' && pathname.endsWith('/')) {
    const url = request.nextUrl.clone()
    url.pathname = pathname.slice(0, -1)
    return NextResponse.redirect(url, 301)
  }
  
  // Handle common duplicate content patterns
  if (pathname === '/index' || pathname === '/home') {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url, 301)
  }
  
  // Normalize case for certain paths
  if (pathname === '/PROFILES') {
    const url = request.nextUrl.clone()
    url.pathname = '/profiles'
    return NextResponse.redirect(url, 301)
  }
  
  if (pathname === '/PACKAGES') {
    const url = request.nextUrl.clone()
    url.pathname = '/packages'
    return NextResponse.redirect(url, 301)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Match paths that need URL normalization
    "/((?!api|_next/static|_next/image|favicon.ico).*)"
  ],
}
