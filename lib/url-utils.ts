/**
 * URL utilities for SEO-friendly URL generation and manipulation
 */

// Base URL for the application
export const BASE_URL = 'https://humsafarforeverlove.com';

/**
 * Convert a string to a SEO-friendly slug
 * @param text - The text to convert to slug
 * @returns SEO-friendly slug
 */
export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Generate SEO-friendly URLs for different content types
 */
export const urlGenerators = {
  // Profile URLs
  profile: (id: string, name?: string) => {
    const slug = name ? createSlug(name) : id;
    return `/profile/${id}${name ? `/${slug}` : ''}`;
  },
  
  // Success story URLs
  successStory: (id: string, coupleNames?: string) => {
    const slug = coupleNames ? createSlug(coupleNames) : id;
    return `/success-stories/${id}${coupleNames ? `/${slug}` : ''}`;
  },
  
  // Package URLs
  package: (packageType: string) => {
    return `/packages/${createSlug(packageType)}`;
  },
  
  // Search URLs with parameters
  profileSearch: (params: Record<string, string | number>) => {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });
    
    const queryString = searchParams.toString();
    return `/profiles${queryString ? `?${queryString}` : ''}`;
  },
  
  // Category URLs
  category: (category: string, subcategory?: string) => {
    const categorySlug = createSlug(category);
    const subcategorySlug = subcategory ? createSlug(subcategory) : null;
    
    return `/category/${categorySlug}${subcategorySlug ? `/${subcategorySlug}` : ''}`;
  }
};

/**
 * Clean and normalize URLs
 * @param url - The URL to clean
 * @returns Cleaned URL
 */
export function cleanUrl(url: string): string {
  return url
    .replace(/\/+/g, '/') // Replace multiple slashes with single slash
    .replace(/\/$/, '') // Remove trailing slash (except for root)
    .replace(/^(?!\/)/g, '/'); // Ensure leading slash
}

/**
 * Generate absolute URL from relative path
 * @param path - Relative path
 * @returns Absolute URL
 */
export function getAbsoluteUrl(path: string): string {
  const cleanPath = cleanUrl(path);
  return `${BASE_URL}${cleanPath}`;
}

/**
 * Extract and validate URL parameters
 * @param searchParams - URLSearchParams object
 * @param schema - Validation schema
 * @returns Validated parameters
 */
export function validateUrlParams<T extends Record<string, any>>(
  searchParams: URLSearchParams,
  schema: Record<keyof T, (value: string) => T[keyof T] | null>
): Partial<T> {
  const result: Partial<T> = {};
  
  Object.entries(schema).forEach(([key, validator]) => {
    const value = searchParams.get(key);
    if (value !== null) {
      const validatedValue = validator(value);
      if (validatedValue !== null) {
        result[key as keyof T] = validatedValue;
      }
    }
  });
  
  return result;
}

/**
 * Common URL parameter validators
 */
export const urlValidators = {
  string: (value: string) => value.trim() || null,
  number: (value: string) => {
    const num = parseInt(value, 10);
    return isNaN(num) ? null : num;
  },
  boolean: (value: string) => {
    return value.toLowerCase() === 'true' ? true : 
           value.toLowerCase() === 'false' ? false : null;
  },
  enum: <T extends string>(allowedValues: T[]) => (value: string): T | null => {
    return allowedValues.includes(value as T) ? value as T : null;
  },
  age: (value: string) => {
    const age = parseInt(value, 10);
    return (age >= 18 && age <= 100) ? age : null;
  },
  location: (value: string) => {
    const trimmed = value.trim();
    return (trimmed.length >= 2 && trimmed.length <= 50) ? trimmed : null;
  }
};

/**
 * Generate pagination URLs
 * @param basePath - Base path for pagination
 * @param currentPage - Current page number
 * @param totalPages - Total number of pages
 * @param searchParams - Additional search parameters
 * @returns Pagination URL object
 */
export function generatePaginationUrls(
  basePath: string,
  currentPage: number,
  totalPages: number,
  searchParams?: URLSearchParams
) {
  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams);
    if (page > 1) {
      params.set('page', page.toString());
    } else {
      params.delete('page');
    }
    const queryString = params.toString();
    return `${basePath}${queryString ? `?${queryString}` : ''}`;
  };
  
  return {
    first: createPageUrl(1),
    previous: currentPage > 1 ? createPageUrl(currentPage - 1) : null,
    next: currentPage < totalPages ? createPageUrl(currentPage + 1) : null,
    last: createPageUrl(totalPages),
    current: createPageUrl(currentPage)
  };
}

/**
 * SEO-friendly URL patterns for different content types
 */
export const urlPatterns = {
  profile: '/profile/[id]/[[...slug]]',
  profileSearch: '/profiles',
  successStory: '/success-stories/[id]/[[...slug]]',
  package: '/packages/[type]',
  category: '/category/[category]/[[...subcategory]]',
  location: '/location/[city]/[[...area]]'
};

/**
 * Check if a URL is SEO-friendly
 * @param url - URL to check
 * @returns Boolean indicating if URL is SEO-friendly
 */
export function isSeoFriendlyUrl(url: string): boolean {
  // Check for common SEO-unfriendly patterns
  const unfriendlyPatterns = [
    /\?.*id=\d+/, // Query parameter IDs
    /[A-Z]/, // Uppercase letters
    /_{2,}/, // Multiple underscores
    /-{2,}/, // Multiple hyphens
    /[^a-z0-9\-\/\?&=]/, // Special characters (except allowed ones)
  ];
  
  return !unfriendlyPatterns.some(pattern => pattern.test(url));
}