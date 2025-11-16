import { Metadata } from 'next';

// Base URL for the application
const BASE_URL = 'https://humsafarforeverlove.com';

/**
 * Generate canonical URL for a given path
 * @param path - The path relative to the base URL (should start with /)
 * @returns Complete canonical URL
 */
export function generateCanonicalUrl(path: string): string {
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  // Remove trailing slash except for root
  const cleanPath = normalizedPath === '/' ? '/' : normalizedPath.replace(/\/$/, '');
  
  return `${BASE_URL}${cleanPath}`;
}

/**
 * Generate canonical metadata for Next.js pages
 * @param path - The path for the canonical URL
 * @returns Metadata object with canonical URL
 */
export function generateCanonicalMeta(path: string): Pick<Metadata, 'alternates'> {
  return {
    alternates: {
      canonical: generateCanonicalUrl(path)
    }
  };
}

/**
 * Common canonical URLs for the application
 */
export const canonicalUrls = {
  home: generateCanonicalUrl('/'),
  about: generateCanonicalUrl('/about'),
  profiles: generateCanonicalUrl('/profiles'),
  successStories: generateCanonicalUrl('/success-stories'),
  packages: generateCanonicalUrl('/packages'),
  faqs: generateCanonicalUrl('/faqs'),
  contact: generateCanonicalUrl('/contact'),
  auth: generateCanonicalUrl('/auth'),
  dashboard: generateCanonicalUrl('/dashboard'),
  
  // Dynamic URLs generators
  profile: (id: string) => generateCanonicalUrl(`/profile/${id}`),
  packagePayment: (packageId: string) => generateCanonicalUrl(`/packages/payment?package=${packageId}`)
};

/**
 * Redirect rules to prevent duplicate content
 * These should be implemented in middleware.ts
 */
export const redirectRules = [
  // Remove trailing slashes (except root)
  {
    source: '/(.*)/+',
    destination: '/$1',
    permanent: true
  },
  // Normalize case for certain paths
  {
    source: '/PROFILES',
    destination: '/profiles',
    permanent: true
  },
  {
    source: '/PACKAGES',
    destination: '/packages',
    permanent: true
  },
  // Handle common duplicate content patterns
  {
    source: '/index',
    destination: '/',
    permanent: true
  },
  {
    source: '/home',
    destination: '/',
    permanent: true
  }
];

/**
 * Meta robots directives for different page types
 */
export const robotsDirectives = {
  // Public pages - should be indexed
  public: 'index, follow',
  
  // Private/sensitive pages - should not be indexed
  private: 'noindex, nofollow',
  
  // Profile pages - index but don't follow links for privacy
  profile: 'noindex, nofollow',
  
  // Payment/sensitive pages
  payment: 'noindex, nofollow',
  
  
};