'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StructuredData, generateBreadcrumbSchema } from '@/components/seo/structured-data';

export interface BreadcrumbItem {
  name: string;
  url: string;
  current?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
  separator?: React.ReactNode;
  includeStructuredData?: boolean;
}

export function Breadcrumbs({
  items,
  className,
  showHome = true,
  separator,
  includeStructuredData = true
}: BreadcrumbsProps) {
  // Always include home if showHome is true
  const breadcrumbItems = showHome 
    ? [{ name: 'Home', url: 'https://humsafarforeverlove.com' }, ...items]
    : items;

  const defaultSeparator = <ChevronRight className="h-4 w-4 text-gray-400" />;

  return (
    <>
      {includeStructuredData && (
        <StructuredData data={generateBreadcrumbSchema(breadcrumbItems)} />
      )}
      <nav 
        aria-label="Breadcrumb" 
        className={cn('flex items-center space-x-2 text-sm', className)}
      >
        <ol className="flex items-center space-x-2">
          {breadcrumbItems.map((item, index) => {
            const isLast = index === breadcrumbItems.length - 1;
            const isHome = index === 0 && showHome;
            
            return (
              <li key={item.url} className="flex items-center">
                {index > 0 && (
                  <span className="mr-2">
                    {separator || defaultSeparator}
                  </span>
                )}
                {isLast ? (
                  <span 
                    className="font-medium text-gray-900"
                    aria-current="page"
                  >
                    {isHome ? (
                      <Home className="h-4 w-4" />
                    ) : (
                      item.name
                    )}
                  </span>
                ) : (
                  <Link
                    href={item.url}
                    className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                  >
                    {isHome ? (
                      <Home className="h-4 w-4" />
                    ) : (
                      item.name
                    )}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}

// Pre-defined breadcrumb configurations for common pages
export const breadcrumbConfigs = {
  profiles: [
    { name: 'Profiles', url: 'https://humsafarforeverlove.com/profiles' }
  ],
  
  profile: (profileName: string, profileId: string) => [
    { name: 'Profiles', url: 'https://humsafarforeverlove.com/profiles' },
    { name: profileName, url: `https://humsafarforeverlove.com/profile/${profileId}`, current: true }
  ],
  
  successStories: [
    { name: 'Success Stories', url: 'https://humsafarforeverlove.com/success-stories' }
  ],
  
  packages: [
    { name: 'Packages', url: 'https://humsafarforeverlove.com/packages' }
  ],
  
  packagePayment: (packageName: string) => [
    { name: 'Packages', url: 'https://humsafarforeverlove.com/packages' },
    { name: `${packageName} Payment`, url: '#', current: true }
  ],
  
  about: [
    { name: 'About Us', url: 'https://humsafarforeverlove.com/about' }
  ],
  
  contact: [
    { name: 'Contact', url: 'https://humsafarforeverlove.com/contact' }
  ],
  
  faqs: [
    { name: 'FAQs', url: 'https://humsafarforeverlove.com/faqs' }
  ],
  
  dashboard: [
    { name: 'Dashboard', url: 'https://humsafarforeverlove.com/dashboard' }
  ],
  
  auth: [
    { name: 'Sign In', url: 'https://humsafarforeverlove.com/auth' }
  ]
};

// Utility function to generate breadcrumbs from pathname
export function generateBreadcrumbsFromPath(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];
  
  let currentPath = '';
  
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === segments.length - 1;
    
    // Convert segment to readable name
    const name = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    breadcrumbs.push({
      name,
      url: `https://humsafarforeverlove.com${currentPath}`,
      current: isLast
    });
  });
  
  return breadcrumbs;
}

// Compact breadcrumb component for mobile
export function CompactBreadcrumbs({ items, className }: { items: BreadcrumbItem[]; className?: string }) {
  if (items.length <= 1) return null;
  
  const currentItem = items[items.length - 1];
  const parentItem = items[items.length - 2];
  
  return (
    <nav className={cn('flex items-center space-x-2 text-sm md:hidden', className)}>
      <Link
        href={parentItem.url}
        className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
      >
        ← {parentItem.name}
      </Link>
    </nav>
  );
}